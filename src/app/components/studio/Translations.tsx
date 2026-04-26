import { useState } from "react";
import {
  Search, Sparkles, CheckCircle2, Mic, Play, Pause,
  X, ChevronDown, FileText, ArrowRight, RotateCcw,
  Clock, Eye, Lock, ChevronLeft, ChevronRight, User,
  ShieldCheck, MessageSquare,
} from "lucide-react";
import { PageShell } from "./PageShell";

// ─── Types ─────────────────────────────────────────────────────────────────────
type TextStatus = "draft" | "review" | "approved" | "expert-review" | "expert-done";
type AudioStatus = "none" | "pending" | "review" | "ready";

interface ExpertReview {
  reviewerId: string;
  reviewerName: string;
  reviewerBadge: string;
  reviewerAvatar: string;
  originalText: string;
  suggestedText: string;
  comment: string;
  returnedAt?: string;
}

interface Translation {
  text: string;
  status: TextStatus;
  audioStatus: AudioStatus;
  aiDrafted?: boolean;
  expertReview?: ExpertReview;
}

interface POI { id: string; name: string; sourceText: string; translations: Record<string, Translation> }
interface Voice { id: string; name: string; language: string; gender: string; style: string[]; avatarUrl: string }
interface Guide { id: string; name: string; targetLanguages: string[]; voiceAssignments: Record<string, string | null> }

