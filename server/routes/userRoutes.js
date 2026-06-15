const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
  adminGetAllUsers,
  adminUpdateUserRole,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.post("/change-password", authMiddleware, changePassword);

router.get("/admin/all", authMiddleware, requireRole("admin"), adminGetAllUsers);
router.patch("/admin/:id/role", authMiddleware, requireRole("admin"), adminUpdateUserRole);

module.exports = router;
