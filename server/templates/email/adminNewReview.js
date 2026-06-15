const emailLayout = require("./layout");

const adminNewReviewEmail = (review) => ({
  subject: `New Review — ${review.rating}★ from ${review.name}`,
  html: emailLayout(`
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">New Review Submitted</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">Reviewer</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:12px;text-align:right">${review.name} (${review.email})</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">Rating</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#FFD700;font-size:12px;text-align:right;font-weight:600">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">Status</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:${review.status === "pending" ? "#FFA500" : "#00AEEF"};font-size:12px;text-align:right;text-transform:capitalize">${review.status}</td></tr>
</table>
<p style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 24px;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px">${review.comment}</p>
<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/admin/reviews"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    Moderate Review
</a>
`),
});

module.exports = adminNewReviewEmail;
