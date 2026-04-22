import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { mockPOIs } from "../../data/mockData";

interface GuidePreviewModalProps {
  guideName: string;
  onClose: () => void;
}

export function GuidePreviewModal({ guideName, onClose }: GuidePreviewModalProps) {
  const [activePOIIndex, setActivePOIIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setActivePOIIndex((i) => {
              const next = Math.min(i + 1, mockPOIs.length - 1);
              if (next === i) setIsPlaying(false);
              return next;
            });
            return 0;
          }
          return p + 0.4;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  const activePOI = mockPOIs[activePOIIndex];
  const totalSeconds = 150;
  const elapsed = Math.floor((progress / 100) * totalSeconds);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const selectPOI = (i: number) => {
    setActivePOIIndex(i);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 size-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="size-5" />
      </button>

      {/* Label above phone */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-0.5">Visitor Preview</p>
        <p className="text-[13px] text-white/60 font-medium">{guideName}</p>
      </div>

      {/* Phone shell */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: 375,
          height: 790,
          background: "#111",
          borderRadius: 50,
          boxShadow: "0 0 0 1.5px #2a2a2a, 0 0 0 3.5px #111, 0 50px 100px rgba(0,0,0,0.9), inset 0 1px 0 #3a3a3a",
        }}
      >
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[120px] w-[3px] h-10 bg-[#222] rounded-l-sm" />
        <div className="absolute -left-[3px] top-[170px] w-[3px] h-14 bg-[#222] rounded-l-sm" />
        <div className="absolute -left-[3px] top-[240px] w-[3px] h-14 bg-[#222] rounded-l-sm" />
        <div className="absolute -right-[3px] top-[160px] w-[3px] h-20 bg-[#222] rounded-r-sm" />

        {/* Screen */}
        <div
          className="absolute inset-[3px] overflow-hidden flex flex-col bg-white"
          style={{ borderRadius: 47 }}
        >
          {/* Status bar */}
          <div className="relative flex items-center justify-between px-8 pt-4 pb-1 flex-shrink-0 z-10">
            <span className="text-[13px] font-semibold text-zinc-900 tabular-nums">9:41</span>
            {/* Dynamic island */}
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 bg-black"
              style={{ width: 120, height: 34, borderRadius: 20 }}
            />
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#111" />
                <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#111" />
                <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" fill="#111" />
                <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#111" />
              </svg>
              {/* Wifi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="#111" />
                <path d="M3.5 6.5a6.5 6.5 0 0 1 9 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 4a10 10 0 0 1 14 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {/* Battery */}
              <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
                <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35" />
                <rect x="1.5" y="1.5" width="18" height="10" rx="2.5" fill="#111" />
                <path d="M24 4.5v4a2 2 0 0 0 0-4Z" fill="#111" fillOpacity="0.4" />
              </svg>
            </div>
          </div>

          {/* App header */}
          <div className="px-5 pt-1 pb-3 border-b border-zinc-100 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-6 bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-black">M</span>
              </div>
              <span className="text-[11px] text-zinc-400">Museo Archeologico Nazionale</span>
            </div>
            <h1 className="text-[18px] font-bold text-zinc-950 leading-tight tracking-tight">{guideName}</h1>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {mockPOIs.length} stops · ~{Math.ceil(mockPOIs.length * 2.5)} min
            </p>
          </div>

          {/* POI list */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="px-4 pt-3 pb-32 space-y-2">
              {mockPOIs.map((poi, i) => {
                const active = i === activePOIIndex;
                return (
                  <button
                    key={poi.id}
                    onClick={() => selectPOI(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                      active ? "bg-zinc-950" : "bg-zinc-50 active:bg-zinc-100"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="size-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-200">
                      {poi.imageUrl && (
                        <img src={poi.imageUrl} alt={poi.title} className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-bold tabular-nums ${active ? "text-white/40" : "text-zinc-400"}`}>
                          {i + 1}
                        </span>
                        <span className={`text-[13px] font-semibold leading-tight truncate ${active ? "text-white" : "text-zinc-900"}`}>
                          {poi.title}
                        </span>
                      </div>
                      <p className={`text-[11px] line-clamp-1 leading-snug ${active ? "text-white/50" : "text-zinc-500"}`}>
                        {(poi.body ?? "").slice(0, 55)}…
                      </p>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] tabular-nums ${active ? "text-white/40" : "text-zinc-400"}`}>
                        {active ? fmt(elapsed) : "2:30"}
                      </span>
                      {active ? (
                        <div
                          className="size-6 rounded-full flex items-center justify-center"
                          style={{ background: isPlaying ? "#D33333" : "rgba(255,255,255,0.15)" }}
                        >
                          {isPlaying ? (
                            <span className="flex gap-[3px]">
                              <span className="w-[2px] h-[10px] bg-white rounded-full block" />
                              <span className="w-[2px] h-[10px] bg-white rounded-full block" />
                            </span>
                          ) : (
                            <Play className="size-3 text-white ml-px" fill="white" />
                          )}
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              background: "rgba(255,255,255,0.94)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderTop: "0.5px solid rgba(0,0,0,0.08)",
            }}
          >
            <div className="px-5 pt-3 pb-2">
              {/* Progress */}
              <div className="relative h-1 bg-zinc-100 rounded-full overflow-hidden mb-1.5">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${progress}%`, background: "#D33333", transition: "width 0.1s linear" }}
                />
              </div>
              <div className="flex justify-between mb-2.5">
                <span className="text-[9px] text-zinc-400 tabular-nums">{fmt(elapsed)}</span>
                <span className="text-[9px] text-zinc-400 tabular-nums">−{fmt(totalSeconds - elapsed)}</span>
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-zinc-950 truncate leading-tight">{activePOI.title}</p>
                  <p className="text-[10px] text-zinc-400 mt-px">Stop {activePOIIndex + 1} of {mockPOIs.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setActivePOIIndex((i) => Math.max(i - 1, 0)); setProgress(0); }}
                    disabled={activePOIIndex === 0}
                    className="size-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors disabled:opacity-25"
                  >
                    <SkipBack className="size-4 text-zinc-800" fill="currentColor" />
                  </button>
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="size-12 flex items-center justify-center rounded-full bg-zinc-950 hover:bg-zinc-800 active:scale-95 transition-all"
                  >
                    {isPlaying
                      ? <Pause className="size-5 text-white" fill="white" />
                      : <Play className="size-5 text-white ml-0.5" fill="white" />
                    }
                  </button>
                  <button
                    onClick={() => { setActivePOIIndex((i) => Math.min(i + 1, mockPOIs.length - 1)); setProgress(0); }}
                    disabled={activePOIIndex === mockPOIs.length - 1}
                    className="size-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors disabled:opacity-25"
                  >
                    <SkipForward className="size-4 text-zinc-800" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
            {/* Home indicator */}
            <div className="flex justify-center pb-2 pt-1">
              <div className="w-28 h-1 bg-zinc-300 rounded-full" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
