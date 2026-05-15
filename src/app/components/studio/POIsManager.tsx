import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Plus, MapPin, ChevronDown, FileText, BookOpen, AlertTriangle, X, UserCircle2 } from "lucide-react";
import { PageShell } from "./PageShell";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { POIEditor } from "./POIEditor";
import { mockGuides } from "../../data/mockData";
import { teamMembers, CURRENT_USER_ID } from "../../data/teamData";

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
  translations?: string[]; // language codes with translated text
  voices?: string[];       // language codes with generated audio
  updatedAt: string;
  isGeolocated?: boolean;
  assignedToGuides?: string[];
  assignee?: string;
}

const AVATAR_COLORS = ["bg-violet-100 text-violet-700","bg-sky-100 text-sky-700","bg-emerald-100 text-emerald-700","bg-amber-100 text-amber-700","bg-rose-100 text-rose-700","bg-zinc-100 text-zinc-600"];
function avatarColor(name: string) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]; }
function initials(name: string) { return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase(); }

const assignableMembers = teamMembers.filter(m => m.status === "active" && m.id !== CURRENT_USER_ID);

const mockPOIs: POI[] = [
  {
    id: "2",
    title: "Renaissance Gallery",
    description: "Key works from the Renaissance period",
    status: "complete",
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=400",
    audioScript: "We now enter the gallery dedicated to...",
    scriptValidated: true,
    translations: ["en"],
    voices: ["it", "en"],
    updatedAt: "1 day ago",
    isGeolocated: true,
    assignedToGuides: ["guide-1"],
    assignee: "m3",
  },
  {
    id: "3",
    title: "Baroque Masterpieces",
    description: "The baroque collection with a focus on Caravaggio",
    status: "under-revision",
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400",
    audioScript: "In this room...",
    scriptValidated: false,
    translations: ["en"],
    voices: [],
    updatedAt: "3 days ago",
    isGeolocated: true,
    assignedToGuides: [],
    assignee: "m4",
  },
  {
    id: "4",
    title: "Ancient Sculptures",
    description: "",
    status: "in-progress",
    category: "Sculpture",
    scriptValidated: false,
    translations: [],
    voices: [],
    updatedAt: "5 days ago",
    isGeolocated: false,
    assignedToGuides: [],
  },
  {
    id: "5",
    title: "Secret Garden",
    description: "",
    status: "idea",
    category: "Outdoors",
    scriptValidated: false,
    translations: [],
    voices: [],
    updatedAt: "1 week ago",
    isGeolocated: false,
    assignedToGuides: [],
  },
  {
    id: "6",
    title: "Modern Collection",
    description: "Contemporary art and installations",
    status: "in-progress",
    category: "Modern Art",
    audioScript: "This collection explores...",
    scriptValidated: false,
    translations: [],
    voices: [],
    updatedAt: "4 days ago",
    isGeolocated: false,
    assignedToGuides: ["guide-3"],
    assignee: "m1",
  },
];

const statusConfig = {
  idea: { 
    label: "Idea", 
    color: "text-zinc-500", 
    bg: "bg-white", 
    border: "border-zinc-200",
    dot: "bg-zinc-400"
  },
  "in-progress": { 
    label: "In Progress", 
    color: "text-zinc-900", 
    bg: "bg-white", 
    border: "border-zinc-300",
    dot: "bg-zinc-900"
  },
  "under-revision": {
    label: "Under Revision",
    color: "text-orange-700",
    bg: "bg-white",
    border: "border-orange-200",
    dot: "bg-orange-500"
  },
  complete: {
    label: "Complete",
    color: "text-zinc-900",
    bg: "bg-white",
    border: "border-[#D33333]",
    dot: "bg-[#D33333]"
  },
};

