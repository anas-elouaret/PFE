/**
 * A small QR encoder, byte mode, error-correction level M.
 *
 * Written rather than installed: this project's build takes no new
 * dependencies, and the only thing that needs encoding is a short
 * verification URL. Supports versions 1 to 6, which hold up to 108 bytes at
 * level M — several times the length of a certificate URL. Version 7 and up
 * need version-information modules that are not implemented here, so the
 * encoder refuses rather than emitting a code that would not scan.
 *
 * Verified by rendering the output and decoding it back with OpenCV's QR
 * reader; see the project notes. A QR that does not scan is worse than no QR,
 * so do not change this without re-running that check.
 */

// --- GF(256), primitive polynomial 0x11D ------------------------------------

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(function buildTables() {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
})();

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

/**
 * Generator polynomial for `degree` error-correction codewords.
 *
 * Built lowest power first, then reversed: the division below indexes it
 * leading coefficient first. Getting this round the wrong way produces data
 * codewords that are perfectly correct followed by error-correction bytes
 * that are not, which no reader will accept.
 */
function generatorPoly(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i += 1) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j += 1) {
      next[j] ^= mul(poly[j], EXP[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly.reverse();
}

function ecCodewords(data, count) {
  const gen = generatorPoly(count);
  const res = new Array(count).fill(0);
  for (const byte of data) {
    const factor = byte ^ res[0];
    res.shift();
    res.push(0);
    for (let i = 0; i < count; i += 1) res[i] ^= mul(gen[i + 1], factor);
  }
  return res;
}

// --- Version tables, level M ------------------------------------------------
// [total data codewords, EC codewords per block, number of blocks]
const LEVEL_M = {
  1: [16, 10, 1],
  2: [28, 16, 1],
  3: [44, 26, 1],
  4: [64, 18, 2],
  5: [86, 24, 2],
  6: [108, 16, 4],
};

const ALIGNMENT = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
};

const MAX_VERSION = 6;

// --- Bit buffer -------------------------------------------------------------

class Bits {
  constructor() {
    this.bits = [];
  }
  put(value, length) {
    for (let i = length - 1; i >= 0; i -= 1) this.bits.push((value >>> i) & 1);
  }
  get length() {
    return this.bits.length;
  }
  toBytes() {
    const bytes = [];
    for (let i = 0; i < this.bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j += 1) b = (b << 1) | (this.bits[i + j] || 0);
      bytes.push(b);
    }
    return bytes;
  }
}

// --- Matrix -----------------------------------------------------------------

function emptyMatrix(size) {
  return Array.from({ length: size }, () => new Array(size).fill(null));
}

function placeFinder(m, row, col) {
  for (let r = -1; r <= 7; r += 1) {
    for (let c = -1; c <= 7; c += 1) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || cc < 0 || rr >= m.length || cc >= m.length) continue;
      const onRing =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
        (c >= 0 && c <= 6 && (r === 0 || r === 6));
      const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      m[rr][cc] = onRing || inCore;
    }
  }
}

function placeAlignment(m, version) {
  const centers = ALIGNMENT[version];
  for (const r of centers) {
    for (const c of centers) {
      // Skip the three corners occupied by finder patterns.
      if (m[r][c] !== null) continue;
      for (let dr = -2; dr <= 2; dr += 1) {
        for (let dc = -2; dc <= 2; dc += 1) {
          const edge = Math.max(Math.abs(dr), Math.abs(dc));
          m[r + dr][c + dc] = edge !== 1;
        }
      }
    }
  }
}

function placeFunctionPatterns(m, version) {
  const size = m.length;
  placeFinder(m, 0, 0);
  placeFinder(m, 0, size - 7);
  placeFinder(m, size - 7, 0);

  // Timing patterns.
  for (let i = 8; i < size - 8; i += 1) {
    const on = i % 2 === 0;
    if (m[6][i] === null) m[6][i] = on;
    if (m[i][6] === null) m[i][6] = on;
  }

  placeAlignment(m, version);

  // The always-dark module.
  m[size - 8][8] = true;
}

