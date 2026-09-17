import { useCallback, useRef, useState } from "react";
import { Upload, Image, Video, FileText, Layers, Archive, AlertCircle } from "lucide-react";

const ACCEPT_MAP = {
  image: "image/jpeg,image/png,image/webp,image/svg+xml",
  video: "video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm",
  document: "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/rtf",
  design: "image/vnd.adobe.photoshop,application/postscript,application/x-figma",
  archive: "application/zip,application/x-rar-compressed,application/x-7z-compressed",
  all: "image/jpeg,image/png,image/webp,image/svg+xml,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/rtf,image/vnd.adobe.photoshop,application/postscript,application/x-figma,application/zip,application/x-rar-compressed,application/x-7z-compressed",
};

export default function FileDropZone({ onFilesAdded, errors = [], className = "" }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const files = e.dataTransfer?.files;
    console.debug("[FileDropZone] drop", files?.length ?? 0, "files");
    if (files?.length) onFilesAdded(files);
  }, [onFilesAdded]);

  const handleInput = useCallback((e) => {
    const files = e.target.files;
    console.debug("[FileDropZone] file input change", files?.length ?? 0, "files");
    if (files?.length) onFilesAdded(files);
    if (inputRef.current) inputRef.current.value = "";
  }, [onFilesAdded]);

  const openPicker = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.debug("[FileDropZone] openPicker");
    inputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openPicker}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          dragging ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"
        }`}
      >
        <input ref={inputRef} type="file" multiple onChange={handleInput} accept={ACCEPT_MAP.all} className="hidden" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-50 border border-indigo-200 flex items-center justify-center">
            <Upload className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Drop files here or click to browse</p>
            <p className="text-xs text-slate-400 mt-1">Images, videos, documents, design files, archives — up to 50MB each</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            {[
              { icon: Image, label: "Images", color: "#6366f1" },
              { icon: Video, label: "Videos", color: "#6366f1" },
              { icon: FileText, label: "Documents", color: "#6366f1" },
              { icon: Layers, label: "Design", color: "#06b6d4" },
              { icon: Archive, label: "Archives", color: "#6366f1" },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-medium text-slate-500">
                <item.icon className="w-3 h-3" style={{ color: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="flex items-center gap-1.5 text-xs text-red-500">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
