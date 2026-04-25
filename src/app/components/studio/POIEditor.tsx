import { useState } from "react";
import { X, Save, Trash2, MapPin, Sparkles, ChevronDown, Upload, ImageIcon, Play, Clock, FileText, Mic, Globe, BookOpen, CheckCircle2, AlertCircle, CircleDashed } from "lucide-react";
import { mockGuides, mockPOIs } from "../../data/mockData";

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
}

interface POIEditorProps {
  poi: POI;
  onClose: () => void;
  onSave: (updatedPOI: POI) => void;
  onDelete: (poiId: string) => void;
  onDevelopWithAI?: () => void;
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

export function POIEditor({ poi, onClose, onSave, onDelete, onDevelopWithAI }: POIEditorProps) {
  const [formData, setFormData] = useState(poi);
  const [activeTab, setActiveTab] = useState<"details" | "audio-script" | "location">("details");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const assignedGuides = formData.assignedToGuides
    ? mockGuides.filter(g => formData.assignedToGuides!.includes(g.id))
    : [];

  const currentStatus = statusConfig[formData.status];
  const wordCount = formData.audioScript?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const duration = formData.audioScript ? estimateDuration(formData.audioScript) : null;

  const scriptState = formData.scriptValidated
    ? { label: "Validated", icon: CheckCircle2, className: "text-emerald-600 bg-emerald-50 border-emerald-200" }
    : formData.audioScript
    ? { label: "Draft", icon: AlertCircle, className: "text-amber-600 bg-amber-50 border-amber-200" }
    : { label: "—", icon: CircleDashed, className: "text-zinc-400 bg-zinc-50 border-zinc-200" };

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

          {/* ── Body: 3 columns ── */}
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

            {/* COL 2 — Tabs + form */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Tab bar */}
              <div className="px-6 border-b border-zinc-100 flex gap-5 flex-shrink-0">
                {[
                  { id: "details",      label: "Details",      icon: FileText },
                  { id: "audio-script", label: "Audio Script", icon: Mic },
                  { id: "location",     label: "Location",     icon: MapPin },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center gap-1.5 pb-3.5 pt-3 text-[13px] font-semibold border-b-2 transition-all ${
                      activeTab === id ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-700"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {activeTab === "details" && (
                  <div className="space-y-5 max-w-lg">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
                        placeholder="Short description of this point of interest…"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                        placeholder="e.g. Sculpture, Painting, Architecture…"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "audio-script" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Sparkles className="size-4 text-zinc-500" />
                        <span className="text-[13px] font-medium text-zinc-700">Generate with AI</span>
                      </div>
                      <button onClick={onDevelopWithAI} className="px-3.5 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
                        Generate
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Script</label>
                      <textarea
                        value={formData.audioScript || ""}
                        onChange={e => setFormData({ ...formData, audioScript: e.target.value })}
                        rows={12}
                        className="w-full px-3.5 py-3 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none leading-relaxed"
                        placeholder="Write the audio narration script for this POI…"
                      />
                      <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-400">
                        <span>{wordCount} words</span>
                        {duration && <span>≈ {duration}</span>}
                      </div>
                    </div>
                    {wordCount > 10 && (
                      <div className="p-4 bg-zinc-900 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <button className="size-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all flex-shrink-0">
                            <Play className="size-4 text-white ml-0.5" />
                          </button>
                          <div className="flex-1">
                            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full w-0 bg-white rounded-full" />
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-white/50 flex-shrink-0">
                            <Clock className="size-3" />
                            <span className="text-[11px]">{duration}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-white/40 text-center">TTS preview · voice not yet assigned</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="space-y-5 max-w-lg">
                    <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <MapPin className="size-4 text-zinc-500" />
                        <div>
                          <p className="text-[13px] font-semibold text-zinc-900">Geolocation</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Auto-trigger when visitor reaches this location</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, isGeolocated: !formData.isGeolocated })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${formData.isGeolocated ? "bg-zinc-900" : "bg-zinc-200"}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.isGeolocated ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </div>
                    {formData.isGeolocated && (
                      <div className="aspect-video bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="size-10 text-zinc-300 mx-auto mb-2" />
                          <p className="text-[12px] text-zinc-400">Map integration</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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

            {/* COL 3 — Properties */}
            <div className="w-56 flex-shrink-0 border-l border-zinc-100 bg-zinc-50 overflow-y-auto">
              <div className="p-5 space-y-6">

                {/* Script */}
                <div>
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Script</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[12px] font-semibold ${scriptState.className}`}>
                    <scriptState.icon className="size-3.5" />
                    {scriptState.label}
                  </div>
                </div>

                {/* Voices */}
                <div>
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Voices</p>
                  {formData.voices && formData.voices.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {formData.voices.map(lang => (
                        <span key={lang} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-[11px] font-semibold text-blue-700 uppercase">
                          <Mic className="size-3" />
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[12px] text-zinc-400">—</span>
                  )}
                </div>

                {/* Translations */}
                <div>
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Translations</p>
                  {formData.translations && formData.translations.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {formData.translations.map(lang => (
                        <span key={lang} className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 border border-violet-200 rounded-lg text-[11px] font-semibold text-violet-700 uppercase">
                          <Globe className="size-3" />
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[12px] text-zinc-400">—</span>
                  )}
                </div>

                {/* Guides */}
                <div>
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">In guides</p>
                  {assignedGuides.length > 0 ? (
                    <div className="space-y-1.5">
                      {assignedGuides.map(g => (
                        <div key={g.id} className="flex items-center gap-2 p-2 bg-white border border-zinc-200 rounded-lg">
                          <img src={g.thumbnail} alt={g.title} className="size-6 rounded-md object-cover flex-shrink-0" />
                          <span className="text-[11px] font-medium text-zinc-700 truncate leading-tight">{g.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[12px] text-zinc-400">—</span>
                  )}
                </div>

                {/* Geolocation badge */}
                {formData.isGeolocated && (
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Location</p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] font-semibold text-emerald-700">
                      <MapPin className="size-3.5" /> Mapped
                    </span>
                  </div>
                )}

              </div>
            </div>

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
    </>
  );
}
