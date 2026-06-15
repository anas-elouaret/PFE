const express = require("express");
const { getDashboardStats, getAnalytics } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, requireRole("admin"), getDashboardStats);
router.get("/analytics", authMiddleware, requireRole("admin"), getAnalytics);

module.exports = router;
