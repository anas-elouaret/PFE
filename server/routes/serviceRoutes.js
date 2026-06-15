const express = require("express");
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", authMiddleware, requireRole("admin"), createService);
router.patch("/:id", authMiddleware, requireRole("admin"), updateService);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteService);

module.exports = router;
