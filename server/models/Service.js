const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["social_media", "marketing", "ugc", "photography", "graphic_design", "other"],
      required: true,
    },
    price: { type: Number, default: 0 },
    unit: { type: String, default: "service" },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    image: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
