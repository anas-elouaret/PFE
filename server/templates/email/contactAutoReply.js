const emailLayout = require("./layout");

const contactAutoReplyEmail = (name, subject) => ({
  subject: `We received your message — growstack`,
  html: emailLayout(`
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">Thanks for reaching out! 🙌</h2>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
Hi ${name},<br>
We've received your message regarding <strong style="color:#fff">${subject}</strong> and our team will get back to you within 24 hours.
</p>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
In the meantime, feel free to browse our services or check out our portfolio.
</p>
<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/services"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    Browse Services
</a>
<p style="font-size:12px;color:rgba(255,255,255,0.3);margin:24px 0 0;line-height:1.5">
If this is urgent, please call us directly.
</p>
`),
});

module.exports = contactAutoReplyEmail;
