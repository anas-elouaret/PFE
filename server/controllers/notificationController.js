const Notification = require("../models/Notification");
const NotificationPreference = require("../models/NotificationPreference");

// ──────────────────────────────────────────────
// GET /api/notifications
// Returns the authenticated user's notification inbox.
// Supports pagination (page, limit) and filtering
// by channel (email|sms|push) and read state.
// Also returns total unread count in one query.
// ──────────────────────────────────────────────
exports.getMyNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { channel, read } = req.query;

    // Build the query filter
    const filter = { recipient: req.userId };
    if (channel) filter.channel = channel;
    if (read === "true") filter.readAt = { $ne: null };
    else if (read === "false") filter.readAt = null;

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.userId, readAt: null }),
    ]);

    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// ──────────────────────────────────────────────
// GET /api/notifications/unread-count
// Lightweight endpoint for badge display (no payload).
// ──────────────────────────────────────────────
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.userId,
      readAt: null,
    });
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

// ──────────────────────────────────────────────
// PATCH /api/notifications/read
// Marks one or more notifications as read.
// Body: { ids: ["..."] } — marks only those IDs.
// Body: {} (empty) — marks ALL as read for this user.
// ──────────────────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    const filter = { recipient: req.userId };
    if (ids && Array.isArray(ids) && ids.length > 0) {
      filter._id = { $in: ids };
    }
    await Notification.updateMany(filter, { readAt: new Date() });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

// ──────────────────────────────────────────────
// GET /api/notifications/preferences
// Returns the user's notification preferences.
// Auto-creates defaults if none exist yet.
// ──────────────────────────────────────────────
exports.getPreferences = async (req, res) => {
  try {
    let prefs = await NotificationPreference.findOne({ user: req.userId });
    if (!prefs) {
      const User = require("../models/User");
      const user = await User.findById(req.userId);
      prefs = await NotificationPreference.create(
        NotificationPreference.getDefaults(user)
      );
    }
    res.json({ preferences: prefs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch preferences" });
  }
};

// ──────────────────────────────────────────────
// PUT /api/notifications/preferences
// Partial update of notification preferences.
// Accepts pushEnabled, phone, and/or channels array.
// Uses upsert so an initial save also creates the doc.
// ──────────────────────────────────────────────
exports.updatePreferences = async (req, res) => {
  try {
    const { pushEnabled, channels, phone } = req.body;
    const update = {};
    if (pushEnabled !== undefined) update.pushEnabled = pushEnabled;
    if (channels !== undefined) update.channels = channels;
    if (phone !== undefined) update.phone = phone;

    const prefs = await NotificationPreference.findOneAndUpdate(
      { user: req.userId },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json({ message: "Preferences updated", preferences: prefs });
  } catch (error) {
    res.status(500).json({ message: "Failed to update preferences" });
  }
};
