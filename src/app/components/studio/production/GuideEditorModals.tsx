import type { ReactNode } from "react";
import type { POI, GuidePOI, ProductionPhase } from "../../../types";
import type { QuizQuestion } from "../pois/POIEditor";
import type { TeamMember } from "../../../data/teamData";
import { PHASES } from "./GuideHeaderCard";
import { POIEditor } from "../pois/POIEditor";
import { GuidePreviewModal } from "../guides/GuidePreviewModal";
import { POIQuizModal } from "../engagement/POIQuizModal";
import { CoverGalleryModal } from "./modals/CoverGalleryModal";
import { AddPOIModal } from "./modals/AddPOIModal";
import { AddEventModal } from "./modals/AddEventModal";
import { PhaseBlockerModal } from "./modals/PhaseBlockerModal";
import { AccessTypeConfirmModal } from "./modals/AccessTypeConfirmModal";
import { PhaseTransitionModal } from "./modals/PhaseTransitionModal";
import { PublishModal, type PublishCheck } from "./modals/PublishModal";
import { FinalReviewModal } from "./modals/FinalReviewModal";
import { TranslationsModal } from "./TranslationsModal";
import { VoicingModal } from "./VoicingModal";

const BACK_WARNINGS: Partial<Record<ProductionPhase, string>> = {
  scripting:   "Going back to Scripting will unlock scripts for editing. Existing translations will need to be regenerated.",
  translating: "Going back to Translation will unlock translations for editing. Generated audio may become outdated.",
  voicing:     "Going back to Voicing will unlock audio generation. Review state will be reset.",
};

type GuideCtx = {
  id: string | undefined;
  title: string;
  status: "draft" | "published";
  thumbnail: string;
  languages: string[];
};
type POICtx = {
  editingPOI: POI | null;
  setEditingPOI: (p: POI | null) => void;
  creatingPOI: boolean;
  setCreatingPOI: (v: boolean) => void;
  showAddPOI: boolean;
  setShowAddPOI: (v: boolean) => void;
  availablePOIs: GuidePOI[];
  linkedChallengeId: string;
  poiCount: number;
  poiQuestions: Record<string, QuizQuestion>;
  setPoiQuestions: (fn: (prev: Record<string, QuizQuestion>) => Record<string, QuizQuestion>) => void;
  editingQuizPOI: POI | null;
  setEditingQuizPOI: (p: POI | null) => void;
  addPOI: (p: GuidePOI) => void;
  savePOI: (updated: any) => void;
  removePOI: (id: string) => void;
  handleNewPOISave: (saved: any) => void;
  toEditorPOI: (p: GuidePOI) => any;
  blankEditorPOI: () => any;
};
type EventCtx = {
  showAddEvent: boolean;
  setShowAddEvent: (v: boolean) => void;
  availableEvents: any[];
  onLinkEvent: (eventId: string) => void;
};
type ModalCtx = {
  activeModal: null | "translations" | "voicing" | "publish";
  setActiveModal: (m: null | "translations" | "voicing" | "publish") => void;
  showPreview: boolean;
  setShowPreview: (v: boolean) => void;
  showCoverGallery: boolean;
  setShowCoverGallery: (v: boolean) => void;
  setThumbnail: (url: string) => void;
  showFinalReview: boolean;
  setShowFinalReview: (v: boolean) => void;
};
type PublishCtx = {
  publishChecks: PublishCheck[];
  allChecksOk: boolean;
  publishReadyPct: number;
  canPublish: boolean;
  approvalState: { approvedBy: TeamMember; date: string } | null;
  setApprovalState: (v: { approvedBy: TeamMember; date: string } | null) => void;
  reviewRequest: { to: TeamMember; date: string } | null;
  setReviewRequest: (v: { to: TeamMember; date: string } | null) => void;
  canSelfApprove: boolean;
  reviewableMembers: TeamMember[];
  currentUser: TeamMember;
  handlePublish: () => void;
  pendingAccessType: "free" | "paid" | null;
  setPendingAccessType: (v: "free" | "paid" | null) => void;
  setAccessType: (v: "free" | "paid") => void;
};
type PhaseCtx = {
  phaseBlocker: { title: string; detail: string } | null;
  setPhaseBlocker: (v: { title: string; detail: string } | null) => void;
  pendingPhase: { phase: ProductionPhase; direction: "forward" | "back" } | null;
  setPendingPhase: (v: { phase: ProductionPhase; direction: "forward" | "back" } | null) => void;
  productionPhase: ProductionPhase;
  setProductionPhase: (p: ProductionPhase) => void;
  translationLanguages: string[];
  setTranslationsComplete: (v: boolean) => void;
  translatingHintJSX: ReactNode;
  onAddLanguage: () => void;
};

