import { Link, useNavigate } from "react-router";
import { Plus, LayoutGrid, List, PenLine, Copy, Sparkles, GitFork, AlignLeft, X, Smartphone, ChevronRight, Calendar } from "lucide-react";
import { PageShell } from "./PageShell";
import { mockGuides } from "../../data/mockData";
import { useState } from "react";
import { GuidePreviewModal } from "./GuidePreviewModal";

const NEW_GUIDE_PATHS = [
  {
    id: "scratch",
    icon: PenLine,
    title: "Create from scratch",
    desc: "Build your itinerary step by step, adding stops manually.",
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "Generate with AI",
    desc: "Describe your tour and let Museoo draft the content for you.",
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
  {
    id: "manual",
    icon: AlignLeft,
    title: "I already have my texts",
    desc: "Paste or import your own content and publish directly.",
  },
];

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


function GridCard({ guide, onPreview }: { guide: typeof mockGuides[0]; onPreview: () => void }) {
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
            <span className={`flex items-center gap-1.5 text-[11px] font-medium mb-1 ${es.text}`}>
              <span className={`size-1.5 rounded-full flex-shrink-0 ${es.dot}`} />
              {es.label}
            </span>
            <p className="text-[11px] text-zinc-400 tracking-wide">
              {guide.languages.map(l => l.toUpperCase()).join(" · ")}
              <span className="mx-1.5 text-zinc-200">·</span>
              {guide.poiCount} POIs
            </p>
            {guide.expositionType === "temporary" && guide.startDate && guide.endDate && (
              <p className="flex items-center gap-1 mt-1.5 text-[11px] text-zinc-400">
                <Calendar className="size-3 flex-shrink-0" />
                {fmtDate(guide.startDate)} – {fmtDate(guide.endDate)}
              </p>
            )}
          </div>
          <Link
            to={`/guides/${guide.id}`}
            className="flex items-center justify-center size-7 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors flex-shrink-0"
          >
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ListRow({ guide, onPreview }: { guide: typeof mockGuides[0]; onPreview: () => void }) {
  const es = statusConfig[guide.editorialStatus];
  return (
    <div className="group flex items-center gap-5 px-5 py-3.5 bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all duration-200" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.03)" }}>

      {/* Thumbnail */}
      <div className="relative size-[52px] rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100">
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

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-zinc-900 truncate leading-snug">{guide.title}</p>
        <p className="text-[12px] text-zinc-400 truncate mt-0.5">{guide.description}</p>
      </div>

      {/* Metadata inline */}
      <div className="hidden md:flex items-center gap-2 text-[11px] text-zinc-400 flex-shrink-0">
        <span className={`flex items-center gap-1.5 font-medium ${es.text}`}>
          <span className={`size-1.5 rounded-full flex-shrink-0 ${es.dot}`} />
          {es.label}
        </span>
        <span className="text-zinc-200">·</span>
        <span className="tracking-wide">{guide.languages.map(l => l.toUpperCase()).join(" · ")}</span>
        <span className="text-zinc-200">·</span>
        <span><span className="font-semibold text-zinc-600">{guide.poiCount}</span> POIs</span>
        {guide.expositionType === "temporary" && guide.startDate && guide.endDate && (
          <>
            <span className="text-zinc-200">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3 flex-shrink-0" />
              {fmtDate(guide.startDate)} – {fmtDate(guide.endDate)}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          onClick={onPreview}
          title="Anteprima visitatore"
          className="p-2 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
        >
          <Smartphone className="size-3.5" strokeWidth={1.5} />
        </button>
        <Link
          to={`/guides/${guide.id}`}
          className="p-2 flex items-center justify-center size-8 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
        >
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function GuidesList() {
  const navigate = useNavigate();
  const [guides] = useState(mockGuides);
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [showNewModal, setShowNewModal] = useState(false);
  const [previewGuide, setPreviewGuide] = useState<string | null>(null);

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
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all"
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
              className="group w-full flex items-center gap-5 px-5 py-4 rounded-xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              <div className="size-14 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-all">
                <Plus className="size-5 text-zinc-500" />
              </div>
              <span className="text-[13px] font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">New Guide</span>
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowNewModal(false)}>
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
            <button onClick={() => setShowNewModal(false)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {/* Options */}
          <div className="px-3 pb-4 space-y-1">
            {/* First option — available now */}
            {(() => { const { icon: Icon, title, desc } = NEW_GUIDE_PATHS[0]; return (
              <button
                onClick={() => { setShowNewModal(false); navigate("/guides/new"); }}
                className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left hover:bg-zinc-50 transition-all"
              >
                <div className="size-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-all">
                  <Icon className="size-4 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800">{title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <svg className="size-4 text-zinc-300 flex-shrink-0 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ); })()}

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
    </>
  );
}
