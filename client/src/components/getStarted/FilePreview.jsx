import { useState } from "react";
import { X, Image, Video, FileText, Layers, Archive, File as FileIcon, Play } from "lucide-react";

const ICONS = { image: Image, video: Video, document: FileText, design: Layers, archive: Archive, other: FileIcon };
const LABELS = { image: "Image", video: "Video", document: "Document", design: "Design", archive: "Archive", other: "File" };
const COLORS = { image: "#6366f1", video: "#6366f1", document: "#6366f1", design: "#06b6d4", archive: "#6366f1", other: "#64748b" };

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileCard({ item, onRemove }) {
  const Icon = ICONS[item.category] || FileIcon;
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.debug("[FilePreview] open preview", item.file.name);
    setShowPreview(true);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.debug("[FilePreview] remove file", item.id, item.file.name);
    onRemove(item.id);
  };

  return (
    <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all">
      {item.preview ? (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">
          <img src={item.preview} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={handlePreview}>
            <Play className="w-4 h-4 text-white/70" />
          </div>
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" style={{ color: COLORS[item.category] || "#64748b" }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{item.file.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-medium text-slate-400 uppercase">{LABELS[item.category] || "File"}</span>
          <span className="text-[10px] text-slate-300">·</span>
          <span className="text-[10px] text-slate-400">{formatSize(item.file.size)}</span>
          {item.status === "uploading" && (
            <>
              <span className="text-[10px] text-slate-300">·</span>
              <span className="text-[10px] text-indigo-500">{item.progress}%</span>
            </>
          )}
        </div>
        {item.status === "uploading" && (
          <div className="mt-1.5 w-full h-1 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-200" style={{ width: `${item.progress}%` }} />
          </div>
        )}
      </div>
      <button type="button" onClick={handleRemove} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100 shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
      {showPreview && item.preview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <img src={item.preview} alt="" className="max-w-full max-h-full rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default function FilePreview({ grouped, onRemove, formatSize }) {
  const categories = ["image", "video", "document", "design", "archive", "other"];

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const Icon = ICONS[cat] || FileIcon;
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color: COLORS[cat] }} />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{LABELS[cat]}s ({items.length})</span>
            </div>
            <div className="space-y-1.5">
              {items.map((item) => <FileCard key={item.id} item={item} onRemove={onRemove} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
