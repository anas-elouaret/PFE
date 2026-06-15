const mongoose = require("mongoose");
const { TRIGGER_TYPES, CHANNEL_TYPES } = require("./Notification");

// ──────────────────────────────────────────────
// Per-channel configuration: whether the channel
// is active and which triggers are allowed through.
// Embedded in NotificationPreference (no _id).
// ──────────────────────────────────────────────
const channelPrefSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: CHANNEL_TYPES, required: true },
    enabled: { type: Boolean, default: true },
    triggers: [{ type: String, enum: TRIGGER_TYPES }],
  },
  { _id: false }
);

// ──────────────────────────────────────────────
// Top-level preference document, one per user.
// ──────────────────────────────────────────────
const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    // Push has a global on/off (separate from the channels array)
    // because push is the fallback in-app channel.
    pushEnabled: { type: Boolean, default: true },
    channels: [channelPrefSchema],
  },
  { timestamps: true }
);

// ── Factory — sensible defaults for a new user ──
notificationPreferenceSchema.statics.getDefaults = function (user) {
  return {
    user: user._id,
    email: user.email,
    phone: user.phone || null,
    pushEnabled: true,
    channels: [
      {
        channel: "email",
        enabled: true,
        triggers: [
          "account_welcome",
          "account_verify",
          "password_reset",
          "new_order",
          "order_confirmed",
          "project_status_change",
        ],
      },
      {
        channel: "push",
        enabled: true,
        triggers: [
          "new_order",
          "order_confirmed",
          "project_status_change",
          "new_review",
        ],
      },
      {
        channel: "sms",
        enabled: false,
        triggers: ["project_status_change", "order_confirmed"],
      },
    ],
  };
};

// ── Permission check ───────────────────────────
// Returns true if the given channel+trigger combination
// is allowed for this user's preferences.
notificationPreferenceSchema.methods.isChannelEnabled = function (
  channel,
  trigger
) {
  // Push has its own top-level toggle
  if (channel === "push") return this.pushEnabled;
  const pref = this.channels.find((c) => c.channel === channel);
  if (!pref || !pref.enabled) return false;
  return pref.triggers.includes(trigger);
};

module.exports = mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema
);
