let app;
try {
  app = require("../app");
} catch (err) {
  console.error("Require error:", err);
  module.exports = (req, res) => {
    res.status(500).json({ error: err.message, stack: err.stack });
  };
  return;
}

module.exports = async (req, res) => {
  try {
    await app(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
