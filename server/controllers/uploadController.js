const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const file = req.files.file;
    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await file.mv(filepath);

    res.json({
      url: `/uploads/${filename}`,
      filename: file.name,
      size: file.size,
      mimetype: file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload file" });
  }
};
