const emailLayout = require("./layout");

const welcomeEmail = (name) => ({
  subject: "Welcome to growstack!",
  html: emailLayout(`
<h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 8px">Welcome aboard, ${name}! 🚀</h2>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
We're thrilled to have you join growstack. Your account is all set up and ready to go.
</p>
<p style="font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 24px">
Browse our services, start a project, and let's build something amazing together.
</p>
<a href="${process.env.CLIENT_URL || "http://localhost:5173"}/services"
   style="display:inline-block;padding:14px 32px;border-radius:12px;background:linear-gradient(135deg,#00AEEF,#0095D4);color:#fff;font-size:14px;font-weight:700;text-decoration:none">
    Explore Services
</a>
<p style="font-size:12px;color:rgba(255,255,255,0.3);margin:24px 0 0;line-height:1.5">
Need help? Just reply to this email — we're here for you.
</p>
`),
});

module.exports = welcomeEmail;