/** Reserves the format-information modules so data placement skips them. */
function reserveFormat(m) {
  const size = m.length;
  for (let i = 0; i <= 8; i += 1) {
    if (m[8][i] === null) m[8][i] = false;
    if (m[i][8] === null) m[i][8] = false;
  }
  for (let i = 0; i < 8; i += 1) {
    if (m[8][size - 1 - i] === null) m[8][size - 1 - i] = false;
    if (m[size - 1 - i][8] === null) m[size - 1 - i][8] = false;
  }
}

const MASKS = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function placeData(m, reserved, bytes) {
  const size = m.length;
  const bits = [];
  for (const b of bytes) for (let i = 7; i >= 0; i -= 1) bits.push((b >>> i) & 1);

  let index = 0;
  let upward = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right -= 1; // the vertical timing column is skipped
    for (let step = 0; step < size; step += 1) {
      const row = upward ? size - 1 - step : step;
      for (const col of [right, right - 1]) {
        if (reserved[row][col]) continue;
        m[row][col] = index < bits.length ? bits[index] === 1 : false;
        index += 1;
      }
    }
    upward = !upward;
  }
}

function penalty(m) {
  const size = m.length;
  let score = 0;

  // Rule 1 — runs of five or more of the same colour.
  const run = (get) => {
    for (let a = 0; a < size; a += 1) {
      let count = 1;
      for (let b = 1; b < size; b += 1) {
        if (get(a, b) === get(a, b - 1)) {
          count += 1;
        } else {
          if (count >= 5) score += count - 2;
          count = 1;
        }
      }
      if (count >= 5) score += count - 2;
    }
  };
  run((r, c) => m[r][c]);
  run((c, r) => m[r][c]);

  // Rule 2 — 2x2 blocks of one colour.
  for (let r = 0; r < size - 1; r += 1) {
    for (let c = 0; c < size - 1; c += 1) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
    }
  }

  // Rule 3 — finder-like sequences.
  const P1 = [true, false, true, true, true, false, true, false, false, false, false];
  const P2 = [false, false, false, false, true, false, true, true, true, false, true];
  const matches = (get, a, b) => {
    const at = (i) => get(a, b + i);
    const eq = (pat) => pat.every((v, i) => at(i) === v);
    return eq(P1) || eq(P2);
  };
  for (let a = 0; a < size; a += 1) {
    for (let b = 0; b + 11 <= size; b += 1) {
      if (matches((x, y) => m[x][y], a, b)) score += 40;
      if (matches((x, y) => m[y][x], a, b)) score += 40;
    }
  }

  // Rule 4 — overall balance of dark modules.
  let dark = 0;
  for (let r = 0; r < size; r += 1) for (let c = 0; c < size; c += 1) if (m[r][c]) dark += 1;
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

/** Format information: 5 data bits, BCH(15,5), then the fixed mask. */
function formatBits(maskIndex) {
  const data = (0b00 << 3) | maskIndex; // 00 = error-correction level M
  let value = data << 10;
  for (let i = 4; i >= 0; i -= 1) {
    if ((value >>> (i + 10)) & 1) value ^= 0b10100110111 << i;
  }
  return ((data << 10) | value) ^ 0b101010000010010;
}

/**
 * Writes both copies of the format information.
 *
 * The fifteen positions below, read in the order given, spell the format
 * string most significant bit first — so the k-th position carries bit
 * (14 - k), not bit k. The second copy stops at the seventh module of the
 * left column: the one under it is the fixed dark module, and writing a
 * format bit there shifts the whole copy by one and corrupts both.
 */
function placeFormat(m, maskIndex) {
  const size = m.length;
  const fmt = formatBits(maskIndex);
  const bit = (k) => ((fmt >>> (14 - k)) & 1) === 1;

  const copy1 = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  copy1.forEach(([r, c], k) => {
    m[r][c] = bit(k);
  });

  for (let k = 0; k <= 6; k += 1) m[size - 1 - k][8] = bit(k);
  for (let k = 7; k <= 14; k += 1) m[8][size - 15 + k] = bit(k);
}

