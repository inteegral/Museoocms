import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router";
import { ArrowLeft, Plus, GripVertical, X, Globe, FileText, CheckCircle2, AlertCircle, DollarSign, LockOpen, Pencil, ClipboardList, UserCircle2, MapPin, Languages, Mic, Rocket, Check, Shield, Clock, ChevronDown, Calendar, ImageIcon, Eye } from "lucide-react";
import confetti from "canvas-confetti";
import { mockGuides, mockPOIs, languages, mockSurveys, mockEvents } from "../../data/mockData";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { POIEditor } from "./POIEditor";
import { GuidePreviewModal } from "./GuidePreviewModal";
import { PageShell } from "./PageShell";
import { getMemberByGuideId, teamMembers, CURRENT_USER_ID, type TeamMember } from "../../data/teamData";
import { Translations } from "./Translations";
import { VoiceTalent } from "./VoiceTalent";

const COVER_GALLERY = [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
  "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80",
  "https://images.unsplash.com/photo-1579541671172-43429ce17aca?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800&q=80",
  "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&q=80",
  "https://images.unsplash.com/photo-1580974852861-c381510bc98d?w=800&q=80",
  "https://images.unsplash.com/photo-1569779213435-ba3167dde7cc?w=800&q=80",
  "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&q=80",
  "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?w=800&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
];

interface POI {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  orderIndex: number;
}

