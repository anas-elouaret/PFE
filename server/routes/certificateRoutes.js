const express = require("express");
const {
  getMyCertificates,
  getMyCertificate,
  verifyCertificate,
} = require("../controllers/certificateController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// Public. Rate limited because it is the one endpoint here that takes a
// guessable-looking identifier, and enumeration should not be free.
router.get(
  "/verify/:reference",
  rateLimiter({ windowMs: 60000, max: 30, message: "Trop de vérifications. Réessayez dans une minute." }),
  verifyCertificate
);

router.get("/me", authMiddleware, getMyCertificates);
router.get("/me/:reference", authMiddleware, getMyCertificate);

module.exports = router;
