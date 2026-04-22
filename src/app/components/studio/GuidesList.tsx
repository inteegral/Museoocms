import { Link } from "react-router";
import { Plus, ExternalLink, LayoutGrid, List } from "lucide-react";
import { PageShell } from "./PageShell";
import { mockGuides } from "../../data/mockData";
import { useState } from "react";

type Filter = "all" | "in-progress" | "under-revision" | "complete";
type ViewMode = "grid" | "list";

const statusConfig = {
  "in-progress":    { label: "In Progress",    dot: "bg-blue-400",    text: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200" },
  "under-revision": { label: "Under Revision",  dot: "bg-amber-400",   text: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" },
  "complete":       { label: "Complete",         dot: "bg-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
};

function LangBadges({ langs }: { langs: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {langs.map((code) => (
        <span key={code} className="text-[10px] font-semibold px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded uppercase tracking-wide">
          {code}
        </span>
      ))}
    </div>
  );
}

function GridCard({ guide }: { guide: typeof mockGuides[0] }) {
  const es = statusConfig[guide.editorialStatus];
  return (
    <div className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)" }}>
      {/* Thumbnail */}
      <div className="relative h-44 bg-zinc-100 overflow-hidden">
        <img
          src={guide.thumbnail}
          alt={guide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {guide.status === "published" && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-[14px] font-semibold text-zinc-900 mb-1 leading-snug tracking-tight">
          {guide.title}
        </h3>
        <p className="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed mb-4">
          {guide.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <LangBadges langs={guide.languages} />
          <span className="text-[12px] text-zinc-400">
            <span className="font-semibold text-zinc-700">{guide.poiCount}</span> POIs
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${es.text} ${es.bg} ${es.border}`}>
            <span className={`size-1.5 rounded-full ${es.dot}`} />
            {es.label}
          </span>
          <Link
            to={`/guides/${guide.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
          >
            Open
          </Link>
        </div>
      </div>
    </div>
  );
}

function ListRow({ guide }: { guide: typeof mockGuides[0] }) {
  const es = statusConfig[guide.editorialStatus];
  return (
    <div className="group flex items-center gap-5 px-5 py-4 bg-white rounded-xl border border-zinc-200 hover:shadow-sm hover:border-zinc-300 transition-all" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
      <div className="relative size-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
        <img
          src={guide.thumbnail}
          alt={guide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-zinc-900 truncate mb-0.5">{guide.title}</p>
        <p className="text-[12px] text-zinc-500 truncate">{guide.description}</p>
      </div>

      <LangBadges langs={guide.languages} />

      <div className="hidden md:block w-14 text-right flex-shrink-0">
        <span className="text-[14px] font-semibold text-zinc-700">{guide.poiCount}</span>
        <span className="text-[11px] text-zinc-400 ml-1">POIs</span>
      </div>

      <div className="hidden lg:flex items-center gap-1.5 w-32 flex-shrink-0">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${es.text} ${es.bg} ${es.border}`}>
          <span className={`size-1.5 rounded-full ${es.dot}`} />
          {es.label}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {guide.status === "published" && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        )}
        <Link
          to={`/guides/${guide.id}`}
          className="px-3.5 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
        >
          Open
        </Link>
      </div>
    </div>
  );
}

export function GuidesList() {
  const [guides] = useState(mockGuides);
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("grid");

  const filteredGuides =
    filter === "all" ? guides : guides.filter(g => g.editorialStatus === filter);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all",            label: "All",            count: guides.length },
    { key: "in-progress",    label: "In Progress",    count: guides.filter(g => g.editorialStatus === "in-progress").length },
    { key: "under-revision", label: "Under Revision", count: guides.filter(g => g.editorialStatus === "under-revision").length },
    { key: "complete",       label: "Complete",        count: guides.filter(g => g.editorialStatus === "complete").length },
  ];

  return (
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
          <Link
            to="/guides/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all"
          >
            <Plus className="size-4" />
            New Guide
          </Link>
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
            {filteredGuides.map(guide => <GridCard key={guide.id} guide={guide} />)}
            <Link
              to="/guides/new"
              className="group flex flex-col items-center justify-center min-h-[320px] rounded-xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3 group-hover:bg-zinc-200 transition-all">
                <Plus className="size-5 text-zinc-500" />
              </div>
              <span className="text-[13px] font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">New Guide</span>
              <span className="text-[11px] text-zinc-400 mt-0.5">Assemble POIs and publish</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGuides.map(guide => <ListRow key={guide.id} guide={guide} />)}
            <Link
              to="/guides/new"
              className="group flex items-center gap-5 px-5 py-4 rounded-xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              <div className="size-14 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-all">
                <Plus className="size-5 text-zinc-500" />
              </div>
              <span className="text-[13px] font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">New Guide</span>
            </Link>
          </div>
        )}

      </div>
    </PageShell>
  );
}
