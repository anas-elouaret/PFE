import { useState, useCallback, useRef } from "react";

const ALLOWED_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  video: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"],
  document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "application/rtf"],
  design: ["image/vnd.adobe.photoshop", "application/postscript", "image/x-adobe-dng", "application/x-figma"],
  archive: ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"],
};

const MAX_FILES = 15;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_TOTAL_SIZE = 200 * 1024 * 1024;

function getFileCategory(type) {
  if (ALLOWED_TYPES.image.includes(type)) return "image";
  if (ALLOWED_TYPES.video.includes(type)) return "video";
  if (ALLOWED_TYPES.document.includes(type)) return "document";
  if (ALLOWED_TYPES.design.includes(type)) return "design";
  if (ALLOWED_TYPES.archive.includes(type)) return "archive";
  return "other";
}

function getExtension(name) {
  return name.split(".").pop().toLowerCase();
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let fileIdCounter = 0;

export default function useFileUpload() {
  const [files, setFiles] = useState([]);
  const nextId = useRef(1);

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList);
    const errors = [];
    const valid = [];

    if (files.length + incoming.length > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} files allowed.`);
      return { errors, valid: [] };
    }

    const currentTotal = files.reduce((s, f) => s + f.file.size, 0);

    for (const file of incoming) {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" exceeds the 50MB limit.`);
        continue;
      }
      if (currentTotal + file.size > MAX_TOTAL_SIZE) {
        errors.push(`"${file.name}" would exceed the 200MB total limit.`);
        continue;
      }
      valid.push({
        id: nextId.current++,
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        progress: 0,
        status: "pending",
        category: getFileCategory(file.type),
      });
    }

    setFiles((prev) => [...prev, ...valid]);
    return { errors, valid };
  }, [files]);

  const removeFile = useCallback((id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const updateProgress = useCallback((id, progress) => {
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress, status: progress >= 100 ? "done" : "uploading" } : f));
  }, []);

  const clearAll = useCallback(() => {
    files.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
    setFiles([]);
  }, [files]);

  const grouped = {
    image: files.filter((f) => f.category === "image"),
    video: files.filter((f) => f.category === "video"),
    document: files.filter((f) => f.category === "document"),
    design: files.filter((f) => f.category === "design"),
    archive: files.filter((f) => f.category === "archive"),
    other: files.filter((f) => f.category === "other"),
  };

  const totalSize = files.reduce((s, f) => s + f.file.size, 0);

  return { files, addFiles, removeFile, updateProgress, clearAll, grouped, totalSize, formatSize };
}
