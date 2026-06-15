const express = require("express");
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", authMiddleware, requireRole("admin"), updateOrderStatus);
router.get("/", authMiddleware, requireRole("admin"), getAllOrders);

module.exports = router;
