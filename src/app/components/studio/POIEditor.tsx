import { useState, useEffect, useRef } from "react";
import { X, Save, Trash2, MapPin, Sparkles, ChevronDown, Upload, ImageIcon, Play, Pause, FileText, Mic, Globe, CheckCircle2, Wand2, Loader2, RotateCcw, Search, Check } from "lucide-react";
import { mockGuides, mockPOIs, mockDocuments } from "../../data/mockData";

type POIStatus = "idea" | "in-progress" | "under-revision" | "complete";

interface POI {
  id: string;
  title: string;
  description: string;
  status: POIStatus;
  category: string;
  imageUrl?: string;
  audioScript?: string;
  scriptValidated?: boolean;
  translations?: string[];
  voices?: string[];
  updatedAt: string;
  isGeolocated?: boolean;
  assignedToGuides?: string[];
  assignee?: string;
}

interface POIEditorProps {
  poi: POI;
  onClose: () => void;
  onSave: (updatedPOI: POI) => void;
  onDelete: (poiId: string) => void;
  guideId?: string;
  guideLanguages?: string[];
}

const statusConfig = {
  idea:             { label: "Idea",           dot: "bg-zinc-400",    text: "text-zinc-600",    bg: "bg-zinc-50",    border: "border-zinc-200" },
  "in-progress":    { label: "In Progress",    dot: "bg-blue-400",    text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  "under-revision": { label: "Under Revision", dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  complete:         { label: "Complete",        dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
};

const mediaLibrary = mockPOIs.map(p => ({ id: p.id, url: p.imageUrl, title: p.title }));

function estimateDuration(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = words / 130;
  if (minutes < 1) return `${Math.round(minutes * 60)}s`;
  return `${Math.floor(minutes)}m ${Math.round((minutes % 1) * 60)}s`;
}

const WAVEFORM = [3,5,8,5,10,7,4,9,6,11,8,5,12,9,6,10,7,4,8,5,9,6,11,7,4,8,5,10,6,9,7,5,11,8,4,9,6,10,5,8,7,11,6,4,9,8,5,10,7,6];

const TEAM = [
  { id: "t1", name: "Sofia Russo",     initials: "SR", color: "bg-violet-100 text-violet-700" },
  { id: "t2", name: "Marco Bianchi",   initials: "MB", color: "bg-sky-100 text-sky-700" },
  { id: "t3", name: "Elena Conti",     initials: "EC", color: "bg-emerald-100 text-emerald-700" },
  { id: "t4", name: "Andrea Ferretti", initials: "AF", color: "bg-amber-100 text-amber-700" },
];

const LANG_META: Record<string, { name: string; flag: string }> = {
  it: { name: "Italiano", flag: "🇮🇹" },
  en: { name: "English",  flag: "🇬🇧" },
  fr: { name: "Français", flag: "🇫🇷" },
  de: { name: "Deutsch",  flag: "🇩🇪" },
  es: { name: "Español",  flag: "🇪🇸" },
  pt: { name: "Português",flag: "🇵🇹" },
  zh: { name: "中文",      flag: "🇨🇳" },
  ja: { name: "日本語",    flag: "🇯🇵" },
};

function AudioPlayer({ label, dark = false, duration }: { label?: string; dark?: boolean; duration: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState("0:00");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = (() => {
    const m = duration.match(/(\d+)m\s*(\d+)s/);
    if (m) return parseInt(m[1]) * 60 + parseInt(m[2]);
    const s = duration.match(/(\d+)s/);
    return s ? parseInt(s[1]) : 30;
  })();

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setPlaying(false); setElapsed("0:00"); return 0; }
          const next = p + (100 / (totalSeconds * 10));
          const sec = Math.floor((next / 100) * totalSeconds);
          setElapsed(`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`);
          return next;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, totalSeconds]);

  const bg = dark ? "bg-zinc-900" : "bg-zinc-50 border border-zinc-200";
  const trackBg = dark ? "bg-white/15" : "bg-zinc-200";
  const trackFill = dark ? "bg-white" : "bg-zinc-800";
  const barBase = dark ? "bg-white/20" : "bg-zinc-300";
  const barFill = dark ? "bg-white/70" : "bg-zinc-500";
  const timeColor = dark ? "text-white/40" : "text-zinc-400";
  const labelColor = dark ? "text-white/30" : "text-zinc-400";

  return (
    <div className={`px-4 py-3.5 rounded-xl ${bg}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying(p => !p)}
          className={`size-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            dark ? "bg-white/10 hover:bg-white/20" : "bg-zinc-900 hover:bg-zinc-700"
          }`}
        >
          {playing
            ? <Pause className={`size-3.5 ${dark ? "text-white" : "text-white"}`} />
            : <Play className={`size-3.5 ml-0.5 ${dark ? "text-white" : "text-white"}`} />
          }
        </button>

        <div className="flex-1 min-w-0">
          {/* Waveform */}
          <div className="flex items-center gap-[2px] h-8 mb-1.5">
            {WAVEFORM.map((h, i) => {
              const filled = (i / WAVEFORM.length) * 100 <= progress;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors duration-100 ${filled ? barFill : barBase}`}
                  style={{ height: `${(h / 12) * 100}%` }}
                />
              );
            })}
          </div>
          {/* Progress bar */}
          <div className={`h-0.5 rounded-full overflow-hidden ${trackBg}`}>
            <div className={`h-full rounded-full transition-all ${trackFill}`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={`flex flex-col items-end gap-0.5 flex-shrink-0 text-[10px] tabular-nums ${timeColor}`}>
          <span>{elapsed}</span>
          <span>{duration}</span>
        </div>
      </div>

      {label && (
        <p className={`text-[10px] mt-2.5 text-center ${labelColor}`}>{label}</p>
      )}
    </div>
  );
}