interface CertifiedReviewer {
  id: string; name: string; badge: string; languages: string[];
  specialty: string; avatarUrl: string; turnaround: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const CURATOR_NAME = "Anna Ferretti";

const certifiedReviewers: CertifiedReviewer[] = [
  { id: "cr1", name: "Prof. Elena Conti", badge: "Art History PhD", languages: ["IT", "FR", "ES"], specialty: "Renaissance & Baroque", avatarUrl: "https://images.unsplash.com/photo-1614436201459-156d322d38c6?w=200&h=200&fit=crop&crop=face", turnaround: "24h" },
  { id: "cr2", name: "Dr. Carlos Mendez", badge: "Museum Curator", languages: ["ES", "FR"], specialty: "Classical Antiquity", avatarUrl: "https://images.unsplash.com/photo-1695266391814-a276948f1775?w=200&h=200&fit=crop&crop=face", turnaround: "48h" },
  { id: "cr3", name: "Marie-Claire Dumont", badge: "Certified Translator", languages: ["FR", "IT"], specialty: "Modern & Contemporary", avatarUrl: "https://images.unsplash.com/photo-1768853972795-2739a9685567?w=200&h=200&fit=crop&crop=face", turnaround: "24h" },
];

const allVoices: Voice[] = [
  { id: "v1", name: "Sarah Mitchell", language: "EN", gender: "Female", style: ["Warm", "Clear"], avatarUrl: "https://images.unsplash.com/photo-1768853972795-2739a9685567?w=200&h=200&fit=crop&crop=face" },
  { id: "v2", name: "Marco Rossi", language: "IT", gender: "Male", style: ["Professional", "Deep"], avatarUrl: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?w=200&h=200&fit=crop&crop=face" },
  { id: "v3", name: "Sofia García", language: "ES", gender: "Female", style: ["Friendly", "Modern"], avatarUrl: "https://images.unsplash.com/photo-1614436201459-156d322d38c6?w=200&h=200&fit=crop&crop=face" },
  { id: "v4", name: "Jean Dupont", language: "FR", gender: "Male", style: ["Calm", "Refined"], avatarUrl: "https://images.unsplash.com/photo-1695266391814-a276948f1775?w=200&h=200&fit=crop&crop=face" },
  { id: "v5", name: "Emma Watson", language: "EN", gender: "Female", style: ["Conversational", "Bright"], avatarUrl: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?w=200&h=200&fit=crop&crop=face" },
];

const initialGuides: Guide[] = [
  { id: "g1", name: "Renaissance Tour", targetLanguages: ["IT", "ES", "FR"], voiceAssignments: { IT: "v2", ES: "v3", FR: null } },
  { id: "g2", name: "Modern Art Collection", targetLanguages: ["IT", "ES"], voiceAssignments: { IT: "v2", ES: null } },
  { id: "g3", name: "Ancient Sculptures", targetLanguages: ["IT", "ES"], voiceAssignments: { IT: null, ES: null } },
];

const initialPOIs: POI[] = [
  {
    id: "p1", name: "Renaissance Hall",
    sourceText: "This magnificent hall showcases the finest examples of Renaissance art from the 15th and 16th centuries. The space was designed to immerse visitors in the grandeur of the period, with soaring ceilings and carefully curated lighting that brings each masterpiece to life.",
    translations: {
      IT: { text: "Questa magnifica sala presenta i migliori esempi dell'arte rinascimentale del XV e XVI secolo.", status: "approved", audioStatus: "ready" },
      ES: { text: "Esta magnífica sala presenta los mejores ejemplos del arte renacentista de los siglos XV y XVI.", status: "review", audioStatus: "review", aiDrafted: true },
      FR: { text: "Cette magnifique salle présente les plus beaux exemples de l'art de la Renaissance des XVe et XVIe siècles.", status: "draft", audioStatus: "none", aiDrafted: true },
    },
  },
  {
    id: "p2", name: "Leonardo's Workshop",
    sourceText: "Step into the recreated workshop of Leonardo da Vinci, where genius and craftsmanship converged. This space replicates the environment where Leonardo developed his groundbreaking inventions and created his most celebrated artworks.",
    translations: {
      IT: { text: "Entra nel laboratorio ricreato di Leonardo da Vinci, dove genio e maestria si incontrano.", status: "approved", audioStatus: "ready" },
      ES: { text: "Entra en el taller recreado de Leonardo da Vinci, donde el genio y la artesanía se fusionaron.", status: "review", audioStatus: "none", aiDrafted: true },
      FR: { text: "", status: "draft", audioStatus: "none" },
    },
  },
  {
    id: "p3", name: "The Last Supper Room",
    sourceText: "This room houses a faithful reproduction of The Last Supper by Leonardo da Vinci. Visitors can study the intricate details of this masterpiece, including the emotional expressions of the apostles.",
    translations: {
      IT: { text: "Questa sala ospita una fedele riproduzione dell'Ultima Cena di Leonardo da Vinci.", status: "approved", audioStatus: "ready" },
      ES: { text: "Esta sala alberga una reproducción fiel de La Última Cena de Leonardo da Vinci.", status: "approved", audioStatus: "ready" },
      FR: { text: "", status: "draft", audioStatus: "none" },
    },
  },
  {
    id: "p4", name: "Michelangelo's Sculptures",
    sourceText: "Marvel at the mastery of Michelangelo's sculptural works. The raw power and emotional depth captured in marble continues to astonish viewers five centuries after their creation.",
    translations: { IT: { text: "", status: "draft", audioStatus: "none" }, ES: { text: "", status: "draft", audioStatus: "none" }, FR: { text: "", status: "draft", audioStatus: "none" } },
  },
  {
    id: "p5", name: "Raphael Gallery",
    sourceText: "Explore the harmonious compositions of Raphael, whose work represents the pinnacle of Renaissance artistic achievement. The gallery presents a curated selection of his most significant paintings.",
    translations: { IT: { text: "", status: "draft", audioStatus: "none" }, ES: { text: "", status: "draft", audioStatus: "none" }, FR: { text: "", status: "draft", audioStatus: "none" } },
  },
];

// ─── Word diff ─────────────────────────────────────────────────────────────────
function wordDiff(a: string, b: string): { text: string; type: "same" | "del" | "ins" }[] {
  const aw = a.split(/(\s+)/), bw = b.split(/(\s+)/);
  const m = aw.length, n = bw.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = aw[i - 1] === bw[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const out: { text: string; type: "same" | "del" | "ins" }[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aw[i - 1] === bw[j - 1]) { out.unshift({ text: aw[i - 1], type: "same" }); i--; j--; }
    else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) { out.unshift({ text: bw[j - 1], type: "ins" }); j--; }
    else { out.unshift({ text: aw[i - 1], type: "del" }); i--; }
  }
  return out;
}

// ─── DiffView ─────────────────────────────────────────────────────────────────
function DiffView({ original, suggested }: { original: string; suggested: string }) {
  const tokens = wordDiff(original, suggested);
  return (
    <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 text-[13px] leading-relaxed min-h-[160px]">
      {tokens.map((t, i) => {
        if (t.type === "same") return <span key={i}>{t.text}</span>;
        if (t.type === "del") return (
          <span key={i} className="line-through text-red-500 bg-red-50 rounded px-0.5">{t.text}</span>
        );
        return (
          <span key={i} className="underline decoration-2 text-emerald-700 bg-emerald-50 rounded px-0.5">{t.text}</span>
        );
      })}
    </div>
  );
}

// ─── Reviewer Picker ──────────────────────────────────────────────────────────
function ReviewerPicker({ lang, onSelect, onClose }: {
  lang: string;
  onSelect: (r: CertifiedReviewer) => void;
  onClose: () => void;
}) {
  const compatible = certifiedReviewers.filter(r => r.languages.includes(lang));
  const rest = certifiedReviewers.filter(r => !r.languages.includes(lang));

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-teal-600" />
          <span className="text-[13px] font-semibold text-zinc-800">Request Expert Review</span>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
          <X className="size-4" />
        </button>
      </div>
      <div className="p-3 space-y-2">
        {compatible.length > 0 && (
          <>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1 mb-1">Recommended for {lang}</p>
            {compatible.map(r => <ReviewerRow key={r.id} r={r} onSelect={onSelect} highlight />)}
          </>
        )}
        {rest.length > 0 && (
          <>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1 mt-3 mb-1">Other reviewers</p>
            {rest.map(r => <ReviewerRow key={r.id} r={r} onSelect={onSelect} />)}
          </>
        )}
      </div>
      <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100">
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          The reviewer will receive the text by email and return corrections directly in the platform. The curator has the final word.
        </p>
      </div>
    </div>
  );
}

function ReviewerRow({ r, onSelect, highlight }: { r: CertifiedReviewer; onSelect: (r: CertifiedReviewer) => void; highlight?: boolean }) {
  return (
    <button onClick={() => onSelect(r)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left hover:shadow-sm ${
        highlight ? "border-teal-200 bg-teal-50/40 hover:bg-teal-50" : "border-zinc-200 bg-white hover:bg-zinc-50"
      }`}>
      <img src={r.avatarUrl} alt={r.name} className="size-10 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[13px] font-semibold text-zinc-900">{r.name}</span>
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-teal-100 text-teal-700 text-[9px] font-bold rounded-full">
            <ShieldCheck className="size-2.5" />{r.badge}
          </span>
        </div>
        <p className="text-[11px] text-zinc-500">{r.specialty} · {r.languages.join(", ")}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase">Turnaround</p>
        <p className="text-[12px] font-semibold text-zinc-700">{r.turnaround}</p>
      </div>
    </button>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
type SlotState = "empty" | "active" | "review" | "done";
const slotColor: Record<SlotState, string> = { empty: "#e4e4e7", active: "#93c5fd", review: "#fcd34d", done: "#4ade80" };

function textSlot(status: TextStatus, text: string): SlotState {
  if (status === "approved") return "done";
  if (status === "expert-done" || status === "review") return "review";
  if (status === "expert-review" || text) return "active";
  return "empty";
}
function audioSlot(status: AudioStatus): SlotState {
  if (status === "ready") return "done";
  if (status === "review") return "review";
  if (status === "pending") return "active";
  return "empty";
}

function SplitPill({ t, v }: { t: SlotState; v: SlotState }) {
  return (
    <div className="flex items-center rounded-full overflow-hidden flex-shrink-0" style={{ border: "1.5px solid #e4e4e7" }}>
      <div className="w-5 h-4 flex items-center justify-center" style={{ backgroundColor: slotColor[t] }}>
        <FileText className="size-2 text-white/80" strokeWidth={3} />
      </div>
      <div className="w-px h-full bg-white/60" />
      <div className="w-5 h-4 flex items-center justify-center" style={{ backgroundColor: slotColor[v] }}>
        <Mic className="size-2 text-white/80" strokeWidth={3} />
      </div>
    </div>
  );
}

// ─── Voice Panel ───────────────────────────────────────────────────────────────
function VoicePanel({ textApproved, audioStatus, voice, lang, showPicker, voiceSearch,
  onAdvance, onApprove, onReopen, onChooseVoice, onClosePicker, onVoiceSearch, onAssignVoice, onPlayToggle, playing }:
{ textApproved: boolean; audioStatus: AudioStatus | undefined; voice: Voice | null; lang: string;
  showPicker: boolean; voiceSearch: string;
  onAdvance: () => void; onApprove: () => void; onReopen: () => void;
  onChooseVoice: () => void; onClosePicker: () => void;
  onVoiceSearch: (q: string) => void; onAssignVoice: (v: Voice) => void;
  onPlayToggle: (id: string) => void; playing: string | null; }) {
  if (!textApproved) {
    return (
      <div className="p-5 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col items-center text-center gap-2">
        <Lock className="size-4 text-zinc-300 mt-1" />
        <p className="text-[12px] font-semibold text-zinc-500">Locked</p>
        <p className="text-[11px] text-zinc-400 leading-relaxed">Approve the translation to unlock voice over.</p>
      </div>
    );
  }
  if (showPicker) {
    return (
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white flex flex-col" style={{ maxHeight: 320 }}>
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between flex-shrink-0">
          <span className="text-[12px] font-semibold text-zinc-700">Choose voice</span>
          <button onClick={onClosePicker} className="text-zinc-400 hover:text-zinc-700"><X className="size-4" /></button>
        </div>
        <div className="px-3 py-2 border-b border-zinc-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400" />
            <input value={voiceSearch} onChange={e => onVoiceSearch(e.target.value)} placeholder="Search…"
              className="w-full pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-zinc-900" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {allVoices.filter(v => v.name.toLowerCase().includes(voiceSearch.toLowerCase())).map(v => (
            <button key={v.id} onClick={() => onAssignVoice(v)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0">
              <img src={v.avatarUrl} alt={v.name} className="size-9 rounded-full object-cover flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-zinc-900 truncate">{v.name}</p>
                <p className="text-[11px] text-zinc-400">{v.language} · {v.gender}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); onPlayToggle(v.id); }}
                className="size-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center flex-shrink-0">
                {playing === v.id ? <Pause className="size-3 text-zinc-700" /> : <Play className="size-3 text-zinc-700 ml-0.5" />}
              </button>
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (!voice) {
    return (
      <div className="p-5 rounded-xl border border-zinc-200 bg-white flex flex-col gap-3">
        <div className="flex items-center gap-2"><Mic className="size-4 text-blue-500" /><p className="text-[12px] font-semibold text-zinc-700">No voice assigned</p></div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">Assign a voice talent to start the {lang} recording.</p>
        <button onClick={onChooseVoice} className="w-full py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5">
          Choose Voice <ArrowRight className="size-3.5" />
        </button>
      </div>
    );
  }
  const stateMap: Record<string, { bg: string; border: string; icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode }> = {
    pending: { bg: "bg-white", border: "border-zinc-200", icon: <Clock className="size-4 text-zinc-400" />, title: "Awaiting recording", desc: `Awaiting recording from ${voice.name}.`, action: <button onClick={onAdvance} className="w-full py-2 border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-colors">Mark as Received</button> },
    review: { bg: "bg-amber-50", border: "border-amber-200", icon: <Eye className="size-4 text-amber-600" />, title: "Under review", desc: "Listen and approve if quality meets standards.", action: <button onClick={onApprove} className="w-full py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5"><CheckCircle2 className="size-3.5" />Approve Voice</button> },
    ready: { bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle2 className="size-4 text-emerald-600" />, title: "Voice approved", desc: `Recording by ${voice.name} is ready.`, action: <button onClick={onReopen} className="w-full py-2 border border-emerald-200 text-emerald-700 text-[12px] font-semibold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"><RotateCcw className="size-3.5" />Reopen</button> },
  };
  const s = stateMap[audioStatus ?? "pending"];
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${s.bg} ${s.border} flex flex-col gap-2`}>
        <div className="flex items-center gap-2">{s.icon}<p className="text-[12px] font-semibold text-zinc-800">{s.title}</p></div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">{s.desc}</p>
        {s.action}
      </div>
      <div className="flex flex-col items-center py-2">
        <div className="relative mb-3">
          <img src={voice.avatarUrl} alt={voice.name} className="size-14 rounded-full object-cover" />
          <button onClick={() => onPlayToggle(voice.id)} className="absolute -bottom-1 -right-1 size-6 rounded-full bg-zinc-900 hover:bg-zinc-700 flex items-center justify-center shadow-md transition-colors">
            {playing === voice.id ? <Pause className="size-2.5 text-white" /> : <Play className="size-2.5 text-white ml-0.5" />}
          </button>
        </div>
        <p className="text-[13px] font-semibold text-zinc-900">{voice.name}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{voice.language} · {voice.gender}</p>
        <div className="flex flex-wrap gap-1 justify-center mt-2">
          {voice.style.map(tag => <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-semibold rounded-full">{tag}</span>)}
        </div>
        <button onClick={onChooseVoice} className="mt-4 w-full py-1.5 border border-zinc-200 text-zinc-500 text-[11px] font-semibold rounded-lg hover:bg-zinc-100 transition-colors">Change Voice</button>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function Translations() {
  const [pois, setPois] = useState<POI[]>(initialPOIs);
  const [guides] = useState<Guide[]>(initialGuides);
  const [guideId, setGuideId] = useState(initialGuides[0].id);
  const [lang, setLang] = useState(initialGuides[0].targetLanguages[0]);
  const [poiId, setPoiId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [search, setSearch] = useState("");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [voiceSearch, setVoiceSearch] = useState("");
  const [voiceAssignments, setVoiceAssignments] = useState<Record<string, Record<string, string | null>>>(
    Object.fromEntries(initialGuides.map(g => [g.id, { ...g.voiceAssignments }]))
  );
  const [generating, setGenerating] = useState(false);
  const [showReviewerPicker, setShowReviewerPicker] = useState(false);

  const guide = guides.find(g => g.id === guideId)!;
  const poi = pois.find(p => p.id === poiId) ?? null;
  const trans = poi ? poi.translations[lang] : undefined;
  const voiceId = voiceAssignments[guideId]?.[lang] ?? null;
  const voice = voiceId ? allVoices.find(v => v.id === voiceId) ?? null : null;
  const filteredPOIs = pois.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const complete = pois.filter(p => p.translations[lang]?.status === "approved" && p.translations[lang]?.audioStatus === "ready").length;

  const patch = (update: Partial<Translation>) => {
    if (!poiId) return;
    setPois(prev => prev.map(x =>
      x.id === poiId ? { ...x, translations: { ...x.translations, [lang]: { ...x.translations[lang], ...update } } } : x
    ));
  };

  const openPOI = (p: POI, l?: string) => {
    const al = l ?? lang;
    setPoiId(p.id); if (l) setLang(l);
    setEditingText(p.translations[al]?.text ?? "");
    setShowVoicePicker(false); setShowReviewerPicker(false);
  };
  const closePOI = () => { setPoiId(null); setShowVoicePicker(false); setShowReviewerPicker(false); };
  const changeGuide = (id: string) => { const g = guides.find(x => x.id === id)!; setGuideId(id); setLang(g.targetLanguages[0]); setPoiId(null); };
  const changeLang = (l: string) => { setLang(l); if (poi) setEditingText(poi.translations[l]?.text ?? ""); };
  const togglePlay = (id: string) => { setPlayingVoice(prev => { if (prev === id) return null; setTimeout(() => setPlayingVoice(null), 3000); return id; }); };
  const assignVoice = (v: Voice) => { setVoiceAssignments(prev => ({ ...prev, [guideId]: { ...prev[guideId], [lang]: v.id } })); patch({ audioStatus: "pending" }); setShowVoicePicker(false); setVoiceSearch(""); };

  const generateAIDraft = () => {
    setGenerating(true);
    setTimeout(() => {
      const aiText = "[AI draft] " + poi!.sourceText;
      setEditingText(aiText);
      patch({ text: aiText, status: "draft", aiDrafted: true });
      setGenerating(false);
    }, 1400);
  };

  const requestExpertReview = (reviewer: CertifiedReviewer) => {
    patch({
      status: "expert-review",
      expertReview: {
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        reviewerBadge: reviewer.badge,
        reviewerAvatar: reviewer.avatarUrl,
        originalText: editingText,
        suggestedText: "",
        comment: "",
      },
    });
    setShowReviewerPicker(false);
  };

  // Simulate expert returning corrections (prototype only)
  const simulateExpertReturn = () => {
    if (!trans?.expertReview) return;
    const original = trans.expertReview.originalText;
    // Simulate a few corrections: replace some words
    const suggested = original
      .replace("[AI draft] ", "")
      .replace("showcases", "presents")
      .replace("finest", "most significant")
      .replace("immerse", "envelop")
      .replace("presenta", "ospita con orgoglio")
      .replace("magnífica", "grandiosa")
      .replace("los mejores", "algunos de los más destacados");
    patch({
      status: "expert-done",
      expertReview: {
        ...trans.expertReview,
        suggestedText: suggested,
        comment: "Adjusted terminology to align with standard museum language. 'Presents' is more neutral than 'showcases'. Minor stylistic refinements throughout.",
        returnedAt: new Date().toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      },
    });
  };

  const acceptExpertSuggestion = () => {
    const suggested = trans?.expertReview?.suggestedText ?? editingText;
    setEditingText(suggested);
    patch({ text: suggested, status: "approved", expertReview: undefined });
  };

  const rejectExpertSuggestion = () => {
    patch({ status: "review", expertReview: undefined });
  };

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (poi) {
    const poiIndex = pois.findIndex(p => p.id === poi.id);
    const isApproved = trans?.status === "approved";
    const isExpertReview = trans?.status === "expert-review";
    const isExpertDone = trans?.status === "expert-done";
    const isReview = trans?.status === "review";
    const isAIDraft = !isApproved && !isExpertReview && !isExpertDone && trans?.aiDrafted && trans?.text;
    const isEmpty = !trans?.text && !editingText;

    const textareaBg = isApproved ? "bg-white" : isExpertDone ? "bg-white" : isReview ? "bg-amber-50/60" : isAIDraft ? "bg-violet-50/50" : "bg-white";
    const textareaBorder = isApproved ? "border-emerald-200" : isExpertDone ? "border-teal-200" : isReview ? "border-amber-200" : isAIDraft ? "border-violet-200" : "border-zinc-200";

    // Status bar config
    const statusBar = (() => {
      if (isApproved) return { bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100", icon: <CheckCircle2 className="size-5 text-emerald-600" />, title: "Approved by curator", desc: `${CURATOR_NAME} has validated this translation.`, titleColor: "text-emerald-900", descColor: "text-emerald-700" };
      if (isExpertDone) return { bg: "bg-teal-50", border: "border-teal-200", iconBg: "bg-teal-100", icon: <ShieldCheck className="size-5 text-teal-600" />, title: `${trans?.expertReview?.reviewerName} returned corrections`, desc: "Review the highlighted diff below, accept or reject — you have the final word.", titleColor: "text-teal-900", descColor: "text-teal-700" };
      if (isExpertReview) return { bg: "bg-orange-50", border: "border-orange-200", iconBg: "bg-orange-100", icon: <Clock className="size-5 text-orange-500" />, title: `Sent to ${trans?.expertReview?.reviewerName} · Awaiting review`, desc: `Expected turnaround: ${certifiedReviewers.find(r => r.id === trans?.expertReview?.reviewerId)?.turnaround ?? "48h"}. You'll be notified when corrections arrive.`, titleColor: "text-orange-900", descColor: "text-orange-700" };
      if (isReview) return { bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100", icon: <Eye className="size-5 text-amber-600" />, title: "AI draft ready — awaiting your review", desc: "Read, edit if needed, then approve or send to an expert. Your signature gives it authority.", titleColor: "text-amber-900", descColor: "text-amber-700" };
      return { bg: "bg-violet-50", border: "border-violet-200", iconBg: "bg-violet-100", icon: <Sparkles className="size-5 text-violet-600" />, title: "AI drafted · not yet reviewed", desc: "The AI wrote a first draft. Review it, correct it — you have the final word.", titleColor: "text-violet-900", descColor: "text-violet-600" };
    })();

    return (
      <PageShell>
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={closePOI} className="size-8 flex items-center justify-center rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors flex-shrink-0">
              <ChevronLeft className="size-4 text-zinc-600" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">{guide.name}</p>
              <h1 className="text-[20px] font-semibold text-zinc-900 tracking-tight truncate">{poi.name}</h1>
            </div>
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1 flex-shrink-0">
              {guide.targetLanguages.map(l => (
                <button key={l} onClick={() => changeLang(l)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${lang === l ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}>{l}</button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { const p = pois[poiIndex - 1]; if (p) openPOI(p); }} disabled={poiIndex === 0}
                className="size-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 transition-all">
                <ChevronLeft className="size-4 text-zinc-600" />
              </button>
              <span className="text-[11px] text-zinc-400 px-1">{poiIndex + 1}/{pois.length}</span>
              <button onClick={() => { const p = pois[poiIndex + 1]; if (p) openPOI(p); }} disabled={poiIndex === pois.length - 1}
                className="size-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 transition-all">
                <ChevronRight className="size-4 text-zinc-600" />
              </button>
            </div>
          </div>

          {/* Status bar */}
          {!isEmpty && (
            <div className={`flex items-center gap-4 px-5 py-4 rounded-xl border mb-6 ${statusBar.bg} ${statusBar.border}`}>
              <div className={`size-9 rounded-xl flex items-center justify-center flex-shrink-0 ${statusBar.iconBg}`}>{statusBar.icon}</div>
              <div className="flex-1">
                <p className={`text-[13px] font-semibold ${statusBar.titleColor}`}>{statusBar.title}</p>
                <p className={`text-[12px] mt-0.5 ${statusBar.descColor}`}>{statusBar.desc}</p>
              </div>
              {/* Reviewer card (expert states) */}
              {(isExpertReview || isExpertDone) && trans?.expertReview && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <img src={trans.expertReview.reviewerAvatar} alt="" className="size-7 rounded-full object-cover" />
                  <div className="text-right">
                    <p className={`text-[11px] font-semibold ${statusBar.titleColor}`}>{trans.expertReview.reviewerName}</p>
                    <p className={`text-[10px] ${statusBar.descColor}`}>{trans.expertReview.reviewerBadge}</p>
                  </div>
                </div>
              )}
              {/* Curator name (approved) */}
              {isApproved && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="size-7 rounded-full bg-emerald-200 flex items-center justify-center"><User className="size-3.5 text-emerald-700" /></div>
                  <span className="text-[12px] font-semibold text-emerald-800">{CURATOR_NAME}</span>
                  <button onClick={() => patch({ status: "draft" })} className="ml-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900">
                    <RotateCcw className="size-3" />Reopen
                  </button>
                </div>
              )}
              {/* Simulate return (prototype) */}
              {isExpertReview && (
                <button onClick={simulateExpertReturn}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors flex-shrink-0">
                  Simulate Return ↩
                </button>
              )}
              {/* Approve from review */}
              {isReview && (
                <button onClick={() => patch({ status: "approved", text: editingText })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all active:scale-95 flex-shrink-0">
                  <CheckCircle2 className="size-4" />Approve
                </button>
              )}
            </div>
          )}

          {/* 3-column editor */}
          <div className="grid grid-cols-[1fr_1.2fr_0.8fr] gap-5 items-start">

            {/* Col 1: Source */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded tracking-wider">EN</span>
                <span className="text-[12px] font-semibold text-zinc-500">Original</span>
                <span className="ml-auto text-[11px] text-zinc-400">{poi.sourceText.length} chars</span>
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-[13px] text-zinc-600 leading-relaxed min-h-[220px]">{poi.sourceText}</div>
            </div>

            {/* Col 2: Translation */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-zinc-900 text-white text-[10px] font-bold rounded tracking-wider">{lang}</span>
                <span className="text-[12px] font-semibold text-zinc-500">Translation</span>
                {isAIDraft && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700"><Sparkles className="size-2.5" />AI draft</span>}
                {isApproved && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-2.5" />Approved</span>}
                {isExpertDone && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-700"><ShieldCheck className="size-2.5" />Expert reviewed</span>}
                <span className="ml-auto text-[11px] text-zinc-400">{editingText.length} chars</span>
              </div>

              {/* Reviewer picker panel */}
              {showReviewerPicker ? (
                <ReviewerPicker lang={lang} onSelect={requestExpertReview} onClose={() => setShowReviewerPicker(false)} />
              ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center min-h-[220px] rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 gap-4 p-6 text-center">
                  <div className="size-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                    <Sparkles className="size-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-violet-900 mb-1">No translation yet</p>
                    <p className="text-[12px] text-violet-600 leading-relaxed">Let AI write a first draft — then you edit, review, or send to an expert.</p>
                  </div>
                  <button onClick={generateAIDraft} disabled={generating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-60">
                    {generating ? <><span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Generating…</> : <><Sparkles className="size-4" />Generate AI Draft</>}
                  </button>
                  <button onClick={() => { setEditingText(""); patch({ text: "", status: "draft", aiDrafted: false }); }} className="text-[12px] text-violet-500 hover:text-violet-700 transition-colors">Write manually instead</button>
                </div>
              ) : isExpertDone && trans?.expertReview ? (
                <div className="space-y-3">
                  {/* Expert comment */}
                  {trans.expertReview.comment && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-teal-200 bg-teal-50/40">
                      <MessageSquare className="size-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wide mb-0.5">Expert note · {trans.expertReview.returnedAt}</p>
                        <p className="text-[12px] text-teal-800 leading-relaxed">{trans.expertReview.comment}</p>
                      </div>
                    </div>
                  )}
                  {/* Diff view */}
                  <DiffView original={trans.expertReview.originalText} suggested={trans.expertReview.suggestedText} />
                  <div className="flex items-center gap-2 justify-end pt-1">
                    <button onClick={rejectExpertSuggestion} className="px-4 py-2 text-[12px] font-semibold text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all">
                      Reject corrections
                    </button>
                    <button onClick={acceptExpertSuggestion}
                      className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all active:scale-95">
                      <CheckCircle2 className="size-4" />Accept & Approve
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <textarea value={editingText} onChange={e => { setEditingText(e.target.value); patch({ text: e.target.value }); }}
                    disabled={isApproved || isExpertReview}
                    placeholder={`${lang} translation…`}
                    className={`w-full p-4 border rounded-xl text-[13px] text-zinc-900 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed transition-all min-h-[220px] ${textareaBg} ${textareaBorder}`} />
                  {/* Action bar */}
                  {!isApproved && !isExpertReview && (
                    <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
                      <button onClick={() => setShowReviewerPicker(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold text-teal-700 border border-teal-200 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all">
                        <ShieldCheck className="size-3.5" />Request Expert Review
                      </button>
                      {trans?.status !== "review" && (
                        <button onClick={() => patch({ status: "review", text: editingText })}
                          className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all">
                          <Eye className="size-3.5" />Submit for Review
                        </button>
                      )}
                      <button onClick={() => patch({ status: "approved", text: editingText })}
                        className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all active:scale-95">
                        <CheckCircle2 className="size-4" />Approve
                      </button>
                    </div>
                  )}
                  {isExpertReview && (
                    <button onClick={() => patch({ status: "draft", expertReview: undefined })}
                      className="text-[11px] text-zinc-400 hover:text-zinc-600 text-right transition-colors">
                      Cancel request
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Col 3: Voice */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-0">
                <Mic className="size-3.5 text-zinc-400" strokeWidth={1.5} />
                <span className="text-[12px] font-semibold text-zinc-500">Voice Over · {lang}</span>
              </div>
              <VoicePanel textApproved={isApproved} audioStatus={trans?.audioStatus} voice={voice} lang={lang}
                showPicker={showVoicePicker} voiceSearch={voiceSearch}
                onAdvance={() => patch({ audioStatus: "review" })} onApprove={() => patch({ audioStatus: "ready" })}
                onReopen={() => patch({ audioStatus: "review" })} onChooseVoice={() => setShowVoicePicker(true)}
                onClosePicker={() => setShowVoicePicker(false)} onVoiceSearch={setVoiceSearch}
                onAssignVoice={assignVoice} onPlayToggle={togglePlay} playing={playingVoice} />
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl flex items-center justify-center bg-violet-50">
              <Sparkles className="size-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Translations</h1>
              <p className="text-[13px] text-zinc-400 mt-0.5">AI drafts · curator approves · expert certifies</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative">
            <select value={guideId} onChange={e => changeGuide(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] font-semibold text-zinc-900 focus:outline-none cursor-pointer">
              {initialGuides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
            {guide.targetLanguages.map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${lang === l ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}>{l}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-32 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${(complete / pois.length) * 100}%` }} />
            </div>
            <span className="text-[12px] font-semibold text-zinc-500">{complete}/{pois.length} complete</span>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input type="text" placeholder="Search POIs…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900" />
        </div>

        <div className="space-y-2">
          {filteredPOIs.map((p, i) => {
            const t = p.translations[lang];
            const ts = textSlot(t?.status ?? "draft", t?.text ?? "");
            const as_ = audioSlot(t?.audioStatus ?? "none");
            const isDone = ts === "done" && as_ === "done";
            const isExpertState = t?.status === "expert-review" || t?.status === "expert-done";
            const isAI = t?.aiDrafted && t?.status !== "approved" && !isExpertState;

            const statusLabel = isDone ? "Complete"
              : t?.status === "expert-done" ? "Expert reviewed"
              : t?.status === "expert-review" ? "Expert review"
              : t?.status === "approved" ? "Approved"
              : t?.status === "review" ? "In review"
              : t?.text ? "Draft"
              : "Not started";

            return (
              <button key={p.id} onClick={() => openPOI(p)}
                className={`w-full group flex items-center gap-4 px-5 py-4 bg-white rounded-xl border transition-all text-left hover:shadow-sm ${isDone ? "border-emerald-200 hover:border-emerald-300" : "border-zinc-200 hover:border-zinc-300"}`}
                style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                <span className="text-[11px] font-medium text-zinc-400 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className={`flex-1 text-[14px] font-semibold truncate ${isDone ? "text-emerald-800" : "text-zinc-900"}`}>{p.name}</span>
                {isAI && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-600 border border-violet-100 flex-shrink-0"><Sparkles className="size-2.5" />AI draft</span>}
                {isExpertState && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-100 flex-shrink-0"><ShieldCheck className="size-2.5" />{t?.status === "expert-done" ? "Expert reviewed" : "Expert review"}</span>}
                <SplitPill t={ts} v={as_} />
                <span className="text-[12px] font-semibold text-zinc-400 group-hover:text-zinc-700 transition-colors ml-1 w-24 text-right flex-shrink-0">{statusLabel}</span>
                <ChevronRight className="size-4 text-zinc-300 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
