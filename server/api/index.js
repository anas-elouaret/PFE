const mongoose = require("mongoose");
const resolveMongoUri = require("../utils/resolveMongoUri");

let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const rawUri = process.env.MONGODB_URI;
    if (!rawUri) throw new Error("MONGODB_URI is missing");
    const mongoUri = rawUri.startsWith("mongodb+srv://") ? await resolveMongoUri(rawUri) : rawUri;
    cached.promise = mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

let app;
try {
  app = require("../app");
} catch (err) {
  console.error("Require error:", err);
  module.exports = (req, res) => {
    res.status(500).json({ error: err.message, stack: err.stack });
  };
  return;
}

module.exports = async (req, res) => {
  try {
    await connectDB();
    await app(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
