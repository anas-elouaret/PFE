const emailLayout = require("./layout");

const esc = (value) =>
  String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatPrice = (amount) =>
  `${Number(amount || 0).toLocaleString("fr-FR")} MAD`;

const formatCurrency = (amount) =>
  `${Number(amount || 0).toLocaleString("fr-FR")}`;

const REFERENCE_LABELS = {
  website: "Website",
  googledrive: "Google Drive",
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  competitor: "Competitor",
  inspiration: "Inspiration",
};

const infoRow = (label, value) => `
<tr>
  <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.35);font-size:12px;white-space:nowrap;vertical-align:top">${label}</td>
  <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:12px;text-align:right;word-break:break-word">${value}</td>
</tr>`;

const currencyCell = (text) => `
<span style="color:#00AEEF;font-weight:700">${text}</span>`;

const adminNewProjectEmail = ({
  orderId,
  createdAt,
  clientName,
  email,
  phone,
  companyName,
  industry,
  website,
  items = [],
  subtotal = 0,
  discount = 0,
  discountPercent = 0,
  promoCode = "",
  promoAmount = 0,
  total = 0,
  description = "",
  timeline = "",
  budget = "",
  references = [],
  files = [],
  notes = "",
}) => {
  const resolvedTotal = Number(total || 0) || Math.max(0, Number(subtotal) - Number(discount) - Number(promoAmount));

  const orderIdText = orderId || "—";
  const submittedAt = createdAt
    ? new Date(createdAt).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "—";

  const itemsRows = items.length
    ? items
        .map((item) => {
          const unit = Number(item.price || 0);
          const qty = Number(item.quantity || 1);
          const lineTotal = unit * qty;
          return `
<tr>
  <td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:13px;font-weight:600">
    ${esc(item.title || "Service")}
    ${qty > 1 ? `<span style="display:block;color:rgba(255,255,255,0.4);font-size:11px;font-weight:400;margin-top:2px">Qty: ${qty} × ${formatCurrency(unit)} MAD / unit</span>` : ""}
  </td>
  <td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:13px;text-align:right">${currencyCell(formatPrice(lineTotal))}</td>
</tr>`;
        })
        .join("")
    : `<tr><td colspan="2" style="padding:9px 0;color:rgba(255,255,255,0.45);font-size:12px">No services selected.</td></tr>`;

  const referenceRows = references.length
    ? references
        .filter((r) => r.url && String(r.url).trim())
        .map(
          (ref) => `
<tr>
  <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.35);font-size:12px">${REFERENCE_LABELS[ref.type] || esc(ref.type)}</td>
  <td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">
    <a href="${esc(ref.url)}" style="color:#00AEEF;font-size:12px;font-weight:600;text-decoration:none;word-break:break-all">${esc(ref.url)}</a>
  </td>
</tr>`
        )
        .join("")
    : `<tr><td colspan="2" style="padding:7px 0;color:rgba(255,255,255,0.45);font-size:12px">No reference links provided.</td></tr>`;

  const fileRows = files.length
    ? files
        .map((f) => {
          const filename = f.name || f.filename || f.url || "Attachment";
          const link = f.url
            ? `<a href="${esc(f.url)}" style="color:#00AEEF;font-size:12px;font-weight:600;text-decoration:none;word-break:break-all">${esc(filename)}</a>`
            : `<span style="color:rgba(255,255,255,0.6);font-size:12px">${esc(filename)}</span>`;
          return `
<tr>
  <td colspan="2" style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:12px">${link}</td>
</tr>`;
        })
        .join("")
    : `<tr><td colspan="2" style="padding:7px 0;color:rgba(255,255,255,0.45);font-size:12px">No files attached.</td></tr>`;

  return {
    subject: `New Order Submission #${orderIdText} — growstack`,
    html: emailLayout(`
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">New Order Submission</h2>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
A new order/project has been submitted. Review the details below and get in touch with the client.
</p>

<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:12px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.4);text-transform:uppercase">Order Metadata</td></tr>
${infoRow("Order ID", `<span style="font-family:monospace;color:#00AEEF;font-weight:700">${orderIdText}</span>`)}
${infoRow("Submitted", submittedAt)}
${timeline ? infoRow("Timeline", esc(timeline)) : ""}
${budget ? infoRow("Budget", `${formatCurrency(budget)} MAD`) : ""}
</table>

<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:12px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.4);text-transform:uppercase">Client Info</td></tr>
${infoRow("Name", esc(clientName))}
${infoRow("Email", `<a href="mailto:${esc(email)}" style="color:#00AEEF;text-decoration:none;font-weight:600">${esc(email)}</a>`)}
${phone ? infoRow("Phone", esc(phone)) : ""}
${companyName ? infoRow("Company / Brand", esc(companyName)) : ""}
${industry ? infoRow("Industry", esc(industry)) : ""}
${website ? infoRow("Website", `<a href="${esc(website)}" style="color:#00AEEF;text-decoration:none;font-weight:600;word-break:break-all">${esc(website)}</a>`) : ""}
</table>

<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:12px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.4);text-transform:uppercase">Order Summary</td></tr>
${itemsRows}
<tr><td style="padding:9px 0;color:rgba(255,255,255,0.55);font-size:12px">Subtotal</td>
<td style="padding:9px 0;color:#fff;font-size:12px;text-align:right">${formatPrice(subtotal)}</td></tr>
${Number(discount) > 0 ? `<tr><td style="padding:9px 0;color:rgba(255,255,255,0.55);font-size:12px">Bundle Discount (${discountPercent}%)</td>
<td style="padding:9px 0;color:#78C850;font-size:12px;text-align:right">−${formatPrice(discount)}</td></tr>` : ""}
${promoCode ? `<tr><td style="padding:9px 0;color:rgba(255,255,255,0.55);font-size:12px">Promo Code (${esc(promoCode)})</td>
<td style="padding:9px 0;color:#78C850;font-size:12px;text-align:right">−${formatPrice(promoAmount)}</td></tr>` : ""}
<tr><td style="padding:12px 0;color:#fff;font-size:14px;font-weight:700;border-top:1px solid rgba(255,255,255,0.12)">Total Amount</td>
<td style="padding:12px 0;text-align:right;border-top:1px solid rgba(255,255,255,0.12)">${currencyCell(formatPrice(resolvedTotal))}</td></tr>
</table>

<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:12px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.4);text-transform:uppercase">Project Brief</td></tr>
<tr><td style="padding:0 0 8px">
<p style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px">${esc(description) || "No description provided."}</p>
</td></tr>
</table>

<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:12px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.4);text-transform:uppercase">Reference Links</td></tr>
${referenceRows}
</table>

<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:12px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.4);text-transform:uppercase">Attached Files</td></tr>
${fileRows}
</table>

${notes ? `<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:12px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.4);text-transform:uppercase">Notes</td></tr>
<tr><td><p style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px">${esc(notes)}</p></td></tr>
</table>` : ""}

<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/admin/projects"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    View in Admin Dashboard
</a>
`),
  };
};

module.exports = adminNewProjectEmail;