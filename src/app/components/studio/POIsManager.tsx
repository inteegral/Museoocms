import { useState } from "react";
import { Plus, Sparkles, MapPin } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AIAssistant } from "./AIAssistant";
import { POIEditor } from "./POIEditor";
import { mockGuides } from "../../data/mockData";

type POIStatus = "idea" | "in-progress" | "under-revision" | "complete";

interface POI {
  id: string;
  title: string;
  description: string;
  status: POIStatus;
  category: string;
  imageUrl?: string;
  audioScript?: string;
  updatedAt: string;
  isGeolocated?: boolean;
  assignedToGuides?: string[]; // IDs delle audioguide a cui è assegnato
}

const mockPOIs: POI[] = [
  {
    id: "1",
    title: "Ingresso Principale",
    description: "Benvenuto al museo, introduzione storica del palazzo",
    status: "complete",
    category: "Architettura",
    imageUrl: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3c2?w=400",
    audioScript: "Benvenuto al nostro museo...",
    updatedAt: "2 ore fa",
    isGeolocated: true,
    assignedToGuides: ["guide-1", "guide-2"],
  },
  {
    id: "2",
    title: "Sala del Rinascimento",
    description: "Opere principali del periodo rinascimentale",
    status: "complete",
    category: "Arte",
    imageUrl: "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=400",
    audioScript: "Entriamo ora nella sala dedicata...",
    updatedAt: "1 giorno fa",
    isGeolocated: true,
    assignedToGuides: ["guide-1"],
  },
  {
    id: "3",
    title: "Capolavori Barocchi",
    description: "La collezione barocca con focus su Caravaggio",
    status: "under-revision",
    category: "Arte",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400",
    updatedAt: "3 giorni fa",
    isGeolocated: true,
    assignedToGuides: [],
  },
  {
    id: "4",
    title: "Sculture Antiche",
    description: "",
    status: "in-progress",
    category: "Scultura",
    updatedAt: "5 giorni fa",
    isGeolocated: false,
    assignedToGuides: [],
  },
  {
    id: "5",
    title: "Giardino Segreto",
    description: "",
    status: "idea",
    category: "Esterni",
    updatedAt: "1 settimana fa",
    isGeolocated: false,
    assignedToGuides: [],
  },
  {
    id: "6",
    title: "Collezione Moderna",
    description: "Arte contemporanea e installazioni",
    status: "in-progress",
    category: "Arte Moderna",
    updatedAt: "4 giorni fa",
    isGeolocated: false,
    assignedToGuides: ["guide-3"],
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

function POICard({
  poi,
  onMove,
  onEdit,
  onOpen,
}: {
  poi: POI;
  onMove: (poiId: string, newStatus: POIStatus) => void;
  onEdit: (poi: POI) => void;
  onOpen: (poi: POI) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "POI_CARD",
    item: { id: poi.id, currentStatus: poi.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const hasGuides = poi.assignedToGuides && poi.assignedToGuides.length > 0;
  const assignedGuides = hasGuides
    ? mockGuides.filter((g) => poi.assignedToGuides!.includes(g.id))
    : [];

  const config = statusConfig[poi.status];

  return (
    <div
      ref={drag}
      onClick={() => onOpen(poi)}
      className={`
        group bg-white rounded-lg border ${config.border} p-5 cursor-pointer
        hover:shadow-lg transition-all duration-200 relative
        ${isDragging ? "opacity-40 scale-95" : ""}
      `}
      style={{
        boxShadow: isDragging ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Image */}
      {poi.imageUrl && (
        <div className="relative -mx-5 -mt-5 mb-5 overflow-hidden rounded-t-lg">
          <img
            src={poi.imageUrl}
            alt={poi.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay badges */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {poi.isGeolocated && (
              <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                <MapPin className="size-3.5 text-[#D33333]" />
                <span className="text-xs font-medium text-zinc-900">Mapped</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-[15px] text-zinc-950 leading-tight tracking-tight">
          {poi.title}
        </h3>

        {/* Description */}
        {poi.description && (
          <p className="text-[13px] text-zinc-600 leading-relaxed line-clamp-2">
            {poi.description}
          </p>
        )}

        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 text-[12px] font-medium text-zinc-700">
            {poi.category}
          </span>
        </div>

        {/* Assigned Guides Thumbnails */}
        {hasGuides && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
            <div className="flex items-center -space-x-2">
              {assignedGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="size-7 rounded-full border-2 border-white overflow-hidden shadow-sm hover:scale-110 hover:z-10 transition-transform"
                  title={guide.title}
                >
                  <img
                    src={guide.thumbnail}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-[12px] text-zinc-500 font-medium">
              {assignedGuides.length} {assignedGuides.length === 1 ? 'guide' : 'guides'}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
          <span className="text-[12px] text-zinc-500">{poi.updatedAt}</span>
          
          {poi.status === "idea" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(poi);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D33333] text-white text-[12px] font-medium rounded-md hover:bg-[#b82828] transition-colors"
            >
              <Sparkles className="size-3.5" />
              Develop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  pois,
  onMove,
  onEdit,
  onOpen,
}: {
  status: POIStatus;
  pois: POI[];
  onMove: (poiId: string, newStatus: POIStatus) => void;
  onEdit: (poi: POI) => void;
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
      className={`
        flex-1 min-w-[320px] bg-zinc-50 rounded-xl p-6
        transition-all duration-200
        ${isOver ? "ring-2 ring-zinc-900 ring-offset-4 bg-zinc-100" : ""}
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`size-2 rounded-full ${config.dot}`} />
          <h2 className="font-semibold text-[14px] text-zinc-900 uppercase tracking-wide">
            {config.label}
          </h2>
          <div className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-white rounded-md border border-zinc-200">
            <span className="text-[13px] font-semibold text-zinc-700">{pois.length}</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {pois.map((poi) => (
          <POICard key={poi.id} poi={poi} onMove={onMove} onEdit={onEdit} onOpen={onOpen} />
        ))}
        
        {pois.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-zinc-200 rounded-lg">
            <p className="text-[13px] text-zinc-400 font-medium">Drop POIs here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function POIsManagerContent() {
  const [pois, setPOIs] = useState<POI[]>(mockPOIs);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [showPOIEditor, setShowPOIEditor] = useState(false);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const handleMovePOI = (poiId: string, newStatus: POIStatus) => {
    setPOIs(
      pois.map((poi) =>
        poi.id === poiId ? { ...poi, status: newStatus, updatedAt: "Ora" } : poi
      )
    );
  };

  const handleEditWithAI = (poi: POI) => {
    setSelectedPOI(poi);
    setShowAIAssistant(true);
  };

  const handleOpenPOI = (poi: POI) => {
    setSelectedPOI(poi);
    setShowPOIEditor(true);
  };

  const handleSavePOI = (updatedPOI: POI) => {
    setPOIs(
      pois.map((poi) =>
        poi.id === updatedPOI.id ? { ...updatedPOI, updatedAt: "Ora" } : poi
      )
    );
    setShowPOIEditor(false);
    setSelectedPOI(null);
  };

  const handleDeletePOI = (poiId: string) => {
    if (confirm("Sei sicuro di voler eliminare questo POI?")) {
      setPOIs(pois.filter((poi) => poi.id !== poiId));
      setShowPOIEditor(false);
      setSelectedPOI(null);
    }
  };

  const handleDevelopWithAI = () => {
    setShowPOIEditor(false);
    setShowAIAssistant(true);
  };

  const handleAIProposal = (proposal: any) => {
    if (selectedPOI && proposal.contents?.[selectedPOI.id]) {
      const content = proposal.contents[selectedPOI.id];
      setPOIs(
        pois.map((poi) =>
          poi.id === selectedPOI.id
            ? {
                ...poi,
                description: content.description,
                audioScript: content.audioScript,
                status: "complete" as POIStatus,
                updatedAt: "Ora",
              }
            : poi
        )
      );
      setShowAIAssistant(false);
      setSelectedPOI(null);
    }
  };

  const statuses: POIStatus[] = ["idea", "in-progress", "under-revision", "complete"];

  const stats = {
    total: pois.length,
    idea: pois.filter((p) => p.status === "idea").length,
    inProgress: pois.filter((p) => p.status === "in-progress").length,
    underRevision: pois.filter((p) => p.status === "under-revision").length,
    complete: pois.filter((p) => p.status === "complete").length,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
            <div className="space-y-3">
              <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight leading-tight">
                Points of Interest
              </h1>
              <p className="text-[15px] text-zinc-600 leading-relaxed max-w-2xl">
                Manage your editorial workflow with a visual pipeline. Drag and drop POIs between stages.
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all duration-200 shadow-sm hover:shadow-md">
              <Plus className="size-5" />
              New POI
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 transition-colors" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="space-y-2">
                <div className="text-[40px] font-light text-zinc-950 tracking-tight leading-none">
                  {stats.total}
                </div>
                <div className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Total POIs
                </div>
              </div>
            </div>

            {/* Idea */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 transition-colors" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-2 rounded-full bg-zinc-400" />
                </div>
                <div className="text-[40px] font-light text-zinc-500 tracking-tight leading-none">
                  {stats.idea}
                </div>
                <div className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Idea
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-xl border border-zinc-300 p-6 hover:border-zinc-400 transition-colors" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-2 rounded-full bg-zinc-900" />
                </div>
                <div className="text-[40px] font-light text-zinc-900 tracking-tight leading-none">
                  {stats.inProgress}
                </div>
                <div className="text-[12px] font-semibold text-zinc-700 uppercase tracking-wider">
                  In Progress
                </div>
              </div>
            </div>

            {/* Under Revision */}
            <div className="bg-white rounded-xl border border-orange-200 p-6 hover:border-orange-300 transition-colors" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-2 rounded-full bg-orange-500" />
                </div>
                <div className="text-[40px] font-light text-orange-700 tracking-tight leading-none">
                  {stats.underRevision}
                </div>
                <div className="text-[12px] font-semibold text-orange-700 uppercase tracking-wider">
                  Under Revision
                </div>
              </div>
            </div>

            {/* Complete */}
            <div className="bg-white rounded-xl border border-[#D33333] p-6 hover:border-[#b82828] transition-colors" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-2 rounded-full bg-[#D33333]" />
                </div>
                <div className="text-[40px] font-light tracking-tight leading-none" style={{ color: '#D33333' }}>
                  {stats.complete}
                </div>
                <div className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#D33333' }}>
                  Complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 pb-6">
          <div className="flex gap-6 min-w-max lg:min-w-0">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                pois={pois.filter((p) => p.status === status)}
                onMove={handleMovePOI}
                onEdit={handleEditWithAI}
                onOpen={handleOpenPOI}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && selectedPOI && (
        <AIAssistant
          guideName={`Sviluppa POI: ${selectedPOI.title}`}
          onClose={() => {
            setShowAIAssistant(false);
            setSelectedPOI(null);
          }}
          onAccept={handleAIProposal}
          documentsContext={[
            { id: "1", name: "Storia_Museo.pdf", type: "pdf" },
            { id: "2", name: "Catalogo_Opere.pdf", type: "pdf" },
          ]}
        />
      )}

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
          onDevelopWithAI={handleDevelopWithAI}
        />
      )}
    </div>
  );
}

export function POIsManager() {
  return (
    <DndProvider backend={HTML5Backend}>
      <POIsManagerContent />
    </DndProvider>
  );
}
