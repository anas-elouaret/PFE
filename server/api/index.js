const mongoose = require("mongoose");
const resolveMongoUri = require("../utils/resolveMongoUri");

let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

// Fail a query immediately when the connection is down instead of buffering
// it: a buffered query can outlive the function's own time limit, turning a
// database outage into a timeout with no error anyone can act on.
mongoose.set("bufferCommands", false);

// A shorter window than the default so a request fails while there is still
// time left to run the fallback path.
const SERVER_SELECTION_TIMEOUT_MS = 8000;

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const rawUri = process.env.MONGODB_URI;
    if (!rawUri) throw new Error("MONGODB_URI is missing");
    const uri = rawUri.startsWith("mongodb+srv://") ? await resolveMongoUri(rawUri) : rawUri;
    cached.promise = mongoose
      .connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
        socketTimeoutMS: 45000,
      })
      .catch((err) => {
        // Clear the cached promise so the next invocation retries instead of
        // replaying this same rejection for the life of the warm instance.
        cached.promise = null;
        throw err;
      });
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
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "https://growstack.ma");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(503).json({ message: "Service temporarily unavailable." });
  };
  return;
}

// The preflight is answered here, before Express runs, so this list is what
// actually decides whether the browser lets the site call the API. It must
// contain the real public domains — answering with a single hardcoded origin
// blocks every POST coming from growstack.ma.
const ALLOWED_ORIGINS = [
  "https://growstack.ma",
  "https://www.growstack.ma",
  "https://growstack-anas.vercel.app",
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

const DEFAULT_ORIGIN = process.env.CLIENT_URL || "https://growstack.ma";

function setCORS(req, res) {
  const requestOrigin = req.headers?.origin;
  const allowedOrigin = ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : DEFAULT_ORIGIN;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
}

module.exports = async (req, res) => {
  setCORS(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  try {
    // A failed connection must not short-circuit the request: some handlers,
    // such as placing an order, have a fallback that still works without the
    // database. Let the route decide what it can do.
    try {
      await connectDB();
    } catch (dbErr) {
      console.error("Database unavailable for this request:", dbErr.message);
    }

    await app(req, res);
  } catch (err) {
    // Never return a stack trace to the client; it exposes paths and internals.
    console.error("Handler error:", err);
    if (!res.headersSent) {
      res.status(503).json({
        message:
          "Le service est temporairement indisponible. Merci de réessayer dans quelques instants.",
      });
    }
  }
};
