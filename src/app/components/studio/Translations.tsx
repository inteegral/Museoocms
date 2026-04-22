import { useState } from "react";
import {
  Search, Sparkles, CheckCircle2, Mic, Play, Pause,
  X, ChevronDown, FileText, ArrowRight, RotateCcw, Clock, Eye, Lock, Plus,
} from "lucide-react";
import { PageShell } from "./PageShell";

// ─── Types ────────────────────────────────────────────────────────────────────

type TextStatus = "draft" | "review" | "approved";
type AudioStatus = "none" | "pending" | "review" | "ready";

interface Translation { text: string; status: TextStatus; audioStatus: AudioStatus }
interface POI { id: string; name: string; sourceText: string; translations: Record<string, Translation> }
interface Voice { id: string; name: string; language: string; gender: string; style: string[]; avatarUrl: string }
interface Guide { id: string; name: string; targetLanguages: string[]; voiceAssignments: Record<string, string | null> }

// ─── Data ─────────────────────────────────────────────────────────────────────

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
      ES: { text: "Esta magnífica sala presenta los mejores ejemplos del arte renacentista de los siglos XV y XVI.", status: "review", audioStatus: "review" },
      FR: { text: "Cette magnifique salle présente les plus beaux exemples de l'art de la Renaissance.", status: "draft", audioStatus: "none" },
    },
  },
  {
    id: "p2", name: "Leonardo's Workshop",
    sourceText: "Step into the recreated workshop of Leonardo da Vinci, where genius and craftsmanship converged. This space replicates the environment where Leonardo developed his groundbreaking inventions and created his most celebrated artworks.",
    translations: {
      IT: { text: "Entra nel laboratorio ricreato di Leonardo da Vinci, dove genio e maestria si incontrano.", status: "approved", audioStatus: "ready" },
      ES: { text: "Entra en el taller recreado de Leonardo da Vinci, donde el genio y la artesanía se fusionaron.", status: "review", audioStatus: "none" },
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
    translations: {
      IT: { text: "", status: "draft", audioStatus: "none" },
      ES: { text: "", status: "draft", audioStatus: "none" },
      FR: { text: "", status: "draft", audioStatus: "none" },
    },
  },
  {
    id: "p5", name: "Raphael Gallery",
    sourceText: "Explore the harmonious compositions of Raphael, whose work represents the pinnacle of Renaissance artistic achievement. The gallery presents a curated selection of his most significant paintings.",
    translations: {
      IT: { text: "", status: "draft", audioStatus: "none" },
      ES: { text: "", status: "draft", audioStatus: "none" },
      FR: { text: "", status: "draft", audioStatus: "none" },
    },
  },
];

// ─── Split Status Pill ────────────────────────────────────────────────────────

type SlotState = "empty" | "active" | "review" | "done";

const slotColor: Record<SlotState, string> = {
  empty: "#e4e4e7",
  active: "#93c5fd",
  review: "#fcd34d",
  done: "#4ade80",
};

function textSlot(status: TextStatus, text: string): SlotState {
  if (status === "approved") return "done";
  if (status === "review") return "review";
  if (text) return "active";
  return "empty";
}

function audioSlot(status: AudioStatus): SlotState {
  if (status === "ready") return "done";
  if (status === "review") return "review";
  if (status === "pending") return "active";
  return "empty";
}

