const express = require("express");
const { chat } = require("../controllers/chatController");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
  "/",
  rateLimiter({ windowMs: 60000, max: 20, message: "Too many chat requests. Please wait a moment." }),
  chat
);

module.exports = router;
