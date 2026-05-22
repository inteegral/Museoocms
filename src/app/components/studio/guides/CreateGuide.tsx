import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  ArrowLeft, Upload, Sparkles, X, Wand2, FileText,
  Loader2, Users, Baby, GraduationCap, Eye, Church, Plus, Search, Check,
} from "lucide-react";
import { languages, mockDocuments, mockPOIs } from "../../../data/mockData";

type Language = "it" | "en" | "fr" | "de" | "es";
type Target = "generic" | "kids" | "experts" | "disabilities" | "pilgrims" | "other";
type Tone = "" | "formal" | "informal" | "narrative" | "educational" | "playful";

type AccessType = "free" | "paid" | null;

interface ItineraryConfig {
  name: string;
  description: string;
  accessType: AccessType;
  language: Language;
  files: UploadedFile[];
  useAllDocs: boolean;
  selectedDocIds: string[];
  useMuseoo: boolean | null;
  target: Target | null;
  targetDescription: string;
  tone: Tone;
  avgPoiLength: number;
  generateQuiz: boolean | null;
  extraInfo: string;
}

interface UploadedFile { name: string; size: number }

interface CoCuratorSuggestion {
  target?: Target;
  tone?: Tone;
  useMuseoo?: boolean;
  generateQuiz?: boolean;
}


const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: "narrative",    label: "Narrative",    desc: "Storytelling, evocative" },
  { value: "informal",     label: "Informal",     desc: "Conversational, warm" },
  { value: "educational",  label: "Educational",  desc: "Didactic, structured" },
  { value: "formal",       label: "Formal",       desc: "Academic, rigorous" },
  { value: "playful",      label: "Playful",      desc: "Fun, engaging" },
];

const TARGETS: { value: Target; label: string; desc: string; Icon: React.ElementType }[] = [
  {
    value: "generic",
    label: "Generic adults",
    desc: "Adults with a general interest in culture. Clear, engaging language without excessive technical jargon.",
    Icon: Users,
  },
  {
    value: "kids",
    label: "Kids & families",
    desc: "Families with children aged 6–12. Simple, fun, interactive language with storytelling elements.",
    Icon: Baby,
  },
  {
    value: "experts",
    label: "Art experts",
    desc: "Art historians, critics, curators. Technical language welcome, in-depth analysis, citations.",
    Icon: GraduationCap,
  },
  {
    value: "disabilities",
    label: "Disabilities",
    desc: "Inclusive language, accessible descriptions of visual elements, adapted timing.",
    Icon: Eye,
  },
  {
    value: "pilgrims",
    label: "Christian pilgrims",
    desc: "Religious and spiritual focus. References to faith, traditions, sacred significance of works.",
    Icon: Church,
  },
  { value: "other", label: "Other...", desc: "", Icon: Plus },
];

const GEN_STEPS = [
  "Analyzing your sources",
  "Structuring the narrative",
  "Generating POI stubs",
  "Finalizing your guide",
];

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3 px-1">
      {children}
    </p>
  );
}

function SuggestionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs font-medium text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-full">{value}</span>
    </div>
  );
}

