const Post = require("../models/Post");
const User = require("../models/User");

/**
 * Shape a stored post for the feed. `liked` is resolved for the caller, so the
 * client never has to hold the full like list to colour one heart.
 */
const toFeedPost = (post, viewerId) => ({
  id: String(post._id),
  text: post.text || "",
  image: post.image || null,
  video: post.video || null,
  createdAt: post.createdAt,
  author: {
    id: String(post.author),
    name: post.authorName,
    avatar: post.authorAvatar || null,
  },
  likes: Array.isArray(post.likes) ? post.likes.length : 0,
  liked: viewerId
    ? (post.likes || []).some((id) => String(id) === String(viewerId))
    : false,
  commentsList: (post.comments || []).map((c) => ({
    id: String(c._id),
    text: c.text,
    createdAt: c.createdAt,
    author: { name: c.authorName, avatar: c.authorAvatar || null },
  })),
  comments: (post.comments || []).length,
  canDelete: viewerId ? String(post.author) === String(viewerId) : false,
});

const loadAuthor = async (userId) => {
  const user = await User.findById(userId).select("name avatar role").lean();
  if (!user) throw Object.assign(new Error("Account not found"), { status: 401 });
  return user;
};

const isStaff = async (userId) => {
  const user = await User.findById(userId).select("role").lean();
  return Boolean(user && ["admin", "creator"].includes(user.role));
};

/** Public feed, newest first. Readable without an account. */
exports.getFeed = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const [posts, total] = await Promise.all([
      Post.find({ status: "visible" })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Post.countDocuments({ status: "visible" }),
    ]);

    res.json({
      posts: posts.map((p) => toFeedPost(p, req.userId)),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load the feed" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const author = await loadAuthor(req.userId);
    const { text = "", image = null, video = null } = req.body;

    const post = await Post.create({
      author: req.userId,
      authorName: author.name,
      authorAvatar: author.avatar || null,
      text: String(text).trim(),
      image,
      video,
    });

    res.status(201).json({ post: toFeedPost(post.toObject(), req.userId) });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(error.status || 500).json({ message: error.message || "Failed to publish the post" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (String(post.author) !== String(req.userId)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { text, image, video } = req.body;
    if (text !== undefined) post.text = String(text).trim();
    if (image !== undefined) post.image = image;
    if (video !== undefined) post.video = video;
    await post.save();

    res.json({ post: toFeedPost(post.toObject(), req.userId) });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to update the post" });
  }
};

/** The author may remove their own post; staff may remove any. */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const own = String(post.author) === String(req.userId);
    if (!own && !(await isStaff(req.userId))) {
      return res.status(403).json({ message: "Access denied." });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the post" });
  }
};

/** Like or unlike. One account counts once, however often it clicks. */
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const already = post.likes.some((id) => String(id) === String(req.userId));
    post.likes = already
      ? post.likes.filter((id) => String(id) !== String(req.userId))
      : [...post.likes, req.userId];
    await post.save();

    res.json({ liked: !already, likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the like" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const text = String(req.body.text || "").trim();
    if (!text) return res.status(400).json({ message: "A comment cannot be empty." });

    const author = await loadAuthor(req.userId);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      author: req.userId,
      authorName: author.name,
      authorAvatar: author.avatar || null,
      text,
    });
    await post.save();

    res.status(201).json({ post: toFeedPost(post.toObject(), req.userId) });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(error.status || 500).json({ message: "Failed to add the comment" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const own = String(comment.author) === String(req.userId);
    const ownsPost = String(post.author) === String(req.userId);
    if (!own && !ownsPost && !(await isStaff(req.userId))) {
      return res.status(403).json({ message: "Access denied." });
    }

    comment.deleteOne();
    await post.save();
    res.json({ post: toFeedPost(post.toObject(), req.userId) });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the comment" });
  }
};

/** Staff: take a post out of the feed without destroying it. */
exports.setStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["visible", "hidden"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const post = await Post.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post: toFeedPost(post.toObject(), req.userId) });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the post" });
  }
};
