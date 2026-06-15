// Simple sound effects using Web Audio API

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function playClickSound() {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(420, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.12);

  gainNode.gain.setValueAtTime(0.09, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.14);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.14);
}

export function playArrivalSound() {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(520, ctx.currentTime);
  osc2.frequency.setValueAtTime(240, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.18);
  osc2.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.18);

  gainNode.gain.setValueAtTime(0.14, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.18);
  osc2.stop(ctx.currentTime + 0.18);
}

export function playPopSound() {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.setValueAtTime(600, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

  gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.05);
}

export function playHoverSound() {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  oscillator.frequency.setValueAtTime(500, ctx.currentTime + 0.05);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
}