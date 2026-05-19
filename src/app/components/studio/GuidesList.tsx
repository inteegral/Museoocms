import { Link, useNavigate, useLocation } from "react-router";
import { Plus, LayoutGrid, List, PenLine, Copy, Sparkles, GitFork, X, Smartphone, ChevronRight, Calendar, Ticket, Unlock, Upload, FileText, BookOpen } from "lucide-react";
import { PageShell } from "./PageShell";
import { mockGuides, mockDocuments } from "../../data/mockData";
import { useState, useEffect, useRef } from "react";
import { GuidePreviewModal } from "./GuidePreviewModal";

const NEW_GUIDE_PATHS = [
  {
    id: "scratch",
    icon: PenLine,
    title: "Create from scratch",
    desc: "Build your itinerary step by step, adding stops manually.",
  },
  {
    id: "adapt",
    icon: Copy,
    title: "Adapt an existing itinerary",
    desc: "Start from one of your guides and reshape it for a new purpose.",
  },
  {
    id: "variant",
    icon: GitFork,
    title: "Create a variant",
    desc: "Branch off a published guide — different language, audience, or length.",
  },
];

type MockGuide = (typeof mockGuides)[number];

const LANG_COLOR: Record<string, string> = {
  it: "#16a34a",
  en: "#2563eb",
  fr: "#7c3aed",
  de: "#d97706",
  es: "#dc2626",
};

