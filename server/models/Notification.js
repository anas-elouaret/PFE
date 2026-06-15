const mongoose = require("mongoose");

// ──────────────────────────────────────────────
// All event types that can trigger notifications
// Used by both Notification and NotificationPreference
// ──────────────────────────────────────────────
const TRIGGER_TYPES = [
  "account_welcome",
  "account_verify",
  "password_reset",
  "new_order",
  "order_confirmed",
  "project_status_change",
  "new_contact_message",
  "new_review",
];

const CHANNEL_TYPES = ["email", "sms", "push"];

const STATUS_TYPES = ["pending", "processing", "sent", "failed"];

const notificationSchema = new mongoose.Schema(
  {
    // ── Recipient ───────────────────────────────
    // Linked user (null = anonymous recipient, e.g. contact form auto-reply)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Fallback addresses when no user account exists
    recipientEmail: { type: String, default: null },
    recipientPhone: { type: String, default: null },

    // ── Delivery ────────────────────────────────
    channel: { type: String, enum: CHANNEL_TYPES, required: true },
    trigger: { type: String, enum: TRIGGER_TYPES, required: true },

    // Lifecycle: pending → processing → sent | failed
    status: {
      type: String,
      enum: STATUS_TYPES,
      default: "pending",
    },

    // ── Content ────────────────────────────────
    subject: { type: String, default: null },
    body: { type: String, required: true },
    // Arbitrary metadata (e.g. { projectId, status } for push notifications)
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },

    // ── Tracking ───────────────────────────────
    readAt: { type: Date, default: null },
    error: { type: String, default: null },
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ── Indexes ────────────────────────────────────
// Per-user inbox sorted by newest first
notificationSchema.index({ recipient: 1, createdAt: -1 });
// Queue processor — picks oldest pending first
notificationSchema.index({ status: 1, createdAt: 1 });
// Admin analytics and filtering
notificationSchema.index({ trigger: 1 });
notificationSchema.index({ channel: 1, status: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
module.exports.TRIGGER_TYPES = TRIGGER_TYPES;
module.exports.CHANNEL_TYPES = CHANNEL_TYPES;
module.exports.STATUS_TYPES = STATUS_TYPES;