function MediaPicker({ current, onSelect, onClose }: {
  current?: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-zinc-900">Media Library</h3>
            <p className="text-[12px] text-zinc-400 mt-0.5">Select an image or upload a new one</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Upload zone */}
        <div className="mx-6 mt-5 border-2 border-dashed border-zinc-200 rounded-xl p-6 flex items-center gap-4 hover:border-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer">
          <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Upload className="size-4 text-zinc-500" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-zinc-700">Upload new image</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">PNG, JPG, WebP · max 10 MB</p>
          </div>
        </div>

        {/* Grid */}
        <div className="p-6">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Library</p>
          <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            {mediaLibrary.map(img => (
              <button
                key={img.id}
                onClick={() => { onSelect(img.url); onClose(); }}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  current === img.url ? "border-zinc-900 ring-2 ring-zinc-900 ring-offset-1" : "border-transparent hover:border-zinc-300"
                }`}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                {current === img.url && (
                  <div className="absolute inset-0 bg-zinc-900/30 flex items-center justify-center">
                    <div className="size-5 rounded-full bg-white flex items-center justify-center">
                      <div className="size-2.5 rounded-full bg-zinc-900" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function POIEditor({ poi, onClose, onSave, onDelete, guideId, guideLanguages }: POIEditorProps) {
  const [formData, setFormData] = useState(poi);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Co-curator
  const [showCoCurator, setShowCoCurator] = useState(false);
  const [coCuratorInput, setCoCuratorInput] = useState(`${poi.title}\n\n${poi.description}`);
  const [coCuratorPhase, setCoCuratorPhase] = useState<"idle" | "generating" | "done">("idle");
  const [generatedScript, setGeneratedScript] = useState("");
  const [coCuratorDocIds, setCoCuratorDocIds] = useState<string[]>([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docSearch, setDocSearch] = useState("");

  const assignedGuides = formData.assignedToGuides
    ? mockGuides.filter(g => formData.assignedToGuides!.includes(g.id))
    : [];

  const inGuideContext = !!guideId && (guideLanguages?.length ?? 0) > 0;
  const targetLangs = guideLanguages ? guideLanguages.slice(1) : [];

  const currentStatus = statusConfig[formData.status];
  const wordCount = formData.audioScript?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const duration = formData.audioScript ? estimateDuration(formData.audioScript) : null;

  return (
    <>
      <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">

          {/* ── Header ── */}
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-4 flex-shrink-0">
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors flex-shrink-0">
              <X className="size-4.5" />
            </button>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-[18px] font-semibold text-zinc-900 bg-transparent border-none outline-none placeholder:text-zinc-300 tracking-tight"
                placeholder="Point of Interest title…"
              />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Co-curator toggle */}
              <button
                onClick={() => { setShowCoCurator(!showCoCurator); if (!showCoCurator) setCoCuratorPhase("idle"); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all ${
                  showCoCurator
                    ? "bg-violet-600 border-violet-600 text-white"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
                }`}
              >
                <Wand2 className="size-3.5" />
                Co-curator
              </button>

              {/* Status dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all ${currentStatus.bg} ${currentStatus.border} ${currentStatus.text}`}
                >
                  <span className={`size-1.5 rounded-full ${currentStatus.dot}`} />
                  {currentStatus.label}
                  <ChevronDown className={`size-3 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
                </button>
                {showStatusDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                    <div className="absolute top-full mt-1.5 right-0 w-44 bg-white rounded-xl border border-zinc-200 shadow-xl z-20 py-1.5">
                      {(Object.keys(statusConfig) as POIStatus[]).map(s => {
                        const c = statusConfig[s];
                        return (
                          <button key={s} onClick={() => { setFormData({ ...formData, status: s }); setShowStatusDropdown(false); }}
                            className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-zinc-50 transition-colors">
                            <span className={`size-1.5 rounded-full ${c.dot}`} />
                            <span className={`text-[13px] font-medium ${c.text}`}>{c.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => onSave(formData)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
              >
                <Save className="size-3.5" />
                Save
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 min-h-0">

            {/* COL 1 — Image */}
            <div className="w-56 flex-shrink-0 border-r border-zinc-100 flex flex-col bg-zinc-50">
              <div className="flex-1 relative overflow-hidden group">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt={formData.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="size-8 text-zinc-300" />
                    <span className="text-[11px] text-zinc-400">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/25 transition-all flex items-center justify-center">
                  <button
                    onClick={() => setShowMediaPicker(true)}
                    className="opacity-0 group-hover:opacity-100 transition-all px-3 py-1.5 bg-white text-zinc-900 text-[11px] font-semibold rounded-lg shadow-lg"
                  >
                    Change
                  </button>
                </div>
              </div>
              <div className="p-3 border-t border-zinc-200 flex gap-2">
                <button
                  onClick={() => setShowMediaPicker(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-zinc-200 rounded-lg text-[11px] font-medium text-zinc-600 hover:border-zinc-400 transition-all"
                >
                  <ImageIcon className="size-3.5" /> Library
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-zinc-200 rounded-lg text-[11px] font-medium text-zinc-600 hover:border-zinc-400 transition-all">
                  <Upload className="size-3.5" /> Upload
                </button>
              </div>
            </div>

            {/* COL 2 — Single scrollable form */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

                {/* Details */}
                <div className="space-y-4">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Details</p>
                  <div>
                    <label className="block text-[12px] font-medium text-zinc-600 mb-1.5">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
                      placeholder="Short description of this point of interest…"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-zinc-600 mb-1.5">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                      placeholder="e.g. Sculpture, Painting, Architecture…"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-zinc-600 mb-1.5">Assigned to</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {TEAM.map(member => {
                        const active = formData.assignee === member.id;
                        return (
                          <button
                            key={member.id}
                            onClick={() => setFormData({ ...formData, assignee: active ? undefined : member.id })}
                            title={member.name}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[12px] font-medium transition-all ${
                              active
                                ? "border-zinc-900 bg-zinc-900 text-white"
                                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                            }`}
                          >
                            <span className={`size-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${active ? "bg-white/20 text-white" : member.color}`}>
                              {member.initials}
                            </span>
                            {member.name.split(" ")[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100" />

                {/* Audio Script */}
                <div className="space-y-4">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Audio Script</p>
                  <div id="poi-script">
                    <textarea
                      value={formData.audioScript || ""}
                      onChange={e => setFormData({ ...formData, audioScript: e.target.value })}
                      rows={10}
                      className="w-full px-3.5 py-3 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none leading-relaxed"
                      placeholder="Write the audio narration script for this POI…"
                    />
                    <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-400">
                      <span>{wordCount} words</span>
                      {duration && <span>≈ {duration}</span>}
                    </div>
                  </div>
                  {wordCount > 0 && duration && (
                    <div className="space-y-2">
                      <AudioPlayer dark duration={duration} label="TTS preview · voice not yet assigned" />
                      {formData.voices && formData.voices.length > 0 && formData.voices.map(lang => (
                        <AudioPlayer key={lang} duration={duration} label={lang.toUpperCase()} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100" />

                {/* Location */}
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Location</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="size-3.5 text-zinc-400 flex-shrink-0" />
                      <div>
                        <p className="text-[13px] font-medium text-zinc-800">Geolocation</p>
                        <p className="text-[11px] text-zinc-400">Auto-trigger when visitor reaches this location</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, isGeolocated: !formData.isGeolocated })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${formData.isGeolocated ? "bg-zinc-900" : "bg-zinc-200"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${formData.isGeolocated ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                  {formData.isGeolocated && (
                    <div className="h-56 bg-zinc-100 rounded-xl border border-zinc-200 overflow-hidden relative">
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 40px)" }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="size-9 rounded-full bg-white shadow-md flex items-center justify-center">
                          <MapPin className="size-4 text-zinc-500" />
                        </div>
                        <p className="text-[12px] text-zinc-400 font-medium">Map integration</p>
                        <p className="text-[11px] text-zinc-400">Drop a pin to set the trigger zone</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100" />

                {/* Translation */}
                <div id="poi-translation" className="space-y-4">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Translation</p>
                  {inGuideContext ? (
                    targetLangs.length === 0 ? (
                      <p className="text-[12px] text-zinc-400">No translation languages configured. Add languages from the audio guide settings to enable translations.</p>
                    ) : (
                      <div className="space-y-3">
                        {targetLangs.map(lang => {
                          const meta = LANG_META[lang] ?? { name: lang.toUpperCase(), flag: "🌐" };
                          const hasTranslation = formData.translations?.includes(lang);
                          return (
                            <div key={lang} className="border border-zinc-200 rounded-xl overflow-hidden">
                              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 border-b border-zinc-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-[14px]">{meta.flag}</span>
                                  <span className="text-[12px] font-semibold text-zinc-700">{meta.name}</span>
                                </div>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${hasTranslation ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                                  {hasTranslation ? "Translated" : "Not translated"}
                                </span>
                              </div>
                              <div className="p-4">
                                <textarea
                                  rows={4}
                                  defaultValue={hasTranslation ? `[${meta.name} translation of the script]` : ""}
                                  placeholder="Translation will appear here after guide production…"
                                  className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none leading-relaxed"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                      <Globe className="size-4 text-zinc-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[13px] font-medium text-zinc-600">Available in guide context</p>
                        <p className="text-[12px] text-zinc-400 mt-0.5 leading-relaxed">
                          Open this POI from an audio guide to manage translations for that guide's languages.
                        </p>
                        {(formData.translations?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-[10px] text-zinc-400 w-full">Already translated:</span>
                            {formData.translations?.map(l => (
                              <span key={l} className="px-1.5 py-0.5 bg-zinc-200 rounded text-[10px] font-semibold text-zinc-500 uppercase">{l}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100" />

                {/* Voicing */}
                <div id="poi-voicing" className="space-y-4">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Voicing</p>
                  {inGuideContext ? (
                    <div className="space-y-3">
                      {(guideLanguages ?? []).map((lang, i) => {
                        const meta = LANG_META[lang] ?? { name: lang.toUpperCase(), flag: "🌐" };
                        const hasVoice = formData.voices?.includes(lang);
                        return (
                          <div key={lang} className="border border-zinc-200 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 border-b border-zinc-100">
                              <div className="flex items-center gap-2">
                                <span className="text-[14px]">{meta.flag}</span>
                                <span className="text-[12px] font-semibold text-zinc-700">{meta.name}</span>
                                {i === 0 && <span className="text-[10px] font-medium text-zinc-400 bg-zinc-200 px-1.5 py-0.5 rounded">Primary</span>}
                              </div>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${hasVoice ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                                {hasVoice ? "Ready" : "Not generated"}
                              </span>
                            </div>
                            <div className="p-4">
                              {hasVoice && duration ? (
                                <AudioPlayer duration={duration} label={`${meta.name} · voice assigned`} />
                              ) : (
                                <p className="text-[12px] text-zinc-400">Not generated yet · voice is set at audio guide level</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                      <Mic className="size-4 text-zinc-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[13px] font-medium text-zinc-600">Available in guide context</p>
                        <p className="text-[12px] text-zinc-400 mt-0.5 leading-relaxed">
                          Voice assignment and TTS generation are scoped to an audio guide. Open from a guide to manage voicing.
                        </p>
                        {(formData.voices?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-[10px] text-zinc-400 w-full">Voices generated:</span>
                            {formData.voices?.map(l => (
                              <span key={l} className="px-1.5 py-0.5 bg-zinc-200 rounded text-[10px] font-semibold text-zinc-500 uppercase">{l}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100" />

                {/* In Guides */}
                <div id="poi-in-guides" className="space-y-3">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">In Guides</p>
                  {(() => {
                    const currentGuide = guideId ? mockGuides.find(g => g.id === guideId) : null;
                    const otherGuides = assignedGuides.filter(g => g.id !== guideId);
                    if (!currentGuide && otherGuides.length === 0) {
                      return <p className="text-[12px] text-zinc-400">Not assigned to any guide yet.</p>;
                    }
                    return (
                      <div className="space-y-2">
                        {currentGuide && (
                          <div className="flex items-center gap-3 p-3 bg-zinc-50 border-2 border-zinc-900 rounded-xl">
                            {currentGuide.thumbnail && <img src={currentGuide.thumbnail} alt={currentGuide.title} className="size-8 rounded-lg object-cover flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-semibold text-zinc-900 truncate">{currentGuide.title}</p>
                              <p className="text-[10px] text-zinc-400">Current guide · {(currentGuide.languages ?? []).join(", ").toUpperCase()}</p>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${currentGuide.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                              {currentGuide.status}
                            </span>
                          </div>
                        )}
                        {otherGuides.map(g => (
                          <div key={g.id} className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl">
                            {g.thumbnail && <img src={g.thumbnail} alt={g.title} className="size-8 rounded-lg object-cover flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-zinc-700 truncate">{g.title}</p>
                              <p className="text-[10px] text-zinc-400">{(g.languages ?? []).join(", ").toUpperCase()}</p>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${g.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                              {g.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-zinc-100 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => onDelete(formData.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 text-[12px] font-semibold rounded-lg transition-all"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
                <button onClick={onClose} className="px-4 py-1.5 text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all">
                  Cancel
                </button>
              </div>
            </div>

            {/* Co-curator panel */}
            {showCoCurator && (
              <div className="w-72 flex-shrink-0 border-l border-zinc-100 bg-white flex flex-col overflow-hidden">
                {/* Co-curator header */}
                <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-violet-100 flex items-center justify-center">
                      <Wand2 className="size-3.5 text-violet-600" />
                    </div>
                    <span className="text-[13px] font-semibold text-zinc-900">Co-curator</span>
                  </div>
                  <button
                    onClick={() => { setShowCoCurator(false); setCoCuratorPhase("idle"); setGeneratedScript(""); }}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                  {/* Guide context pill */}
                  {assignedGuides.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Guide context</p>
                      <div className="space-y-1.5">
                        {assignedGuides.map(g => (
                          <div key={g.id} className="flex items-center gap-2 p-2 bg-violet-50 border border-violet-200 rounded-lg">
                            <img src={g.thumbnail} alt={g.title} className="size-5 rounded-md object-cover flex-shrink-0" />
                            <span className="text-[11px] font-medium text-violet-800 truncate leading-tight">{g.title}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">Tone, audience and language are inherited from the guide profile.</p>
                    </div>
                  )}

                  {/* Input */}
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Describe this stop</label>
                    <textarea
                      value={coCuratorInput}
                      onChange={e => setCoCuratorInput(e.target.value)}
                      rows={6}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none leading-relaxed"
                      placeholder="Describe what the visitor sees at this stop…"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1.5">The Co-curator will calibrate the script to the guide's profile.</p>
                  </div>

                  {/* Sources */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Sources</p>
                      <button
                        onClick={() => setShowDocModal(true)}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
                      >
                        Browse
                      </button>
                    </div>
                    {coCuratorDocIds.length === 0 ? (
                      <p className="text-[11px] text-zinc-400">No documents selected — Co-curator will use guide context only.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {coCuratorDocIds.map(id => {
                          const doc = mockDocuments.find(d => d.id === id);
                          if (!doc) return null;
                          return (
                            <span key={id} className="flex items-center gap-1 text-[11px] bg-violet-50 border border-violet-200 text-violet-800 px-2 py-1 rounded-md">
                              <FileText className="size-3 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{doc.filename}</span>
                              <button
                                onClick={() => setCoCuratorDocIds(ids => ids.filter(i => i !== id))}
                                className="text-violet-400 hover:text-red-400 transition-colors ml-0.5"
                              >
                                <X className="size-2.5" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Generate button */}
                  {coCuratorPhase !== "done" && (
                    <button
                      disabled={coCuratorPhase === "generating" || !coCuratorInput.trim()}
                      onClick={() => {
                        setCoCuratorPhase("generating");
                        setGeneratedScript("");
                        setTimeout(() => {
                          const guideCtx = assignedGuides[0]?.title ?? "this guide";
                          setGeneratedScript(
                            `Welcome to one of the most captivating stops on ${guideCtx}.\n\n` +
                            `${formData.title} stands as a testament to the mastery of its era. ` +
                            `As you face it, notice the interplay of light and shadow across its surface — ` +
                            `a deliberate choice by the artist to draw your gaze in a specific sequence.\n\n` +
                            `Look closely at the details in the lower left corner. Few visitors pause long enough to discover the subtle signature embedded there, a quiet act of pride in a world where artists rarely received public recognition.\n\n` +
                            `Take a moment. Let the work speak to you before moving on.`
                          );
                          setCoCuratorPhase("done");
                        }, 1800);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-[13px] font-semibold rounded-xl transition-all"
                    >
                      {coCuratorPhase === "generating" ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-3.5" />
                          Generate script
                        </>
                      )}
                    </button>
                  )}

                  {/* Generated result */}
                  {coCuratorPhase === "done" && generatedScript && (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-violet-50 border border-violet-200 rounded-xl">
                        <p className="text-[12px] text-violet-900 leading-relaxed whitespace-pre-line">{generatedScript}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFormData({ ...formData, audioScript: generatedScript });
                            setShowCoCurator(false);
                            setCoCuratorPhase("idle");
                            setGeneratedScript("");
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white text-[12px] font-semibold rounded-lg transition-all"
                        >
                          <CheckCircle2 className="size-3.5" />
                          Apply
                        </button>
                        <button
                          onClick={() => { setCoCuratorPhase("idle"); setGeneratedScript(""); }}
                          className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                          title="Regenerate"
                        >
                          <RotateCcw className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {showMediaPicker && (
        <MediaPicker
          current={formData.imageUrl}
          onSelect={url => setFormData({ ...formData, imageUrl: url })}
          onClose={() => setShowMediaPicker(false)}
        />
      )}

      {showDocModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={() => setShowDocModal(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <p className="text-[14px] font-semibold text-zinc-900">Document library</p>
              <button onClick={() => setShowDocModal(false)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-zinc-100">
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-200">
                <Search className="size-3.5 text-zinc-400 flex-shrink-0" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={e => setDocSearch(e.target.value)}
                  placeholder="Search documents…"
                  className="flex-1 text-[13px] bg-transparent focus:outline-none text-zinc-700 placeholder:text-zinc-400"
                  autoFocus
                />
                {docSearch && (
                  <button onClick={() => setDocSearch("")} className="text-zinc-300 hover:text-zinc-500">
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-72 px-3 py-2">
              {mockDocuments
                .filter(d => d.filename.toLowerCase().includes(docSearch.toLowerCase()))
                .map(doc => {
                  const selected = coCuratorDocIds.includes(doc.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setCoCuratorDocIds(ids =>
                        selected ? ids.filter(id => id !== doc.id) : [...ids, doc.id]
                      )}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-zinc-50 ${selected ? "bg-zinc-50" : ""}`}
                    >
                      <div className={`size-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${selected ? "bg-zinc-900 border-zinc-900" : "border-zinc-300"}`}>
                        {selected && <Check className="size-3 text-white" />}
                      </div>
                      <FileText className="size-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-[13px] text-zinc-700 flex-1 truncate">{doc.filename}</span>
                      <span className="text-[12px] text-zinc-400 flex-shrink-0">{doc.size}</span>
                    </button>
                  );
                })}
            </div>

            <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-[12px] text-zinc-400">{coCuratorDocIds.length} selected</p>
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 text-[13px] bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
