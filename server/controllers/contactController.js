const Contact = require("../models/Contact");
const { notifyContactMessage } = require("../hooks/notificationHooks");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Name, email, subject, and message are required" });
    }
    const contact = await Contact.create({ name, email, phone, subject, message });

    notifyContactMessage(contact).catch((err) =>
      console.warn("Contact notification failed:", err.message)
    );

    res.status(201).json({ message: "Message sent successfully. We'll get back to you soon.", success: true });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to send message" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }).lean();
    const unreadCount = messages.filter((m) => !m.isRead).length;
    res.json({ messages, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message marked as read", contact: message });
  } catch (error) {
    res.status(500).json({ message: "Failed to update message" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
};
