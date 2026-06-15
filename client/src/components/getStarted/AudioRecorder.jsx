import { Mic, Square, Play, Trash2, Loader2 } from "lucide-react";

export default function AudioRecorder({ recording, duration, recordings, onStart, onStop, onDelete, formatDuration }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {recording ? (
          <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-300">Recording... {formatDuration(duration)}</span>
            <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-red-500 animate-pulse" style={{ width: `${(duration % 60) / 60 * 100}%` }} />
            </div>
            <button onClick={onStop} className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center hover:bg-red-500/30 transition-colors shrink-0">
              <Square className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ) : (
          <button onClick={onStart} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/20 to-cyan-600/10 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Record voice message</p>
              <p className="text-[10px] text-zinc-500">Click to start recording</p>
            </div>
          </button>
        )}
      </div>

      {recordings.length > 0 && (
        <div className="space-y-1.5">
          {recordings.map((rec) => (
            <div key={rec.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] group hover:bg-white/[0.04] transition-all">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <audio src={rec.url} controls className="hidden" id={`audio-${rec.id}`} />
                <button
                  onClick={() => { const el = document.getElementById(`audio-${rec.id}`); if (el.paused) el.play(); else el.pause(); }}
                  className="flex items-center justify-center w-full h-full"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="w-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" id={`wave-${rec.id}`} />
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5">{formatDuration(rec.duration)}</p>
              </div>
              <button onClick={() => onDelete(rec.id)} className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100 shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
