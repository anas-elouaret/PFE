const statusEmojis = {
  pending: "⏳",
  in_progress: "🛠️",
  completed: "✅",
  cancelled: "❌",
};

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const projectStatusPush = (project, newStatus) => {
  const emoji = statusEmojis[newStatus] || "";
  const label = statusLabels[newStatus] || newStatus;
  return {
    title: `${emoji} Project ${label}`,
    body: `"${project.name || project.serviceTitle || "Untitled"}" is now ${label.toLowerCase()}.`,
    data: {
      trigger: "project_status_change",
      projectId: project._id ? project._id.toString() : project.id,
      status: newStatus,
    },
  };
};

module.exports = projectStatusPush;