function POIBadges({ poi }: { poi: POI }) {
  const hasScript = !!poi.audioScript;
  const scriptOk = poi.scriptValidated;
  const guideCount = poi.assignedToGuides?.length ?? 0;

  return (
    <div className="flex items-center gap-2">
      {/* Script dot + label */}
      <div className="flex items-center gap-1.5">
        <span className={`size-1.5 rounded-full flex-shrink-0 ${
          scriptOk ? "bg-emerald-400" : hasScript ? "bg-amber-400" : "bg-zinc-300"
        }`} />
        <span className={`text-[11px] font-medium ${
          scriptOk ? "text-emerald-600" : hasScript ? "text-amber-600" : "text-zinc-400"
        }`}>
          {scriptOk ? "Validated" : hasScript ? "Draft" : "No script"}
        </span>
      </div>

      {/* Divider */}
      <span className="w-px h-3 bg-zinc-200 flex-shrink-0" />

      {/* Guides */}
      <div className="flex items-center gap-1.5">
        <BookOpen className={`size-3 flex-shrink-0 ${guideCount > 0 ? "text-zinc-500" : "text-zinc-300"}`} />
        <span className={`text-[11px] font-medium tabular-nums ${guideCount > 0 ? "text-zinc-600" : "text-zinc-300"}`}>
          {guideCount > 0 ? `${guideCount} ${guideCount === 1 ? "guide" : "guides"}` : "Not used"}
        </span>
      </div>
    </div>
  );
}

