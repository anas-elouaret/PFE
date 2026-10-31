const express = require("express");
const {
  createReview,
  getApprovedReviews,
  getRatingSummary,
  likeReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

const reviewLimiter = rateLimiter({ windowMs: 60000, max: 3, message: "Too many submissions. Try again later." });

router.post("/", reviewLimiter, createReview);
router.get("/", getApprovedReviews);
router.get("/summary", getRatingSummary);
router.post("/:id/like", likeReview);

router.get("/admin", authMiddleware, requireRole("admin"), getAllReviews);
router.patch("/admin/:id", authMiddleware, requireRole("admin"), updateReviewStatus);
router.delete("/admin/:id", authMiddleware, requireRole("admin"), deleteReview);

module.exports = router;