function POIItem({ poi, onRemove, onEdit, index, movePOI }: {
  poi: POI;
  onRemove: () => void;
  onEdit: () => void;
  index: number;
  movePOI: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "POI",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "POI",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        movePOI(item.index, index);
        item.index = index;
      }
    },
  });

  const [isActive, setIsActive] = useState(true);
  const hasContent = poi.body && poi.body.length > 50;

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        group relative flex items-center gap-4 py-5 pr-5 pl-16 bg-white rounded-lg border transition-all cursor-move
        ${isDragging ? "opacity-40 scale-95 border-zinc-200" : isActive ? "border-zinc-200 hover:border-zinc-300" : "border-zinc-200 hover:border-zinc-300"}
      `}
      style={{
        boxShadow: isDragging ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Toggle attivazione POI */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsActive((v) => !v); }}
        title={isActive ? "Disattiva POI" : "Attiva POI"}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-5 rounded-full flex items-center px-[3px] transition-colors duration-300 cursor-pointer z-10 focus:outline-none"
        style={{ background: isActive ? '#b8aa9c' : '#ece7e1' }}
      >
        <span
          className="size-[14px] rounded-full bg-white shadow-sm transition-transform duration-300"
          style={{ transform: isActive ? 'translateX(16px)' : 'translateX(0)' }}
        />
      </button>

      <GripVertical className="size-4 text-zinc-300 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className={`size-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 transition-all duration-300 ${!isActive ? "grayscale opacity-50" : ""}`}>
        <img src={poi.imageUrl} alt={poi.title} className="w-full h-full object-cover" />
      </div>

      <div className={`flex-1 min-w-0 transition-opacity duration-300 ${!isActive ? "opacity-40" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-[15px] text-zinc-950 mb-1 leading-tight">
              {poi.title}
            </h4>
            <p className="text-[13px] text-zinc-600 line-clamp-2 leading-relaxed">
              {poi.body.slice(0, 120)}...
            </p>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {hasContent ? (
              <CheckCircle2 className="size-4 text-emerald-500 mr-1" />
            ) : (
              <AlertCircle className="size-4 text-amber-500 mr-1" />
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideEditorContent() {
  const { id } = useParams();
  const location = useLocation();
  const incoming = location.state as { generatedName?: string; generatedDescription?: string; generatedPOIs?: POI[] } | null;
  const currentUser = teamMembers.find((m) => m.id === CURRENT_USER_ID)!;
  const guide = mockGuides.find((g) => g.id === id);
  const [selectedPOIs, setSelectedPOIs] = useState<POI[]>(incoming?.generatedPOIs ?? mockPOIs.slice(0, guide?.poiCount || 0));
  const [title, setTitle] = useState(incoming?.generatedName || guide?.title || "");
  const [description, setDescription] = useState(incoming?.generatedDescription || guide?.description || "");
  const [showAddPOI, setShowAddPOI] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(guide?.languages || ["it"]);
  const [status, setStatus] = useState<"draft" | "published">(guide?.status || "draft");
  const [accessType, setAccessType] = useState<"free" | "paid">("free");
  const [editingPOI, setEditingPOI] = useState<POI | null>(null);
  const [creatingPOI, setCreatingPOI] = useState(false);
  const [linkedSurveyId, setLinkedSurveyId] = useState<string>("");
  const [expositionType, setExpositionType] = useState<"permanent" | "temporary">(guide?.expositionType ?? "permanent");
  const [startDate, setStartDate] = useState<string>(guide?.startDate ?? "");
  const [endDate, setEndDate] = useState<string>(guide?.endDate ?? "");
  const [linkedEventIds, setLinkedEventIds] = useState<string[]>(
    () => mockEvents.filter((e) => e.linkedGuides.includes(id || "")).map((e) => e.id)
  );
  const [showAddEvent, setShowAddEvent] = useState(false);
  const linkedEvents = mockEvents.filter((e) => linkedEventIds.includes(e.id));
  const availableEvents = mockEvents.filter((e) => !linkedEventIds.includes(e.id));
  const [responsible, setResponsible] = useState<TeamMember | undefined>(() =>
    id ? getMemberByGuideId(id) : undefined
  );
  const [responsiblePickerOpen, setResponsiblePickerOpen] = useState(false);
  const assignableMembers = teamMembers.filter((m) => m.status === "active");
  const [activeModal, setActiveModal] = useState<null | "translations" | "voicing" | "publish">(null);
  const [approvalState, setApprovalState] = useState<{ approvedBy: TeamMember; date: string } | null>(null);
  const [reviewRequest, setReviewRequest] = useState<{ to: TeamMember; date: string } | null>(null);
  const [showFinalReview, setShowFinalReview] = useState(false);
  const [selectedReviewerId, setSelectedReviewerId] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewMode, setReviewMode] = useState<"member" | "invite">("member");
  const [inviteEmail, setInviteEmail] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>(guide?.thumbnail ?? "");
  const [showCoverGallery, setShowCoverGallery] = useState(false);

  const movePOI = (dragIndex: number, hoverIndex: number) => {
    const newPOIs = [...selectedPOIs];
    const [removed] = newPOIs.splice(dragIndex, 1);
    newPOIs.splice(hoverIndex, 0, removed);
    setSelectedPOIs(newPOIs);
  };

  const removePOI = (poiId: string) => {
    setSelectedPOIs(selectedPOIs.filter((p) => p.id !== poiId));
  };

  const addPOI = (poi: POI) => {
    setSelectedPOIs([...selectedPOIs, poi]);
    setShowAddPOI(false);
  };

  const savePOI = (updated: any) => {
    setSelectedPOIs(selectedPOIs.map((p) =>
      p.id === updated.id ? { ...p, title: updated.title, body: updated.audioScript ?? p.body } : p
    ));
    setEditingPOI(null);
  };

  const blankEditorPOI = () => ({
    id: `poi-new-${Date.now()}`,
    title: "",
    description: "",
    status: "in-progress" as const,
    category: "General",
    imageUrl: "",
    audioScript: "",
    updatedAt: "now",
  });

  const handleNewPOISave = (saved: any) => {
    const newPOI: POI = {
      id: saved.id,
      title: saved.title,
      body: saved.audioScript ?? "",
      imageUrl: saved.imageUrl ?? "",
      orderIndex: selectedPOIs.length,
    };
    setSelectedPOIs([...selectedPOIs, newPOI]);
    setCreatingPOI(false);
    setShowAddPOI(false);
  };

  const toEditorPOI = (poi: POI) => ({
    id: poi.id,
    title: poi.title,
    description: "",
    status: "in-progress" as const,
    category: "General",
    imageUrl: poi.imageUrl,
    audioScript: poi.body,
    updatedAt: "now",
  });

  const availablePOIs = mockPOIs.filter(
    (poi) => !selectedPOIs.find((sp) => sp.id === poi.id)
  );

  const maxPOIs = 10; // Free tier limit
  const completedPOIs = selectedPOIs.filter(p => p.body && p.body.length > 50).length;
  const progressPercentage = selectedPOIs.length > 0 ? Math.round((completedPOIs / selectedPOIs.length) * 100) : 0;

  const flagMap: Record<string, string> = { it: "🇮🇹", en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", es: "🇪🇸", pt: "🇵🇹", zh: "🇨🇳", ja: "🇯🇵", ar: "🇸🇦" };

  const langRows = selectedLanguages.map((lang, i) => ({
    lang,
    hasContent: true,
    hasTranslation: i === 0,
    hasVoice: false,
  }));

  const publishChecks = [
    {
      label: "All POI content complete",
      ok: selectedPOIs.length > 0 && completedPOIs === selectedPOIs.length,
      detail: selectedPOIs.length === 0 ? "No POIs added" : completedPOIs < selectedPOIs.length ? `${selectedPOIs.length - completedPOIs} POIs need content` : undefined,
      action: (selectedPOIs.length === 0 || completedPOIs < selectedPOIs.length) ? { label: "Edit POIs", onClick: () => { setActiveModal(null); setTimeout(() => document.getElementById("poi-section")?.scrollIntoView({ behavior: "smooth" }), 100); } } : undefined,
    },
    {
      label: "Translations reviewed",
      ok: selectedLanguages.length > 1,
      detail: selectedLanguages.length <= 1 ? "Only source language configured" : undefined,
      action: selectedLanguages.length <= 1 ? { label: "Add translations", onClick: () => setActiveModal("translations") } : undefined,
    },
    {
      label: "Voice talent assigned",
      ok: false,
      detail: "No voice assigned yet",
      action: { label: "Go to Voicing", onClick: () => setActiveModal("voicing") },
    },
    {
      label: "Pronunciations validated",
      ok: false,
      detail: "3 words to confirm",
      action: { label: "Go to Voicing", onClick: () => setActiveModal("voicing") },
    },
    {
      label: "Guide metadata complete",
      ok: title.length > 0 && description.length > 0,
      detail: !title.length || !description.length ? "Add a title and description" : undefined,
    },
    {
      label: "All media uploaded",
      ok: selectedPOIs.length > 0 && selectedPOIs.every((p) => !!p.imageUrl),
      detail: selectedPOIs.filter((p) => !p.imageUrl).length > 0 ? `${selectedPOIs.filter((p) => !p.imageUrl).length} POIs missing images` : undefined,
    },
  ];
  const checksOkCount = publishChecks.filter((c) => c.ok).length;
  const allChecksOk = checksOkCount === publishChecks.length;
  const publishReadyPct = Math.round((checksOkCount / publishChecks.length) * 100);
  const canPublish = allChecksOk || approvalState !== null;
  const canSelfApprove =
    currentUser.role === "owner" ||
    currentUser.role === "admin" ||
    currentUser.id === responsible?.id;
  const reviewableMembers = teamMembers.filter((m) => m.status === "active" && m.id !== currentUser.id);

  const handlePublish = () => {
    setStatus("published");
    setActiveModal(null);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  if (!guide) {
    return <div className="p-8">Guide not found</div>;
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Guides
        </Link>

        {/* Guide Header Card */}
        <div className="mb-8 bg-white border border-zinc-200 rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)' }}>
          {/* Title & meta */}
          <div className="px-7 pt-7 pb-5 border-b border-zinc-100 group/header">
            <div className="flex items-start justify-between gap-4 mb-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-[26px] font-semibold text-zinc-950 tracking-tight flex-1 border-none outline-none bg-transparent focus:ring-0 placeholder:text-zinc-300 cursor-text"
                placeholder="Guide Title"
              />
              <div className="flex items-center gap-3 flex-shrink-0 mt-1.5">
                <Pencil className="size-3.5 text-zinc-300 group-hover/header:text-zinc-400 transition-colors" />
                <div className={`size-2 rounded-full ${status === 'published' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                <span className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wide">
                  {status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={1}
              className="text-[14px] text-zinc-500 leading-relaxed w-full border-none outline-none bg-transparent resize-none focus:ring-0 placeholder:text-zinc-300 cursor-text"
              placeholder="Add a description..."
            />
          </div>

          {/* Workflow progress */}
          {(() => {
            const steps = [
              { id: "itinerary",    label: "Itinerary",    done: selectedPOIs.length > 0 && completedPOIs > 0, onClick: () => document.getElementById("poi-section")?.scrollIntoView({ behavior: "smooth" }) },
              { id: "translations", label: "Translations", done: selectedLanguages.length > 1,                  onClick: () => setActiveModal("translations") },
              { id: "voicing",      label: "Voicing",      done: false,                                         onClick: () => setActiveModal("voicing") },
              { id: "publish",      label: "Publish",      done: status === "published",                         onClick: () => setActiveModal("publish") },
            ];
            const nextStep = steps.find(s => !s.done);
            return (
              <div className="px-7 py-3.5 border-b border-zinc-100 flex items-center gap-2">
                {steps.map((step, i) => {
                  const inner = (
                    <div className="flex items-center gap-1.5">
                      <div className={`size-2 rounded-full flex-shrink-0 ${step.done ? "bg-zinc-900" : step.id === nextStep?.id ? "bg-zinc-400" : "bg-zinc-200"}`} />
                      <span className={`text-[12px] font-medium whitespace-nowrap ${step.done ? "text-zinc-400" : step.id === nextStep?.id ? "text-zinc-800" : "text-zinc-400"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                  const element = <button onClick={step.onClick} className="hover:opacity-70 transition-opacity cursor-pointer">{inner}</button>;
                  return (
                    <div key={step.id} className="flex items-center gap-2">
                      {i > 0 && <div className="w-6 h-px bg-zinc-200" />}
                      {element}
                    </div>
                  );
                })}
                <button
                  onClick={() => setShowPreview(true)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 transition-all text-[12px] font-medium"
                >
                  <Eye className="size-3.5" />
                  Preview
                </button>
              </div>
            );
          })()}

          {/* Languages */}
          <div className="px-7 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                Languages
              </span>
              <span className="text-[11px] text-zinc-400">
                Additional languages require a translation package
              </span>
            </div>
            <div className="flex items-end gap-4">
              {selectedLanguages.map((lang, i) => (
                <div key={lang} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wider ${
                      i === 0 ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                    style={{ boxShadow: i === 0 ? '0 2px 8px 0 rgba(0,0,0,0.15)' : 'none' }}
                  >
                    {lang.toUpperCase()}
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
                    {i === 0 ? "Primary" : languages.find(l => l.code === lang)?.name}
                  </span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1.5">
                <button className="size-10 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all">
                  <Plus className="size-3.5" />
                </button>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Add</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip — no card, just numbers inline */}
        <div className="flex items-center gap-8 mb-10 px-1">
          <div>
            <span className="text-[22px] font-light text-zinc-900">{selectedPOIs.length}</span>
            <span className="ml-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">POIs</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{selectedLanguages.length}</span>
            <span className="ml-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Languages</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{progressPercentage}%</span>
            <span className="ml-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Complete</span>
          </div>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main — dominant zone */}
          <div className="lg:col-span-2 space-y-6">
            {/* POIs Section */}
            <div id="poi-section" className="bg-white rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)' }}>
              <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-zinc-900">Points of Interest</h2>
                  <p className="text-[12px] text-zinc-400 mt-0.5">
                    Drag to reorder · {selectedPOIs.length}/{maxPOIs} used
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPOI(true)}
                  disabled={selectedPOIs.length >= maxPOIs}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="size-4" />
                  Add POI
                </button>
              </div>
              <div className="p-5">
                {selectedPOIs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="size-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="size-7 text-zinc-400" />
                    </div>
                    <p className="text-[14px] text-zinc-600 mb-1">No POIs added yet</p>
                    <p className="text-[12px] text-zinc-400">Add POIs manually or use AI Assistant</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPOIs.map((poi, index) => (
                      <POIItem
                        key={poi.id}
                        poi={poi}
                        index={index}
                        onRemove={() => removePOI(poi.id)}
                        onEdit={() => setEditingPOI(poi)}
                        movePOI={movePOI}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Events Section */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)" }}>
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-zinc-900">Events</h2>
                  <p className="text-[12px] text-zinc-400 mt-0.5">
                    Announce events within this guide
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEvent(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                >
                  <Plus className="size-3.5" />
                  Add Event
                </button>
              </div>

              <div className="p-4">
                {linkedEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                      <Calendar className="size-5 text-zinc-300" />
                    </div>
                    <p className="text-[13px] text-zinc-500 mb-0.5">No events linked</p>
                    <p className="text-[11px] text-zinc-400">Link an event to promote it inside this guide</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {linkedEvents.map((event) => {
                      const isSingleDay = event.startDate === event.endDate;
                      const statusColors = {
                        upcoming: "bg-blue-50 text-blue-700",
                        ongoing: "bg-emerald-50 text-emerald-700",
                        past: "bg-zinc-100 text-zinc-500",
                      };
                      const statusLabels = { upcoming: "Upcoming", ongoing: "Ongoing", past: "Past" };
                      return (
                        <div key={event.id} className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
                          <div className="size-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                            {event.imageUrl ? (
                              <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Calendar className="size-4 text-zinc-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-zinc-900 truncate leading-tight">{event.title}</p>
                            <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
                              <Calendar className="size-3 flex-shrink-0" />
                              {isSingleDay
                                ? new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                                : `${new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                              {event.location && <> · {event.location}</>}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[event.status]}`}>
                              {statusLabels[event.status]}
                            </span>
                            <button
                              onClick={() => setLinkedEventIds((ids) => ids.filter((i) => i !== event.id))}
                              className="p-1 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar — secondary panel */}
          <div className="bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
            {/* Cover Image */}
            <div className="p-5 border-b border-zinc-200">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Cover Image</p>
              {thumbnail ? (
                <div className="relative group rounded-lg overflow-hidden aspect-video bg-zinc-200">
                  <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setShowCoverGallery(true)}
                      className="px-3 py-1.5 bg-white text-zinc-900 text-[12px] font-semibold rounded-lg shadow-md hover:bg-zinc-50 transition-colors"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => setThumbnail("")}
                      className="p-1.5 bg-white text-zinc-900 rounded-lg shadow-md hover:bg-zinc-50 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCoverGallery(true)}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-100 transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <ImageIcon className="size-6 text-zinc-300 group-hover:text-zinc-400 transition-colors" />
                  <span className="text-[12px] font-medium text-zinc-400 group-hover:text-zinc-500 transition-colors">Choose cover image</span>
                </button>
              )}
            </div>

            {/* Publishing */}
            <div className="p-5 border-b border-zinc-200">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-4">Publishing</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-zinc-500 mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-[12px] font-medium text-zinc-500 mb-2">Availability</label>
                  <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg mb-2">
                    {(["permanent", "temporary"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setExpositionType(type)}
                        className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
                          expositionType === type
                            ? "bg-white text-zinc-900 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-700"
                        }`}
                      >
                        {type === "permanent" ? "Permanent" : "Temporary"}
                      </button>
                    ))}
                  </div>
                  {expositionType === "temporary" && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Start</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">End</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                      {endDate && new Date(endDate) < new Date() && (
                        <p className="flex items-center gap-1.5 text-[11px] text-amber-600">
                          <span className="size-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          This exposition has ended
                        </p>
                      )}
                      {startDate && endDate && new Date(endDate) >= new Date() && (
                        <p className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                          <Calendar className="size-3 flex-shrink-0" />
                          Active until {new Date(endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-zinc-500 mb-1.5">Access Type</label>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setAccessType("free")}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        accessType === "free" ? "border-zinc-900 bg-white" : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${accessType === "free" ? "border-zinc-900" : "border-zinc-300"}`}>
                          {accessType === "free" && <div className="size-2 rounded-full bg-zinc-900" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <LockOpen className="size-3.5 text-zinc-600" />
                            <span className="text-[13px] font-semibold text-zinc-900">Free Access</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Universal QR code</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setAccessType("paid")}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        accessType === "paid" ? "border-zinc-900 bg-white" : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${accessType === "paid" ? "border-zinc-900" : "border-zinc-300"}`}>
                          {accessType === "paid" && <div className="size-2 rounded-full bg-zinc-900" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="size-3.5 text-zinc-600" />
                            <span className="text-[13px] font-semibold text-zinc-900">Paid Access</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Unique QR per visitor</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  {accessType === "paid" && (
                    <p className="text-[11px] text-blue-600 mt-2 leading-relaxed">
                      Generate QR codes in Monetization after publishing.
                    </p>
                  )}
                </div>

                <button
                  className="w-full px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-40"
                  disabled={selectedPOIs.length === 0}
                >
                  {status === 'published' ? 'Update Guide' : 'Publish Guide'}
                </button>
              </div>
            </div>

            {/* Responsible */}
            <div className="p-5 border-b border-zinc-200">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Responsible</p>
              {responsible ? (
                <div className="group/resp">
                  <div className="flex items-start gap-2.5">
                    {/* Avatar */}
                    <div className="size-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                      {responsible.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-800 leading-tight">{responsible.name}</p>
                      <p className="text-[11px] text-zinc-400">{responsible.email}</p>
                      {responsible.bio && (
                        <p className="text-[11px] text-zinc-400 italic mt-1 leading-snug">{responsible.bio}</p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setResponsiblePickerOpen(true)}
                    className="mt-2 text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button onClick={() => setResponsiblePickerOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-zinc-200 rounded-lg text-[12px] text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 hover:bg-zinc-50 transition-all"
                >
                  <UserCircle2 className="size-4" strokeWidth={1.5} />
                  Assign responsible
                </button>
              )}

              {/* Picker dropdown */}
              {responsiblePickerOpen && (
                <div className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setResponsiblePickerOpen(false)}
                >
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100">
                      <p className="text-[13px] font-semibold text-zinc-900">Assign responsible</p>
                      <button onClick={() => setResponsiblePickerOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {assignableMembers.map((m) => (
                        <button key={m.id}
                          onClick={() => { setResponsible(m); setResponsiblePickerOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${responsible?.id === m.id ? "bg-violet-50" : "hover:bg-zinc-50"}`}
                        >
                          <div className="size-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[10px] flex-shrink-0">
                            {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-zinc-800">{m.name}</p>
                            {m.bio && <p className="text-[11px] text-zinc-400 truncate italic">{m.bio}</p>}
                          </div>
                          {responsible?.id === m.id && <CheckCircle2 className="size-4 text-violet-500 flex-shrink-0" />}
                        </button>
                      ))}
                      <div className="h-px bg-zinc-100 my-1" />
                      <button onClick={() => { setResponsible(undefined); setResponsiblePickerOpen(false); }}
                        className="w-full px-3 py-2 text-[12px] text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg text-left transition-colors"
                      >
                        Remove assignment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="p-5 border-b border-zinc-200">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Metadata</p>
              <div className="space-y-2.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Created</span>
                  <span className="font-medium text-zinc-700">Jan 22, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Last Modified</span>
                  <span className="font-medium text-zinc-700">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">POIs</span>
                  <span className="font-medium text-zinc-700">{selectedPOIs.length}</span>
                </div>
              </div>
            </div>

            {/* Survey */}
            <div className="p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <ClipboardList className="size-3.5 text-zinc-400" strokeWidth={1.5} />
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Survey</p>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">Associate a feedback survey to be shown to visitors after completing this guide.</p>
              <div className="relative">
                <select
                  value={linkedSurveyId}
                  onChange={(e) => setLinkedSurveyId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                >
                  <option value="">No survey linked</option>
                  {mockSurveys.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <Globe className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
              </div>
              {linkedSurveyId && (
                <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                  Survey linked
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* POI Editor — edit existing */}
      {editingPOI && (
        <POIEditor
          poi={toEditorPOI(editingPOI)}
          onClose={() => setEditingPOI(null)}
          onSave={savePOI}
          onDelete={() => { removePOI(editingPOI.id); setEditingPOI(null); }}
        />
      )}

      {/* POI Editor — create new */}
      {creatingPOI && (
        <POIEditor
          poi={blankEditorPOI()}
          onClose={() => setCreatingPOI(false)}
          onSave={handleNewPOISave}
          onDelete={() => setCreatingPOI(false)}
        />
      )}

      {/* Add POI Modal */}
      {showAddPOI && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-[18px] font-semibold text-zinc-950">Add Point of Interest</h2>
              <button
                onClick={() => setShowAddPOI(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Subheader */}
            <div className="px-6 pt-3 pb-3 flex items-center justify-between border-b border-zinc-100 flex-shrink-0">
              <span className="text-[12px] text-zinc-400">
                {availablePOIs.length} available in library
              </span>
              <button
                onClick={() => { setShowAddPOI(false); setCreatingPOI(true); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
              >
                <Plus className="size-3.5" />
                Create New
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-3">
                {availablePOIs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[14px] text-zinc-500 mb-1">All POIs are already added</p>
                    <p className="text-[12px] text-zinc-400">Use "+ Create New" to add a new POI from scratch</p>
                  </div>
                ) : (
                  availablePOIs.map((poi) => (
                    <button
                      key={poi.id}
                      onClick={() => addPOI(poi)}
                      className="w-full flex items-start gap-4 p-4 border border-zinc-200 rounded-lg hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left"
                    >
                      <img
                        src={poi.imageUrl}
                        alt={poi.title}
                        className="size-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[15px] text-zinc-950 mb-1">
                          {poi.title}
                        </h3>
                        <p className="text-[13px] text-zinc-600 line-clamp-2">
                          {poi.body.slice(0, 100)}...
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddEvent(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 flex-shrink-0">
              <div>
                <p className="text-[14px] font-semibold text-zinc-900">Link an Event</p>
                <p className="text-[12px] text-zinc-400 mt-0.5">Select events to promote in this guide</p>
              </div>
              <button onClick={() => setShowAddEvent(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-3">
              {availableEvents.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-[13px] text-zinc-500">All events are already linked.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {availableEvents.map((event) => {
                    const isSingleDay = event.startDate === event.endDate;
                    const statusColors = {
                      upcoming: "bg-blue-50 text-blue-700",
                      ongoing: "bg-emerald-50 text-emerald-700",
                      past: "bg-zinc-100 text-zinc-500",
                    };
                    const statusLabels = { upcoming: "Upcoming", ongoing: "Ongoing", past: "Past" };
                    return (
                      <button
                        key={event.id}
                        onClick={() => { setLinkedEventIds((ids) => [...ids, event.id]); setShowAddEvent(false); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all text-left"
                      >
                        <div className="size-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Calendar className="size-4 text-zinc-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-zinc-800 truncate">{event.title}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
                            <Calendar className="size-3 flex-shrink-0" />
                            {isSingleDay
                              ? new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                              : `${new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                          </p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColors[event.status]}`}>
                          {statusLabels[event.status]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guide Preview Modal */}
      {showPreview && (
        <GuidePreviewModal guideName={title} onClose={() => setShowPreview(false)} />
      )}

      {/* Cover Gallery Modal */}
      {showCoverGallery && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4" onClick={() => setShowCoverGallery(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-zinc-950">Choose Cover Image</h3>
              <button onClick={() => setShowCoverGallery(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-3 gap-3 max-h-[420px] overflow-y-auto">
              {COVER_GALLERY.map((url) => (
                <button
                  key={url}
                  onClick={() => { setThumbnail(url); setShowCoverGallery(false); }}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${thumbnail === url ? "border-zinc-900" : "border-transparent hover:border-zinc-300"}`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {thumbnail === url && (
                    <div className="absolute inset-0 bg-zinc-900/30 flex items-center justify-center">
                      <Check className="size-5 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Translations Modal */}
      {activeModal === "translations" && (
        <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <span className="text-[14px] font-semibold text-zinc-900">Translations — {title}</span>
              <button onClick={() => setActiveModal(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <Translations defaultGuideId={id} />
            </div>
          </div>
        </div>
      )}

      {/* Voicing Modal */}
      {activeModal === "voicing" && (
        <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <span className="text-[14px] font-semibold text-zinc-900">Voicing — {title}</span>
              <button onClick={() => setActiveModal(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <VoiceTalent onPublish={() => setActiveModal("publish")} />
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {activeModal === "publish" && (
        <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <div>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Publication</p>
                <p className="text-[15px] font-semibold text-zinc-900 leading-tight">{title}</p>
                <p className="text-[12px] text-zinc-400 mt-0.5">{selectedPOIs.length} points of interest</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors mt-0.5">
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">

              {/* Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-zinc-900">Publication Checklist</h3>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${allChecksOk ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {publishReadyPct}% ready
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${allChecksOk ? "bg-emerald-500" : "bg-amber-400"}`}
                    style={{ width: `${publishReadyPct}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {publishChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-50">
                      <div className={`size-6 rounded-full flex items-center justify-center flex-shrink-0 ${check.ok ? "bg-emerald-100" : "bg-amber-100"}`}>
                        {check.ok
                          ? <Check className="size-3.5 text-emerald-600" />
                          : <AlertCircle className="size-3.5 text-amber-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-zinc-800">{check.label}</p>
                        {check.detail && <p className="text-[11px] text-zinc-400">{check.detail}</p>}
                      </div>
                      {!check.ok && check.action && (
                        <button
                          onClick={check.action.onClick}
                          className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          {check.action.label} →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Language status */}
              <div>
                <h3 className="text-[13px] font-semibold text-zinc-900 mb-3">Language Status</h3>
                <div className="rounded-xl overflow-hidden border border-zinc-200">
                  <div className="grid grid-cols-6 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
                    <span className="col-span-2">Language</span>
                    <span className="text-center">Content</span>
                    <span className="text-center">Translation</span>
                    <span className="text-center">Voice</span>
                    <span className="text-center">Status</span>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {langRows.map((row) => (
                      <div key={row.lang} className="grid grid-cols-6 items-center px-4 py-3">
                        <span className="col-span-2 text-[13px] font-medium text-zinc-800">
                          {flagMap[row.lang] ?? "🌐"} {languages.find((l) => l.code === row.lang)?.name ?? row.lang.toUpperCase()}
                        </span>
                        {[row.hasContent, row.hasTranslation, row.hasVoice].map((ok, i) => (
                          <div key={i} className="flex justify-center">
                            {ok
                              ? <CheckCircle2 className="size-4 text-emerald-500" />
                              : <div className="size-4 rounded-full border-2 border-zinc-200" />}
                          </div>
                        ))}
                        <div className="flex justify-center">
                          {row.hasContent && row.hasTranslation && row.hasVoice
                            ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Ready</span>
                            : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">In progress</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Review request banner (pending) */}
            {reviewRequest && !approvalState && (
              <div className="mx-6 mb-2 flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Clock className="size-4 text-amber-600 flex-shrink-0" />
                  <p className="text-[12px] font-medium text-amber-800 truncate">
                    Review requested from <span className="font-semibold">{reviewRequest.to.name}</span> · {reviewRequest.date}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    to={`/review/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap underline underline-offset-2"
                  >
                    Open review link ↗
                  </Link>
                  <button
                    onClick={() => setApprovalState({ approvedBy: reviewRequest.to, date: reviewRequest.date })}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap underline underline-offset-2"
                  >
                    Simulate approval
                  </button>
                </div>
              </div>
            )}

            {/* Approval banner (approved) */}
            {approvalState && (
              <div className="mx-6 mb-2 flex items-center gap-2.5 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0" />
                <p className="text-[12px] font-medium text-emerald-800">
                  Approved by <span className="font-semibold">{approvalState.approvedBy.name}</span> · {approvalState.date}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 flex-shrink-0">
              {!approvalState ? (
                <button
                  onClick={() => setShowFinalReview(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 text-[13px] font-semibold text-zinc-700 rounded-lg hover:bg-zinc-50 transition-all"
                >
                  <Shield className="size-4" />
                  Final Review
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700">
                  <CheckCircle2 className="size-4" /> Approved
                </span>
              )}
              <button
                disabled={!canPublish}
                onClick={handlePublish}
                className="inline-flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Rocket className="size-4" />
                Publish Guide
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Final Review sub-modal */}
      {showFinalReview && (
        <div
          className="fixed inset-0 z-[60] bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowFinalReview(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
              <div>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Final Review</p>
                <p className="text-[15px] font-semibold text-zinc-900 leading-tight">{title}</p>
              </div>
              <button onClick={() => setShowFinalReview(false)} className="text-zinc-400 hover:text-zinc-700 mt-0.5">
                <X className="size-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* Option 1 — Request review (primary) */}
              <div>
                <p className="text-[13px] font-semibold text-zinc-900 mb-0.5">Request review</p>
                <p className="text-[12px] text-zinc-500 mb-3">Send to a team member or invite someone external.</p>

                {/* Mode toggle */}
                <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg mb-3">
                  {(["member", "invite"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setReviewMode(mode); setSelectedReviewerId(""); setInviteEmail(""); }}
                      className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
                        reviewMode === mode
                          ? "bg-white text-zinc-900 shadow-sm"
                          : "text-zinc-400 hover:text-zinc-700"
                      }`}
                    >
                      {mode === "member" ? "Team member" : "Invite by email"}
                    </button>
                  ))}
                </div>

                {/* Team member picker */}
                {reviewMode === "member" && (
                  <>
                    <div className="relative mb-3">
                      <select
                        value={selectedReviewerId}
                        onChange={(e) => setSelectedReviewerId(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                      >
                        <option value="">Select reviewer…</option>
                        {reviewableMembers.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} · {m.role}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                    </div>
                    {selectedReviewerId && (() => {
                      const member = reviewableMembers.find((m) => m.id === selectedReviewerId);
                      if (!member) return null;
                      return (
                        <div className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 rounded-xl mb-3">
                          <div className="size-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-zinc-800">{member.name}</p>
                            <p className="text-[11px] text-zinc-400 capitalize">{member.role}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}

                {/* Invite by email */}
                {reviewMode === "invite" && (
                  <div className="mb-3">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-400 mt-1.5">
                      They'll receive a link to review this guide. No account needed.
                    </p>
                  </div>
                )}

                {/* Note */}
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Add a note… (optional)"
                  rows={2}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[12px] text-zinc-900 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 mb-3"
                />

                <button
                  disabled={reviewMode === "member" ? !selectedReviewerId : !inviteEmail.includes("@")}
                  onClick={() => {
                    const toMember: TeamMember = reviewMode === "member"
                      ? reviewableMembers.find((m) => m.id === selectedReviewerId)!
                      : { id: "invited", name: inviteEmail, email: inviteEmail, role: "curator", status: "pending", joinedAt: "", bio: "", assignments: [] };
                    setReviewRequest({
                      to: toMember,
                      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                    });
                    setSelectedReviewerId("");
                    setInviteEmail("");
                    setReviewNote("");
                    setShowFinalReview(false);
                  }}
                  className="w-full py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {reviewMode === "member" ? "Send for review →" : "Send invitation →"}
                </button>
              </div>

              {/* Option 2 — Self-approve (secondary, only if allowed) */}
              {canSelfApprove && (
                <div className="pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-zinc-100" />
                    <span className="text-[11px] text-zinc-400 font-medium">or</span>
                    <div className="flex-1 h-px bg-zinc-100" />
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 rounded-xl mb-3">
                    <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px] flex-shrink-0">
                      {currentUser.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-zinc-800">{currentUser.name}</p>
                      <p className="text-[10px] text-zinc-400 capitalize">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setApprovalState({
                        approvedBy: currentUser,
                        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                      });
                      setShowFinalReview(false);
                    }}
                    className="w-full py-2 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-xl hover:bg-zinc-50 transition-all"
                  >
                    Approve directly as {currentUser.role}
                  </button>
                  <p className="mt-2.5 text-center text-[10px] text-zinc-400">
                    <Link
                      to={`/review/${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-zinc-600 transition-colors"
                    >
                      Go to review page
                    </Link>
                    {" "}· developer only
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

export function GuideEditor() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GuideEditorContent />
    </DndProvider>
  );
}

