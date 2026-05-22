import {
  Mic,
  Play,
  Pause,
  Search,
  Plus,
  X,
  Check,
  Upload,
  ChevronDown,
  Volume2,
  Pencil,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PageShell } from "../../_layout/PageShell";
import { mockPOIs } from "../../../../data/mockData";
import { VoiceActor, VoiceGenerationModal, stripPunctuation } from "./VoiceGenerationModal";

interface Pronunciation {
  id: string;
  word: string;
  ipa: string;
  simplified: string;
  foundIn: string[];
  status: "pending" | "approved" | "overridden";
  override?: string;
}

// Avatar pool (reused across voices)
const AV = {
  f1: "https://images.unsplash.com/photo-1768853972795-2739a9685567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  m1: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  f2: "https://images.unsplash.com/photo-1614436201459-156d322d38c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  m2: "https://images.unsplash.com/photo-1695266391814-a276948f1775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  f3: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  m3: "https://images.unsplash.com/photo-1649712041612-021cf78bca23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  f4: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  m4: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  f5: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  m5: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
};

const mockVoices: VoiceActor[] = [
  // ── English ──────────────────────────────────────────────────────────────────
  { id: "en1", name: "Sarah Mitchell",   language: "EN", gender: "female", age: "adult",  style: ["Warm", "Professional", "Clear"],        description: "Perfect for museum tours and art galleries. Clear pronunciation with a warm, engaging tone.", avatarUrl: AV.f1 },
  { id: "en2", name: "Emma Watson",      language: "EN", gender: "female", age: "young",  style: ["Friendly", "Conversational", "Bright"],  description: "Ideal for interactive exhibits and family-friendly tours. Bright and conversational.", avatarUrl: AV.f3 },
  { id: "en3", name: "James Hartley",    language: "EN", gender: "male",   age: "adult",  style: ["Authoritative", "Deep", "Clear"],        description: "Rich baritone suited for grand historical narratives and permanent collections.", avatarUrl: AV.m4 },
  // ── Italian ──────────────────────────────────────────────────────────────────
  { id: "it1", name: "Marco Rossi",      language: "IT", gender: "male",   age: "adult",  style: ["Professional", "Authoritative", "Deep"], description: "Ideal for historical narratives and cultural heritage sites. Deep, authoritative voice.", avatarUrl: AV.m1 },
  { id: "it2", name: "Giulia Bianchi",   language: "IT", gender: "female", age: "young",  style: ["Warm", "Expressive", "Engaging"],        description: "Bright and engaging voice ideal for contemporary exhibitions and family tours.", avatarUrl: AV.f2 },
  { id: "it3", name: "Alessandro Ferrari", language: "IT", gender: "male", age: "senior", style: ["Refined", "Calm", "Scholarly"],          description: "Distinguished senior voice perfect for classical art and archaeological collections.", avatarUrl: AV.m2 },
  { id: "it4", name: "Chiara Romano",    language: "IT", gender: "female", age: "adult",  style: ["Clear", "Professional", "Measured"],     description: "Crisp and precise diction, excellent for scientific museums and technical exhibits.", avatarUrl: AV.f4 },
  { id: "it5", name: "Lorenzo Esposito", language: "IT", gender: "male",   age: "young",  style: ["Dynamic", "Modern", "Friendly"],         description: "Energetic tone that keeps younger audiences engaged throughout the tour.", avatarUrl: AV.m3 },
  { id: "it6", name: "Valentina Conti",  language: "IT", gender: "female", age: "senior", style: ["Elegant", "Soothing", "Refined"],        description: "Timeless elegance suited for fine arts, opera collections and prestige venues.", avatarUrl: AV.f5 },
  { id: "it7", name: "Matteo Ricci",     language: "IT", gender: "male",   age: "adult",  style: ["Storytelling", "Vivid", "Engaging"],     description: "Gifted storyteller whose voice brings historical figures and events to life.", avatarUrl: AV.m5 },
  { id: "it8", name: "Francesca Lombardi", language: "IT", gender: "female", age: "adult", style: ["Warm", "Inviting", "Natural"],          description: "Natural, conversational delivery perfect for immersive and narrative-led tours.", avatarUrl: AV.f1 },
  { id: "it9", name: "Davide Moretti",   language: "IT", gender: "male",   age: "young",  style: ["Confident", "Fresh", "Clear"],           description: "Confident delivery with modern diction, well suited for design and contemporary art.", avatarUrl: AV.m4 },
  // ── Spanish ──────────────────────────────────────────────────────────────────
  { id: "es1", name: "Sofia García",     language: "ES", gender: "female", age: "young",  style: ["Energetic", "Friendly", "Modern"],       description: "Great for contemporary art and modern exhibitions. Energetic and approachable.", avatarUrl: AV.f2 },
  { id: "es2", name: "Carlos Martínez",  language: "ES", gender: "male",   age: "adult",  style: ["Warm", "Authoritative", "Clear"],        description: "Strong, clear voice ideal for history museums and permanent heritage collections.", avatarUrl: AV.m1 },
  { id: "es3", name: "Isabel López",     language: "ES", gender: "female", age: "senior", style: ["Elegant", "Refined", "Calm"],            description: "Sophisticated presence perfect for fine arts, classical paintings and sculpture.", avatarUrl: AV.f5 },
  { id: "es4", name: "Alejandro González", language: "ES", gender: "male", age: "young",  style: ["Dynamic", "Engaging", "Vivid"],          description: "Vibrant delivery that captures the imagination — great for interactive and digital exhibits.", avatarUrl: AV.m3 },
  { id: "es5", name: "Carmen Rodríguez", language: "ES", gender: "female", age: "adult",  style: ["Expressive", "Storytelling", "Warm"],    description: "Gifted storyteller with a rich, expressive voice suited for narrative-led tours.", avatarUrl: AV.f4 },
  { id: "es6", name: "Miguel Hernández", language: "ES", gender: "male",   age: "senior", style: ["Scholarly", "Deep", "Measured"],         description: "Academic depth and gravitas, excellent for archaeological and anthropological collections.", avatarUrl: AV.m2 },
  { id: "es7", name: "Lucía Fernández",  language: "ES", gender: "female", age: "young",  style: ["Bright", "Natural", "Conversational"],   description: "Approachable and natural tone, great for family visits and discovery-led exhibits.", avatarUrl: AV.f3 },
  { id: "es8", name: "Pablo Sánchez",    language: "ES", gender: "male",   age: "adult",  style: ["Professional", "Confident", "Clear"],    description: "Reliable professional voice with clean diction for institutional and national museums.", avatarUrl: AV.m5 },
  { id: "es9", name: "Elena Ramírez",    language: "ES", gender: "female", age: "adult",  style: ["Smooth", "Inviting", "Melodic"],         description: "Smooth, melodic delivery that makes even dense historical content feel accessible.", avatarUrl: AV.f1 },
  // ── French ───────────────────────────────────────────────────────────────────
  { id: "fr1", name: "Jean Dupont",      language: "FR", gender: "male",   age: "senior", style: ["Calm", "Sophisticated", "Refined"],      description: "Perfect for classical art and fine arts museums. Sophisticated and refined tone.", avatarUrl: AV.m2 },
  { id: "fr2", name: "Marie Dubois",     language: "FR", gender: "female", age: "adult",  style: ["Clear", "Elegant", "Professional"],      description: "Crisp Parisian diction with an elegant bearing, suited for prestige cultural venues.", avatarUrl: AV.f4 },
  { id: "fr3", name: "Pierre Martin",    language: "FR", gender: "male",   age: "adult",  style: ["Warm", "Engaging", "Authoritative"],     description: "Warm authority ideal for history museums, impressionist collections and grand narratives.", avatarUrl: AV.m1 },
  { id: "fr4", name: "Camille Bernard",  language: "FR", gender: "female", age: "young",  style: ["Bright", "Modern", "Friendly"],          description: "Contemporary energy suited for modern art, design museums and younger audiences.", avatarUrl: AV.f3 },
  { id: "fr5", name: "Antoine Petit",    language: "FR", gender: "male",   age: "young",  style: ["Dynamic", "Vivid", "Confident"],         description: "Confident and vivid delivery — brings movement and life to narrative-driven exhibits.", avatarUrl: AV.m3 },
  { id: "fr6", name: "Isabelle Moreau",  language: "FR", gender: "female", age: "senior", style: ["Serene", "Scholarly", "Measured"],       description: "Serene and measured tone perfect for contemplative spaces: sculpture, impressionism, photography.", avatarUrl: AV.f5 },
  { id: "fr7", name: "François Simon",   language: "FR", gender: "male",   age: "adult",  style: ["Storytelling", "Deep", "Evocative"],     description: "Evocative storytelling voice that turns factual descriptions into memorable experiences.", avatarUrl: AV.m5 },
  { id: "fr8", name: "Chloé Laurent",    language: "FR", gender: "female", age: "adult",  style: ["Natural", "Inviting", "Smooth"],         description: "Natural and inviting delivery, excellent for interactive exhibitions and guided discovery.", avatarUrl: AV.f1 },
  { id: "fr9", name: "Olivier Lefebvre", language: "FR", gender: "male",   age: "adult",  style: ["Precise", "Clear", "Professional"],      description: "Precise diction and clean delivery suited for scientific, technical and natural history museums.", avatarUrl: AV.m4 },
  // ── German ───────────────────────────────────────────────────────────────────
  { id: "de1", name: "Klaus Schmidt",    language: "DE", gender: "male",   age: "adult",  style: ["Clear", "Precise", "Professional"],      description: "Excellent for technical and scientific museums. Clear and precise pronunciation.", avatarUrl: AV.m3 },
];

