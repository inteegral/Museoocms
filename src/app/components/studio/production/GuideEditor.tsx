import { useState } from "react";
import { useParams, Link, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { mockGuides, mockPOIs, mockEvents, mockChallenges } from "../../../data/mockData";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { type QuizQuestion } from "../pois/POIEditor";
import { PageShell } from "../_layout/PageShell";
import { getMemberByGuideId, teamMembers, CURRENT_USER_ID, type TeamMember } from "../../../data/teamData";
import type { GuidePOI, POI, ProductionPhase } from "../../../types";
import { GuideEditorSidebar } from "./GuideEditorSidebar";
import { GuideHeaderCard } from "./GuideHeaderCard";
import { POISection } from "./POISection";
import { EventsSection } from "./EventsSection";
import { GuideEditorModals } from "./GuideEditorModals";
import { SourcesDrawer } from "./SourcesDrawer";


function GuideEditorContent() {
  const { id } = useParams();
  const location = useLocation();
  const incoming = location.state as { generatedName?: string; generatedDescription?: string; generatedPOIs?: GuidePOI[]; sources?: { name: string; type: "library" | "uploaded" }[]; scratch?: boolean } | null;
  const isScratch = incoming?.scratch === true;
  const currentUser = teamMembers.find((m) => m.id === CURRENT_USER_ID)!;
  const guide = mockGuides.find((g) => g.id === id);
  const [selectedPOIs, setSelectedPOIs] = useState<GuidePOI[]>(incoming?.generatedPOIs ?? mockPOIs.slice(0, guide?.poiCount || 0));
  const isNew = incoming !== null;
  const [title, setTitle] = useState(isNew ? (incoming.generatedName ?? "") : (guide?.title || ""));
  const [description, setDescription] = useState(isNew ? (incoming.generatedDescription ?? "") : (guide?.description || ""));
  const [showAddPOI, setShowAddPOI] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(isNew ? ["it"] : (guide?.languages || ["it"]));
  const [status, setStatus] = useState<"draft" | "published">(isNew ? "draft" : (guide?.status || "draft"));
  const [accessType, setAccessType] = useState<"free" | "paid">(isNew ? "free" : (guide?.accessMode === "paid" ? "paid" : "free"));
  const [editingPOI, setEditingPOI] = useState<POI | null>(null);
  const [creatingPOI, setCreatingPOI] = useState(false);
  const [linkedSurveyId, setLinkedSurveyId] = useState<string>("");
  const [expositionType, setExpositionType] = useState<"permanent" | "temporary">(guide?.expositionType ?? "permanent");
  const [startDate, setStartDate] = useState<string>(guide?.startDate ?? "");
  const [endDate, setEndDate] = useState<string>(guide?.endDate ?? "");
  const [linkedEventIds, setLinkedEventIds] = useState<string[]>(
    () => incoming !== null ? [] : mockEvents.filter((e) => e.linkedGuides.includes(id || "")).map((e) => e.id)
  );
  const [showAddEvent, setShowAddEvent] = useState(false);
  const linkedEvents = mockEvents.filter((e) => linkedEventIds.includes(e.id));
  const availableEvents = mockEvents.filter((e) => !linkedEventIds.includes(e.id));
  const [responsible, setResponsible] = useState<TeamMember | undefined>(() =>
    id ? getMemberByGuideId(id) : undefined
  );
  const [activeModal, setActiveModal] = useState<null | "translations" | "voicing" | "publish">(null);
  const [approvalState, setApprovalState] = useState<{ approvedBy: TeamMember; date: string } | null>(null);
  const [reviewRequest, setReviewRequest] = useState<{ to: TeamMember; date: string } | null>(null);
  const [showFinalReview, setShowFinalReview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>(isNew ? "" : (guide?.thumbnail ?? ""));
  const [showCoverGallery, setShowCoverGallery] = useState(false);
  const guideChallenges = incoming !== null ? [] : mockChallenges.filter(h => h.guideId === id);
  const [linkedChallengeId, setLinkedChallengeId] = useState<string>(guideChallenges[0]?.id ?? "");
  const [pendingAccessType, setPendingAccessType] = useState<"free" | "paid" | null>(null);

  const [productionPhase, setProductionPhase] = useState<ProductionPhase>(
    incoming ? "scripting" : (guide?.productionPhase as ProductionPhase | undefined) ?? "scripting"
  );
  const [pendingPhase, setPendingPhase] = useState<{ phase: ProductionPhase; direction: "forward" | "back" } | null>(null);
  const [phaseBlocker, setPhaseBlocker] = useState<{ title: string; detail: string } | null>(null);
  const sources = incoming?.sources ?? [];
  const [poiQuestions, setPoiQuestions] = useState<Record<string, QuizQuestion>>({});
  const [editingQuizPOI, setEditingQuizPOI] = useState<POI | null>(null);

  const translationLanguages = selectedLanguages.slice(1);
  const translatingHintJSX = translationLanguages.length > 0 ? (
    <>Scripts are locked. Translations in {translationLanguages.map((l, i) => (
      <span key={l}><span className="text-[#D33333] font-semibold">{l.toUpperCase()}</span>{i < translationLanguages.length - 1 ? ", " : ""}</span>
    ))} are being generated.</>
  ) : <>No additional languages configured. Add a language or skip directly to Voicing.</>;

  const movePOI = (dragIndex: number, hoverIndex: number) => {
    const newPOIs = [...selectedPOIs];
    const [removed] = newPOIs.splice(dragIndex, 1);
    newPOIs.splice(hoverIndex, 0, removed);
    setSelectedPOIs(newPOIs);
  };

  const removePOI = (poiId: string) => {
    setSelectedPOIs(selectedPOIs.filter((p) => p.id !== poiId));
  };

  const addPOI = (poi: GuidePOI) => {
    setSelectedPOIs([...selectedPOIs, poi]);
    setShowAddPOI(false);
  };

  const savePOI = (updated: any) => {
    setSelectedPOIs(selectedPOIs.map((p) =>
      p.id === updated.id ? { ...p, title: updated.title, body: updated.audioScript ?? p.body, status: updated.status ?? p.status } : p
    ));
    setEditingPOI(null);
  };

  const blankEditorPOI = () => ({
    id: `poi-new-${Date.now()}`,
    title: "",
    description: "",
    status: "draft" as const,
    category: "General",
    imageUrl: "",
    audioScript: "",
    updatedAt: "now",
  });

  const handleNewPOISave = (saved: any) => {
    const newPOI: GuidePOI = {
      id: saved.id,
      title: saved.title,
      body: saved.audioScript ?? "",
      imageUrl: saved.imageUrl ?? "",
      orderIndex: selectedPOIs.length,
      status: saved.status ?? "draft",
    };
    setSelectedPOIs([...selectedPOIs, newPOI]);
    setCreatingPOI(false);
    setShowAddPOI(false);
  };

  const toEditorPOI = (poi: GuidePOI) => ({
    id: poi.id,
    title: poi.title,
    description: "",
    status: poi.status ?? "draft" as const,
    category: "General",
    imageUrl: poi.imageUrl,
    audioScript: poi.body,
    updatedAt: "now",
  });

  const availablePOIs = mockPOIs.filter(
    (poi) => !selectedPOIs.find((sp) => sp.id === poi.id)
  );

  const maxPOIs = 10; // Free tier limit
  const completedPOIs = selectedPOIs.filter(p => p.status === "complete").length;
  const [translationsComplete, setTranslationsComplete] = useState(false);
  const progressPercentage = selectedPOIs.length > 0 ? Math.round((completedPOIs / selectedPOIs.length) * 100) : 0;

  const tryAdvancePhase = (targetPhase: ProductionPhase) => {
    if (targetPhase === "translating") {
      if (selectedPOIs.length === 0) {
        setPhaseBlocker({
          title: "No points of interest yet",
          detail: "Add at least one POI and complete its script before moving to Translation.",
        });
        return;
      }
      const incomplete = selectedPOIs.length - completedPOIs;
      if (incomplete > 0) {
        setPhaseBlocker({
          title: "Scripting not complete",
          detail: `${incomplete} POI${incomplete > 1 ? "s are" : " is"} still missing a script. Complete all scripts before starting Translation.`,
        });
        return;
      }
    }
    if (targetPhase === "voicing" && translationLanguages.length > 0 && !translationsComplete) {
      setPhaseBlocker({
        title: "Translations not complete",
        detail: "All translations must be approved before moving to Voicing.",
      });
      return;
    }
    setPendingPhase({ phase: targetPhase, direction: "forward" });
  };

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
      label: "Pronunciations validated",
      ok: false,
      detail: "3 words to confirm",
      action: { label: "Go to Voicing", onClick: () => setActiveModal("voicing") },
    },
    {
      label: "Voice talent assigned",
      ok: false,
      detail: "No voice assigned yet",
      action: { label: "Go to Voicing", onClick: () => setActiveModal("voicing") },
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

  const isPaid = isNew ? false : guide.accessMode === "paid";
  const accessBarUsed = isNew ? 0 : isPaid ? (guide.codesUsed ?? 0) : (guide.accessesUsed ?? 0);
  const accessBarTotal = isNew ? 200 : isPaid ? (guide.codesTotal ?? 0) : (guide.accessesLimit ?? 0);

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

        <GuideHeaderCard
          title={title} onTitleChange={setTitle}
          description={description} onDescriptionChange={setDescription}
          status={status}
          accessBar={{ isPaid, used: accessBarUsed, total: accessBarTotal }}
          productionPhase={productionPhase}
          poiCount={selectedPOIs.length} completedPOIs={completedPOIs}
          translationLanguages={translationLanguages} translationsComplete={translationsComplete}
          translatingHintJSX={translatingHintJSX}
          onOpenModal={setActiveModal}
          onTryAdvancePhase={tryAdvancePhase}
          onGoBack={(phase) => setPendingPhase({ phase, direction: "back" })}
          onPreview={() => setShowPreview(true)}
          selectedLanguages={selectedLanguages}
          onLanguageAdd={(code) => setSelectedLanguages(prev => [...prev, code])}
          onLanguageRemove={(code) => setSelectedLanguages(prev => prev.filter(c => c !== code))}
        />

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

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main — dominant zone */}
          <div className="lg:col-span-2 space-y-6">
            <POISection
              selectedPOIs={selectedPOIs} poiQuestions={poiQuestions}
              linkedChallengeId={linkedChallengeId} maxPOIs={maxPOIs}
              movePOI={movePOI} onAddPOI={() => setShowAddPOI(true)}
              onCreatePOI={() => setCreatingPOI(true)}
              onEditPOI={(poi) => setEditingPOI(poi as any)}
              onRemovePOI={removePOI}
              onQuizPOI={(poi) => setEditingQuizPOI(poi as any)}
            />

            <EventsSection
              linkedEvents={linkedEvents}
              onAddEvent={() => setShowAddEvent(true)}
              onUnlinkEvent={(eventId) => setLinkedEventIds(ids => ids.filter(i => i !== eventId))}
            />

          </div>

          {/* Sidebar — secondary panel */}
          <GuideEditorSidebar
            thumbnail={thumbnail}
            onThumbnailClear={() => setThumbnail("")}
            onOpenCoverGallery={() => setShowCoverGallery(true)}
            status={status}
            onStatusChange={setStatus}
            expositionType={expositionType}
            onExpositionTypeChange={setExpositionType}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            accessType={accessType}
            onAccessTypeClick={(type) => {
              if (type === accessType) return;
              if (status === "published") setPendingAccessType(type);
              else setAccessType(type);
            }}
            poiCount={selectedPOIs.length}
            responsible={responsible}
            onResponsibleChange={setResponsible}
            linkedSurveyId={linkedSurveyId}
            onLinkedSurveyIdChange={setLinkedSurveyId}
            linkedChallengeId={linkedChallengeId}
            onLinkedChallengeIdChange={setLinkedChallengeId}
          />
        </div>
      </div>

      <GuideEditorModals
        guide={{ id, title, status, thumbnail, languages: selectedLanguages }}
        poi={{
          editingPOI, setEditingPOI,
          creatingPOI, setCreatingPOI,
          showAddPOI, setShowAddPOI,
          availablePOIs, linkedChallengeId, poiCount: selectedPOIs.length,
          poiQuestions, setPoiQuestions,
          editingQuizPOI, setEditingQuizPOI,
          addPOI, savePOI, removePOI, handleNewPOISave, toEditorPOI, blankEditorPOI,
        }}
        event={{
          showAddEvent, setShowAddEvent, availableEvents,
          onLinkEvent: (eventId) => setLinkedEventIds(ids => [...ids, eventId]),
        }}
        modal={{
          activeModal, setActiveModal,
          showPreview, setShowPreview,
          showCoverGallery, setShowCoverGallery, setThumbnail,
          showFinalReview, setShowFinalReview,
        }}
        publish={{
          publishChecks, allChecksOk, publishReadyPct, canPublish,
          approvalState, setApprovalState,
          reviewRequest, setReviewRequest,
          canSelfApprove, reviewableMembers, currentUser,
          handlePublish,
          pendingAccessType, setPendingAccessType, setAccessType,
        }}
        phase={{
          phaseBlocker, setPhaseBlocker,
          pendingPhase, setPendingPhase,
          productionPhase, setProductionPhase,
          translationLanguages, setTranslationsComplete, translatingHintJSX,
          onAddLanguage: () => { setPendingPhase(null); setTimeout(() => document.getElementById("languages-section")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50); },
        }}
      />
      <SourcesDrawer sources={sources} />
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

