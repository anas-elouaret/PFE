#!/usr/bin/env node
/**
 * Create or promote the first administrator.
 *
 * There is deliberately no HTTP route for this: promoting an account is only
 * possible for whoever already holds the database credentials.
 *
 * Usage, from the server/ directory:
 *
 *   MONGODB_URI="<your Atlas URI>" node scripts/create-admin.js you@example.com "Your Name" "a-strong-password"
 *
 * - If the email already exists, the account is promoted to admin.
 * - Otherwise a new verified admin account is created with the given password.
 *
 * The password is read from the command line, so clear your shell history
 * afterwards (or export it as a variable) if the machine is shared.
 */

const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const User = require(path.join(__dirname, "..", "models", "User"));

async function main() {
  const [email, name, password] = process.argv.slice(2);

  if (!email) {
    console.error("Usage: node scripts/create-admin.js <email> [name] [password]");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Export it or put it in server/.env");
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    existing.role = "admin";
    if (typeof existing.isVerified === "boolean") existing.isVerified = true;
    await existing.save();
    console.log(`Promoted existing account to admin: ${normalizedEmail}`);
  } else {
    if (!password || password.length < 8) {
      console.error("A password of at least 8 characters is required to create a new account.");
      await mongoose.disconnect();
      process.exit(1);
    }
    const user = new User({
      name: (name || "Administrator").trim(),
      email: normalizedEmail,
      password,
      role: "admin",
    });
    if (typeof user.isVerified === "boolean" || "isVerified" in user) {
      user.isVerified = true;
    }
    await user.save();
    console.log(`Created admin account: ${normalizedEmail}`);
  }

  await mongoose.disconnect();
  console.log("Done. Sign in at https://growstack.ma/admin/login");
}

main().catch(async (err) => {
  console.error("Failed:", err.message);
  try {
    await mongoose.disconnect();
  } catch {
    /* already disconnected */
  }
  process.exit(1);
});
