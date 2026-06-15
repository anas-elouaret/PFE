import { useCallback, useRef, useState } from "react";
import { Upload, Image, Video, FileText, Layers, Archive, File as FileIcon, AlertCircle } from "lucide-react";

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

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer?.files) onFilesAdded(e.dataTransfer.files);
  }, [onFilesAdded]);

  const handleInput = useCallback((e) => {
    if (e.target.files) onFilesAdded(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  }, [onFilesAdded]);

  const openPicker = () => inputRef.current?.click();

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={openPicker}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          dragging ? "border-[#00AEEF]/50 bg-[#00AEEF]/5" : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
        }`}
      >
        <input ref={inputRef} type="file" multiple onChange={handleInput} accept={ACCEPT_MAP.all} className="hidden" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00AEEF]/20 to-[#33C8FF]/10 border border-[#00AEEF]/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-[#00AEEF]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Drop files here or click to browse</p>
            <p className="text-xs text-zinc-500 mt-1">Images, videos, documents, design files, archives — up to 50MB each</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            {[
              { icon: Image, label: "Images", color: "#00AEEF" },
              { icon: Video, label: "Videos", color: "#00AEEF" },
              { icon: FileText, label: "Documents", color: "#00AEEF" },
              { icon: Layers, label: "Design", color: "#33C8FF" },
              { icon: Archive, label: "Archives", color: "#00AEEF" },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] font-medium text-zinc-400">
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
            <p key={i} className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
