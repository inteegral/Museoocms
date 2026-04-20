import { Link } from "react-router";
import { Plus, MoreVertical, ExternalLink, Filter } from "lucide-react";
import { mockGuides } from "../../data/mockData";
import { useState } from "react";

const editorialStatusConfig = {
  "in-progress": { label: "In Progress", color: "text-blue-600", bgColor: "bg-blue-100" },
  "under-revision": { label: "Under Revision", color: "text-orange-600", bgColor: "bg-orange-100" },
  "complete": { label: "Complete", color: "text-green-600", bgColor: "bg-green-100" },
};

export function GuidesList() {
  const [guides] = useState(mockGuides);
  const [filter, setFilter] = useState<"all" | "in-progress" | "under-revision" | "complete">("all");

  const filteredGuides =
    filter === "all"
      ? guides
      : guides.filter((g) => g.editorialStatus === filter);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-[28px] md:text-[32px] leading-tight tracking-tight text-zinc-900 mb-2"
              style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              Audioguide
            </h1>
            <p className="text-[14px] text-zinc-600">
              Gestisci le audioguide del tuo museo
            </p>
          </div>
          <Link
            to="/studio/guides/new"
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg hover:opacity-90 transition-all text-[13px] font-semibold text-white"
            style={{ backgroundColor: '#D33333' }}
          >
            <Plus className="size-4 group-hover:scale-110 transition-transform" />
            <span>Nuova audioguida</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md transition-all text-[12px] font-semibold whitespace-nowrap ${
                filter === "all"
                  ? "text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
              style={filter === "all" ? { backgroundColor: '#D33333' } : {}}
            >
              Tutte ({guides.length})
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-4 py-2 rounded-md transition-all text-[12px] font-semibold whitespace-nowrap ${
                filter === "in-progress"
                  ? "text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
              style={filter === "in-progress" ? { backgroundColor: '#D33333' } : {}}
            >
              In Progress ({guides.filter((g) => g.editorialStatus === "in-progress").length})
            </button>
            <button
              onClick={() => setFilter("under-revision")}
              className={`px-4 py-2 rounded-md transition-all text-[12px] font-semibold whitespace-nowrap ${
                filter === "under-revision"
                  ? "text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
              style={filter === "under-revision" ? { backgroundColor: '#D33333' } : {}}
            >
              Under Revision ({guides.filter((g) => g.editorialStatus === "under-revision").length})
            </button>
            <button
              onClick={() => setFilter("complete")}
              className={`px-4 py-2 rounded-md transition-all text-[12px] font-semibold whitespace-nowrap ${
                filter === "complete"
                  ? "text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
              style={filter === "complete" ? { backgroundColor: '#D33333' } : {}}
            >
              Complete ({guides.filter((g) => g.editorialStatus === "complete").length})
            </button>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuides.map((guide) => {
            const editorialConfig = editorialStatusConfig[guide.editorialStatus];
            return (
              <div
                key={guide.id}
                className="bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden hover:border-zinc-300 transition-all"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-[14px] font-semibold text-zinc-900 mb-1.5 tracking-tight truncate">
                      {guide.title}
                    </h3>
                    <p className="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-[11px] text-zinc-600">
                    <div>
                      <span className="text-[16px] font-semibold text-zinc-900 mr-1">{guide.poiCount}</span>
                      POI
                    </div>
                    <div>
                      <span className="text-[16px] font-semibold text-zinc-900 mr-1">{guide.languages.length}</span>
                      lingue
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-1.5 mb-4">
                    {guide.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-[10px] px-2 py-1 bg-zinc-200 text-zinc-700 rounded uppercase tracking-wide font-semibold"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <span
                      className={`
                        inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded uppercase tracking-wide font-semibold
                        ${
                          guide.status === "published"
                            ? "text-white"
                            : "bg-zinc-200 text-zinc-700"
                        }
                      `}
                      style={guide.status === "published" ? { backgroundColor: '#D33333' } : {}}
                    >
                      <span
                        className={`
                          size-1 rounded-full
                          ${guide.status === "published" ? "bg-white" : "bg-zinc-500"}
                        `}
                      />
                      {guide.status === "published" ? "Live" : "Draft"}
                    </span>

                    <span className="text-[10px] px-2 py-1 bg-zinc-200 text-zinc-700 rounded uppercase tracking-wide font-semibold">
                      {editorialConfig.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/studio/guides/${guide.id}`}
                      className="flex-1 px-4 py-2 bg-zinc-900 text-white text-center rounded-md hover:bg-zinc-800 transition-all text-[12px] font-semibold"
                    >
                      Modifica
                    </Link>
                    {guide.status === "published" && (
                      <button className="px-3 py-2 border border-zinc-300 text-zinc-700 rounded-md hover:bg-zinc-100 transition-all">
                        <ExternalLink className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create New Card */}
          <Link
            to="/studio/guides/new"
            className="group bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300 p-5 hover:border-zinc-900 transition-all flex flex-col items-center justify-center min-h-[280px] text-zinc-600"
          >
            <div className="size-12 bg-zinc-200 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zinc-900 transition-all">
              <Plus className="size-5 group-hover:text-white transition-colors" />
            </div>
            <div className="text-[13px] font-semibold text-zinc-900 mb-1">Crea nuova audioguida</div>
            <div className="text-[11px] text-zinc-500">Assembla POI e pubblica</div>
          </Link>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-zinc-50 rounded-lg border border-zinc-200 p-5">
          <div className="flex items-start gap-4">
            <div className="size-8 bg-zinc-200 rounded-md flex items-center justify-center flex-shrink-0 text-[16px]">
              💡
            </div>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-zinc-900 mb-1.5">Pipeline Editoriale</h3>
              <p className="text-[12px] text-zinc-600 leading-relaxed">
                Le audioguide passano attraverso diversi stati: <strong>In Progress</strong> durante la creazione,
                <strong> Under Revision</strong> per revisioni e raffinamenti, <strong>Complete</strong> quando pronte.
                Solo le Complete possono essere pubblicate con l'acquisto di un pacchetto vocale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}