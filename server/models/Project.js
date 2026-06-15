const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
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
    files: [
      {
        url: String,
        filename: String,
        type: String,
      },
    ],
    negotiated: { type: Boolean, default: false },
    negotiationNotes: { type: String, default: "" },
    budgetDiscussion: { type: Boolean, default: false },
    reference: { type: String, default: "" },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ email: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model("Project", projectSchema);
