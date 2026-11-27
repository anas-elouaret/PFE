#!/usr/bin/env node
/**
 * Promote an existing account to admin.
 *
 * The admin panel at /admin is built and routed, but every route behind it
 * is guarded by requireRole("admin") and signup always creates a "client".
 * Until one account carries the admin role, the panel cannot be opened by
 * anyone — which is why it has never been seen.
 *
 * Usage, from the server/ directory:
 *
 *   MONGODB_URI="<your Atlas connection string>" node scripts/make-admin.js you@example.com
 *
 * The account must already exist: sign up on the site first, then run this.
 * Nothing is created here, so a typo in the email changes nothing.
 */
const mongoose = require("mongoose");

const email = (process.argv[2] || "").trim().toLowerCase();
const uri = process.env.MONGODB_URI;

if (!email || !email.includes("@")) {
  console.error("Usage: node scripts/make-admin.js <email>");
  process.exit(1);
}
if (!uri) {
  console.error("MONGODB_URI is not set. Copy it from Vercel → Settings → Environment Variables.");
  process.exit(1);
}

(async () => {
  await mongoose.connect(uri);
  const User = require("../models/User");

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No account with ${email}. Sign up on the site first, then run this again.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  if (user.role === "admin") {
    console.log(`${email} is already an admin. Nothing to do.`);
  } else {
    const was = user.role;
    user.role = "admin";
    // An admin who cannot sign in because their address was never confirmed
    // is the same problem one step later.
    user.isVerified = true;
    await user.save();
    console.log(`${email}: ${was} -> admin (and marked verified).`);
  }

  const admins = await User.find({ role: "admin" }).select("email").lean();
  console.log(`Admins now: ${admins.map((a) => a.email).join(", ")}`);
  console.log("Sign in at https://growstack.ma/admin/login");

  await mongoose.disconnect();
})().catch(async (err) => {
  console.error("Failed:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
