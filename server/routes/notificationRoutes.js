const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", notificationController.getMyNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/read", notificationController.markAsRead);
router.get("/preferences", notificationController.getPreferences);
router.put("/preferences", notificationController.updatePreferences);

module.exports = router;
