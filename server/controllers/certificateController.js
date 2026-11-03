const Certificate = require("../models/Certificate");
const User = require("../models/User");
const quizData = require("../data/quizzes.json");

const PASS_MARK = typeof quizData.passMark === "number" ? quizData.passMark : 60;

/**
 * Issues or updates the certificate for a passed guide.
 *
 * Called from the quiz controller once a passing attempt has been graded on
 * the server — never from a route the browser can reach, so a certificate
 * cannot be minted by asking for one. A retake with a better score updates
 * the score on the existing certificate and keeps its reference, because the
 * reference may already be printed or shared.
 *
 * Returns the certificate, or null if it could not be issued. A failure here
 * must not fail the quiz attempt: the reader keeps their score either way.
 */
async function issueForPass({ userId, guideSlug, guideTitle, score }) {
  if (score < PASS_MARK) return null;

  const user = await User.findById(userId).select("name").lean();
  if (!user) return null;

  const existing = await Certificate.findOne({ user: userId, guideSlug });
  if (existing) {
    if (score > existing.score) {
      existing.score = score;
      await existing.save();
    }
    return existing;
  }

  // A duplicate reference is astronomically unlikely but cheap to survive.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await Certificate.create({
        user: userId,
        reference: Certificate.generateReference(),
        recipientName: user.name,
        guideSlug,
        guideTitle,
        score,
      });
    } catch (err) {
      // 11000 on `reference` means a collision; on the user+guide index it
      // means a parallel request already issued this one.
      if (err?.code !== 11000) throw err;
      const raced = await Certificate.findOne({ user: userId, guideSlug });
      if (raced) return raced;
    }
  }
  return null;
}

exports.issueForPass = issueForPass;

/** The signed-in reader's own certificates. */
exports.getMyCertificates = async (req, res) => {
  const certificates = await Certificate.find({ user: req.userId })
    .sort({ issuedAt: -1 })
    .select("-user -__v")
    .lean();
  res.json({ certificates });
};

/** One of the reader's certificates, for the printable page. */
exports.getMyCertificate = async (req, res) => {
  const certificate = await Certificate.findOne({
    user: req.userId,
    reference: String(req.params.reference).toUpperCase(),
  })
    .select("-user -__v")
    .lean();

  if (!certificate) return res.status(404).json({ message: "Attestation introuvable." });
  res.json({ certificate });
};

/**
 * Public check of a reference.
 *
 * Deliberately narrow: the holder's name, what it is for, the date and the
 * score. No email, no account, nothing that would turn a reference someone
 * published into a way of harvesting contact details. An unknown reference
 * answers 404 with a plain message rather than hinting at near matches.
 */
exports.verifyCertificate = async (req, res) => {
  const reference = String(req.params.reference || "").toUpperCase().trim();
  if (!/^[A-Z0-9-]{6,32}$/.test(reference)) {
    return res.status(400).json({ valid: false, message: "Référence invalide." });
  }

  const certificate = await Certificate.findOne({ reference })
    .select("reference recipientName guideTitle guideSlug score issuedAt -_id")
    .lean();

  if (!certificate) {
    return res
      .status(404)
      .json({ valid: false, message: "Aucune attestation ne correspond à cette référence." });
  }

  res.json({ valid: true, certificate });
};
