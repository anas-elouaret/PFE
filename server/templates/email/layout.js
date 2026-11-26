const SITE = process.env.PUBLIC_SITE_URL || "https://growstack.ma";

/**
 * The shell every outgoing email is wrapped in.
 *
 * The footer carries the sender's identity and a way out. A transactional
 * mail that names nobody and offers no way to stop receiving it is what
 * filters read as bulk, and what a recipient has no answer to.
 *
 * @param {string} content  the message body
 * @param {object} [opts]
 * @param {boolean} [opts.internal]  true for mail to ourselves (admin
 *   notifications), which carries the identity but no unsubscribe line.
 */
const emailLayout = (content, opts = {}) => {
  const { internal = false } = opts;

  const optOut = internal
    ? ""
    : `<p style="font-size:11px;line-height:18px;color:rgba(255,255,255,0.35);margin:0 0 8px">
Vous recevez ce message parce que vous avez un compte ou une commande chez GROWSTACK.
<a href="${SITE}/client/dashboard/parametres" style="color:rgba(255,255,255,0.6);text-decoration:underline">Gérer vos notifications</a>
&middot;
<a href="mailto:growstackagency@gmail.com?subject=Desabonnement" style="color:rgba(255,255,255,0.6);text-decoration:underline">Se désabonner</a>
</p>`;

  return `<!DOCTYPE html>
<html lang="fr" style="background:#070707;margin:0;padding:0">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:40px 20px">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%">
<tr><td style="padding:32px 32px 0;text-align:center">
<h1 style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.3px;margin:0">
growstack<span style="color:#ff5722">.</span>
</h1>
</td></tr>
<tr><td style="padding:40px 32px;background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01));border-radius:16px;border:1px solid rgba(255,255,255,0.06)">
${content}
</td></tr>
<tr><td style="padding:24px 32px;text-align:center">
${optOut}
<p style="font-size:11px;line-height:18px;color:rgba(255,255,255,0.3);margin:0 0 6px">
GROWSTACK &middot; Casablanca, Maroc &middot;
<a href="mailto:growstackagency@gmail.com" style="color:rgba(255,255,255,0.5);text-decoration:underline">growstackagency@gmail.com</a>
</p>
<p style="font-size:11px;color:rgba(255,255,255,0.3);margin:0">
<a href="${SITE}/confidentialite" style="color:rgba(255,255,255,0.5);text-decoration:underline">Confidentialité</a>
&middot;
<a href="${SITE}/conditions" style="color:rgba(255,255,255,0.5);text-decoration:underline">Conditions</a>
&middot;
&copy; ${new Date().getFullYear()} GROWSTACK
</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
};

module.exports = emailLayout;