export function CreateGuide() {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingFiles = (location.state as { catalogueFiles?: { name: string; size: number }[]; catalogueIdea?: string } | null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<ItineraryConfig>({
    name: "",
    description: incomingFiles?.catalogueIdea ?? "",
    accessType: null,
    language: "it",
    files: incomingFiles?.catalogueFiles ?? [],
    useAllDocs: false,
    selectedDocIds: [],
    useMuseoo: null,
    target: null,
    targetDescription: "",
    tone: "",
    avgPoiLength: 250,
    generateQuiz: null,
    extraInfo: "",
  });

  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [showCoCurator, setShowCoCurator] = useState(true);
  const [coCuratorInput, setCoCuratorInput] = useState("");
  const [coCuratorPhase, setCoCuratorPhase] = useState<"idle" | "processing" | "done">("idle");
  const [suggestion, setSuggestion] = useState<CoCuratorSuggestion | null>(null);
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());

  const handleFilesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    setConfig((c) => ({ ...c, files: [...c.files, ...dropped.map((f) => ({ name: f.name, size: f.size }))] }));
  };

  const handleFilesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    setConfig((c) => ({ ...c, files: [...c.files, ...picked.map((f) => ({ name: f.name, size: f.size }))] }));
  };

  const handleTargetChange = (t: Target) => {
    setConfig((c) => ({
      ...c,
      target: t,
      targetDescription: t !== "other" ? TARGETS.find((x) => x.value === t)!.desc : "",
    }));
  };

  const analyzeCoCurator = () => {
    if (!coCuratorInput.trim()) return;
    setCoCuratorPhase("processing");
    setTimeout(() => {
      const lower = coCuratorInput.toLowerCase();
      const detectedTarget: Target =
        lower.includes("famig") || lower.includes("bamb") || lower.includes("kid") ? "kids"
        : lower.includes("espert") || lower.includes("storico") || lower.includes("expert") ? "experts"
        : lower.includes("pelleg") || lower.includes("religio") || lower.includes("pilgr") ? "pilgrims"
        : lower.includes("disab") || lower.includes("accessib") ? "disabilities"
        : "generic";
      const detectedTone: Tone =
        lower.includes("serio") || lower.includes("formal") ? "formal"
        : lower.includes("leggero") || lower.includes("divert") || lower.includes("fun") || lower.includes("playful") ? "playful"
        : lower.includes("raccont") || lower.includes("narrat") || lower.includes("stori") ? "narrative"
        : lower.includes("didatt") || lower.includes("educat") ? "educational"
        : "informal";
      setSuggestion({
        target: detectedTarget,
        tone: detectedTone,
        useMuseoo: !(lower.includes("solo") && lower.includes("material")),
        generateQuiz: lower.includes("quiz") || lower.includes("interatt"),
      });
      setCoCuratorPhase("done");
    }, 1600);
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    const fields = new Set<string>();
    setConfig((c) => {
      const next = { ...c };
      if (suggestion.target) {
        next.target = suggestion.target;
        next.targetDescription = TARGETS.find((x) => x.value === suggestion.target)!.desc;
        fields.add("target");
      }
      if (suggestion.tone)              { next.tone = suggestion.tone;             fields.add("tone"); }
      if (suggestion.useMuseoo != null)  { next.useMuseoo = suggestion.useMuseoo;   fields.add("museoo"); }
      if (suggestion.generateQuiz != null){ next.generateQuiz = suggestion.generateQuiz; fields.add("quiz"); }
      return next;
    });
    setHighlightedFields(fields);
    setTimeout(() => setHighlightedFields(new Set()), 2000);
    setCoCuratorPhase("idle");
    setSuggestion(null);
    setCoCuratorInput("");
  };

  const hl = (field: string) =>
    highlightedFields.has(field) ? "ring-2 ring-violet-300 ring-offset-1" : "";

  const handleGenerate = () => {
    if (!config.name.trim()) return;
    setGenerating(true);
    setGenStep(0);
    setTimeout(() => setGenStep(1), 700);
    setTimeout(() => setGenStep(2), 1400);
    setTimeout(() => setGenStep(3), 2000);
    setTimeout(() => {
      const librarySources = config.useAllDocs
        ? mockDocuments.map((d) => ({ name: d.filename, type: "library" as const }))
        : config.selectedDocIds.map((id) => {
            const doc = mockDocuments.find((d) => d.id === id);
            return { name: doc?.filename ?? id, type: "library" as const };
          });
      const uploadedSources = config.files.map((f) => ({ name: f.name, type: "uploaded" as const }));
      navigate("/guides/guide-1", {
        state: {
          generatedName: config.name,
          generatedDescription: config.description,
          generatedPOIs: mockPOIs.slice(0, 5),
          sources: [...librarySources, ...uploadedSources],
        },
      });
    }, 2700);
  };

  return (
    <div className="flex">

      {/* ── Main form ─────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/guides" className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-sm transition-colors">
              <ArrowLeft className="size-4" /> Back
            </Link>
            <div className="h-4 w-px bg-zinc-200" />
            <div>
              <h1 className="text-base font-semibold text-zinc-900 leading-tight">New audio guide</h1>
              <p className="text-xs text-zinc-400">Configure your itinerary before generating content</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!showCoCurator && (
              <button
                onClick={() => setShowCoCurator(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors border border-violet-200"
              >
                <Wand2 className="size-3.5" /> Co-curator
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={!config.name.trim()}
              className="px-5 py-2 text-sm bg-[#D33333] text-white rounded-lg hover:bg-[#b82c2c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate →
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="px-8 py-10 space-y-8 max-w-3xl mx-auto">

          {/* ── Block 0: Guide name ─────────────────────── */}
          <div>
            <SectionLabel>Guide</SectionLabel>
            <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
              <label className="block">
                <p className="text-sm font-medium text-zinc-800 mb-2">Guide name <span className="text-red-400">*</span></p>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig((c) => ({ ...c, name: e.target.value }))}
                  placeholder="e.g. Complete Museum Tour, Renaissance Highlights..."
                  className="w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-800 placeholder:text-zinc-300"
                />
              </label>
              <label className="block mt-4">
                <p className="text-sm font-medium text-zinc-800 mb-2">Description <span className="text-zinc-400 font-normal text-xs">optional</span></p>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig((c) => ({ ...c, description: e.target.value }))}
                  rows={3}
                  placeholder="What should this guide cover? Who is it for? Any specific focus or narrative you have in mind..."
                  className="w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-700 placeholder:text-zinc-300 resize-none"
                />
              </label>
            </div>
          </div>

          {/* ── Block 2: Narrative style ────────────────── */}
          <div>
            <SectionLabel>Narrative style</SectionLabel>
            <div className="space-y-3">

              {/* Target + Tone — single card, two columns */}
              <div className={`bg-white rounded-xl border border-zinc-200 px-5 py-4 transition-all ${hl("target")} ${hl("tone")}`}>
                <div className="flex gap-6">

                  {/* Left: Target */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 mb-3">Visitor target</p>
                    <div className="flex flex-col gap-1">
                      {TARGETS.map(({ value, label, Icon }) => {
                        const active = config.target === value;
                        return (
                          <button
                            key={value}
                            onClick={() => handleTargetChange(value)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all ${
                              active
                                ? "border-zinc-900 bg-[#D33333] text-white"
                                : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                          >
                            <Icon className="size-3.5 flex-shrink-0" />
                            <span className="text-xs font-medium">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {config.target && (
                      <textarea
                        value={config.targetDescription}
                        onChange={(e) => setConfig((c) => ({ ...c, targetDescription: e.target.value }))}
                        rows={2}
                        placeholder="Describe the target audience..."
                        className="w-full mt-2 text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none text-zinc-600 placeholder:text-zinc-300 bg-zinc-50"
                      />
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-px bg-zinc-100 self-stretch" />

                  {/* Right: Tone */}
                  <div className="w-40 flex-shrink-0">
                    <p className="text-sm font-medium text-zinc-800 mb-3">Tone of voice</p>
                    <div className="flex flex-col gap-1">
                      {TONES.map(({ value, label, desc }) => {
                        const active = config.tone === value;
                        return (
                          <button
                            key={value}
                            onClick={() => setConfig((c) => ({ ...c, tone: value }))}
                            title={desc}
                            className={`px-3 py-2 text-xs rounded-lg border text-left transition-all ${
                              active
                                ? "border-zinc-900 bg-[#D33333] text-white"
                                : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    {config.tone && (
                      <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                        {TONES.find((t) => t.value === config.tone)?.desc}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* POI length */}
              <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">Average POI length</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Suggested 200–300 words</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-semibold text-zinc-900 tabular-nums">{config.avgPoiLength}</span>
                    <span className="text-xs text-zinc-400 ml-1">words</span>
                    <p className="text-xs text-zinc-400 tabular-nums">≈ {Math.floor(config.avgPoiLength / 130)}m {Math.round((config.avgPoiLength % 130) / 130 * 60)}s</p>
                  </div>
                </div>
                <input
                  type="range" min={80} max={600} step={10}
                  value={config.avgPoiLength}
                  onChange={(e) => setConfig((c) => ({ ...c, avgPoiLength: Number(e.target.value) }))}
                  className="w-full accent-zinc-900"
                />
                <div className="flex justify-between text-[10px] text-zinc-300 mt-1">
                  <span>80</span><span>600</span>
                </div>
              </div>

              {/* Sources — library + upload */}
              <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">Sources <span className="text-zinc-400 font-normal text-xs ml-1">optional</span></p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {config.useAllDocs
                        ? `All ${mockDocuments.length} documents selected`
                        : (() => {
                            const total = config.selectedDocIds.length + config.files.length;
                            return total > 0 ? `${total} source${total > 1 ? "s" : ""} added` : "No sources added";
                          })()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDocModal(true)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
                    >
                      <FileText className="size-3.5" /> Browse
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
                    >
                      <Upload className="size-3.5" /> Upload
                    </button>
                    <input ref={fileInputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={handleFilesInput} />
                  </div>
                </div>

                {/* Selected library docs */}
                {!config.useAllDocs && config.selectedDocIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {config.selectedDocIds.map((id) => {
                      const doc = mockDocuments.find((d) => d.id === id);
                      if (!doc) return null;
                      return (
                        <span key={id} className="flex items-center gap-1 text-[11px] bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md">
                          <span className="truncate max-w-[140px]">{doc.filename}</span>
                          <button
                            onClick={() => setConfig((c) => ({ ...c, selectedDocIds: c.selectedDocIds.filter((i) => i !== id) }))}
                            className="text-zinc-400 hover:text-red-400 transition-colors ml-0.5"
                          >
                            <X className="size-2.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Uploaded files */}
                {config.files.length > 0 && (
                  <div className="space-y-1.5">
                    {config.files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-zinc-50 rounded-lg">
                        <FileText className="size-3.5 text-zinc-400 flex-shrink-0" />
                        <span className="text-xs text-zinc-700 flex-1 truncate">{f.name}</span>
                        <span className="text-xs text-zinc-400">{formatBytes(f.size)}</span>
                        <button onClick={() => setConfig((c) => ({ ...c, files: c.files.filter((_, j) => j !== i) }))} className="text-zinc-300 hover:text-red-400 transition-colors">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drag & drop zone — only when no files yet */}
                {config.files.length === 0 && config.selectedDocIds.length === 0 && !config.useAllDocs && (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFilesDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-100 rounded-lg py-4 px-4 text-center cursor-pointer hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                  >
                    <p className="text-xs text-zinc-400">or drag PDF files here</p>
                  </div>
                )}
              </div>

              {/* Extra info */}
              <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
                <p className="text-sm font-medium text-zinc-800 mb-1">Other useful information <span className="text-zinc-400 font-normal text-xs">optional</span></p>
                <p className="text-xs text-zinc-400 mb-3">Themes to emphasize, elements to avoid, special requests...</p>
                <textarea
                  value={config.extraInfo}
                  onChange={(e) => setConfig((c) => ({ ...c, extraInfo: e.target.value }))}
                  rows={3}
                  placeholder="e.g. Focus on the Baroque period, avoid religious themes, keep it concise."
                  className="w-full text-xs px-3 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none text-zinc-700 placeholder:text-zinc-300"
                />
              </div>
            </div>
          </div>

          {/* ── Block 1: Sources ───────────────────────── */}
          <div>
            <SectionLabel>Sources</SectionLabel>
            <div className="space-y-3">

              {/* Language */}
              <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
                <p className="text-sm font-medium text-zinc-800 mb-3">Initial itinerary language</p>
                <select
                  value={config.language}
                  onChange={(e) => setConfig((c) => ({ ...c, language: e.target.value as Language }))}
                  className="w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-lg bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* ── Block 0b: Access type ───────────────────── */}
          <div>
            <SectionLabel>Access type</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "free" as AccessType, label: "Free access", desc: "Universal QR code, open to all visitors." },
                { value: "paid" as AccessType, label: "Paid access", desc: "Unique QR per visitor. Set your price at publish." },
              ] as { value: AccessType; label: string; desc: string }[]).map(({ value, label, desc }) => {
                const active = config.accessType === value;
                return (
                  <button
                    key={String(value)}
                    onClick={() => setConfig((c) => ({ ...c, accessType: value }))}
                    className={`text-left px-4 py-4 rounded-xl border transition-all ${
                      active ? "border-zinc-900 bg-[#D33333] text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    <p className={`text-sm font-semibold mb-1 ${active ? "text-white" : "text-zinc-800"}`}>{label}</p>
                    <p className={`text-xs leading-relaxed ${active ? "text-zinc-300" : "text-zinc-400"}`}>{desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Block 3: Museoo AI ──────────────────────── */}
          <div>
            <SectionLabel>AI enrichment</SectionLabel>
            <div className={`bg-white rounded-xl border border-zinc-200 px-5 py-4 transition-all ${hl("museoo")}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="size-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800">Enrich with Museoo</p>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Museoo searches online sources and uses its cultural knowledge to enrich your content beyond what's in your documents.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 mt-0.5">
                  {([true, false] as const).map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => setConfig((c) => ({ ...c, useMuseoo: v }))}
                      className={`px-4 py-1.5 text-xs rounded-lg border transition-all ${
                        config.useMuseoo === v
                          ? "border-zinc-900 bg-[#D33333] text-white"
                          : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                      }`}
                    >
                      {v ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Co-curator panel ──────────────────────────── */}
      {showCoCurator && (
        <aside className="w-72 flex-shrink-0 border-l border-zinc-200 bg-zinc-50 flex flex-col sticky top-0 self-start h-screen overflow-hidden">
          <div className="px-4 py-4 border-b border-zinc-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-violet-100 flex items-center justify-center">
                <Wand2 className="size-3 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-800">Co-curator</p>
                <p className="text-[10px] text-zinc-400">Describe → auto-fill</p>
              </div>
            </div>
            <button onClick={() => setShowCoCurator(false)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Describe your tour freely — audience, mood, themes. The co-curator will suggest the right settings.
            </p>
            <textarea
              value={coCuratorInput}
              onChange={(e) => setCoCuratorInput(e.target.value)}
              disabled={coCuratorPhase === "processing"}
              rows={6}
              placeholder={`"A relaxed family tour on the Renaissance, with quizzes for kids, informal tone..."`}
              className="w-full text-xs px-3 py-2.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none text-zinc-700 placeholder:text-zinc-300 disabled:opacity-50"
            />
            <button
              onClick={analyzeCoCurator}
              disabled={!coCuratorInput.trim() || coCuratorPhase === "processing"}
              className="w-full py-2 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {coCuratorPhase === "processing"
                ? <><Loader2 className="size-3 animate-spin" /> Analyzing...</>
                : <><Sparkles className="size-3" /> Analyze & suggest</>}
            </button>

            {coCuratorPhase === "done" && suggestion && (
              <div className="bg-white rounded-xl border border-violet-200 p-3 space-y-2.5">
                <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-wide">Detected settings</p>
                <div className="space-y-1.5">
                  {suggestion.target && (
                    <SuggestionRow label="Target" value={TARGETS.find((t) => t.value === suggestion.target)?.label ?? ""} />
                  )}
                  {suggestion.tone && (
                    <SuggestionRow label="Tone" value={TONES.find((t) => t.value === suggestion.tone)?.label ?? ""} />
                  )}
                  {suggestion.useMuseoo != null && (
                    <SuggestionRow label="Museoo" value={suggestion.useMuseoo ? "Yes" : "No"} />
                  )}
                  {suggestion.generateQuiz != null && (
                    <SuggestionRow label="Quiz" value={suggestion.generateQuiz ? "Yes" : "No"} />
                  )}
                </div>
                <button onClick={applySuggestion} className="w-full py-2 text-xs bg-[#D33333] text-white rounded-lg hover:bg-[#b82c2c] transition-colors">
                  Apply to form
                </button>
                <button
                  onClick={() => { setCoCuratorPhase("idle"); setSuggestion(null); }}
                  className="w-full py-1 text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-zinc-200 bg-white">
            <p className="text-[10px] text-zinc-400 text-center">You can still edit every field manually.</p>
          </div>
        </aside>
      )}

      {/* ── Generation loading overlay ─────────────── */}
      {generating && (
        <div className="fixed inset-0 z-50 bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-zinc-100 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-zinc-900 transition-all duration-500 ease-out"
                style={{ width: `${((genStep + 1) / GEN_STEPS.length) * 100}%` }}
              />
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="size-10 bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Loader2 className="size-5 text-white animate-spin" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] text-zinc-400 mb-0.5">Generating your guide</p>
                  <p className="text-[15px] font-semibold text-zinc-950 leading-tight truncate">{config.name}</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {GEN_STEPS.map((label, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`size-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      i < genStep
                        ? "bg-emerald-500 border-emerald-500"
                        : i === genStep
                        ? "bg-zinc-900"
                        : "bg-zinc-100"
                    }`}>
                      {i < genStep
                        ? <Check className="size-3 text-white" />
                        : i === genStep
                        ? <Loader2 className="size-3 text-white animate-spin" />
                        : null}
                    </div>
                    <span className={`text-[13px] transition-colors duration-300 ${
                      i < genStep ? "text-zinc-400" : i === genStep ? "text-zinc-900 font-medium" : "text-zinc-300"
                    }`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Document library modal ─────────────────── */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDocModal(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <p className="text-sm font-semibold text-zinc-900">Document library</p>
              <button onClick={() => setShowDocModal(false)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                <X className="size-4" />
              </button>
            </div>

            {/* Use all toggle */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
              <p className="text-xs text-zinc-600">Use all documents</p>
              <button
                onClick={() => setConfig((c) => ({ ...c, useAllDocs: !c.useAllDocs, selectedDocIds: [] }))}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-9 h-5 rounded-full flex items-center px-[3px] transition-colors duration-300"
                  style={{ background: config.useAllDocs ? '#3f3f46' : '#e4e4e7' }}
                >
                  <span
                    className="size-[14px] rounded-full bg-white shadow-sm transition-transform duration-300"
                    style={{ transform: config.useAllDocs ? 'translateX(16px)' : 'translateX(0)' }}
                  />
                </div>
              </button>
            </div>

            {/* Search */}
            {!config.useAllDocs && (
              <div className="px-5 py-3 border-b border-zinc-100">
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-200">
                  <Search className="size-3.5 text-zinc-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Search documents..."
                    className="flex-1 text-xs bg-transparent focus:outline-none text-zinc-700 placeholder:text-zinc-400"
                    autoFocus
                  />
                  {docSearch && (
                    <button onClick={() => setDocSearch("")} className="text-zinc-300 hover:text-zinc-500">
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Doc list */}
            {!config.useAllDocs && (
              <div className="overflow-y-auto max-h-72 px-3 py-2">
                {mockDocuments
                  .filter((d) => d.filename.toLowerCase().includes(docSearch.toLowerCase()))
                  .map((doc) => {
                    const selected = config.selectedDocIds.includes(doc.id);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setConfig((c) => ({
                          ...c,
                          selectedDocIds: selected
                            ? c.selectedDocIds.filter((id) => id !== doc.id)
                            : [...c.selectedDocIds, doc.id],
                        }))}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-zinc-50 ${selected ? "bg-zinc-50" : ""}`}
                      >
                        <div className={`size-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${selected ? "bg-zinc-900 border-zinc-900" : "border-zinc-300"}`}>
                          {selected && <Check className="size-3 text-white" />}
                        </div>
                        <FileText className="size-3.5 text-zinc-400 flex-shrink-0" />
                        <span className="text-xs text-zinc-700 flex-1 truncate">{doc.filename}</span>
                        <span className="text-xs text-zinc-400 flex-shrink-0">{doc.size}</span>
                      </button>
                    );
                  })}
              </div>
            )}

            {/* All docs selected state */}
            {config.useAllDocs && (
              <div className="px-5 py-8 text-center">
                <p className="text-xs text-zinc-500">All {mockDocuments.length} documents will be used as source material.</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                {config.useAllDocs ? `All ${mockDocuments.length} selected` : `${config.selectedDocIds.length} selected`}
              </p>
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 text-xs bg-[#D33333] text-white rounded-lg hover:bg-[#b82c2c] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
