const Project = require("../models/Project");
const User = require("../models/User");
const { notifyProjectStatusChange } = require("../hooks/notificationHooks");

exports.createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.userId) projectData.client = req.userId;
    const project = await Project.create(projectData);
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to create project" });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { status, search, client } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (client) filter.client = client;
    if (search) {
      filter.$or = [
        { serviceTitle: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const projects = await Project.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.userId }).sort({ createdAt: -1 }).lean();
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { status, note, ...updates } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const oldStatus = project.status;

    if (status) {
      project.statusHistory.push({
        status,
        date: new Date(),
        note: note || `Status changed to ${status}`,
      });
      project.status = status;
    }

    Object.assign(project, updates);
    await project.save();

    if (status && oldStatus !== status && project.client) {
      const user = await User.findById(project.client);
      if (user) {
        notifyProjectStatusChange(user, project, oldStatus, status).catch(
          (err) => console.warn("Project status notification failed:", err.message)
        );
      }
    }

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Failed to update project" });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ["pending", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const oldStatus = project.status;

    project.statusHistory.push({
      status,
      date: new Date(),
      note: note || `Status changed to ${status}`,
    });
    project.status = status;
    await project.save();

    if (project.client && oldStatus !== status) {
      const user = await User.findById(project.client);
      if (user) {
        notifyProjectStatusChange(user, project, oldStatus, status).catch(
          (err) => console.warn("Project status notification failed:", err.message)
        );
      }
    }

    res.json({ message: `Project ${status} successfully`, project });
  } catch (error) {
    res.status(500).json({ message: "Failed to update project status" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
};
