const express = require("express");
const {
  signup,
  signin,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

const authLimiter = rateLimiter({ windowMs: 60000, max: 5, message: "Too many attempts. Try again later." });

router.post("/signup", signup);
router.post("/signin", authLimiter, signin);
router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
