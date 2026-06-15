const express = require("express");
const {
  createReview,
  getApprovedReviews,
  likeReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

const reviewLimiter = rateLimiter({ windowMs: 60000, max: 3, message: "Too many submissions. Try again later." });

router.post("/", reviewLimiter, createReview);
router.get("/", getApprovedReviews);
router.post("/:id/like", likeReview);

router.get("/admin", authMiddleware, getAllReviews);
router.patch("/admin/:id", authMiddleware, updateReviewStatus);
router.delete("/admin/:id", authMiddleware, deleteReview);

module.exports = router;
