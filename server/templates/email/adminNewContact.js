const emailLayout = require("./layout");

const adminNewContactEmail = (contact) => ({
  subject: `New Contact Message — ${contact.subject}`,
  html: emailLayout(`
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">New Contact Message</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">From</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:12px;text-align:right">${contact.name} (${contact.email})</td></tr>
${contact.phone ? `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">Phone</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:12px;text-align:right">${contact.phone}</td></tr>` : ""}
<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">Subject</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#00AEEF;font-size:12px;text-align:right;font-weight:600">${contact.subject}</td></tr>
</table>
<p style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 24px;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px">${contact.message}</p>
<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/admin/messages"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    View in Admin
</a>
`),
});

module.exports = adminNewContactEmail;
