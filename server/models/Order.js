const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    serviceId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    image: { type: String, default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

orderSchema.index({ email: 1 });
orderSchema.index({ client: 1 });

module.exports = mongoose.model("Order", orderSchema);
