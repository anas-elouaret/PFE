const emailLayout = require("./layout");

const orderConfirmationEmail = (name, order) => ({
  subject: `Order Confirmed #${order._id.toString().slice(-6)} — growstack`,
  html: emailLayout(`
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">Order Confirmed! ✅</h2>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
Hi ${name},<br>Your order has been confirmed and we're getting started on it.
</p>
<table style="width:100%;border-collapse:collapse;margin-bottom:24px">
<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">Order</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:12px;text-align:right;font-weight:600">#${order._id.toString().slice(-6)}</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">Items</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:12px;text-align:right">${order.items ? order.items.length : 0}</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);font-size:12px">Total</td>
<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#00AEEF;font-size:14px;text-align:right;font-weight:700">${(order.total || 0).toLocaleString("fr-FR")} MAD</td></tr>
</table>
<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/client/dashboard"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    View Dashboard
</a>
<p style="font-size:12px;color:rgba(255,255,255,0.3);margin:24px 0 0;line-height:1.5">
We'll keep you updated on your order's progress.
</p>
`),
});

module.exports = orderConfirmationEmail;
