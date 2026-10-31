const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    companyName: { type: String, default: "" },
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    projectType: { type: String, default: "" },
    serviceTitle: { type: String, default: "" },
    serviceId: { type: String, default: "" },
    serviceIds: [{ type: String }],
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        date: { type: Date, default: Date.now },
        note: String,
      },
    ],
    // Human-readable order reference shown to the client (e.g. GS-ABC123).
    orderId: { type: String, default: "", index: true },
    // What the client asked for in the brief, in their own words.
    timeline: { type: String, default: "" },
    budget: { type: String, default: "" },
    files: [
      {
        url: String,
        // The browser sends `name`; `filename` is kept for older records.
        name: String,
        filename: String,
        size: Number,
        type: String,
        category: String,
      },
    ],
    items: [
      {
        serviceId: { type: String, default: null },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        image: { type: String, default: null },
        category: { type: String, default: "" },
      },
    ],
    references: [
      {
        type: { type: String, default: "website" },
        url: { type: String, default: "" },
      },
    ],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    promoCode: { type: String, default: "" },
    promoAmount: { type: Number, default: 0 },
    negotiated: { type: Boolean, default: false },
    negotiationNotes: { type: String, default: "" },
    budgetDiscussion: { type: Boolean, default: false },
    reference: { type: String, default: "" },
    price: { type: Number, default: 0 },
    // Amount actually due after discounts; `price` is kept in step with it.
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ email: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model("Project", projectSchema);