function POICard({
  poi,
  onMove,
  onOpen,
}: {
  poi: POI;
  onMove: (poiId: string, newStatus: POIStatus) => void;
  onOpen: (poi: POI) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "POI_CARD",
    item: { id: poi.id, currentStatus: poi.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const config = statusConfig[poi.status];

  return (
    <div
      ref={drag}
      onClick={() => onOpen(poi)}
      className={`group bg-white rounded-xl border border-zinc-200/80 overflow-hidden cursor-pointer transition-all duration-200 ${isDragging ? "opacity-40 scale-95 shadow-none" : "hover:shadow-md hover:border-zinc-300"}`}
      style={{ boxShadow: isDragging ? 'none' : '0 1px 4px 0 rgba(0,0,0,0.05)' }}
    >
      {/* Image */}
      {poi.imageUrl && (
        <div className="relative overflow-hidden">
          <img
            src={poi.imageUrl}
            alt={poi.title}
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          {poi.isGeolocated && (
            <div className="absolute top-2 left-2">
              <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <MapPin className="size-3 text-[#D33333]" />
                <span className="text-[10px] font-semibold text-zinc-800">Mapped</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[14px] text-zinc-950 leading-tight tracking-tight flex-1">
            {poi.title}
          </h3>
          <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap mt-0.5">{poi.updatedAt}</span>
        </div>

        {poi.description && (
          <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-2">{poi.description}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-medium">{poi.category}</span>
        </div>

        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
          <POIBadges poi={poi} />
          {poi.assignee && (() => {
            const member = teamMembers.find(m => m.id === poi.assignee);
            if (!member?.name) return null;
            return (
              <div title={member.name} className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${avatarColor(member.name)}`}>
                {initials(member.name)}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  pois,
  onMove,
  onOpen,
}: {
  status: POIStatus;
  pois: POI[];
  onMove: (poiId: string, newStatus: POIStatus) => void;
  onOpen: (poi: POI) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: "POI_CARD",
    drop: (item: { id: string; currentStatus: POIStatus }) => {
      if (item.currentStatus !== status) {
        onMove(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const config = statusConfig[status];

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[220px] flex flex-col transition-all duration-200 ${isOver ? "ring-2 ring-zinc-900/20 ring-offset-2 rounded-xl" : ""}`}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`size-1.5 rounded-full ${config.dot}`} />
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">{config.label}</span>
        <span className="ml-auto text-[11px] font-semibold text-zinc-400">{pois.length}</span>
      </div>

      {/* Cards */}
      <div className={`flex-1 rounded-xl p-3 space-y-3 transition-colors ${isOver ? "bg-zinc-100" : "bg-zinc-50/70"}`}>
        {pois.map((poi) => (
          <POICard key={poi.id} poi={poi} onMove={onMove} onOpen={onOpen} />
        ))}
        {pois.length === 0 && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-zinc-200 rounded-lg">
            <p className="text-[12px] text-zinc-400">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function POIsManagerContent() {
  const [pois, setPOIs] = useState<POI[]>(mockPOIs);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [showPOIEditor, setShowPOIEditor] = useState(false);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [selectedGuideFilter, setSelectedGuideFilter] = useState<string>("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteConfirm, setDeleteConfirm] = useState<{ poiId: string; poiTitle: string; guides: typeof mockGuides } | null>(null);

  const openNewPOI = () => {
    const blank: POI = {
      id: `poi-${Date.now()}`,
      title: "New Point of Interest",
      description: "",
      status: "in-progress",
      category: "General",
      scriptValidated: false,
      translations: [],
      voices: [],
      updatedAt: "Just now",
      isGeolocated: false,
      assignedToGuides: [],
    };
    setPOIs((prev) => [...prev, blank]);
    setSelectedPOI(blank);
    setShowPOIEditor(true);
  };

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      openNewPOI();
      setSearchParams({}, { replace: true });
    }
  }, []);

  const handleMovePOI = (poiId: string, newStatus: POIStatus) => {
    setPOIs(
      pois.map((poi) =>
        poi.id === poiId ? { ...poi, status: newStatus, updatedAt: "Just now" } : poi
      )
    );
  };

  const handleOpenPOI = (poi: POI) => {
    setSelectedPOI(poi);
    setShowPOIEditor(true);
  };

  const handleSavePOI = (updatedPOI: POI) => {
    setPOIs(
      pois.map((poi) =>
        poi.id === updatedPOI.id ? { ...updatedPOI, updatedAt: "Just now" } : poi
      )
    );
    setShowPOIEditor(false);
    setSelectedPOI(null);
  };

  const handleDeletePOI = (poiId: string) => {
    const poi = pois.find(p => p.id === poiId);
    const affectedGuides = mockGuides.filter(g =>
      (poi?.assignedToGuides ?? []).includes(g.id)
    );
    if (affectedGuides.length > 0) {
      setDeleteConfirm({ poiId, poiTitle: poi?.title ?? "this POI", guides: affectedGuides });
    } else {
      confirmDelete(poiId);
    }
  };

  const confirmDelete = (poiId: string) => {
    setPOIs(prev => prev.filter(p => p.id !== poiId));
    setShowPOIEditor(false);
    setSelectedPOI(null);
    setDeleteConfirm(null);
  };

  const statuses: POIStatus[] = ["idea", "in-progress", "under-revision", "complete"];

  const filteredPOIs = selectedGuideFilter === "all"
    ? pois
    : pois.filter((p) => p.assignedToGuides?.includes(selectedGuideFilter));

  const stats = {
    total: pois.length,
    idea: pois.filter((p) => p.status === "idea").length,
    inProgress: pois.filter((p) => p.status === "in-progress").length,
    underRevision: pois.filter((p) => p.status === "under-revision").length,
    complete: pois.filter((p) => p.status === "complete").length,
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-semibold text-zinc-950 tracking-tight">Points of Interest</h1>
            <p className="text-[13px] text-zinc-400 mt-0.5">{stats.total} total · drag cards between columns to update status</p>
          </div>
          <button
            onClick={openNewPOI}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all"
          >
            <Plus className="size-4" />
            New POI
          </button>
        </div>

        {/* Toolbar: stats + guide filter */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
            <div className="px-3.5 py-1.5 text-[12px] font-medium text-zinc-500">
              All <span className="ml-1 text-zinc-400">{stats.total}</span>
            </div>
            <div className="w-px h-4 bg-zinc-200" />
            {([
              { dot: "bg-zinc-400",   label: "Idea",           count: stats.idea },
              { dot: "bg-zinc-900",   label: "In Progress",    count: stats.inProgress },
              { dot: "bg-orange-400", label: "Under Revision", count: stats.underRevision },
              { dot: "bg-[#D33333]",  label: "Complete",       count: stats.complete },
            ] as const).map(({ dot, label, count }) => (
              <div key={label} className="flex items-center gap-1.5 px-3.5 py-1.5">
                <span className={`size-1.5 rounded-full ${dot} flex-shrink-0`} />
                <span className="text-[12px] text-zinc-600">{label}</span>
                <span className="text-[11px] text-zinc-400 ml-0.5">{count}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            <select
              value={selectedGuideFilter}
              onChange={(e) => setSelectedGuideFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-[12px] font-medium text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer hover:border-zinc-300 transition-colors"
              style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}
            >
              <option value="all">All POIs</option>
              <optgroup label="Filter by guide">
                {mockGuides.map((guide) => {
                  const count = pois.filter((p) => p.assignedToGuides?.includes(guide.id)).length;
                  return (
                    <option key={guide.id} value={guide.id}>{guide.title} ({count})</option>
                  );
                })}
              </optgroup>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Kanban Board */}
        <div className="pb-6">
          <div className="flex gap-4">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                pois={filteredPOIs.filter((p) => p.status === status)}
                onMove={handleMovePOI}
                onOpen={handleOpenPOI}
              />
            ))}
          </div>
        </div>

      {/* POI Editor Modal */}
      {showPOIEditor && selectedPOI && (
        <POIEditor
          poi={selectedPOI}
          onClose={() => {
            setShowPOIEditor(false);
            setSelectedPOI(null);
          }}
          onSave={handleSavePOI}
          onDelete={handleDeletePOI}
        />
      )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (() => {
        const publishedGuides = deleteConfirm.guides.filter(g => g.status === "published");
        const draftGuides = deleteConfirm.guides.filter(g => g.status !== "published");
        const isBlocked = publishedGuides.length > 0;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${isBlocked ? "bg-red-50" : "bg-amber-50"}`}>
                    <AlertTriangle className={`size-5 ${isBlocked ? "text-red-500" : "text-amber-500"}`} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-zinc-900 mb-1">
                      {isBlocked ? "Cannot delete this POI" : `Used in ${deleteConfirm.guides.length} ${deleteConfirm.guides.length === 1 ? "guide" : "guides"}`}
                    </p>
                    <p className="text-[13px] text-zinc-500 leading-relaxed">
                      {isBlocked
                        ? <>Remove <span className="font-medium text-zinc-700">"{deleteConfirm.poiTitle}"</span> from all published guides before deleting it.</>
                        : <>Deleting <span className="font-medium text-zinc-700">"{deleteConfirm.poiTitle}"</span> will also remove it from:</>
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-6 ml-14">
                  {deleteConfirm.guides.map(g => (
                    <div key={g.id} className="flex items-center gap-2.5">
                      <span className={`size-1.5 rounded-full flex-shrink-0 ${g.status === "published" ? "bg-emerald-400" : "bg-zinc-300"}`} />
                      <p className="text-[13px] text-zinc-700 font-medium">{g.title}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        g.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {g.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                  ))}
                </div>

                {isBlocked ? (
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="w-full py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-800 transition-all"
                  >
                    OK, go back
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 py-2.5 border border-zinc-200 text-[13px] font-semibold text-zinc-700 rounded-xl hover:bg-zinc-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => confirmDelete(deleteConfirm.poiId)}
                      className="flex-1 py-2.5 bg-red-600 text-white text-[13px] font-semibold rounded-xl hover:bg-red-700 transition-all"
                    >
                      Delete anyway
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </PageShell>
  );
}

export function POIsManager() {
  return (
    <DndProvider backend={HTML5Backend}>
      <POIsManagerContent />
    </DndProvider>
  );
}
