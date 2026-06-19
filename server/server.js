require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

const { startQueue } = require("./services/notificationQueue");

const startServer = async () => {
  try {
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
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