// --- Public API -------------------------------------------------------------

/**
 * Encodes `text` and returns the module matrix as an array of boolean rows.
 * @param {string} text
 * @returns {boolean[][]}
 */
export function qrMatrix(text) {
  const data = new TextEncoder().encode(text);

  let version = 0;
  for (let v = 1; v <= MAX_VERSION; v += 1) {
    const [dataCodewords] = LEVEL_M[v];
    // 4 bits mode + 8 bits length + payload
    if (dataCodewords * 8 >= 4 + 8 + data.length * 8) {
      version = v;
      break;
    }
  }
  if (!version) {
    throw new Error(
      `QR: ${data.length} bytes exceeds what versions 1-${MAX_VERSION} hold at level M.`
    );
  }

  const [dataCodewords, ecPerBlock, blockCount] = LEVEL_M[version];

  const bits = new Bits();
  bits.put(0b0100, 4); // byte mode
  bits.put(data.length, 8);
  for (const b of data) bits.put(b, 8);

  const capacity = dataCodewords * 8;
  bits.put(0, Math.min(4, capacity - bits.length)); // terminator
  while (bits.length % 8 !== 0) bits.put(0, 1);

  const bytes = bits.toBytes();
  const padding = [0xec, 0x11];
  for (let i = 0; bytes.length < dataCodewords; i += 1) bytes.push(padding[i % 2]);

  // Split into blocks. Short blocks come first; longer ones carry one extra
  // data codeword each.
  const shortCount = blockCount - (dataCodewords % blockCount);
  const shortLength = Math.floor(dataCodewords / blockCount);
  const dataBlocks = [];
  const ecBlocks = [];
  let offset = 0;
  for (let i = 0; i < blockCount; i += 1) {
    const length = i < shortCount ? shortLength : shortLength + 1;
    const block = bytes.slice(offset, offset + length);
    offset += length;
    dataBlocks.push(block);
    ecBlocks.push(ecCodewords(block, ecPerBlock));
  }

  // Interleave.
  const final = [];
  const maxData = Math.max(...dataBlocks.map((b) => b.length));
  for (let i = 0; i < maxData; i += 1) {
    for (const block of dataBlocks) if (i < block.length) final.push(block[i]);
  }
  for (let i = 0; i < ecPerBlock; i += 1) {
    for (const block of ecBlocks) final.push(block[i]);
  }

  const size = 17 + 4 * version;
  const base = emptyMatrix(size);
  placeFunctionPatterns(base, version);
  reserveFormat(base);
  const reserved = base.map((row) => row.map((v) => v !== null));

  let best = null;
  let bestScore = Infinity;
  for (let maskIndex = 0; maskIndex < 8; maskIndex += 1) {
    const m = base.map((row) => row.slice());
    placeData(m, reserved, final);
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (!reserved[r][c] && MASKS[maskIndex](r, c)) m[r][c] = !m[r][c];
      }
    }
    placeFormat(m, maskIndex);
    const score = penalty(m);
    if (score < bestScore) {
      bestScore = score;
      best = m;
    }
  }

  return best.map((row) => row.map((v) => v === true));
}

/**
 * The matrix as a single SVG path, which renders far fewer nodes than one
 * rectangle per module.
 * @returns {{ path: string, size: number }} size includes the quiet zone
 */
export function qrSvgPath(text, quietZone = 4) {
  const matrix = qrMatrix(text);
  const size = matrix.length + quietZone * 2;
  let path = "";
  for (let r = 0; r < matrix.length; r += 1) {
    for (let c = 0; c < matrix.length; c += 1) {
      if (matrix[r][c]) path += `M${c + quietZone} ${r + quietZone}h1v1h-1z`;
    }
  }
  return { path, size };
}
