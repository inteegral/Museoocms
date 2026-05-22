import { useState } from "react";
import { useParams, Link, useLocation } from "react-router";
import { ArrowLeft, FileText, X } from "lucide-react";
import confetti from "canvas-confetti";
import { mockGuides, mockPOIs, mockEvents, mockChallenges } from "../../../data/mockData";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { POIEditor, type QuizQuestion } from "../pois/POIEditor";
import { GuidePreviewModal } from "../guides/GuidePreviewModal";
import { PageShell } from "../_layout/PageShell";
import { getMemberByGuideId, teamMembers, CURRENT_USER_ID, type TeamMember } from "../../../data/teamData";
import type { GuidePOI, POI, ProductionPhase } from "../../../types";
import { POIQuizModal } from "../engagement/POIQuizModal";
import { CoverGalleryModal } from "./modals/CoverGalleryModal";
import { AddPOIModal } from "./modals/AddPOIModal";
import { AddEventModal } from "./modals/AddEventModal";
import { PhaseBlockerModal } from "./modals/PhaseBlockerModal";
import { AccessTypeConfirmModal } from "./modals/AccessTypeConfirmModal";
import { PhaseTransitionModal } from "./modals/PhaseTransitionModal";
import { PublishModal } from "./modals/PublishModal";
import { FinalReviewModal } from "./modals/FinalReviewModal";
import { TranslationsModal } from "./TranslationsModal";
import { VoicingModal } from "./VoicingModal";
import { GuideEditorSidebar } from "./GuideEditorSidebar";
import { GuideHeaderCard, PHASES } from "./GuideHeaderCard";
import { POISection } from "./POISection";
import { EventsSection } from "./EventsSection";


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
  const [showSources, setShowSources] = useState(false);
  const [poiQuestions, setPoiQuestions] = useState<Record<string, QuizQuestion>>({});
  const [editingQuizPOI, setEditingQuizPOI] = useState<POI | null>(null);

  const translationLanguages = selectedLanguages.slice(1);
  const translatingHintJSX = translationLanguages.length > 0 ? (
    <>Scripts are locked. Translations in {translationLanguages.map((l, i) => (
      <span key={l}><span className="text-[#D33333] font-semibold">{l.toUpperCase()}</span>{i < translationLanguages.length - 1 ? ", " : ""}</span>
    ))} are being generated.</>
  ) : <>No additional languages configured. Add a language or skip directly to Voicing.</>;

  const BACK_WARNINGS: Partial<Record<ProductionPhase, string>> = {
    scripting:   "Going back to Scripting will unlock scripts for editing. Existing translations will need to be regenerated.",
    translating: "Going back to Translation will unlock translations for editing. Generated audio may become outdated.",
    voicing:     "Going back to Voicing will unlock audio generation. Review state will be reset.",
  };

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

      {/* POI Editor — edit existing */}
      {editingPOI && (
        <POIEditor
          poi={toEditorPOI(editingPOI)}
          onClose={() => setEditingPOI(null)}
          onSave={savePOI}
          onDelete={() => { removePOI(editingPOI.id); setEditingPOI(null); }}
          guideId={id}
          guideContext={{ id: id || "", title, status, thumbnail, languages: selectedLanguages }}
          guideLanguages={selectedLanguages}
          quizQuestion={poiQuestions[editingPOI.id]}
          onQuizChange={(q) => setPoiQuestions((prev) => q ? { ...prev, [editingPOI.id]: q } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== editingPOI.id)))}
          hasChallenge={linkedChallengeId !== ""}
        />
      )}

      {/* POI Editor — create new */}
      {creatingPOI && (
        <POIEditor
          poi={blankEditorPOI()}
          onClose={() => setCreatingPOI(false)}
          onSave={handleNewPOISave}
          onDelete={() => setCreatingPOI(false)}
          guideId={id}
          guideContext={{ id: id || "", title, status, thumbnail, languages: selectedLanguages }}
          guideLanguages={selectedLanguages}
          hasChallenge={linkedChallengeId !== ""}
        />
      )}

      {/* Add POI Modal */}
      {showAddPOI && (
        <AddPOIModal
          availablePOIs={availablePOIs}
          onAdd={addPOI}
          onCreate={() => { setShowAddPOI(false); setCreatingPOI(true); }}
          onClose={() => setShowAddPOI(false)}
        />
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <AddEventModal
          availableEvents={availableEvents}
          onLink={(eventId) => { setLinkedEventIds((ids) => [...ids, eventId]); setShowAddEvent(false); }}
          onClose={() => setShowAddEvent(false)}
        />
      )}

      {/* Guide Preview Modal */}
      {showPreview && (
        <GuidePreviewModal guideName={title} guideId={id} onClose={() => setShowPreview(false)} />
      )}

      {/* Cover Gallery Modal */}
      {showCoverGallery && (
        <CoverGalleryModal
          thumbnail={thumbnail}
          onSelect={(url) => { setThumbnail(url); setShowCoverGallery(false); }}
          onClose={() => setShowCoverGallery(false)}
        />
      )}

      {/* Translations Modal */}
      {activeModal === "translations" && (
        <TranslationsModal
          title={title}
          guideId={id}
          selectedLanguages={selectedLanguages}
          onClose={() => setActiveModal(null)}
          onCompletionChange={setTranslationsComplete}
        />
      )}

      {/* Voicing Modal */}
      {activeModal === "voicing" && (
        <VoicingModal
          title={title}
          onClose={() => setActiveModal(null)}
          onPublish={() => setActiveModal("publish")}
        />
      )}

      {/* Publish Modal */}
      {activeModal === "publish" && (
        <PublishModal
          title={title}
          poiCount={selectedPOIs.length}
          publishChecks={publishChecks}
          allChecksOk={allChecksOk}
          publishReadyPct={publishReadyPct}
          canPublish={canPublish}
          approvalState={approvalState}
          reviewRequest={reviewRequest}
          guideId={id}
          onClose={() => setActiveModal(null)}
          onPublish={handlePublish}
          onFinalReview={() => setShowFinalReview(true)}
          onSimulateApproval={() => reviewRequest && setApprovalState({ approvedBy: reviewRequest.to, date: reviewRequest.date })}
        />
      )}
      {/* Access type change confirmation — published guides only */}
      {pendingAccessType && (
        <AccessTypeConfirmModal
          pendingAccessType={pendingAccessType}
          onConfirm={() => { setAccessType(pendingAccessType); setPendingAccessType(null); }}
          onCancel={() => setPendingAccessType(null)}
        />
      )}

      {/* Final Review sub-modal */}
      {showFinalReview && (
        <FinalReviewModal
          title={title}
          guideId={id}
          currentUser={currentUser}
          canSelfApprove={canSelfApprove}
          reviewableMembers={reviewableMembers}
          onClose={() => setShowFinalReview(false)}
          onRequestReview={(to) => setReviewRequest({ to, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) })}
          onSelfApprove={(user) => setApprovalState({ approvedBy: user, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) })}
        />
      )}

      {/* Phase blocker — cannot advance */}
      {phaseBlocker && (
        <PhaseBlockerModal
          title={phaseBlocker.title}
          detail={phaseBlocker.detail}
          onGotoScripting={() => { setPhaseBlocker(null); setTimeout(() => document.getElementById("poi-section")?.scrollIntoView({ behavior: "smooth" }), 50); }}
          onClose={() => setPhaseBlocker(null)}
        />
      )}

      {/* Phase transition confirmation */}
      {pendingPhase && (() => {
        const isBack = pendingPhase.direction === "back";
        const target = PHASES.find(p => p.id === pendingPhase.phase)!;
        const warning = isBack ? BACK_WARNINGS[productionPhase] : null;
        const noLangs = !isBack && pendingPhase.phase === "translating" && translationLanguages.length === 0;
        const hintText = warning ?? (pendingPhase.phase === "translating" ? translatingHintJSX : target.hint);
        return (
          <PhaseTransitionModal
            targetLabel={target.label}
            isBack={isBack}
            noLangs={noLangs}
            hintText={hintText}
            onConfirm={() => {
              setProductionPhase(pendingPhase.phase);
              setPendingPhase(null);
              if (pendingPhase.direction === "forward") {
                if (pendingPhase.phase === "translating") setActiveModal("translations");
                if (pendingPhase.phase === "voicing") setActiveModal("voicing");
                if (pendingPhase.phase === "review") setActiveModal("publish");
              }
            }}
            onAddLanguage={() => { setPendingPhase(null); setTimeout(() => document.getElementById("languages-section")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50); }}
            onSkipToVoicing={() => { setProductionPhase("voicing"); setPendingPhase(null); setActiveModal("voicing"); }}
            onCancel={() => setPendingPhase(null)}
          />
        );
      })()}

      {/* POI Quiz Modal */}
      {editingQuizPOI && (
        <POIQuizModal
          poi={editingQuizPOI}
          existing={poiQuestions[editingQuizPOI.id]}
          onSave={(q) => {
            setPoiQuestions((prev) => ({ ...prev, [editingQuizPOI.id]: q }));
            setEditingQuizPOI(null);
          }}
          onRemove={() => {
            setPoiQuestions((prev) => { const next = { ...prev }; delete next[editingQuizPOI.id]; return next; });
            setEditingQuizPOI(null);
          }}
          onClose={() => setEditingQuizPOI(null)}
        />
      )}

      {/* Context floating pill */}
      {sources.length > 0 && (
        <button
          onClick={() => setShowSources((v) => !v)}
          className={`fixed bottom-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-[13px] font-medium transition-all duration-200 ${
            showSources
              ? "bg-zinc-800 text-white scale-95"
              : "bg-white text-zinc-700 hover:bg-zinc-50 hover:scale-105 border border-zinc-200"
          }`}
          style={{ right: "88px" }}
          title="Context"
        >
          <FileText className="size-4 flex-shrink-0" strokeWidth={1.5} />
          Context
        </button>
      )}

      {/* Sources drawer */}
      {showSources && sources.length > 0 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowSources(false)} />
          <div className="fixed top-0 right-0 h-full w-72 z-50 bg-white border-l border-zinc-200 flex flex-col shadow-xl" style={{ boxShadow: '-4px 0 24px 0 rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-zinc-400" />
                <p className="text-sm font-semibold text-zinc-900">Sources</p>
              </div>
              <button onClick={() => setShowSources(false)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <p className="px-5 py-3 text-[11px] text-zinc-400 border-b border-zinc-100">
              Documents used to generate this guide's content.
            </p>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {sources.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors">
                  <FileText className="size-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="text-xs text-zinc-700 flex-1 truncate">{s.name}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    s.type === "library"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-amber-50 text-amber-600"
                  }`}>
                    {s.type === "library" ? "library" : "uploaded"}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-zinc-100">
              <Link to="/guides/new" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2">
                Edit sources
              </Link>
            </div>
          </div>
        </>
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

