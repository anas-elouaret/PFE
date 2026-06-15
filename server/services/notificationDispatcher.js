const { sendEmail } = require("../utils/email");
const { sendSMS } = require("./smsProvider");
const { sendPush } = require("./pushProvider");

// ──────────────────────────────────────────────
// Routes a Notification document to the correct
// channel-specific sender based on its `.channel` field.
// Each sender is responsible for its own transport
// (nodemailer, SMS provider, in-app DB write).
//
// Throws on missing recipient data or unknown channel,
// which the queue's retry logic handles.
// ──────────────────────────────────────────────
const dispatch = async (notification) => {
  switch (notification.channel) {
    case "email":
      if (!notification.recipientEmail) {
        throw new Error("No recipient email for email notification");
      }
      return sendEmail({
        to: notification.recipientEmail,
        subject: notification.subject,
        html: notification.body,
      });

    case "sms":
      if (!notification.recipientPhone) {
        throw new Error("No recipient phone for SMS notification");
      }
      return sendSMS({
        to: notification.recipientPhone,
        body: notification.body,
      });

    case "push":
      // Push is stored directly in the Notification collection
      // so the client can poll it. No external transport needed.
      return sendPush({
        recipient: notification.recipient,
        title: notification.subject,
        body: notification.body,
        data: notification.payload,
      });

    default:
      throw new Error(`Unknown channel: ${notification.channel}`);
  }
};

module.exports = { dispatch };
