const emailLayout = (content) => `<!DOCTYPE html>
<html lang="en" style="background:#070707;margin:0;padding:0">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:40px 20px">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%">
<tr><td style="padding:32px 32px 0;text-align:center">
<h1 style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.3px;margin:0">
growstack<span style="color:#00AEEF">.</span>
</h1>
</td></tr>
<tr><td style="padding:40px 32px;background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01));border-radius:16px;border:1px solid rgba(255,255,255,0.06)">
${content}
</td></tr>
<tr><td style="padding:24px 32px;text-align:center">
<p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0">&copy; ${new Date().getFullYear()} growstack. All rights reserved.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;

module.exports = emailLayout;
