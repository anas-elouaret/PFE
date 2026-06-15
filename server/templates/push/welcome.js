const welcomePush = (name) => ({
  title: "Welcome to growstack! 🚀",
  body: `Hi ${name}, your account is ready. Start exploring our services!`,
  data: {
    trigger: "account_welcome",
  },
});

module.exports = welcomePush;
