require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET;

const rawUri = process.env.MONGODB_URI;

const { startQueue } = require("./services/notificationQueue");

const startServer = async () => {
  try {
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    if (!rawUri) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(rawUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected");

    startQueue();

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
