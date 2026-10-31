const Project = require("../models/Project");
const User = require("../models/User");
const { notifyProjectStatusChange, notifyAdminNewProject } = require("../hooks/notificationHooks");
const { sendEmail } = require("../utils/email");
const adminNewProjectEmail = require("../templates/email/adminNewProject");

// Where a new order is announced when the database is unreachable. The
// notification queue stores its messages in MongoDB, so it cannot be the
// fallback for a MongoDB outage — this path talks to SMTP directly.
const FALLBACK_ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "growstackagency@gmail.com";

const emailOrderDirectly = async (order) => {
  const tpl = adminNewProjectEmail(order);
  await sendEmail({
    to: FALLBACK_ADMIN_EMAIL,
    subject: tpl.subject,
    html: tpl.html,
  });
};

// A signed-in client may only reach their own project; staff may reach any.
const canAccessProject = async (userId, project) => {
  if (project.client && String(project.client) === String(userId)) return true;
  const user = await User.findById(userId).select("role").lean();
  return Boolean(user && ["admin", "creator"].includes(user.role));
};

exports.createProject = async (req, res) => {
  const projectData = { ...req.body };
  if (req.userId) projectData.client = req.userId;

  let project = null;
  let saveError = null;

  try {
    project = await Project.create(projectData);
  } catch (error) {
    // A malformed order is the sender's problem and must be reported as such.
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    saveError = error;
    console.error("Order could not be saved:", error.message);
  }

  if (project) {
    notifyAdminNewProject(project).catch((err) =>
      console.warn("Admin order notification failed:", err.message)
    );
    return res.status(201).json({ message: "Project created successfully", project });
  }

  // The database is unavailable. Rather than lose the order, send it straight
  // to the agency by email and tell the client the truth: we received it, but
  // it is not in their dashboard yet.
  try {
    await emailOrderDirectly(projectData);
    return res.status(202).json({
      message:
        "Votre demande nous est bien parvenue. Elle sera ajoutée à votre espace client sous peu.",
      persisted: false,
      project: projectData,
    });
  } catch (mailError) {
    console.error("Order fallback email failed:", mailError.message, saveError?.message);
    return res.status(503).json({
      message:
        "Nous ne parvenons pas à enregistrer votre demande pour le moment. Merci de réessayer dans quelques instants ou de nous écrire à " +
        FALLBACK_ADMIN_EMAIL +
        ".",
    });
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
    if (!(await canAccessProject(req.userId, project))) {
      return res.status(403).json({ message: "Access denied." });
    }
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
    if (!(await canAccessProject(req.userId, project))) {
      return res.status(403).json({ message: "Access denied." });
    }

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
    if (!(await canAccessProject(req.userId, project))) {
      return res.status(403).json({ message: "Access denied." });
    }

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
