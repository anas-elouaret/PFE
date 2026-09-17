import { useState } from "react";
import { Plus, X, Link2, Globe, Video, Camera, MessageCircle, Lightbulb, Sword, ChevronDown } from "lucide-react";

const TYPE_ICONS = {
  website: Globe, googledrive: Link2, youtube: Video,
  instagram: Camera, tiktok: Camera, facebook: MessageCircle,
  competitor: Sword, inspiration: Lightbulb,
};

export default function ReferenceLinks({ references, onAdd, onUpdate, onRemove, getTypeLabel, getTypePlaceholder, referenceTypes }) {
  const [expanded, setExpanded] = useState(true);

  const handleToggle = (e) => {
    e.preventDefault();
    console.debug("[ReferenceLinks] toggle expanded", !expanded);
    setExpanded((prev) => !prev);
  };

  const handleAdd = (e, typeId) => {
    e.preventDefault();
    e.stopPropagation();
    console.debug("[ReferenceLinks] add reference", typeId);
    onAdd(typeId);
  };

  const handleRemove = (e, refId) => {
    e.preventDefault();
    e.stopPropagation();
    console.debug("[ReferenceLinks] remove reference", refId);
    onRemove(refId);
  };

  return (
    <div className="space-y-3">
      <button type="button" onClick={handleToggle} className="flex items-center justify-between w-full text-left">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-slate-900">Project References</span>
          <span className="text-xs text-slate-400">({references.length})</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="space-y-2">
          {references.map((ref) => {
            const Icon = TYPE_ICONS[ref.type] || Link2;
            return (
              <div key={ref.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <input
                    value={ref.url}
                    onChange={(e) => onUpdate(ref.id, e.target.value)}
                    placeholder={getTypePlaceholder(ref.type)}
                    className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-500/20"
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400 w-16 text-right">{getTypeLabel(ref.type)}</span>
                <button type="button" onClick={(e) => handleRemove(e, ref.id)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shrink-0">
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {referenceTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={(e) => handleAdd(e, type.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
              >
                <Plus className="w-3 h-3" />
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