function LangDot({ lang, primary }: { lang: string; primary?: boolean }) {
  return (
    <span
      className={`size-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${
        primary ? "bg-[#D33333] text-white" : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {lang.toUpperCase()}
    </span>
  );
}

function AccessBadge({ guide }: { guide: MockGuide }) {
  const isPaid = guide.accessMode === "paid";
  const used  = isPaid ? (guide.codesUsed    ?? 0) : (guide.accessesUsed   ?? 0);
  const total = isPaid ? (guide.codesTotal   ?? 0) : (guide.accessesLimit  ?? 0);
  const remaining = total - used;
  const pct = total ? Math.round((used / total) * 100) : 0;
  const isLow = total ? remaining / total < 0.15 : false;
  const barColor = isLow ? "#f59e0b" : isPaid ? "#8b5cf6" : "#10b981";
  const unit = "accesses";

  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold self-start ${
        isPaid
          ? "bg-violet-50 text-violet-700 border border-violet-100"
          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
      }`}>
        {isPaid
          ? <Ticket className="size-2.5" strokeWidth={2} />
          : <Unlock className="size-2.5" strokeWidth={2} />}
        {isPaid ? "Paid access" : "Free access"}
      </span>
      <div className="flex items-center gap-1.5">
        <div className="w-14 h-1.5 bg-zinc-100 rounded-full overflow-hidden flex-shrink-0">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
        </div>
        <span className={`text-[10px] font-medium tabular-nums ${isLow ? "text-amber-600" : "text-zinc-400"}`}>
          {remaining.toLocaleString()} / {total.toLocaleString()} {unit}
        </span>
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

type Filter = "all" | "in-progress" | "under-revision" | "complete";
type ViewMode = "grid" | "list";

const statusConfig = {
  "in-progress":    { label: "In Progress",    dot: "bg-blue-400",    text: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200" },
  "under-revision": { label: "Under Revision",  dot: "bg-amber-400",   text: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" },
  "complete":       { label: "Complete",         dot: "bg-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
};

const phaseConfig: Record<string, { label: string; dot: string; text: string }> = {
  scripting:   { label: "Scripting",   dot: "bg-zinc-400",    text: "text-zinc-500"    },
  translating: { label: "Translation", dot: "bg-sky-400",     text: "text-sky-600"     },
  voicing:     { label: "Voicing",     dot: "bg-violet-400",  text: "text-violet-600"  },
  review:      { label: "Review",      dot: "bg-emerald-400", text: "text-emerald-600" },
};


function GridCard({ guide, onPreview }: { guide: MockGuide; onPreview: () => void }) {
  const es = statusConfig[guide.editorialStatus];
  return (
    <div className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:border-zinc-200 hover:shadow-lg transition-all duration-300 flex flex-col" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
      {/* Thumbnail */}
      <div className="relative h-44 bg-zinc-100 overflow-hidden">
        <img
          src={guide.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <button
          onClick={e => { e.preventDefault(); onPreview(); }}
          title="Anteprima visitatore"
          className="absolute bottom-3 right-3 size-8 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
        >
          <Smartphone className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <h3 className="text-[14px] font-semibold text-zinc-900 leading-snug tracking-tight mb-1">
          {guide.title}
        </h3>
        <p className="text-[12px] text-zinc-400 line-clamp-2 leading-relaxed mb-5 flex-1">
          {guide.description}
        </p>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`flex items-center gap-1.5 text-[11px] font-medium ${es.text}`}>
                <span className={`size-1.5 rounded-full flex-shrink-0 ${es.dot}`} />
                {es.label}
              </span>
              {guide.productionPhase && (() => {
                const ph = phaseConfig[guide.productionPhase];
                return ph ? (
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 ${ph.text}`}>
                    <span className={`size-1.5 rounded-full flex-shrink-0 ${ph.dot}`} />
                    {ph.label}
                  </span>
                ) : null;
              })()}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5">
                {guide.languages.map((l, i) => <LangDot key={l} lang={l} primary={i === 0} />)}
              </div>
              <span className="text-zinc-200 text-[11px]">·</span>
              <span className="text-[11px] text-zinc-400">{guide.poiCount} POIs</span>
            </div>
            <p className="flex items-center gap-1 mt-1 text-[11px] text-zinc-400">
              <Calendar className="size-3 flex-shrink-0" />
              {guide.expositionType === "temporary" && guide.startDate && guide.endDate
                ? `${fmtDate(guide.startDate)} – ${fmtDate(guide.endDate)}`
                : "Permanent collection"}
            </p>
            <div className="mt-2">
              <AccessBadge guide={guide} />
            </div>
          </div>
          <Link
            to={`/guides/${guide.id}`}
            className="flex items-center justify-center size-7 rounded-lg bg-[#D33333] text-white hover:bg-[#b82c2c] transition-colors flex-shrink-0"
          >
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ListRow({ guide, onPreview }: { guide: MockGuide; onPreview: () => void }) {
  const es = statusConfig[guide.editorialStatus];
  const ph = guide.productionPhase ? phaseConfig[guide.productionPhase] : null;
  return (
    <Link
      to={`/guides/${guide.id}`}
      className="group flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all duration-200"
      style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.03)" }}
    >
      {/* Thumbnail */}
      <div className="relative size-[48px] rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100">
        <img
          src={guide.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {guide.status === "published" && (
          <span className="absolute bottom-1 right-1 size-2 rounded-full bg-emerald-400 ring-1 ring-white" />
        )}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-zinc-900 truncate leading-snug">{guide.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`flex items-center gap-1 text-[11px] font-medium ${es.text}`}>
            <span className={`size-1.5 rounded-full flex-shrink-0 ${es.dot}`} />
            {es.label}
          </span>
          {ph && (
            <>
              <span className="text-zinc-200 text-[10px]">·</span>
              <span className={`text-[11px] font-medium ${ph.text}`}>{ph.label}</span>
            </>
          )}
          <span className="text-zinc-200 text-[10px]">·</span>
          <span className="flex items-center gap-0.5">
            {guide.languages.map((l, i) => <LangDot key={l} lang={l} primary={i === 0} />)}
          </span>
          <span className="text-zinc-200 text-[10px]">·</span>
          <span className="text-[11px] text-zinc-400">{guide.poiCount} POIs</span>
        </div>
      </div>

      {/* Right side: access + date */}
      <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0 text-right">
        <AccessBadge guide={guide} />
        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
          <Calendar className="size-3 flex-shrink-0" />
          {guide.expositionType === "temporary" && guide.startDate && guide.endDate
            ? `${fmtDate(guide.startDate)} – ${fmtDate(guide.endDate)}`
            : "Permanent"}
        </span>
      </div>

      {/* Preview button */}
      <button
        onClick={e => { e.preventDefault(); onPreview(); }}
        title="Visitor preview"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 transition-all text-[11px] font-medium flex-shrink-0"
      >
        <Smartphone className="size-3.5" strokeWidth={1.5} />
        Preview
      </button>
    </Link>
  );
}

export function GuidesList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [guides] = useState(mockGuides);
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("list");
  const [showNewModal, setShowNewModal] = useState(false);
  const [previewGuide, setPreviewGuide] = useState<string | null>(null);
  const [showCatalogueModal, setShowCatalogueModal] = useState(false);
  const [catalogueFiles, setCatalogueFiles] = useState<{ name: string; size: number }[]>([]);
  const [catalogueIdea, setCatalogueIdea] = useState("");
  const [catalogueDragOver, setCatalogueDragOver] = useState(false);
  const [showLibraryPicker, setShowLibraryPicker] = useState(false);
  const [selectedLibraryDocs, setSelectedLibraryDocs] = useState<string[]>([]);
  const [libraryTagFilter, setLibraryTagFilter] = useState<string | null>(null);
  const catalogueInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((location.state as { openNewGuide?: boolean } | null)?.openNewGuide) {
      setShowNewModal(true);
      window.history.replaceState({}, "");
    }
  }, []);

  const handleCatalogueFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter(f => /\.(pdf|docx|txt)$/i.test(f.name))
      .map(f => ({ name: f.name, size: f.size }));
    setCatalogueFiles(prev => [...prev, ...next]);
  };

  const closeNewModal = () => {
    setShowNewModal(false);
    setCatalogueFiles([]);
    setCatalogueIdea("");
  };

  const closeCatalogueModal = () => {
    setShowCatalogueModal(false);
    setCatalogueFiles([]);
    setCatalogueIdea("");
    setShowLibraryPicker(false);
    setSelectedLibraryDocs([]);
    setLibraryTagFilter(null);
  };

  const toggleLibraryDoc = (id: string) =>
    setSelectedLibraryDocs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);

  const allSelectedFiles = [
    ...catalogueFiles,
    ...mockDocuments.filter(d => selectedLibraryDocs.includes(d.id)).map(d => ({ name: d.filename, size: 0 })),
  ];

  const filteredGuides =
    filter === "all" ? guides : guides.filter(g => g.editorialStatus === filter);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all",            label: "All",            count: guides.length },
    { key: "in-progress",    label: "In Progress",    count: guides.filter(g => g.editorialStatus === "in-progress").length },
    { key: "under-revision", label: "Under Revision", count: guides.filter(g => g.editorialStatus === "under-revision").length },
    { key: "complete",       label: "Complete",        count: guides.filter(g => g.editorialStatus === "complete").length },
  ];

  return (
    <>
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Audio Guides</h1>
            <p className="text-[13px] text-zinc-500">
              {guides.length} guides · {guides.filter(g => g.status === "published").length} published
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
          >
            <Plus className="size-4" />
            New Guide
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
            {filters.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                  filter === key ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {label}
                <span className={`ml-1.5 text-[11px] ${filter === key ? "text-zinc-400" : "text-zinc-300"}`}>{count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-400 hover:text-zinc-700"}`}>
              <LayoutGrid className="size-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-400 hover:text-zinc-700"}`}>
              <List className="size-4" />
            </button>
          </div>
        </div>

        {/* Grid */}
        {view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGuides.map(guide => <GridCard key={guide.id} guide={guide} onPreview={() => setPreviewGuide(guide.title)} />)}
            <button
              onClick={() => setShowNewModal(true)}
              className="group flex flex-col items-center justify-center min-h-[320px] rounded-xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3 group-hover:bg-zinc-200 transition-all">
                <Plus className="size-5 text-zinc-500" />
              </div>
              <span className="text-[13px] font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">New Guide</span>
              <span className="text-[11px] text-zinc-400 mt-0.5">Assemble POIs and publish</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGuides.map(guide => <ListRow key={guide.id} guide={guide} onPreview={() => setPreviewGuide(guide.title)} />)}
            <button
              onClick={() => setShowNewModal(true)}
              className="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-dashed border-zinc-300 hover:border-zinc-900 hover:bg-zinc-950 transition-all duration-200"
            >
              <div className="size-9 rounded-xl bg-zinc-100 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all">
                <Plus className="size-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[13px] font-semibold text-zinc-500 group-hover:text-white transition-colors">New audio guide</p>
                <p className="text-[11px] text-zinc-400 group-hover:text-white/50 transition-colors mt-0.5">Create from scratch or generate with AI</p>
              </div>
              <ChevronRight className="size-4 text-zinc-300 group-hover:text-white/50 flex-shrink-0 transition-colors" />
            </button>
          </div>
        )}

      </div>
    </PageShell>

    {previewGuide && (
      <GuidePreviewModal guideName={previewGuide} onClose={() => setPreviewGuide(null)} />
    )}

    {/* ── New guide modal ──────────────────────── */}
    {showNewModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeNewModal}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <p className="text-base font-semibold text-zinc-900">New audio guide</p>
              <p className="text-xs text-zinc-400 mt-0.5">Choose how you want to get started</p>
            </div>
            <button onClick={closeNewModal} className="text-zinc-300 hover:text-zinc-500 transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {/* Options */}
          <div className="px-3 pb-4 space-y-1">

            {/* Option 1 — Create from scratch */}
            <button
              onClick={() => { closeNewModal(); navigate("/guides/guide-1", { state: { generatedName: "", generatedDescription: "", generatedPOIs: [], sources: [], scratch: true } }); }}
              className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left hover:bg-zinc-50 transition-all"
            >
              <div className="size-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-all">
                <PenLine className="size-4 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800">Create from scratch</p>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">Build your itinerary step by step, adding stops manually.</p>
              </div>
              <ChevronRight className="size-4 text-zinc-300 flex-shrink-0 group-hover:text-zinc-400 transition-colors" />
            </button>

            {/* Option 2 — Generate from catalogue */}
            <button
              onClick={() => { closeNewModal(); setShowCatalogueModal(true); }}
              className="group w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-zinc-50 transition-all rounded-xl"
            >
              <div className="size-9 rounded-xl bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center flex-shrink-0 transition-all">
                <BookOpen className="size-4 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800">Generate from your catalogue</p>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">Upload your museum's documents and let the AI build the guide.</p>
              </div>
              <ChevronRight className="size-4 text-zinc-300 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
            </button>

            {/* Coming Soon divider */}
            <div className="flex items-center gap-3 px-4 pt-3 pb-1">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Coming Soon</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>

            {/* Remaining options — coming soon */}
            {NEW_GUIDE_PATHS.slice(1).map(({ id, icon: Icon, title, desc }) => (
              <div
                key={id}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left opacity-40 cursor-default select-none"
              >
                <div className="size-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="size-4 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800">{title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
      {/* Catalogue Modal */}
      {showCatalogueModal && (
        <div className="fixed inset-0 bg-zinc-950/50 z-50 flex items-center justify-center p-6" onClick={closeCatalogueModal}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="h-1 w-full bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-300" />
            <div className="px-7 pt-7 pb-7 space-y-5">

              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="size-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                      <BookOpen className="size-4 text-white" />
                    </div>
                    <h2 className="text-[17px] font-semibold text-zinc-900 tracking-tight">Generate from your catalogue</h2>
                  </div>
                  <p className="text-[13px] text-zinc-400 leading-relaxed">Upload your museum's documents and describe your idea. Museoo will draft the guide for you.</p>
                </div>
                <button onClick={closeCatalogueModal} className="text-zinc-400 hover:text-zinc-700 transition-colors ml-4 flex-shrink-0">
                  <X className="size-5" />
                </button>
              </div>

              {/* Idea field */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                  Describe your idea <span className="normal-case font-normal text-zinc-400">(optional)</span>
                </label>
                <textarea
                  value={catalogueIdea}
                  onChange={e => setCatalogueIdea(e.target.value)}
                  placeholder="e.g. A 45-minute tour for families with children, focusing on ancient Roman everyday life…"
                  rows={3}
                  className="w-full px-3.5 py-3 border border-zinc-200 rounded-xl text-[13px] text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none transition-all leading-relaxed"
                />
                <p className="text-[11px] text-zinc-400 mt-1.5">Museoo will use this to build drafts you can freely adapt and refine.</p>
              </div>

              {/* Source buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowLibraryPicker(false); catalogueInputRef.current?.click(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-xl text-[13px] font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
                >
                  <Upload className="size-4 text-zinc-400" strokeWidth={1.5} />
                  Upload from device
                </button>
                <button
                  onClick={() => setShowLibraryPicker(v => !v)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-[13px] font-medium transition-all ${
                    showLibraryPicker ? "border-zinc-900 bg-[#D33333] text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
                  }`}
                >
                  <BookOpen className="size-4" strokeWidth={1.5} />
                  Choose from Library
                </button>
                <input ref={catalogueInputRef} type="file" multiple accept=".pdf,.docx,.txt" className="hidden" onChange={e => handleCatalogueFiles(e.target.files)} />
              </div>

              {/* Library picker */}
              {showLibraryPicker && (
                <div>
                  {/* Tag filter chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    <button
                      onClick={() => setLibraryTagFilter(null)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${libraryTagFilter === null ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}
                    >
                      Tutti
                    </button>
                    <button
                      onClick={() => setLibraryTagFilter("museo")}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${libraryTagFilter === "museo" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                    >
                      #museo
                    </button>
                    {mockGuides.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setLibraryTagFilter(g.id)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${libraryTagFilter === g.id ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-600 hover:bg-violet-100"}`}
                      >
                        {g.title.split(" ").slice(0, 2).join(" ")}
                      </button>
                    ))}
                  </div>
                  <div className="border border-zinc-100 rounded-2xl overflow-hidden">
                    {mockDocuments
                      .filter(doc => libraryTagFilter === null || doc.tags.includes(libraryTagFilter))
                      .map(doc => {
                        const selected = selectedLibraryDocs.includes(doc.id);
                        return (
                          <button
                            key={doc.id}
                            onClick={() => toggleLibraryDoc(doc.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-zinc-100 last:border-0 transition-colors ${selected ? "bg-zinc-50" : "hover:bg-zinc-50"}`}
                          >
                            <div className={`size-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? "bg-zinc-900 border-zinc-900" : "border-zinc-300"}`}>
                              {selected && <X className="size-2.5 text-white" strokeWidth={3} />}
                            </div>
                            <FileText className="size-4 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                            <span className="text-[13px] font-medium text-zinc-700 flex-1 truncate">{doc.filename}</span>
                            <div className="flex gap-1 flex-shrink-0">
                              {doc.tags.slice(0, 2).map(tag => (
                                <span key={tag} className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-full ${
                                  tag === "museo" ? "bg-blue-50 text-blue-500" :
                                  tag.startsWith("guide-") ? "bg-violet-50 text-violet-500" :
                                  "bg-amber-50 text-amber-500"
                                }`}>
                                  {tag === "museo" ? "#museo" : tag.startsWith("guide-") ? mockGuides.find(g => g.id === tag)?.title.split(" ")[0] : tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[11px] text-zinc-400 flex-shrink-0 ml-1">{doc.size}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Combined file list */}
              {allSelectedFiles.length > 0 && !showLibraryPicker && (
                <div className="space-y-1.5">
                  {catalogueFiles.map((f, i) => (
                    <div key={`upload-${i}`} className="flex items-center gap-2.5 px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                      <FileText className="size-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-[12px] font-medium text-zinc-700 flex-1 truncate">{f.name}</span>
                      <span className="text-[11px] text-zinc-400">{(f.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => setCatalogueFiles(prev => prev.filter((_, j) => j !== i))} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  {mockDocuments.filter(d => selectedLibraryDocs.includes(d.id)).map(doc => (
                    <div key={`lib-${doc.id}`} className="flex items-center gap-2.5 px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                      <BookOpen className="size-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-[12px] font-medium text-zinc-700 flex-1 truncate">{doc.filename}</span>
                      <span className="text-[11px] text-zinc-400">{doc.size}</span>
                      <button onClick={() => toggleLibraryDoc(doc.id)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  disabled={allSelectedFiles.length === 0}
                  onClick={() => {
                    const files = allSelectedFiles;
                    closeCatalogueModal();
                    navigate("/guides/new", { state: { catalogueFiles: files, catalogueIdea } });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Sparkles className="size-3.5" />
                  Generate guide
                </button>
                <button onClick={closeCatalogueModal} className="w-full py-2.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-600 transition-all">
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