function SplitPill({ t, v }: { t: SlotState; v: SlotState }) {
  const both = t === "done" && v === "done";
  return (
    <div
      className={`flex items-center rounded-full overflow-hidden flex-shrink-0 transition-all ${both ? "ring-1 ring-green-400 ring-offset-1" : ""}`}
      style={{ border: "1.5px solid #e4e4e7" }}
    >
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

// ─── Smart Action Banner ──────────────────────────────────────────────────────

interface BannerProps {
  trans: Translation | undefined;
  editingText: string;
  hasVoice: boolean;
  onAITranslate: () => void;
  onSubmitReview: () => void;
  onApproveText: () => void;
  onReopenText: () => void;
  onChooseVoice: () => void;
}

function SmartBanner({ trans, editingText, hasVoice, onAITranslate, onSubmitReview, onApproveText, onReopenText, onChooseVoice }: BannerProps) {
  const textDone = trans?.status === "approved";
  const audioDone = trans?.audioStatus === "ready";
  const hasText = !!(trans?.text || editingText);

  if (textDone && audioDone) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
        <div className="size-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="size-4 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-emerald-900">Complete</p>
          <p className="text-[12px] text-emerald-600 mt-0.5">Translation and voice over are both approved.</p>
        </div>
        <button onClick={onReopenText} className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors">
          <RotateCcw className="size-3.5" />Reopen
        </button>
      </div>
    );
  }

  if (textDone && !audioDone) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
        <div className="size-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Mic className="size-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-blue-900">Text approved — voice over next</p>
          <p className="text-[12px] text-blue-600 mt-0.5">
            {hasVoice ? "Advance the voice recording workflow in the panel on the right." : "Assign a voice to start the recording process."}
          </p>
        </div>
        {!hasVoice && (
          <button onClick={onChooseVoice} className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-colors">
            Assign Voice <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>
    );
  }

  if (trans?.status === "review") {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
        <div className="size-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Eye className="size-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-amber-900">Ready for approval</p>
          <p className="text-[12px] text-amber-700 mt-0.5">Review the translation and approve it to move forward.</p>
        </div>
        <button onClick={onApproveText} className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-colors">
          <CheckCircle2 className="size-3.5" />Approve
        </button>
      </div>
    );
  }

  if (hasText) {
    return (
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3">
        <div className="size-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Clock className="size-4 text-zinc-500" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-zinc-800">Draft saved</p>
          <p className="text-[12px] text-zinc-500 mt-0.5">Submit for review when ready.</p>
        </div>
        <button onClick={onSubmitReview} className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 bg-white text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-colors">
          <Eye className="size-3.5" />Submit for Review
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl flex items-center gap-3">
      <div className="size-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Sparkles className="size-4 text-violet-600" />
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-violet-900">No translation yet</p>
        <p className="text-[12px] text-violet-600 mt-0.5">Generate a first draft with AI, then edit and review.</p>
      </div>
      <button onClick={onAITranslate} className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-colors">
        <Sparkles className="size-3.5" />AI Translate
      </button>
    </div>
  );
}

// ─── Smart Voice Banner ───────────────────────────────────────────────────────

