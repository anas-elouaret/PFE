const Review = require("../models/Review");
const { notifyNewReview } = require("../hooks/notificationHooks");

exports.createReview = async (req, res) => {
  try {
    const { name, email, rating, comment, avatar } = req.body;

    const existing = await Review.findOne({ email, status: { $ne: "rejected" } });
    if (existing) {
      return res.status(409).json({ message: "You have already submitted a review. It will be published after moderation." });
    }

    const review = await Review.create({ name, email, rating, comment, avatar });

    notifyNewReview(review).catch((err) =>
      console.warn("Review notification failed:", err.message)
    );

    res.status(201).json({ message: "Review submitted successfully and is pending moderation.", success: true });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to submit review" });
  }
};

exports.getApprovedReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || "newest";
    const skip = (page - 1) * limit;

    let sortOption = {};
    switch (sort) {
      case "highest":
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const [reviews, total] = await Promise.all([
      Review.find({ status: "approved" }).sort(sortOption).skip(skip).limit(limit).lean(),
      Review.countDocuments({ status: "approved" }),
    ]);

    const ratingStats = await Review.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          distribution: { $push: "$rating" },
        },
      },
    ]);

    const stats = ratingStats[0] || { averageRating: 0, totalReviews: 0, distribution: [] };
    const distribution = [0, 0, 0, 0, 0];
    if (stats.distribution) {
      stats.distribution.forEach((r) => {
        if (r >= 1 && r <= 5) distribution[r - 1]++;
      });
    }

    res.json({
      reviews,
      stats: {
        averageRating: Math.round(stats.averageRating * 10) / 10,
        totalReviews: stats.totalReviews,
        distribution,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

exports.likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { ip } = req;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.likedBy.includes(ip)) {
      return res.status(409).json({ message: "You have already liked this review" });
    }

    review.likes += 1;
    review.likedBy.push(ip);
    await review.save();

    res.json({ likes: review.likes });
  } catch (error) {
    res.status(500).json({ message: "Failed to like review" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
      ];
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();

    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
        },
      },
    ]);

    res.json({ reviews, stats: stats[0] || { total: 0, pending: 0, approved: 0, rejected: 0 } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: `Review ${status} successfully`, review });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};
