// ──────────────────────────────────────────────
// Notification Hooks
// ──────────────────────────────────────────────
// These functions are called from controllers after
// business events occur (signup, order, status change…).
// Each hook:
//   1. Ensures the user has NotificationPreference defaults.
//   2. Renders the appropriate template(s) for each channel.
//   3. Enqueues the notification for async delivery.
//
// Hooks are deliberately fire-and-forget (caught with .catch())
// so a delivery failure never blocks the HTTP response.
// ──────────────────────────────────────────────

const { enqueue } = require("../services/notificationQueue");
const NotificationPreference = require("../models/NotificationPreference");

// ── Template imports ───────────────────────────
const welcomeEmail = require("../templates/email/welcome");
const welcomePush = require("../templates/push/welcome");
const orderConfirmationEmail = require("../templates/email/orderConfirmation");
const orderConfirmationPush = require("../templates/push/orderConfirmation");
const projectStatusEmail = require("../templates/email/projectStatusChange");
const projectStatusPush = require("../templates/push/projectStatusChange");
const contactAutoReplyEmail = require("../templates/email/contactAutoReply");
const adminNewContactEmail = require("../templates/email/adminNewContact");
const adminNewReviewEmail = require("../templates/email/adminNewReview");
const newReviewPush = require("../templates/push/newReview");

// ── Helpers ────────────────────────────────────

// Fetch all admin email addresses for broadcast alerts
const getAdminEmails = async () => {
  const User = require("../models/User");
  const admins = await User.find({ role: "admin" }).select("email").lean();
  return admins.map((a) => a.email);
};

// Create default preferences for a user if they don't exist yet
const ensurePrefs = async (user) => {
  const existing = await NotificationPreference.findOne({ user: user._id });
  if (!existing) {
    await NotificationPreference.create(
      NotificationPreference.getDefaults(user)
    );
  }
};

// ── Enqueue shorthands (reduce boilerplate in the hooks below) ──

const enqueueEmail = (user, trigger, subject, body) =>
  enqueue({
    recipient: user._id,
    recipientEmail: user.email,
    channel: "email",
    trigger,
    subject,
    body,
  });

const enqueuePush = (user, trigger, title, body, payload) =>
  enqueue({
    recipient: user._id,
    channel: "push",
    trigger,
    subject: title,
    body,
    payload,
  });

const enqueueSMS = (user, trigger, body) =>
  enqueue({
    recipient: user._id,
    recipientPhone: user.phone,
    channel: "sms",
    trigger,
    subject: null,
    body,
  });

// ── Hooks ──────────────────────────────────────

// Trigger: user signs up
const notifyAccountWelcome = async (user) => {
  await ensurePrefs(user);

  const emailTpl = welcomeEmail(user.name);
  await enqueueEmail(user, "account_welcome", emailTpl.subject, emailTpl.html);

  const pushTpl = welcomePush(user.name);
  await enqueuePush(
    user,
    "account_welcome",
    pushTpl.title,
    pushTpl.body,
    pushTpl.data
  );
};

// Trigger: order is created (confirmed)
const notifyOrderConfirmed = async (user, order) => {
  await ensurePrefs(user);

  const emailTpl = orderConfirmationEmail(user.name, order);
  await enqueueEmail(
    user,
    "order_confirmed",
    emailTpl.subject,
    emailTpl.html
  );

  const pushTpl = orderConfirmationPush(order);
  await enqueuePush(
    user,
    "order_confirmed",
    pushTpl.title,
    pushTpl.body,
    pushTpl.data
  );

  if (user.phone) {
    await enqueueSMS(
      user,
      "order_confirmed",
      `Order #${order._id.toString().slice(-6)} confirmed for ${(order.total || 0).toLocaleString("fr-FR")} MAD. Track it in your dashboard.`
    );
  }
};

// Trigger: project status transitions (pending → in_progress → completed → cancelled)
const notifyProjectStatusChange = async (user, project, oldStatus, newStatus) => {
  await ensurePrefs(user);

  const emailTpl = projectStatusEmail(user.name, project, oldStatus, newStatus);
  await enqueueEmail(
    user,
    "project_status_change",
    emailTpl.subject,
    emailTpl.html
  );

  const pushTpl = projectStatusPush(project, newStatus);
  await enqueuePush(
    user,
    "project_status_change",
    pushTpl.title,
    pushTpl.body,
    pushTpl.data
  );

  if (user.phone) {
    await enqueueSMS(
      user,
      "project_status_change",
      `Project "${project.name || project.serviceTitle || "Untitled"}" is now ${newStatus.replace("_", " ")}.`
    );
  }
};

// Trigger: visitor submits the contact form
// Sends an auto-reply to the visitor + an alert to every admin
const notifyContactMessage = async (contact) => {
  // Auto-reply to the visitor
  const autoReplyTpl = contactAutoReplyEmail(contact.name, contact.subject);
  await enqueue({
    recipientEmail: contact.email,
    channel: "email",
    trigger: "new_contact_message",
    subject: autoReplyTpl.subject,
    body: autoReplyTpl.html,
  });

  // Alert all admins
  const adminEmails = await getAdminEmails();
  if (adminEmails.length === 0) return;

  const adminTpl = adminNewContactEmail(contact);
  for (const email of adminEmails) {
    await enqueue({
      recipientEmail: email,
      channel: "email",
      trigger: "new_contact_message",
      subject: adminTpl.subject,
      body: adminTpl.html,
    });
  }
};

// Trigger: a new review is submitted (pending moderation)
// Alerts all admins via email + push
const notifyNewReview = async (review) => {
  const User = require("../models/User");
  const admins = await User.find({ role: "admin" }).select("_id email").lean();
  if (admins.length === 0) return;

  // Email all admins
  const adminTpl = adminNewReviewEmail(review);
  for (const admin of admins) {
    await enqueue({
      recipientEmail: admin.email,
      channel: "email",
      trigger: "new_review",
      subject: adminTpl.subject,
      body: adminTpl.html,
    });
  }

  // Push notification to all admins (in-app)
  const pushTpl = newReviewPush(review);
  for (const admin of admins) {
    await enqueuePush(
      { _id: admin._id, email: admin.email },
      "new_review",
      pushTpl.title,
      pushTpl.body,
      pushTpl.data
    );
  }
};

module.exports = {
  notifyAccountWelcome,
  notifyOrderConfirmed,
  notifyProjectStatusChange,
  notifyContactMessage,
  notifyNewReview,
};
