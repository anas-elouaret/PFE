const Notification = require("../models/Notification");

// ──────────────────────────────────────────────
// "Push" notifications are stored directly in the
// Notification collection with status "sent",
// so the client can fetch them via GET /api/notifications.
//
// No external push service (Firebase, APNs) is involved.
// This is an in-app notification inbox.
// ──────────────────────────────────────────────
const sendPush = async ({ recipient, title, body, data }) => {
  const notification = await Notification.create({
    recipient,
    channel: "push",
    trigger: data && data.trigger ? data.trigger : "general",
    subject: title,
    body,
    payload: data || {},
    status: "sent",
    sentAt: new Date(),
  });
  return { success: true, notificationId: notification._id };
};

module.exports = { sendPush };
