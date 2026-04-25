import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, Map as MapIcon, ChevronLeft, MapPin, RotateCcw, RotateCw, Globe, ChevronDown } from "lucide-react";
import { mockPOIs } from "../../data/mockData";

interface GuidePreviewModalProps {
  guideName: string;
  onClose: () => void;
}

const LANGUAGES = [
  { code: "it", flag: "🇮🇹", name: "Italiano" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
];

// ── Floor plan positions ──────────────────────────────────────────────────────
const POI_FLOOR = mockPOIs.map((poi, i) => {
  const positions = [
    { x: 17, y: 18 }, { x: 83, y: 18 }, { x: 17, y: 51 },
    { x: 83, y: 51 }, { x: 50, y: 18 },
  ];
  return { id: poi.id, name: poi.title, ...positions[i] };
});

const USER_PATH = [
  { x: 50, y: 82 }, { x: 50, y: 65 }, { x: 17, y: 51 },
  { x: 17, y: 28 }, { x: 50, y: 18 }, { x: 83, y: 18 },
  { x: 83, y: 51 }, { x: 83, y: 65 }, { x: 50, y: 82 },
];

// ── Floor plan SVG ────────────────────────────────────────────────────────────
function FloorPlan() {
  const colPositions: [number, number][] = [
    [108,148],[184,148],[261,148],[108,280],[261,280],
    [108,412],[184,412],[261,412],
  ];
  const doors: [number,number,number,number][] = [
    [160,548,209,548],[108,100,108,130],[261,100,261,130],
    [68,148,88,148],[68,412,88,412],[281,148,301,148],
    [281,412,301,412],[160,412,209,412],
  ];
  return (
    <svg viewBox="0 0 369 610" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%", display:"block" }} preserveAspectRatio="xMidYMid meet">
      <rect width="369" height="610" fill="#ccc5bb" />
      {[50,100,150,200,250,300,350].map(v => (
        <g key={v}>
          <line x1={v} y1={0} x2={v} y2={610} stroke="#bfb8ae" strokeWidth="0.4" strokeDasharray="2,4" />
          <line x1={0} y1={v} x2={369} y2={v} stroke="#bfb8ae" strokeWidth="0.4" strokeDasharray="2,4" />
        </g>
      ))}
      <rect x="18" y="18" width="333" height="556" rx="2" fill="#f0ece4" stroke="#7a6e60" strokeWidth="3" />
      <rect x="108" y="148" width="153" height="264" rx="1" fill="#dce8c8" stroke="#7a6e60" strokeWidth="1.5" />
      <rect x="120" y="160" width="129" height="240" rx="10" fill="#c8dca8" stroke="#a0bc78" strokeWidth="1" />
      <rect x="180" y="160" width="9" height="240" fill="#d4cebf" />
      <rect x="120" y="274" width="129" height="9" fill="#d4cebf" />
      <circle cx="184" cy="280" r="12" fill="#b0cc88" stroke="#90b068" strokeWidth="1" />
      <line x1="108" y1="18"  x2="108" y2="148" stroke="#7a6e60" strokeWidth="2" />
      <line x1="261" y1="18"  x2="261" y2="148" stroke="#7a6e60" strokeWidth="2" />
      <line x1="18"  y1="148" x2="108" y2="148" stroke="#7a6e60" strokeWidth="2" />
      <line x1="261" y1="148" x2="351" y2="148" stroke="#7a6e60" strokeWidth="2" />
      <line x1="18"  y1="412" x2="108" y2="412" stroke="#7a6e60" strokeWidth="2" />
      <line x1="261" y1="412" x2="351" y2="412" stroke="#7a6e60" strokeWidth="2" />
      <line x1="108" y1="412" x2="261" y2="412" stroke="#7a6e60" strokeWidth="2" />
      <line x1="18"  y1="280" x2="108" y2="280" stroke="#7a6e60" strokeWidth="1.5" />
      <line x1="261" y1="280" x2="351" y2="280" stroke="#7a6e60" strokeWidth="1.5" />
      {doors.map(([x1,y1,x2,y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f0ece4" strokeWidth="4" />)}
      {colPositions.map(([cx,cy], i) => <rect key={i} x={cx-5} y={cy-5} width="10" height="10" fill="#c8bfb0" stroke="#7a6e60" strokeWidth="1" />)}
      {[
        { x: 63,  y: 78,  n: "I",   sub: "Venus de Milo"    },
        { x: 184, y: 78,  n: "II",  sub: "Apollo Statue"     },
        { x: 306, y: 78,  n: "III", sub: "Attic Amphora"     },
        { x: 63,  y: 210, n: "IV",  sub: "Roman Mosaic"      },
        { x: 63,  y: 348, n: "V",   sub: "Medieval"          },
        { x: 306, y: 210, n: "VI",  sub: "Corinth. Helmet"   },
        { x: 306, y: 348, n: "VII", sub: "Sculptures"        },
      ].map(({ x, y, n, sub }) => (
        <g key={n}>
          <text x={x} y={y}    textAnchor="middle" fill="#5c5040" fontSize="11" fontFamily="Georgia,serif" fontWeight="700">{n}</text>
          <text x={x} y={y+13} textAnchor="middle" fill="#7a6e60" fontSize="7.5" fontFamily="system-ui">{sub}</text>
        </g>
      ))}
      <text x="184" y="492" textAnchor="middle" fill="#5c5040" fontSize="9" fontFamily="Georgia,serif" fontWeight="700" letterSpacing="1">ENTRANCE HALL</text>
      <text x="184" y="592" textAnchor="middle" fill="#7a6e60" fontSize="7" fontFamily="system-ui" letterSpacing="0.5">↑ INGRESSO</text>
      <g transform="translate(340, 44)">
        <circle cx="0" cy="0" r="13" fill="rgba(255,255,255,0.7)" stroke="#7a6e60" strokeWidth="1" />
        <polygon points="0,-9 2.5,3 0,0 -2.5,3" fill="#5c5040" />
        <polygon points="0,9 2.5,-3 0,0 -2.5,-3" fill="#a09080" />
        <text x="0" y="-14" textAnchor="middle" fill="#5c5040" fontSize="7" fontFamily="system-ui" fontWeight="700">N</text>
      </g>
    </svg>
  );
}

// ── Phone map view ────────────────────────────────────────────────────────────
function PhoneMap({ userX, userY, onClose }: { userX: number; userY: number; onClose: () => void }) {
  const nearest = POI_FLOOR.find((p) => Math.hypot(p.x - userX, p.y - userY) < 8);
  return (
    <div className="absolute inset-0 z-20 flex flex-col" style={{ top: 48 }}>
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 z-10 bg-white" style={{ borderBottom: "1px solid #F0F0F0" }}>
        <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors" style={{ border: "1px solid #E5E5E5" }}>
          <ChevronLeft className="size-4 text-zinc-700" />
        </button>
        <span style={{ fontSize: 14, fontWeight: 400, color: "#1f2937", fontFamily: "Fraunces, Georgia, serif" }}>Floor Plan</span>
        <span style={{ fontSize: 11, color: "#9ca3af", flex: 1, fontFamily: "Inter, system-ui, sans-serif" }}>Ground Floor</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(211,51,51,0.08)" }}>
          <div className="size-2 rounded-full animate-pulse" style={{ background: "#D33333" }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "#D33333", fontFamily: "Inter, system-ui, sans-serif" }}>Live</span>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-[#ccc5bb]">
        <div className="absolute inset-0"><FloorPlan /></div>
        {POI_FLOOR.map((poi, i) => (
          <div key={poi.id} className="absolute" style={{ left: `${poi.x}%`, top: `${poi.y}%`, transform: "translate(-50%, -100%)", zIndex: 8 }}>
            <div className="flex flex-col items-center drop-shadow-md">
              <div className="size-6 rounded-full border-2 border-white flex items-center justify-center" style={{ background: "#D33333" }}>
                <span className="text-white text-[9px] font-bold">{i + 1}</span>
              </div>
              <div className="w-px h-1.5" style={{ background: "#D33333" }} />
            </div>
          </div>
        ))}
        <div className="absolute" style={{ left: `${userX}%`, top: `${userY}%`, transform: "translate(-50%, -50%)", zIndex: 10 }}>
          <div className="absolute rounded-full" style={{ width: 36, height: 36, top: -18, left: -18, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }} />
          <div className="size-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
          <div className="absolute inset-0 size-4 rounded-full bg-blue-400 animate-ping opacity-40 pointer-events-none" />
        </div>
        <div className="absolute pointer-events-none" style={{ left: `${userX}%`, top: `${userY}%`, transform: "translate(-50%, 14px)", zIndex: 11 }}>
          <div className="text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-md" style={{ background: "#D33333" }}>You are here</div>
        </div>
      </div>
      {nearest && (
        <div className="absolute left-3 right-3 z-30 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl" style={{ bottom: 16, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", border: "1px solid rgba(211,51,51,0.12)" }}>
          <div className="size-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(211,51,51,0.08)" }}>
            <MapPin className="size-4" style={{ color: "#D33333" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 10, fontWeight: 600, color: "#D33333", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Inter, system-ui, sans-serif" }}>Nearby</p>
            <p style={{ fontSize: 13, fontWeight: 400, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "Fraunces, Georgia, serif" }}>{nearest.name}</p>
          </div>
          <button className="px-3 py-1.5 text-white text-[11px] font-bold rounded-xl flex-shrink-0" style={{ background: "#D33333", fontFamily: "Inter, system-ui, sans-serif" }}>Play</button>
        </div>
      )}
    </div>
  );
}

// ── POI Card ──────────────────────────────────────────────────────────────────
// Number badge sits inside the image so the line (absolute in parent) can run
// behind cards without affecting their horizontal layout.
function POICard({
  poi, index, total, isActive, isPlaying, progress, elapsed, totalSeconds, speed,
  onSelect, onTogglePlay, onSkipBack, onSkipForward, onSpeedChange,
}: {
  poi: typeof mockPOIs[0];
  index: number; total: number; isActive: boolean; isPlaying: boolean;
  progress: number; elapsed: number; totalSeconds: number; speed: number;
  onSelect: () => void; onTogglePlay: () => void;
  onSkipBack: () => void; onSkipForward: () => void;
  onSpeedChange: () => void;
}) {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={onSelect}
        className="w-full text-left overflow-hidden transition-all duration-500"
        style={{
          borderRadius: 20,
          background: "#fff",
          border: isActive ? "1.5px solid rgba(211,51,51,0.25)" : "1.5px solid #F0F0F0",
          boxShadow: isActive
            ? "0 20px 60px rgba(211,51,51,0.1), 0 4px 16px rgba(0,0,0,0.06)"
            : "0 2px 8px rgba(0,0,0,0.03)",
          transform: isActive ? "scale(1)" : "scale(0.97)",
          opacity: isActive ? 1 : 0.72,
        }}
      >
        {/* Image with number badge */}
        <div
          className="relative overflow-hidden"
          style={{ height: isActive ? 200 : 140, borderRadius: "18px 18px 0 0", transition: "height 0.5s ease" }}
        >
          {poi.imageUrl
            ? <img
                src={poi.imageUrl}
                alt={poi.title}
                className="w-full h-full object-cover"
                style={{
                  transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  filter: isActive ? "none" : "grayscale(30%) brightness(0.95)",
                }}
              />
            : <div className="w-full h-full" style={{ background: "#F0EDE8" }} />
          }
          {/* Gradient */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0) 70%)" }} />

          {/* Stop number badge — minimal circle, top left of image */}
          <div style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: isActive ? 46 : 38,
            height: isActive ? 46 : 38,
            borderRadius: "50%",
            background: isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.12)",
            border: `1px solid ${isActive ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)"}`,
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.4s ease",
            zIndex: 2,
          }}>
            <span style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: 300,
              fontSize: isActive ? 16 : 13,
              lineHeight: 1,
              color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.75)",
              letterSpacing: "-0.01em",
              transition: "all 0.4s ease",
            }}>
              {num}
            </span>
          </div>

          {/* Title bottom-left */}
          <div className="absolute bottom-0 left-0 right-0" style={{ padding: "10px 14px" }}>
            {isActive && (
              <h3 style={{ fontSize: 16, fontWeight: 300, color: "#fff", lineHeight: 1.25, margin: 0, fontFamily: "Fraunces, Georgia, serif", letterSpacing: "-0.01em" }}>
                {poi.title}
              </h3>
            )}
          </div>

          {/* Now playing badge */}
          {isActive && isPlaying && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: "rgba(211,51,51,0.88)", backdropFilter: "blur(8px)" }}>
              <span className="flex gap-[2.5px] items-end" style={{ height: 11 }}>
                {[0,1,2].map(j => (
                  <span key={j} style={{
                    width: 2.5, background: "#fff", display: "block", borderRadius: 2,
                    animation: "soundbar 0.7s ease-in-out infinite",
                    animationDelay: `${j * 0.18}s`,
                    height: j === 1 ? "100%" : "55%",
                  }} />
                ))}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", fontFamily: "Inter, system-ui, sans-serif" }}>PLAYING</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: isActive ? "14px 16px 18px" : "10px 14px 12px", transition: "padding 0.4s ease" }}>

          {/* Title inactive */}
          {!isActive && (
            <h3 style={{ fontSize: 14, fontWeight: 300, color: "#1f2937", lineHeight: 1.3, marginBottom: 4, fontFamily: "Fraunces, Georgia, serif" }}>
              {poi.title}
            </h3>
          )}

          {/* Description */}
          <p style={{
            fontSize: 11,
            color: isActive ? "#6b7280" : "#9ca3af",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: isActive ? 2 : 1,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
            marginBottom: isActive ? 18 : 0,
            fontFamily: "Inter, system-ui, sans-serif",
          }}>
            {poi.body ?? ""}
          </p>

          {/* Active player */}
          {isActive && (
            <div onClick={e => e.stopPropagation()}>
              <div className="relative rounded-full overflow-hidden" style={{ height: 2, background: "#F0EDE8", marginBottom: 6 }}>
                <div style={{ position: "absolute", inset: "0 auto 0 0", borderRadius: 9999, width: `${progress}%`, background: "#D33333", transition: "width 0.1s linear" }} />
              </div>
              <div className="flex justify-between" style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 10, color: "#9ca3af", fontVariantNumeric: "tabular-nums", fontFamily: "Inter, system-ui, sans-serif" }}>{fmt(elapsed)}</span>
                <span style={{ fontSize: 10, color: "#9ca3af", fontVariantNumeric: "tabular-nums", fontFamily: "Inter, system-ui, sans-serif" }}>−{fmt(totalSeconds - elapsed)}</span>
              </div>
              <div className="flex items-center justify-between" style={{ paddingLeft: 4, paddingRight: 4 }}>
                <button onClick={onSpeedChange} style={{ width: 38, height: 30, borderRadius: 8, background: "rgba(211,51,51,0.07)", border: "1px solid rgba(211,51,51,0.15)", fontSize: 10, fontWeight: 700, color: "#D33333", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
                  {speed === 1 ? "1×" : speed === 1.5 ? "1.5×" : "2×"}
                </button>
                <button onClick={onSkipBack} style={{ width: 40, height: 40, borderRadius: "50%", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <RotateCcw strokeWidth={1.8} style={{ width: 20, height: 20, color: "#6b7280" }} />
                </button>
                <button onClick={onTogglePlay} style={{ width: 54, height: 54, borderRadius: "50%", background: "#D33333", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(211,51,51,0.3)", cursor: "pointer", flexShrink: 0 }}>
                  {isPlaying
                    ? <Pause style={{ width: 18, height: 18, color: "#fff" }} fill="white" />
                    : <Play style={{ width: 18, height: 18, color: "#fff", marginLeft: 2 }} fill="white" />
                  }
                </button>
                <button onClick={onSkipForward} style={{ width: 40, height: 40, borderRadius: "50%", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <RotateCw strokeWidth={1.8} style={{ width: 20, height: 20, color: "#6b7280" }} />
                </button>
                <div style={{ width: 38 }} />
              </div>
            </div>
          )}

          {/* Inactive footer */}
          {!isActive && (
            <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
              <span style={{ fontSize: 10, color: "#C0C0C0", letterSpacing: "0.04em", fontFamily: "Inter, system-ui, sans-serif" }}>2 MIN 30 SEC</span>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(211,51,51,0.07)", border: "1px solid rgba(211,51,51,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play style={{ width: 10, height: 10, color: "#D33333", marginLeft: 1.5 }} fill="#D33333" />
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function GuidePreviewModal({ guideName, onClose }: GuidePreviewModalProps) {
  const [activePOIIndex, setActivePOIIndex] = useState(0);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [progress, setProgress]             = useState(0);
  const [showMap, setShowMap]               = useState(false);
  const [userStep, setUserStep]             = useState(0);
  const [speed, setSpeed]                   = useState(1);
  const [showLangMenu, setShowLangMenu]     = useState(false);
  const [selectedLang, setSelectedLang]     = useState("en");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const firstPOIRef = useRef<HTMLDivElement>(null);

  const totalSeconds = 150;
  const elapsed      = Math.floor((progress / 100) * totalSeconds);
  const activeLang   = LANGUAGES.find(l => l.code === selectedLang)!;

  const scrollToPOIs = () => {
    if (firstPOIRef.current && scrollRef.current) {
      scrollRef.current.scrollTo({ top: firstPOIRef.current.offsetTop - 8, behavior: "smooth" });
    }
  };

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
          return p + 0.4 * speed;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!showMap) return;
    const t = setInterval(() => setUserStep((s) => (s + 1) % USER_PATH.length), 2000);
    return () => clearInterval(t);
  }, [showMap]);

  const selectPOI = (i: number) => {
    setActivePOIIndex(i);
    setProgress(0);
    setIsPlaying(true);
  };

  const skipBack    = () => setProgress((p) => Math.max(0, p - (15 / totalSeconds) * 100));
  const skipForward = () => setProgress((p) => Math.min(100, p + (15 / totalSeconds) * 100));
  const cycleSpeed  = () => setSpeed((s) => s === 1 ? 1.5 : s === 1.5 ? 2 : 1);

  const { x: userX, y: userY } = USER_PATH[userStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">

      <button onClick={onClose} className="absolute top-6 right-6 size-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50">
        <X className="size-5" />
      </button>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-0.5" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Visitor Preview</p>
        <p className="text-[13px] text-white/60" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>{guideName}</p>
      </div>

      {/* Phone shell */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: 375, height: 790,
          background: "#111",
          borderRadius: 50,
          boxShadow: "0 0 0 1.5px #2a2a2a, 0 0 0 3.5px #111, 0 50px 100px rgba(0,0,0,0.9), inset 0 1px 0 #3a3a3a",
        }}
      >
        {/* Physical buttons */}
        <div className="absolute -left-[3px] top-[120px] w-[3px] h-10 bg-[#222] rounded-l-sm" />
        <div className="absolute -left-[3px] top-[170px] w-[3px] h-14 bg-[#222] rounded-l-sm" />
        <div className="absolute -left-[3px] top-[240px] w-[3px] h-14 bg-[#222] rounded-l-sm" />
        <div className="absolute -right-[3px] top-[160px] w-[3px] h-20 bg-[#222] rounded-r-sm" />

        {/* Screen */}
        <div className="absolute inset-[3px] overflow-hidden flex flex-col" style={{ borderRadius: 47, background: "#fff" }}>

          {/* Status bar */}
          <div className="relative flex items-center justify-between px-8 pt-4 pb-1 flex-shrink-0 bg-white" style={{ zIndex: 10 }}>
            <span className="text-[13px] font-semibold text-zinc-900 tabular-nums">9:41</span>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black" style={{ width: 120, height: 34, borderRadius: 20 }} />
            <div className="flex items-center gap-1.5">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="0.5" fill="#111" /><rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#111" /><rect x="9" y="2.5" width="3" height="9.5" rx="0.5" fill="#111" /><rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#111" /></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="#111" /><path d="M3.5 6.5a6.5 6.5 0 0 1 9 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" /><path d="M1 4a10 10 0 0 1 14 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35" /><rect x="1.5" y="1.5" width="18" height="10" rx="2.5" fill="#111" /><path d="M24 4.5v4a2 2 0 0 0 0-4Z" fill="#111" fillOpacity="0.4" /></svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

            {/* ═══════════════════════════════════
                HERO CANVAS — fills the first screen
                Status bar ~46px, phone inner ~784px → 738px remaining
                ═══════════════════════════════════ */}
            <div
              style={{
                minHeight: 738,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background image */}
              <img
                src={mockPOIs[0].imageUrl}
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 20%",
                  transform: "scale(1.04)",
                }}
              />

              {/* Gradient overlay: dark vignette top + heavy dark bottom for text legibility */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(8,6,16,0.52) 0%, rgba(8,6,16,0.28) 35%, rgba(8,6,16,0.62) 68%, rgba(8,6,16,0.92) 100%)",
              }} />

              {/* Subtle color tint — adds warmth/premium feel */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at 70% 30%, rgba(211,51,51,0.08) 0%, transparent 65%)",
              }} />

              {/* ── Language selector — absolute top right ── */}
              <div style={{ position: "absolute", top: 18, right: 18, zIndex: 10 }}>
                <button
                  onClick={() => setShowLangMenu(v => !v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: showLangMenu ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{activeLang.flag}</span>
                  <Globe style={{ width: 11, height: 11, color: "rgba(255,255,255,0.7)" }} strokeWidth={1.8} />
                  <ChevronDown
                    style={{ width: 10, height: 10, color: "rgba(255,255,255,0.7)", transition: "transform 0.2s", transform: showLangMenu ? "rotate(180deg)" : "rotate(0deg)" }}
                    strokeWidth={2}
                  />
                </button>
                {showLangMenu && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0,
                    background: "rgba(18,16,28,0.94)", backdropFilter: "blur(20px)",
                    borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    overflow: "hidden", zIndex: 20, minWidth: 144,
                  }}>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setSelectedLang(lang.code); setShowLangMenu(false); }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 8,
                          padding: "9px 14px",
                          background: lang.code === selectedLang ? "rgba(211,51,51,0.15)" : "transparent",
                          border: "none", cursor: "pointer",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span style={{ fontSize: 15 }}>{lang.flag}</span>
                        <span style={{ fontSize: 12, color: lang.code === selectedLang ? "#D33333" : "rgba(255,255,255,0.8)", fontWeight: lang.code === selectedLang ? 600 : 400, fontFamily: "Inter, system-ui, sans-serif" }}>{lang.name}</span>
                        {lang.code === selectedLang && <span style={{ marginLeft: "auto", fontSize: 11, color: "#D33333" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Centered hero content ── */}
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "72px 24px 48px",
                position: "relative", zIndex: 2,
              }}>
                {/* Museum logo mark */}
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <span style={{ fontSize: 20, fontFamily: "Fraunces, Georgia, serif", fontWeight: 200, color: "#fff", letterSpacing: "-0.02em" }}>M</span>
                </div>

                {/* Museum name */}
                <p style={{
                  fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase", letterSpacing: "0.16em",
                  fontFamily: "Inter, system-ui, sans-serif", marginBottom: 20,
                }}>
                  Museo Archeologico Nazionale
                </p>

                {/* Decorative line */}
                <div style={{ width: 28, height: 1.5, background: "#D33333", borderRadius: 1, marginBottom: 24 }} />

                {/* Guide title */}
                <h1 style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontWeight: 200, fontSize: 36,
                  color: "#ffffff", lineHeight: 1.2,
                  letterSpacing: "-0.025em", marginBottom: 20,
                  textShadow: "0 2px 24px rgba(0,0,0,0.4)",
                }}>
                  {guideName}
                </h1>

                {/* Stats */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36, justifyContent: "center" }}>
                  {[`${mockPOIs.length} stops`, `~${Math.ceil(mockPOIs.length * 2.5)} min`].map((label) => (
                    <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "Inter, system-ui, sans-serif" }}>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D33333", display: "inline-block" }} />
                      {label}
                    </span>
                  ))}
                </div>

                {/* CTA button */}
                <button
                  onClick={scrollToPOIs}
                  style={{
                    width: "100%", padding: "15px 0",
                    borderRadius: 16,
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    color: "#ffffff", fontSize: 15, fontWeight: 300,
                    cursor: "pointer",
                    fontFamily: "Fraunces, Georgia, serif",
                    letterSpacing: "0.01em",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
                >
                  Start the Tour
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 2v9M6.5 11l-2.5-2.5M6.5 11l2.5-2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Bottom divider */}
              <div style={{ padding: "0 20px 28px", position: "relative", zIndex: 2 }}>
                <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 30%, #D33333 50%, rgba(255,255,255,0.2) 70%, transparent 100%)" }} />
              </div>
            </div>

            {/* ═══════════════════════════════════
                POI LIST
                Line x = 18px pad + 12px badge-left + 23px half-circle = 53px
                ═══════════════════════════════════ */}
            <div ref={firstPOIRef} style={{ position: "relative", padding: "24px 18px 40px" }}>

              {/* Vertical connecting line (z-index 0, hidden behind cards) */}
              <div style={{
                position: "absolute",
                left: 53,
                top: 58,            /* starts at center of first badge */
                bottom: 80,
                width: 1,
                background: "linear-gradient(to bottom, rgba(211,51,51,0.2) 0%, rgba(211,51,51,0.04) 100%)",
                zIndex: 0,
              }} />

              {/* Cards — full width, line is hidden behind them */}
              {mockPOIs.map((poi, i) => (
                <POICard
                  key={poi.id}
                  poi={poi}
                  index={i}
                  total={mockPOIs.length}
                  isActive={i === activePOIIndex}
                  isPlaying={isPlaying}
                  progress={progress}
                  elapsed={elapsed}
                  totalSeconds={totalSeconds}
                  speed={speed}
                  onSelect={() => selectPOI(i)}
                  onTogglePlay={() => setIsPlaying(p => !p)}
                  onSkipBack={skipBack}
                  onSkipForward={skipForward}
                  onSpeedChange={cycleSpeed}
                />
              ))}

              {/* End of guide */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4, position: "relative", zIndex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(211,51,51,0.07)", border: "1px solid rgba(211,51,51,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: "#D33333" }}>✓</span>
                </div>
                <p style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic", fontFamily: "Fraunces, Georgia, serif" }}>End of guide</p>
              </div>
            </div>
          </div>

          {/* Map FAB — inside screen, bottom-right */}
          <button
            onClick={() => setShowMap(v => !v)}
            className="absolute z-30 flex items-center justify-center transition-all"
            style={{
              bottom: 32, right: 16,
              width: 48, height: 48,
              borderRadius: "50%",
              background: showMap ? "#D33333" : "rgba(20,18,30,0.82)",
              backdropFilter: "blur(14px)",
              border: showMap ? "1.5px solid #D33333" : "1.5px solid rgba(255,255,255,0.18)",
              boxShadow: showMap ? "0 6px 20px rgba(211,51,51,0.45)" : "0 4px 16px rgba(0,0,0,0.35)",
            }}
          >
            <MapIcon className="size-5 text-white" strokeWidth={1.8} />
          </button>

          {/* Map overlay */}
          {showMap && <PhoneMap userX={userX} userY={userY} onClose={() => setShowMap(false)} />}
        </div>
      </div>

      <style>{`
        @keyframes soundbar {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
