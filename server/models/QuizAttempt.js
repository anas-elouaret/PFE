const mongoose = require("mongoose");

/**
 * One completed run of a guide's quiz by a signed-in reader.
 *
 * Kept per attempt rather than as a single score per guide, so a reader can
 * retake a quiz and see that they improved. The dashboard shows the best
 * score per guide and the number of attempts.
 */
const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The guide's slug. Kept as a string because guides live in the front-end
    // data file, not in the database.
    guideSlug: {
      type: String,
      required: true,
      trim: true,
    },
    // Stored alongside the slug so a renamed guide still reads correctly in
    // the reader's history.
    guideTitle: {
      type: String,
      default: "",
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    correctCount: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
    passed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ user: 1, guideSlug: 1, createdAt: -1 });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
