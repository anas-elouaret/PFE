const mongoose = require("mongoose");
const crypto = require("crypto");

/**
 * An attestation that a reader passed a guide's quiz.
 *
 * This is not a diploma and GROWSTACK is not an accredited training body —
 * the certificate page says so on its face. What this record exists for is
 * verification: the reference is printed on the certificate, and anyone the
 * holder shows it to can check it against the public verify endpoint. A
 * certificate that cannot be checked is just an image anybody can edit.
 *
 * The holder's name is copied in at issue time rather than read from the
 * account later, so renaming an account cannot silently rewrite a
 * certificate that is already in circulation.
 */
const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    recipientName: { type: String, required: true, trim: true },
    guideSlug: { type: String, required: true, trim: true },
    guideTitle: { type: String, default: "", trim: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One certificate per reader per guide. Retaking the quiz with a better score
// updates the existing one rather than issuing a second.
certificateSchema.index({ user: 1, guideSlug: 1 }, { unique: true });

/**
 * A reference that is short enough to read aloud and type, and random enough
 * not to be guessable from another one. Ambiguous characters (0/O, 1/I) are
 * left out because these get copied by hand.
 */
certificateSchema.statics.generateReference = function generateReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i += 1) code += alphabet[bytes[i] % alphabet.length];
  const year = new Date().getFullYear();
  return `GS-${year}-${code.slice(0, 4)}-${code.slice(4)}`;
};

module.exports = mongoose.model("Certificate", certificateSchema);
