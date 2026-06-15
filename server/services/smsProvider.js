// ──────────────────────────────────────────────
// SMS provider abstraction.
// Set SMS_PROVIDER=twilio in .env to use Twilio.
// Default "log" provider just prints to console
// for development/testing.
// ──────────────────────────────────────────────
const SMS_PROVIDER = process.env.SMS_PROVIDER || "log";

const providers = {
  // ── Dev / testing — logs instead of sending ──
  log: {
    send: async ({ to, body }) => {
      console.log(`[SMS LOG] To: ${to} | Body: ${body}`);
      return { success: true, provider: "log" };
    },
  },

  // ── Production — Twilio ──────────────────────
  twilio: {
    send: async ({ to, body }) => {
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        throw new Error("Twilio credentials not configured");
      }
      let twilio;
      try {
        twilio = require("twilio");
      } catch {
        throw new Error("twilio package is not installed. Run: npm install twilio");
      }
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      const message = await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
        body,
      });
      return { success: true, provider: "twilio", sid: message.sid };
    },
  },
};

const sendSMS = async ({ to, body }) => {
  const provider = providers[SMS_PROVIDER] || providers.log;
  return provider.send({ to, body });
};

module.exports = { sendSMS };