const mockPronunciations: Pronunciation[] = [
  {
    id: "p1",
    word: "Aphrodite",
    ipa: "/æˈfrɒd.ɪ.ti/",
    simplified: "af-ROD-it-ee",
    foundIn: ["Apollo Statue"],
    status: "pending",
  },
  {
    id: "p2",
    word: "Hellenistic",
    ipa: "/ˌhel.əˈnɪs.tɪk/",
    simplified: "hel-uh-NIS-tik",
    foundIn: ["Attic Amphora"],
    status: "pending",
  },
  {
    id: "p3",
    word: "tesserae",
    ipa: "/ˈtes.ər.iː/",
    simplified: "TES-er-ee",
    foundIn: ["Roman Mosaic"],
    status: "pending",
  },
];

const SCRIPT_LANGS = ["EN", "IT", "ES", "FR"] as const;
type ScriptLang = typeof SCRIPT_LANGS[number];
const LANG_LABELS: Record<ScriptLang, string> = { EN: "English", IT: "Italiano", ES: "Español", FR: "Français" };

export function VoiceTalent({ onPublish }: { onPublish?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<"script" | "pronunciations" | "catalog">("script");
  const [sourceLang, setSourceLang] = useState<ScriptLang>("EN");

  // Catalog state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [selectedVoiceForAssignment, setSelectedVoiceForAssignment] = useState<VoiceActor | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  // Language-aware voice assignments: lang → voice id
  const GUIDE_LANGUAGES = ["IT", "ES", "FR"];
  const LANG_NAMES: Record<string, string> = { IT: "Italian", ES: "Spanish", FR: "French", EN: "English", DE: "German" };
  const [activeCatalogLang, setActiveCatalogLang] = useState(GUIDE_LANGUAGES[0]);
  const [catalogAssignments, setCatalogAssignments] = useState<Record<string, string | null>>({
    IT: "it1", ES: "es1", FR: null,
  });

  // Pronunciations state
  const [pronunciations, setPronunciations] = useState<Pronunciation[]>(mockPronunciations);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [playingPron, setPlayingPron] = useState<string | null>(null);
  const [popover, setPopover] = useState<{ word: string; poiTitle: string; x: number; y: number } | null>(null);

  const pendingCount = pronunciations.filter((p) => p.status === "pending").length;

  const togglePlay = (voiceId: string) => {
    setPlayingVoice(playingVoice === voiceId ? null : voiceId);
    if (playingVoice !== voiceId) setTimeout(() => setPlayingVoice(null), 3000);
  };

  const togglePlayPron = (id: string) => {
    setPlayingPron(playingPron === id ? null : id);
    if (playingPron !== id) setTimeout(() => setPlayingPron(null), 2000);
  };


  const approvePronunciation = (id: string) => {
    setPronunciations((prev) => prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p)));
  };

  const startEdit = (p: Pronunciation) => {
    setEditingId(p.id);
    setEditValue(p.override ?? p.simplified);
  };

  const saveOverride = (id: string) => {
    setPronunciations((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "overridden", override: editValue } : p))
    );
    setEditingId(null);
    setEditValue("");
  };

  const handleWordClick = (e: React.MouseEvent, token: string, clean: string, poiTitle: string) => {
    if (!clean) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopover({ word: clean, poiTitle, x: rect.left, y: rect.bottom });
  };

  const addToReview = (word: string, poiTitle: string) => {
    setPronunciations((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, word, ipa: "—", simplified: "—", foundIn: [poiTitle], status: "pending" },
    ]);
    setPopover(null);
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Stepper */}
        {(() => {
          const steps: { key: "script" | "pronunciations" | "catalog"; label: string }[] = [
            { key: "script",         label: "Script" },
            { key: "pronunciations", label: "Pronunciations" },
            { key: "catalog",        label: "Voice Talent" },
          ];
          const activeIdx = steps.findIndex(s => s.key === activeTab);
          return (
            <div className="flex items-center gap-2 mb-8">
              {steps.map((step, i) => {
                const isActive   = step.key === activeTab;
                const isComplete = i < activeIdx;
                const isLast     = i === steps.length - 1;
                return (
                  <div key={step.key} className="flex items-center gap-2">
                    <button
                      onClick={() => isComplete && setActiveTab(step.key)}
                      disabled={!isComplete && !isActive}
                      className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
                        isActive
                          ? "text-zinc-900"
                          : isComplete
                          ? "text-zinc-500 hover:text-zinc-900 hover:underline underline-offset-2"
                          : "text-zinc-300 cursor-not-allowed"
                      }`}
                    >
                      <span className={`text-[11px] tabular-nums ${isActive ? "font-semibold" : ""}`}>
                        {isComplete ? "✓" : `${i + 1}.`}
                      </span>
                      {step.label}
                      {step.key === "pronunciations" && pendingCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-amber-400 text-white text-[10px] font-bold flex items-center justify-center leading-none">{pendingCount}</span>
                      )}
                    </button>
                    {!isLast && <span className="text-zinc-200 text-[12px]">·</span>}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ── Voice Catalog tab ── */}
        {activeTab === "catalog" && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Voice Talent</h1>
                <p className="text-[13px] text-zinc-500">Assign a voice for each language version of your guide</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all flex-shrink-0">
                <Upload className="size-4" />
                Upload Custom Voice
              </button>
            </div>

            {/* Language assignment tabs */}
            <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: `repeat(${GUIDE_LANGUAGES.length}, 1fr)` }}>
              {GUIDE_LANGUAGES.map(lang => {
                const assignedVoice = catalogAssignments[lang] ? mockVoices.find(v => v.id === catalogAssignments[lang]) : null;
                const isActive = activeCatalogLang === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setActiveCatalogLang(lang)}
                    className={`flex flex-col gap-1 p-4 rounded-xl border text-left transition-all ${
                      isActive ? "border-zinc-900 bg-zinc-50 shadow-sm" : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? "text-zinc-900" : "text-zinc-400"}`}>{lang}</span>
                      {assignedVoice
                        ? <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600"><Check className="size-2.5" />Assigned</span>
                        : <span className="text-[10px] text-zinc-300 font-medium">Unassigned</span>
                      }
                    </div>
                    <p className={`text-[12px] font-semibold truncate ${assignedVoice ? "text-zinc-800" : "text-zinc-300"}`}>
                      {assignedVoice ? assignedVoice.name : "— no voice yet"}
                    </p>
                    {assignedVoice && (
                      <p className="text-[10px] text-zinc-400">{LANG_NAMES[lang]} · {assignedVoice.gender}</p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search + gender filter */}
            <div className="mb-6 flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder={`Search ${LANG_NAMES[activeCatalogLang] ?? activeCatalogLang} voices…`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="neutral">Neutral</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Voice grid */}
            {(() => {
              const matchSearch = (v: VoiceActor) =>
                v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (filterGender === "all" || v.gender === filterGender);
              const primary   = mockVoices.filter(v => v.language === activeCatalogLang && matchSearch(v));
              const secondary = mockVoices.filter(v => v.language !== activeCatalogLang && matchSearch(v));
              const assignedId = catalogAssignments[activeCatalogLang];

              const VoiceCard = ({ voice, dimmed }: { voice: VoiceActor; dimmed?: boolean }) => {
                const isAssigned = assignedId === voice.id;
                return (
                  <div
                    className={`flex flex-col bg-white rounded-xl overflow-hidden transition-all p-6 ${
                      isAssigned
                        ? "border-2 border-emerald-400 shadow-md"
                        : "border border-zinc-200 hover:shadow-md hover:border-zinc-300"
                    } ${dimmed ? "opacity-40" : ""}`}
                    style={{ boxShadow: isAssigned ? undefined : "0 1px 3px 0 rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex justify-center mb-5">
                      <div className="relative">
                        <img src={voice.avatarUrl} alt={voice.name} className="size-28 rounded-full object-cover" />
                        <button
                          onClick={() => togglePlay(voice.id)}
                          className="absolute -bottom-1.5 -right-1.5 size-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-all shadow-lg"
                        >
                          {playingVoice === voice.id ? <Pause className="size-4 text-white" /> : <Play className="size-4 text-white ml-0.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-center flex-1 flex flex-col">
                      <h3 className="text-[15px] font-semibold text-zinc-900 mb-0.5">{voice.name}</h3>
                      <p className="text-[12px] text-zinc-400 mb-3">
                        {voice.language} · {voice.gender.charAt(0).toUpperCase() + voice.gender.slice(1)} · {voice.age.charAt(0).toUpperCase() + voice.age.slice(1)}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                        {voice.style.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[11px] font-semibold rounded-full">{tag}</span>
                        ))}
                      </div>
                      <p className="text-[13px] text-zinc-500 leading-relaxed mb-5">{voice.description}</p>
                      {isAssigned ? (
                        <div className="mt-auto flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 text-emerald-700 text-[13px] font-semibold rounded-lg border border-emerald-200">
                          <Check className="size-3.5" /> Assigned to {activeCatalogLang}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setCatalogAssignments(prev => ({ ...prev, [activeCatalogLang]: voice.id }));
                            setSelectedVoiceForAssignment(voice);
                          }}
                          className="mt-auto w-full px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all"
                        >
                          Assign to {activeCatalogLang}
                        </button>
                      )}
                    </div>
                  </div>
                );
              };

              return (
                <>
                  {primary.length === 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-[13px] font-semibold text-amber-800 mb-1">No {LANG_NAMES[activeCatalogLang] ?? activeCatalogLang} voices in the catalog</p>
                      <p className="text-[12px] text-amber-600">Upload a custom voice or pick one from another language below.</p>
                    </div>
                  )}

                  {primary.length > 0 && (
                    <div className="mb-10">
                      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                        {LANG_NAMES[activeCatalogLang] ?? activeCatalogLang} — {primary.length} voice{primary.length > 1 ? "s" : ""} available
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {primary.map(v => <VoiceCard key={v.id} voice={v} />)}
                      </div>
                    </div>
                  )}

                  {secondary.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-zinc-300 uppercase tracking-widest mb-4">Other languages</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {secondary.map(v => <VoiceCard key={v.id} voice={v} dimmed />)}
                      </div>
                    </div>
                  )}

                  {primary.length === 0 && secondary.length === 0 && (
                    <div className="text-center py-16">
                      <Mic className="size-12 text-zinc-300 mx-auto mb-4" />
                      <p className="text-[16px] font-semibold text-zinc-900 mb-2">No voices found</p>
                      <p className="text-[14px] text-zinc-500">Try adjusting your search or gender filter</p>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}

        {/* ── Pronunciations tab ── */}
        {activeTab === "pronunciations" && (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight">Pronunciations</h1>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[11px] font-semibold border border-zinc-200">
                    Source: {sourceLang}
                  </span>
                </div>
                <p className="text-[13px] text-zinc-500">
                  Words flagged here are protected from phonetic rewriting by the TTS engine across all target languages — proper names, technical terms and place names will retain their original pronunciation from {LANG_LABELS[sourceLang]}.
                </p>
              </div>
              {pendingCount === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-semibold rounded-full">
                  <CheckCircle2 className="size-4" /> All validated
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-[12px] font-semibold rounded-full">
                  <AlertCircle className="size-4" /> {pendingCount} pending
                </span>
              )}
            </div>

            <div className="space-y-3">
              {pronunciations.map((p) => {
                const isEditing = editingId === p.id;
                const isPlaying = playingPron === p.id;

                return (
                  <div
                    key={p.id}
                    className={`bg-white border rounded-xl px-5 py-4 transition-all ${
                      p.status === "approved" || p.status === "overridden"
                        ? "border-zinc-200 opacity-60"
                        : "border-zinc-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">

                      {/* Status dot */}
                      <div className={`mt-0.5 size-2 rounded-full flex-shrink-0 ${
                        p.status === "approved" ? "bg-emerald-500" :
                        p.status === "overridden" ? "bg-blue-500" : "bg-amber-400"
                      }`} />

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="text-[17px] font-semibold text-zinc-900">{p.word}</span>
                          <span className="text-[12px] text-zinc-400 font-mono">{p.ipa}</span>
                        </div>

                        {/* Simplified / override */}
                        <p className="text-[12px] text-zinc-500 mb-2">
                          {p.status === "overridden" && p.override
                            ? <><span className="text-blue-600 font-semibold">{p.override}</span> <span className="text-zinc-300">(custom)</span></>
                            : p.simplified}
                        </p>

                        {/* Found in */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.foundIn.map((name) => (
                            <span key={name} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[11px] font-medium rounded-full">
                              {name}
                            </span>
                          ))}
                        </div>

                        {/* Edit panel */}
                        {isEditing && (
                          <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden">
                            {/* Preview row */}
                            <button
                              onClick={() => togglePlayPron(p.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-zinc-200 text-left transition-colors ${isPlaying ? "bg-amber-50" : "hover:bg-zinc-100"}`}
                            >
                              <div className={`size-7 rounded-full flex items-center justify-center flex-shrink-0 ${isPlaying ? "bg-[#D33333] text-white" : "bg-zinc-200 text-zinc-500"}`}>
                                {isPlaying ? <Pause className="size-3" /> : <Volume2 className="size-3" />}
                              </div>
                              <span className="text-[12px] font-medium text-zinc-600">
                                {isPlaying ? "Listening to current TTS pronunciation…" : "Listen to current TTS pronunciation"}
                              </span>
                            </button>

                            {/* IPA reference */}
                            <div className="px-4 py-3 border-b border-zinc-200 flex items-center gap-2">
                              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Official phonetics</span>
                              <span className="text-[13px] font-mono text-zinc-700">{p.ipa}</span>
                            </div>

                            {/* Sounds-like input */}
                            <div className="px-4 py-3">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <label className="text-[11px] font-semibold text-zinc-500">
                                  How should it sound?
                                </label>
                                <a
                                  href="#pronunciation-guide"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open pronunciation guide"
                                  className="text-zinc-300 hover:text-zinc-500 transition-colors"
                                >
                                  <Info className="size-3" />
                                </a>
                              </div>
                              <input
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder={p.simplified !== "—" ? p.simplified : "e.g. af-ROD-it-ee"}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-[13px] text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                              />
                              <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed">
                                Use dashes to split syllables · CAPS for stress
                                <span className="text-zinc-300 mx-1">·</span>
                                e.g. <span className="font-mono text-zinc-500">Mi-kel-AN-je-lo</span>
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="px-4 pb-3 flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setEditingId(null); setEditValue(""); }}
                                className="px-3 py-1.5 text-[12px] font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveOverride(p.id)}
                                disabled={!editValue.trim()}
                                className="px-4 py-1.5 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all disabled:opacity-40"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {!isEditing && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Preview */}
                          <button
                            onClick={() => togglePlayPron(p.id)}
                            title="Preview pronunciation"
                            className={`size-8 rounded-full flex items-center justify-center transition-all ${
                              isPlaying
                                ? "bg-[#D33333] text-white"
                                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                            }`}
                          >
                            {isPlaying ? <Pause className="size-3.5" /> : <Volume2 className="size-3.5" />}
                          </button>

                          {p.status === "pending" ? (
                            <>
                              <button
                                onClick={() => startEdit(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 transition-all"
                              >
                                <Pencil className="size-3" /> Edit
                              </button>
                              <button
                                onClick={() => approvePronunciation(p.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all"
                              >
                                <Check className="size-3" /> Approve
                              </button>
                            </>
                          ) : (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                              p.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                            }`}>
                              {p.status === "approved" ? "Approved" : "Overridden"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {pronunciations.length === 0 && (
              <div className="text-center py-16">
                <CheckCircle2 className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">No words to review</h3>
                <p className="text-[14px] text-zinc-500">All pronunciations look good.</p>
              </div>
            )}

            {/* Next step */}
            <div className="mt-10 pt-8 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setActiveTab("script")}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 text-zinc-600 text-[13px] font-medium rounded-xl hover:bg-zinc-50 transition-all"
              >
                <ArrowRight className="size-4 rotate-180" />
                Back: Script
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
              >
                Next: Assign Voice
                <ArrowRight className="size-4" />
              </button>
            </div>
          </>
        )}

        {/* ── Script tab ── */}
        {activeTab === "script" && (
          <>
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Audio Script</h1>
                <p className="text-[13px] text-zinc-500 mb-3">
                  Click any word to flag it for pronunciation review. Flagged words will be protected from phonetic alteration when the TTS (ElevenLabs / Polly) reads the translations — useful for proper names, technical terms, and place names.
                </p>
                {/* Source language selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Source</span>
                  <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
                    {SCRIPT_LANGS.map(l => (
                      <button
                        key={l}
                        onClick={() => setSourceLang(l)}
                        title={LANG_LABELS[l]}
                        className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all ${
                          sourceLang === l
                            ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                            : "text-zinc-400 hover:text-zinc-700"
                        }`}
                      >{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 flex-shrink-0 pt-1">
                {[
                  { color: "bg-amber-400", label: "Pending" },
                  { color: "bg-emerald-500", label: "Approved" },
                  { color: "bg-blue-500", label: "Overridden" },
                ].map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                    <span className={`w-4 h-0.5 rounded inline-block ${color}`} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {mockPOIs.map((poi) => (
                <div
                  key={poi.id}
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}
                >
                  <div className="px-6 py-3.5 border-b border-zinc-100 bg-zinc-50 flex items-center gap-3">
                    <h3 className="text-[13px] font-semibold text-zinc-900">{poi.title}</h3>
                    <span className="text-[11px] text-zinc-400">
                      {poi.body.split(" ").length} words
                    </span>
                  </div>
                  <p className="px-6 py-5 text-[14px] text-zinc-700 leading-relaxed">
                    {poi.body.split(" ").map((token, i) => {
                      const clean = stripPunctuation(token);
                      if (!clean) return <span key={i}>{token} </span>;
                      const pron = pronunciations.find((p) => p.word.toLowerCase() === clean);
                      const underlineCls = pron
                        ? pron.status === "pending"
                          ? "underline decoration-amber-400 decoration-2"
                          : pron.status === "approved"
                          ? "underline decoration-emerald-500 decoration-2"
                          : "underline decoration-blue-500 decoration-2"
                        : "";
                      return (
                        <span key={i}>
                          <span
                            onClick={(e) => handleWordClick(e, token, clean, poi.title)}
                            className={`cursor-pointer rounded px-0.5 -mx-0.5 hover:bg-zinc-100 transition-colors ${underlineCls}`}
                          >
                            {token}
                          </span>{" "}
                        </span>
                      );
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Next step */}
            <div className="mt-10 pt-8 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-[13px] text-zinc-400">Step 1 of 3 · Reviewed? Move to pronunciation check.</p>
              <button
                onClick={() => setActiveTab("pronunciations")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
              >
                Next: Pronunciations
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Popover */}
            {popover && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />
                <div
                  className="fixed z-50 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 w-60"
                  style={{ left: popover.x, top: popover.y + 6 }}
                >
                  {(() => {
                    const existing = pronunciations.find(
                      (p) => p.word.toLowerCase() === popover.word.toLowerCase()
                    );
                    return (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[15px] font-semibold text-zinc-900 capitalize">{popover.word}</span>
                          <button onClick={() => setPopover(null)} className="text-zinc-400 hover:text-zinc-700">
                            <X className="size-4" />
                          </button>
                        </div>

                        {existing ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                existing.status === "pending" ? "bg-amber-50 text-amber-700" :
                                existing.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                                "bg-blue-50 text-blue-700"
                              }`}>
                                {existing.status.charAt(0).toUpperCase() + existing.status.slice(1)}
                              </span>
                              {existing.ipa !== "—" && (
                                <span className="text-[11px] text-zinc-400 font-mono">{existing.ipa}</span>
                              )}
                            </div>
                            {(existing.override ?? existing.simplified) !== "—" && (
                              <p className="text-[12px] text-zinc-500 mb-3">{existing.override ?? existing.simplified}</p>
                            )}
                            {existing.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { approvePronunciation(existing.id); setPopover(null); }}
                                  className="flex-1 py-1.5 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all"
                                >
                                  <Check className="size-3 inline mr-1" />Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveTab("pronunciations");
                                    setEditingId(existing.id);
                                    setEditValue(existing.override ?? existing.simplified);
                                    setPopover(null);
                                  }}
                                  className="flex-1 py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-700 rounded-lg hover:bg-zinc-50 transition-all"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                            {existing.status !== "pending" && (
                              <button
                                onClick={() => setPopover(null)}
                                className="w-full py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 transition-all"
                              >
                                Close
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-[12px] text-zinc-500 mb-3">
                              Not in review. Add it to check how the voice will pronounce it.
                            </p>
                            <button
                              onClick={() => addToReview(popover.word, popover.poiTitle)}
                              className="w-full py-2 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all"
                            >
                              + Add to review
                            </button>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {selectedVoiceForAssignment && (
        <VoiceGenerationModal
          voice={selectedVoiceForAssignment}
          onClose={() => setSelectedVoiceForAssignment(null)}
          onPublish={GUIDE_LANGUAGES.every(lang => catalogAssignments[lang] != null) ? onPublish : undefined}
        />
      )}
    </PageShell>
  );
}
