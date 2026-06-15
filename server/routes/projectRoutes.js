const express = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  getMyProjects,
  updateProject,
  updateProjectStatus,
  deleteProject,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", createProject);
router.get("/", authMiddleware, requireRole("admin", "creator"), getAllProjects);
router.get("/my", authMiddleware, getMyProjects);
router.get("/:id", getProjectById);
router.patch("/:id", authMiddleware, updateProject);
router.patch("/:id/status", authMiddleware, updateProjectStatus);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteProject);

module.exports = router;
