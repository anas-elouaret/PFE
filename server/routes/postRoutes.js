const express = require("express");
const {
  getFeed,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  setStatus,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuthMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// Posting and commenting are the expensive, abusable actions.
const writeLimiter = rateLimiter({
  windowMs: 60000,
  max: 10,
  message: "Trop de publications. Réessayez dans une minute.",
});

// Anyone may read the feed; a signed-in reader also learns what they liked.
router.get("/", optionalAuth, getFeed);

// Everything that writes needs a real account.
router.post("/", authMiddleware, writeLimiter, createPost);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.post("/:id/like", authMiddleware, toggleLike);
router.post("/:id/comments", authMiddleware, writeLimiter, addComment);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);

// Moderation.
router.patch("/:id/status", authMiddleware, requireRole("admin", "creator"), setStatus);

module.exports = router;
