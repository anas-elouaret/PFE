const jwt = require("jsonwebtoken");

/**
 * Identifies the caller when a valid token is present, and lets the request
 * through either way.
 *
 * Used by endpoints that anyone may read but that answer differently for a
 * signed-in visitor — the community feed, for instance, marks the posts the
 * viewer has already liked. An invalid or expired token is treated as no
 * token rather than as an error, so a stale session still sees the feed.
 */
module.exports = (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  } catch {
    // Anonymous from here on.
  }
  next();
};
