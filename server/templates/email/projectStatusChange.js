const emailLayout = require("./layout");

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusEmojis = {
  pending: "⏳",
  in_progress: "🛠️",
  completed: "✅",
  cancelled: "❌",
};

const projectStatusEmail = (name, project, oldStatus, newStatus) => ({
  subject: `Project ${statusLabels[newStatus] || newStatus} — ${project.clientName || project.serviceTitle}`,
  html: emailLayout(`
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">Project Update ${statusEmojis[newStatus] || ""}</h2>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
Hi ${name},<br>
Your project <strong style="color:#fff">${project.clientName || project.serviceTitle || "Untitled"}</strong> has moved from
<strong style="color:rgba(255,255,255,0.6)">${statusLabels[oldStatus] || oldStatus}</strong>
to
<strong style="color:#00AEEF">${statusLabels[newStatus] || newStatus}</strong>.
</p>
${project.description ? `<p style="font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;margin:0 0 24px;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px">${project.description}</p>` : ""}
<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/client/dashboard"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    View Project
</a>
<p style="font-size:12px;color:rgba(255,255,255,0.3);margin:24px 0 0;line-height:1.5">
Questions? Reach out to your project manager.
</p>
`),
});

module.exports = projectStatusEmail;
