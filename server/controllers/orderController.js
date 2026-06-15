const Order = require("../models/Order");
const User = require("../models/User");
const { notifyOrderConfirmed } = require("../hooks/notificationHooks");

exports.createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body };
    if (req.userId) orderData.client = req.userId;
    const order = await Order.create(orderData);

    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user) {
        notifyOrderConfirmed(user, order).catch((err) =>
          console.warn("Order notification failed:", err.message)
        );
      }
    }

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to create order" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, client } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (client) filter.client = client;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ client: req.userId }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};
