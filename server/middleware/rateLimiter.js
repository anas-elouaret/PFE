const store = new Map();

const CLEANUP_INTERVAL = 60000;
const MAX_ENTRIES = 10000;

setInterval(() => {
  const now = Date.now();
  if (store.size > MAX_ENTRIES) {
    store.clear();
    return;
  }
  for (const [key, timestamps] of store.entries()) {
    const valid = timestamps.filter((t) => now - t < 60000);
    if (valid.length === 0) store.delete(key);
    else store.set(key, valid);
  }
}, CLEANUP_INTERVAL);

const rateLimiter = ({ windowMs = 60000, max = 10, message = "Too many requests" } = {}) => {
  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    if (!store.has(key)) {
      store.set(key, []);
    }

    const timestamps = store.get(key).filter((t) => now - t < windowMs);
    timestamps.push(now);
    store.set(key, timestamps);

    if (timestamps.length > max) {
      return res.status(429).json({ message });
    }

    next();
  };
};

module.exports = rateLimiter;
