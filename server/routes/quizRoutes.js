const express = require("express");
const { getQuiz, submitQuiz, getMyAttempts } = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuthMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// A signed-in reader's own history comes first: /me must not be captured by
// the /:slug route below.
router.get("/me/attempts", authMiddleware, getMyAttempts);

router.get("/:slug", getQuiz);

// Anyone may take a quiz; the attempt is recorded only for a signed-in
// reader, which optionalAuth identifies without turning guests away.
router.post(
  "/:slug/attempts",
  optionalAuth,
  rateLimiter({ windowMs: 60000, max: 20, message: "Trop de tentatives. Réessayez dans une minute." }),
  submitQuiz
);

module.exports = router;
