const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIMES = [
  "image/jpeg", "image/png", "image/webp", "image/svg+xml",
  "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip", "application/x-rar-compressed", "application/x-7z-compressed",
  "text/plain", "application/rtf",
  "image/vnd.adobe.photoshop", "application/postscript", "application/x-figma",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const file = req.files.file;

    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return res.status(400).json({ message: "File type not allowed" });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ message: "File exceeds 50MB limit" });
    }

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
