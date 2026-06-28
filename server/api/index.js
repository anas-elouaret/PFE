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
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "https://growstack-anas.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(500).json({ error: err.message, stack: err.stack });
  };
  return;
}

function setCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "https://growstack-anas.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

module.exports = async (req, res) => {
  setCORS(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  try {
    await connectDB();
    await app(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