function SmartVoiceBanner({
  textApproved, audioStatus, voiceName, lang,
  onAdvance, onApprove, onReopen, onChooseVoice,
}: {
  textApproved: boolean; audioStatus: AudioStatus | undefined;
  voiceName: string | undefined; lang: string;
  onAdvance: () => void; onApprove: () => void;
  onReopen: () => void; onChooseVoice: () => void;
}) {
  if (!textApproved) {
    return (
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Lock className="size-3.5 text-zinc-400" />
          <p className="text-[12px] font-semibold text-zinc-500">Locked</p>
        </div>
        <p className="text-[12px] text-zinc-400 leading-relaxed">Approve the translation first to unlock voice over.</p>
      </div>
    );
  }
  if (!voiceName) {
    return (
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Mic className="size-3.5 text-blue-500" />
          <p className="text-[12px] font-semibold text-zinc-700">No voice assigned</p>
        </div>
        <p className="text-[12px] text-zinc-500 leading-relaxed mb-3">Assign a voice talent to start the {lang} recording.</p>
        <button onClick={onChooseVoice} className="w-full py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5">
          Choose Voice <ArrowRight className="size-3.5" />
        </button>
      </div>
    );
  }
  if (audioStatus === "pending") {
    return (
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Clock className="size-3.5 text-zinc-500" />
          <p className="text-[12px] font-semibold text-zinc-700">Awaiting recording</p>
        </div>
        <p className="text-[12px] text-zinc-500 leading-relaxed mb-3">Mark as received when the recording from {voiceName} arrives.</p>
        <button onClick={onAdvance} className="w-full py-2 border border-zinc-200 bg-white text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-colors">
          Mark as Received
        </button>
      </div>
    );
  }
  if (audioStatus === "review") {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Eye className="size-3.5 text-amber-600" />
          <p className="text-[12px] font-semibold text-amber-900">Under review</p>
        </div>
        <p className="text-[12px] text-amber-700 leading-relaxed mb-3">Listen and approve if quality meets standards.</p>
        <button onClick={onApprove} className="w-full py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5">
          <CheckCircle2 className="size-3.5" />Approve Voice
        </button>
      </div>
    );
  }
  return (
    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <div className="flex items-center gap-2.5 mb-1.5">
        <CheckCircle2 className="size-3.5 text-emerald-600" />
        <p className="text-[12px] font-semibold text-emerald-900">Voice approved</p>
      </div>
      <p className="text-[12px] text-emerald-600 leading-relaxed mb-3">The {lang} recording by {voiceName} is ready to publish.</p>
      <button onClick={onReopen} className="w-full py-2 border border-emerald-200 text-emerald-700 text-[12px] font-semibold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5">
        <RotateCcw className="size-3.5" />Reopen
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Translations() {
  const [pois, setPois] = useState<POI[]>(initialPOIs);
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [guideId, setGuideId] = useState(initialGuides[0].id);
  const [lang, setLang] = useState(initialGuides[0].targetLanguages[0]);
  const [poiId, setPoiId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [search, setSearch] = useState("");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [voiceSearch, setVoiceSearch] = useState("");

  const guide = guides.find((g) => g.id === guideId)!;
  const poi = pois.find((p) => p.id === poiId) ?? null;
  const trans = poi ? poi.translations[lang] : undefined;
  const voiceId = guide.voiceAssignments[lang] ?? null;
  const voice = voiceId ? allVoices.find((v) => v.id === voiceId) ?? null : null;

  const patch = (p: Partial<Translation>) => {
    if (!poiId) return;
    setPois((prev) => prev.map((x) =>
      x.id === poiId
        ? { ...x, translations: { ...x.translations, [lang]: { ...x.translations[lang], ...p } } }
        : x
    ));
  };

  const assignVoice = (v: Voice) => {
    setGuides((prev) => prev.map((g) =>
      g.id === guideId ? { ...g, voiceAssignments: { ...g.voiceAssignments, [lang]: v.id } } : g
    ));
    setShowVoicePicker(false);
    setVoiceSearch("");
  };

  const openPOI = (p: POI, l?: string) => {
    const activeLang = l ?? lang;
    setPoiId(p.id);
    if (l) setLang(l);
    setEditingText(p.translations[activeLang]?.text ?? "");
    setShowVoicePicker(false);
  };

  const closeModal = () => {
    setPoiId(null);
    setShowVoicePicker(false);
  };

  const changeGuide = (id: string) => {
    const g = guides.find((x) => x.id === id)!;
    const l = g.targetLanguages[0];
    setGuideId(id);
    setLang(l);
    setPoiId(null);
  };

  const changeLang = (l: string) => {
    setLang(l);
    if (poi) setEditingText(poi.translations[l]?.text ?? "");
  };

  const togglePlay = (id: string) => {
    setPlayingVoice((prev) => {
      if (prev === id) return null;
      setTimeout(() => setPlayingVoice(null), 3000);
      return id;
    });
  };

  const complete = pois.filter(
    (p) => p.translations[lang]?.status === "approved" && p.translations[lang]?.audioStatus === "ready"
  ).length;

  const filteredPOIs = pois.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Translations</h1>
            <p className="text-[13px] text-zinc-500">
              {complete} of {pois.length} POIs complete · {guide.name}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Guide selector */}
          <div className="relative">
            <select
              value={guideId}
              onChange={(e) => changeGuide(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            >
              {initialGuides.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Language pills */}
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
            {guide.targetLanguages.map((l) => (
              <button
                key={l}
                onClick={() => changeLang(l)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  lang === l ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${(complete / pois.length) * 100}%` }}
                />
              </div>
              <span className="text-[12px] font-semibold text-zinc-500">{complete}/{pois.length}</span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1"><FileText className="size-3" /> Text</span>
              <span className="flex items-center gap-1"><Mic className="size-3" /> Voice</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search POIs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>

        {/* POI List */}
        <div className="space-y-2">
          {filteredPOIs.map((p, i) => {
            const t = p.translations[lang];
            const ts = textSlot(t?.status ?? "draft", t?.text ?? "");
            const as_ = audioSlot(t?.audioStatus ?? "none");
            const isDone = ts === "done" && as_ === "done";

            return (
              <button
                key={p.id}
                onClick={() => openPOI(p)}
                className={`w-full group flex items-center gap-4 px-5 py-4 bg-white rounded-xl border transition-all text-left hover:shadow-sm ${
                  isDone ? "border-emerald-200 hover:border-emerald-300" : "border-zinc-200 hover:border-zinc-300"
                }`}
                style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}
              >
                <span className="text-[11px] font-medium text-zinc-400 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className={`flex-1 text-[14px] font-semibold truncate ${isDone ? "text-emerald-800" : "text-zinc-900"}`}>
                  {p.name}
                </span>
                <SplitPill t={ts} v={as_} />
                <span className="text-[12px] font-semibold text-zinc-400 group-hover:text-zinc-700 transition-colors ml-2">
                  {isDone ? "Complete" : t?.text ? "In progress" : "Not started"}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ── Translation Modal ── */}
      {poi && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Modal header */}
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">
                  {guide.name} · EN → {lang}
                </p>
                <h2 className="text-[18px] font-semibold text-zinc-900">{poi.name}</h2>
              </div>
              <div className="flex items-center gap-3">
                {/* Lang switcher inside modal */}
                <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
                  {guide.targetLanguages.map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLang(l)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        lang === l ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex flex-1 overflow-hidden">

              {/* Center: source + translation */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Smart banner */}
                <div className="px-6 pt-5 pb-4 flex-shrink-0">
                  <SmartBanner
                    trans={trans}
                    editingText={editingText}
                    hasVoice={!!voice}
                    onAITranslate={() => {
                      const draft = "[AI] " + poi.sourceText.slice(0, 80) + "…";
                      setEditingText(draft);
                      patch({ text: draft, status: "draft" });
                    }}
                    onSubmitReview={() => patch({ status: "review", text: editingText })}
                    onApproveText={() => patch({ status: "approved", text: editingText })}
                    onReopenText={() => patch({ status: "draft" })}
                    onChooseVoice={() => setShowVoicePicker(true)}
                  />
                </div>

                {/* Text panels */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  <div className="grid grid-cols-2 gap-4 h-full min-h-[240px]">
                    {/* Source */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded tracking-wider">EN</span>
                        <span className="text-[12px] font-semibold text-zinc-500">Source</span>
                        <span className="ml-auto text-[11px] text-zinc-400">{poi.sourceText.length} chars</span>
                      </div>
                      <div className="flex-1 p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-[13px] text-zinc-600 leading-relaxed overflow-y-auto">
                        {poi.sourceText}
                      </div>
                    </div>
                    {/* Translation */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-zinc-900 text-white text-[10px] font-bold rounded tracking-wider">{lang}</span>
                        <span className="text-[12px] font-semibold text-zinc-500">Translation</span>
                        <span className="ml-auto text-[11px] text-zinc-400">{editingText.length} chars</span>
                      </div>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        disabled={trans?.status === "approved"}
                        placeholder={`Type the ${lang} translation here…`}
                        className="flex-1 p-4 bg-white border border-zinc-200 rounded-xl text-[13px] text-zinc-900 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent disabled:bg-zinc-50 disabled:text-zinc-500 min-h-[200px] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: voice panel */}
              <div className="w-[220px] flex-shrink-0 border-l border-zinc-200 flex flex-col bg-zinc-50/50 overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-zinc-100 flex-shrink-0">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Voice Over · {lang}</p>
                </div>

                {showVoicePicker ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between flex-shrink-0">
                      <span className="text-[12px] font-semibold text-zinc-700">Choose voice</span>
                      <button onClick={() => setShowVoicePicker(false)} className="text-zinc-400 hover:text-zinc-700">
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="px-3 py-2.5 border-b border-zinc-100 flex-shrink-0">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400" />
                        <input
                          type="text"
                          placeholder="Search…"
                          value={voiceSearch}
                          onChange={(e) => setVoiceSearch(e.target.value)}
                          className="w-full pl-7 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {allVoices
                        .filter((v) => v.name.toLowerCase().includes(voiceSearch.toLowerCase()))
                        .map((v) => (
                          <button
                            key={v.id}
                            onClick={() => { assignVoice(v); patch({ audioStatus: "pending" }); }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 transition-colors border-b border-zinc-50 last:border-0"
                          >
                            <img src={v.avatarUrl} alt={v.name} className="size-9 rounded-full object-cover flex-shrink-0" />
                            <div className="text-left flex-1 min-w-0">
                              <p className="text-[12px] font-semibold text-zinc-900 truncate">{v.name}</p>
                              <p className="text-[11px] text-zinc-400">{v.language} · {v.gender}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); togglePlay(v.id); }}
                              className="size-6 rounded-full bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center flex-shrink-0"
                            >
                              {playingVoice === v.id ? <Pause className="size-3 text-zinc-700" /> : <Play className="size-3 text-zinc-700 ml-0.5" />}
                            </button>
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <SmartVoiceBanner
                      textApproved={trans?.status === "approved"}
                      audioStatus={trans?.audioStatus}
                      voiceName={voice?.name}
                      lang={lang}
                      onAdvance={() => patch({ audioStatus: "review" })}
                      onApprove={() => patch({ audioStatus: "ready" })}
                      onReopen={() => patch({ audioStatus: "review" })}
                      onChooseVoice={() => setShowVoicePicker(true)}
                    />

                    {voice && (
                      <div className="flex flex-col items-center pt-2">
                        <div className="relative mb-3">
                          <img src={voice.avatarUrl} alt={voice.name} className="size-14 rounded-full object-cover" />
                          <button
                            onClick={() => togglePlay(voice.id)}
                            className="absolute -bottom-1 -right-1 size-6 rounded-full bg-zinc-900 hover:bg-zinc-700 flex items-center justify-center shadow-md transition-colors"
                          >
                            {playingVoice === voice.id ? <Pause className="size-2.5 text-white" /> : <Play className="size-2.5 text-white ml-0.5" />}
                          </button>
                        </div>
                        <p className="text-[13px] font-semibold text-zinc-900">{voice.name}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{voice.language} · {voice.gender}</p>
                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                          {voice.style.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-semibold rounded-full">{tag}</span>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowVoicePicker(true)}
                          className="mt-4 w-full py-1.5 border border-zinc-200 text-zinc-500 text-[11px] font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                        >
                          Change Voice
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between flex-shrink-0">
              <button onClick={closeModal} className="px-4 py-2 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-200 rounded-lg transition-all">
                Close
              </button>
              <div className="flex items-center gap-2">
                {/* Navigate prev/next */}
                {(() => {
                  const idx = pois.findIndex((p) => p.id === poi.id);
                  return (
                    <>
                      <button
                        onClick={() => { const prev = pois[idx - 1]; if (prev) openPOI(prev); }}
                        disabled={idx === 0}
                        className="px-3 py-2 text-[12px] font-semibold text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-100 disabled:opacity-30 transition-all"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={() => { const next = pois[idx + 1]; if (next) openPOI(next); }}
                        disabled={idx === pois.length - 1}
                        className="px-3 py-2 text-[12px] font-semibold text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-100 disabled:opacity-30 transition-all"
                      >
                        Next →
                      </button>
                    </>
                  );
                })()}
                <button
                  onClick={() => patch({ text: editingText })}
                  disabled={trans?.status === "approved"}
                  className="px-4 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </PageShell>
  );
}
