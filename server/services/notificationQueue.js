const Notification = require("../models/Notification");
const NotificationPreference = require("../models/NotificationPreference");
const { dispatch } = require("./notificationDispatcher");

// ── Config (overridable via .env) ──────────────
const QUEUE_POLL_INTERVAL = parseInt(
  process.env.NOTIFICATION_QUEUE_INTERVAL || "5000",
  10
);
const BATCH_SIZE = parseInt(
  process.env.NOTIFICATION_BATCH_SIZE || "10",
  10
);

let intervalHandle = null;

// ──────────────────────────────────────────────
// enqueue
// ──────────────────────────────────────────────
// Creates a new Notification document with status "pending".
// Before creating, checks the user's NotificationPreference
// to see if this channel+trigger combination is allowed.
// Returns the created document, or null if skipped.
// ──────────────────────────────────────────────
const enqueue = async ({
  recipient,
  recipientEmail,
  recipientPhone,
  channel,
  trigger,
  subject,
  body,
  payload,
}) => {
  // ── Check user preference (push & SMS only; email is always tried) ──
  if (recipient && (channel === "push" || channel === "sms")) {
    const prefs = await NotificationPreference.findOne({ user: recipient });
    if (prefs && !prefs.isChannelEnabled(channel, trigger)) {
      return null;
    }
  }

  return Notification.create({
    recipient: recipient || null,
    recipientEmail: recipientEmail || null,
    recipientPhone: recipientPhone || null,
    channel,
    trigger,
    subject: subject || null,
    body,
    payload: payload || {},
    status: "pending",
  });
};

// ──────────────────────────────────────────────
// processQueue (called every QUEUE_POLL_INTERVAL)
// ──────────────────────────────────────────────
// 1. Fetch the oldest N pending notifications.
// 2. For each one: mark "processing" → attempt dispatch.
// 3. On success: mark "sent" with a timestamp.
// 4. On failure: increment retryCount.
//    - If retries exhausted → mark "failed".
//    - Otherwise → set back to "pending" for re-processing.
// ──────────────────────────────────────────────
const processQueue = async () => {
  try {
    const batch = await Notification.find({ status: "pending" })
      .sort({ createdAt: 1 }) // oldest first
      .limit(BATCH_SIZE);

    for (const notification of batch) {
      // ── Acquire lock (prevent re-processing by another poll) ──
      notification.status = "processing";
      await notification.save();

      try {
        await dispatch(notification);
        notification.status = "sent";
        notification.sentAt = new Date();
        await notification.save();
      } catch (err) {
        notification.retryCount += 1;
        if (notification.retryCount >= notification.maxRetries) {
          notification.status = "failed";
          notification.error = err.message;
        } else {
          // Release back to pending for next poll cycle
          notification.status = "pending";
          notification.error = err.message;
        }
        await notification.save();
      }
    }
  } catch (err) {
    console.error("[NotificationQueue] Process error:", err.message);
  }
};

// ── Lifecycle ──────────────────────────────────
const startQueue = () => {
  if (intervalHandle) return;
  console.log(
    `[NotificationQueue] Started (poll every ${QUEUE_POLL_INTERVAL}ms)`
  );
  intervalHandle = setInterval(processQueue, QUEUE_POLL_INTERVAL);
  // Run immediately on start, don't wait for first tick
  processQueue();
};

const stopQueue = () => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    console.log("[NotificationQueue] Stopped");
  }
};

module.exports = { enqueue, processQueue, startQueue, stopQueue };
