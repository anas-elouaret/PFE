import { useState } from "react";
import { Plus, X, Link2, Globe, Video, Camera, MessageCircle, Lightbulb, Sword, ChevronDown } from "lucide-react";

const TYPE_ICONS = {
  website: Globe, googledrive: Link2, youtube: Video,
  instagram: Camera, tiktok: Camera, facebook: MessageCircle,
  competitor: Sword, inspiration: Lightbulb,
};

export default function ReferenceLinks({ references, onAdd, onUpdate, onRemove, getTypeLabel, getTypePlaceholder, referenceTypes }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-3">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-left">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Project References</span>
          <span className="text-xs text-zinc-500">({references.length})</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="space-y-2">
          {references.map((ref) => {
            const Icon = TYPE_ICONS[ref.type] || Link2;
            return (
              <div key={ref.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <input
                    value={ref.url}
                    onChange={(e) => onUpdate(ref.id, e.target.value)}
                    placeholder={getTypePlaceholder(ref.type)}
                    className="w-full h-9 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-600 outline-none transition-all focus:border-purple-500/40 focus:bg-white/[0.06]"
                  />
                </div>
                <span className="text-[10px] font-medium text-zinc-500 w-16 text-right">{getTypeLabel(ref.type)}</span>
                <button onClick={() => onRemove(ref.id)} className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all shrink-0">
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {referenceTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => onAdd(type.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
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
