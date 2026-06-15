const Notification = require("../models/Notification");

// ──────────────────────────────────────────────
// "Push" notifications are stored directly in the
// Notification collection with status "sent",
// so the client can fetch them via GET /api/notifications.
//
// No external push service (Firebase, APNs) is involved.
// This is an in-app notification inbox.
// ──────────────────────────────────────────────
const sendPush = async ({ notificationId, recipient, title, body, data }) => {
  if (notificationId) {
    await Notification.findByIdAndUpdate(notificationId, {
      status: "sent",
      sentAt: new Date(),
    });
  }
  return { success: true, notificationId };
};

module.exports = { sendPush };
