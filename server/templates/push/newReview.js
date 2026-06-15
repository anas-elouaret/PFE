const newReviewPush = (review) => ({
  title: `New ${review.rating}★ Review`,
  body: `${review.name} left a ${review.rating}-star review: "${review.comment.slice(0, 80)}${review.comment.length > 80 ? "…" : ""}"`,
  data: {
    trigger: "new_review",
    reviewId: review._id ? review._id.toString() : null,
    rating: review.rating,
  },
});

module.exports = newReviewPush;