export function GuideEditorModals({
  guide, poi, event, modal, publish, phase,
}: {
  guide: GuideCtx;
  poi: POICtx;
  event: EventCtx;
  modal: ModalCtx;
  publish: PublishCtx;
  phase: PhaseCtx;
}) {
  const guideCtx = { id: guide.id || "", title: guide.title, status: guide.status, thumbnail: guide.thumbnail, languages: guide.languages };

  return (
    <>
      {poi.editingPOI && (
        <POIEditor
          poi={poi.toEditorPOI(poi.editingPOI)}
          onClose={() => poi.setEditingPOI(null)}
          onSave={poi.savePOI}
          onDelete={() => { poi.removePOI(poi.editingPOI!.id); poi.setEditingPOI(null); }}
          guideId={guide.id}
          guideContext={guideCtx}
          guideLanguages={guide.languages}
          quizQuestion={poi.poiQuestions[poi.editingPOI.id]}
          onQuizChange={(q) => poi.setPoiQuestions((prev) => q ? { ...prev, [poi.editingPOI!.id]: q } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== poi.editingPOI!.id)))}
          hasChallenge={poi.linkedChallengeId !== ""}
        />
      )}

      {poi.creatingPOI && (
        <POIEditor
          poi={poi.blankEditorPOI()}
          onClose={() => poi.setCreatingPOI(false)}
          onSave={poi.handleNewPOISave}
          onDelete={() => poi.setCreatingPOI(false)}
          guideId={guide.id}
          guideContext={guideCtx}
          guideLanguages={guide.languages}
          hasChallenge={poi.linkedChallengeId !== ""}
        />
      )}

      {poi.showAddPOI && (
        <AddPOIModal
          availablePOIs={poi.availablePOIs}
          onAdd={poi.addPOI}
          onCreate={() => { poi.setShowAddPOI(false); poi.setCreatingPOI(true); }}
          onClose={() => poi.setShowAddPOI(false)}
        />
      )}

      {event.showAddEvent && (
        <AddEventModal
          availableEvents={event.availableEvents}
          onLink={(eventId) => { event.onLinkEvent(eventId); event.setShowAddEvent(false); }}
          onClose={() => event.setShowAddEvent(false)}
        />
      )}

      {modal.showPreview && (
        <GuidePreviewModal guideName={guide.title} guideId={guide.id} onClose={() => modal.setShowPreview(false)} />
      )}

      {modal.showCoverGallery && (
        <CoverGalleryModal
          thumbnail={guide.thumbnail}
          onSelect={(url) => { modal.setThumbnail(url); modal.setShowCoverGallery(false); }}
          onClose={() => modal.setShowCoverGallery(false)}
        />
      )}

      {modal.activeModal === "translations" && (
        <TranslationsModal
          title={guide.title}
          guideId={guide.id}
          selectedLanguages={guide.languages}
          onClose={() => modal.setActiveModal(null)}
          onCompletionChange={phase.setTranslationsComplete}
        />
      )}

      {modal.activeModal === "voicing" && (
        <VoicingModal
          title={guide.title}
          onClose={() => modal.setActiveModal(null)}
          onPublish={() => modal.setActiveModal("publish")}
        />
      )}

      {modal.activeModal === "publish" && (
        <PublishModal
          title={guide.title}
          poiCount={poi.poiCount}
          publishChecks={publish.publishChecks}
          allChecksOk={publish.allChecksOk}
          publishReadyPct={publish.publishReadyPct}
          canPublish={publish.canPublish}
          approvalState={publish.approvalState}
          reviewRequest={publish.reviewRequest}
          guideId={guide.id}
          onClose={() => modal.setActiveModal(null)}
          onPublish={publish.handlePublish}
          onFinalReview={() => modal.setShowFinalReview(true)}
          onSimulateApproval={() => publish.reviewRequest && publish.setApprovalState({ approvedBy: publish.reviewRequest.to, date: publish.reviewRequest.date })}
        />
      )}

      {publish.pendingAccessType && (
        <AccessTypeConfirmModal
          pendingAccessType={publish.pendingAccessType}
          onConfirm={() => { publish.setAccessType(publish.pendingAccessType!); publish.setPendingAccessType(null); }}
          onCancel={() => publish.setPendingAccessType(null)}
        />
      )}

      {modal.showFinalReview && (
        <FinalReviewModal
          title={guide.title}
          guideId={guide.id}
          currentUser={publish.currentUser}
          canSelfApprove={publish.canSelfApprove}
          reviewableMembers={publish.reviewableMembers}
          onClose={() => modal.setShowFinalReview(false)}
          onRequestReview={(to) => publish.setReviewRequest({ to, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) })}
          onSelfApprove={(user) => publish.setApprovalState({ approvedBy: user, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) })}
        />
      )}

      {phase.phaseBlocker && (
        <PhaseBlockerModal
          title={phase.phaseBlocker.title}
          detail={phase.phaseBlocker.detail}
          onGotoScripting={() => { phase.setPhaseBlocker(null); setTimeout(() => document.getElementById("poi-section")?.scrollIntoView({ behavior: "smooth" }), 50); }}
          onClose={() => phase.setPhaseBlocker(null)}
        />
      )}

      {phase.pendingPhase && (() => {
        const isBack = phase.pendingPhase.direction === "back";
        const target = PHASES.find(p => p.id === phase.pendingPhase!.phase)!;
        const warning = isBack ? BACK_WARNINGS[phase.productionPhase] : null;
        const noLangs = !isBack && phase.pendingPhase.phase === "translating" && phase.translationLanguages.length === 0;
        const hintText = warning ?? (phase.pendingPhase.phase === "translating" ? phase.translatingHintJSX : target.hint);
        return (
          <PhaseTransitionModal
            targetLabel={target.label}
            isBack={isBack}
            noLangs={noLangs}
            hintText={hintText}
            onConfirm={() => {
              phase.setProductionPhase(phase.pendingPhase!.phase);
              phase.setPendingPhase(null);
              if (phase.pendingPhase!.direction === "forward") {
                if (phase.pendingPhase!.phase === "translating") modal.setActiveModal("translations");
                if (phase.pendingPhase!.phase === "voicing") modal.setActiveModal("voicing");
                if (phase.pendingPhase!.phase === "review") modal.setActiveModal("publish");
              }
            }}
            onAddLanguage={phase.onAddLanguage}
            onSkipToVoicing={() => { phase.setProductionPhase("voicing"); phase.setPendingPhase(null); modal.setActiveModal("voicing"); }}
            onCancel={() => phase.setPendingPhase(null)}
          />
        );
      })()}

      {poi.editingQuizPOI && (
        <POIQuizModal
          poi={poi.editingQuizPOI}
          existing={poi.poiQuestions[poi.editingQuizPOI.id]}
          onSave={(q) => {
            poi.setPoiQuestions((prev) => ({ ...prev, [poi.editingQuizPOI!.id]: q }));
            poi.setEditingQuizPOI(null);
          }}
          onRemove={() => {
            poi.setPoiQuestions((prev) => { const next = { ...prev }; delete next[poi.editingQuizPOI!.id]; return next; });
            poi.setEditingQuizPOI(null);
          }}
          onClose={() => poi.setEditingQuizPOI(null)}
        />
      )}
    </>
  );
}
