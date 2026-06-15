const express = require("express");
const {
  submitContact,
  getAllMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", submitContact);
router.get("/", authMiddleware, requireRole("admin"), getAllMessages);
router.patch("/:id/read", authMiddleware, requireRole("admin"), markAsRead);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteMessage);

module.exports = router;
