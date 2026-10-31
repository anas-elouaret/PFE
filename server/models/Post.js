const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true, trim: true, maxlength: 100 },
    authorAvatar: { type: String, default: null },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    // Posts belong to a real signed-in account. The author's name and avatar
    // are copied in so a feed page costs one query and still reads correctly
    // if the account is later renamed or removed.
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    authorName: { type: String, required: true, trim: true, maxlength: 100 },
    authorAvatar: { type: String, default: null },

    text: { type: String, default: "", trim: true, maxlength: 5000 },
    image: { type: String, default: null },
    video: { type: String, default: null },

    // User ids, so one account counts once however many times it clicks.
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],

    // Hidden posts stay in the database for the record but leave the feed.
    status: {
      type: String,
      enum: ["visible", "hidden"],
      default: "visible",
      index: true,
    },
  },
  { timestamps: true }
);

// A post must say something: empty text with no media is not a post.
postSchema.pre("validate", function ensureContent(next) {
  if (!this.text && !this.image && !this.video) {
    this.invalidate("text", "A post needs text, an image or a video.");
  }
  next();
});

postSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
