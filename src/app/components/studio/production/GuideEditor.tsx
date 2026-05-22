import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router";
import { ArrowLeft, Plus, X, Globe, FileText, CheckCircle2, DollarSign, LockOpen, Pencil, ClipboardList, UserCircle2, MapPin, Check, Calendar, ImageIcon, Eye, Ticket, Unlock, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { mockGuides, mockPOIs, languages, mockSurveys, mockEvents, mockChallenges } from "../../../data/mockData";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { POIEditor, type QuizQuestion } from "../pois/POIEditor";
import { GuidePreviewModal } from "../guides/GuidePreviewModal";
import { PageShell } from "../_layout/PageShell";
import { getMemberByGuideId, teamMembers, CURRENT_USER_ID, type TeamMember } from "../../../data/teamData";
import type { GuidePOI, POI, ProductionPhase } from "../../../types";
import { POIItem } from "./scripting/POIItem";
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
  const [responsiblePickerOpen, setResponsiblePickerOpen] = useState(false);
  const assignableMembers = teamMembers.filter((m) => m.status === "active");
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

  const PHASES: { id: ProductionPhase; label: string; hint: string }[] = [
    { id: "scripting",   label: "Scripting",    hint: "Write and finalise the audio script for each POI." },
    { id: "translating", label: "Translation",  hint: "Scripts are locked. Translations are being generated." },
    { id: "voicing",     label: "Voicing",      hint: "Assign voices and generate TTS audio for all languages." },
    { id: "review",      label: "Review",       hint: "Final check before publishing to visitors." },
  ];
  const [productionPhase, setProductionPhase] = useState<ProductionPhase>(
    incoming ? "scripting" : (guide?.productionPhase as ProductionPhase | undefined) ?? "scripting"
  );
  const [pendingPhase, setPendingPhase] = useState<{ phase: ProductionPhase; direction: "forward" | "back" } | null>(null);
  const [phaseBlocker, setPhaseBlocker] = useState<{ title: string; detail: string } | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const langPickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showLangPicker) return;
    const handler = (e: MouseEvent) => {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) setShowLangPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLangPicker]);
  const sources = incoming?.sources ?? [];
  const [showSources, setShowSources] = useState(false);
  const [poiQuestions, setPoiQuestions] = useState<Record<string, QuizQuestion>>({});
  const [editingQuizPOI, setEditingQuizPOI] = useState<POI | null>(null);

  const phaseIndex = PHASES.findIndex(p => p.id === productionPhase);
  const nextPhase = PHASES[phaseIndex + 1] ?? null;
  const prevPhase = PHASES[phaseIndex - 1] ?? null;

  const translationLanguages = selectedLanguages.slice(1);
  const translatingHint = translationLanguages.length > 0
    ? `Scripts are locked. Translations in ${translationLanguages.map(l => l.toUpperCase()).join(", ")} are being generated.`
    : "No additional languages configured. Add a language or skip directly to Voicing.";
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
            {(() => {
              const isPaid = isNew ? false : guide?.accessMode === "paid";
              const used  = isNew ? 0 : isPaid ? (guide?.codesUsed    ?? 0) : (guide?.accessesUsed   ?? 0);
              const total = isNew ? 200 : isPaid ? (guide?.codesTotal   ?? 0) : (guide?.accessesLimit  ?? 0);
              const remaining = total - used;
              const pct = total ? Math.round((used / total) * 100) : 0;
              const isLow = total ? remaining / total < 0.15 : false;
              const barColor = isLow ? "#f59e0b" : isPaid ? "#8b5cf6" : "#10b981";
              return (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isPaid ? "bg-violet-50 text-violet-700 border border-violet-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                    {isPaid ? <Ticket className="size-2.5" strokeWidth={2} /> : <Unlock className="size-2.5" strokeWidth={2} />}
                    {isPaid ? "Paid access" : "Free access"}
                  </span>
                  <div className="w-14 h-1.5 bg-zinc-100 rounded-full overflow-hidden flex-shrink-0">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                  </div>
                  <span className={`text-[10px] font-medium tabular-nums ${isLow ? "text-amber-600" : "text-zinc-400"}`}>
                    {remaining.toLocaleString()} / {total.toLocaleString()} available
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Production phase stepper */}
          <div className="px-7 py-3.5 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              {/* Phase pills */}
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {PHASES.map((phase, i) => {
                  const isCurrent = phase.id === productionPhase;
                  const isPast = i < phaseIndex;
                  const modalKey = phase.id === "translating" ? "translations" as const : phase.id === "voicing" ? "voicing" as const : null;
                  const isClickable = modalKey && (isCurrent || isPast);
                  const pillClass = `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    isCurrent  ? "bg-[#D33333] text-white" :
                    isPast     ? "bg-zinc-100 text-zinc-400 line-through decoration-zinc-300" :
                                 "bg-zinc-50 text-zinc-300"
                  }`;
                  return (
                    <div key={phase.id} className="flex items-center gap-1">
                      {i > 0 && <div className={`w-5 h-px flex-shrink-0 ${isPast ? "bg-zinc-400" : "bg-zinc-200"}`} />}
                      {isClickable ? (
                        <button onClick={() => setActiveModal(modalKey)} className={`${pillClass} hover:opacity-75`}>
                          {isPast && <Check className="size-2.5 flex-shrink-0" strokeWidth={3} />}
                          {phase.label}
                        </button>
                      ) : (
                        <div className={pillClass}>
                          {isPast && <Check className="size-2.5 flex-shrink-0" strokeWidth={3} />}
                          {phase.label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {prevPhase && (
                  <button
                    onClick={() => setPendingPhase({ phase: prevPhase.id, direction: "back" })}
                    className="text-[11px] font-medium text-zinc-400 hover:text-zinc-700 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-50"
                  >
                    ← {prevPhase.label}
                  </button>
                )}
                {nextPhase && (() => {
                  const translationBlocked = nextPhase.id === "translating" && (selectedPOIs.length === 0 || completedPOIs < selectedPOIs.length);
                  const voicingBlocked = nextPhase.id === "voicing" && translationLanguages.length > 0 && !translationsComplete;
                  const isBlocked = translationBlocked || voicingBlocked;
                  return (
                    <button
                      onClick={() => tryAdvancePhase(nextPhase.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                        isBlocked
                          ? "bg-zinc-300 text-zinc-400 cursor-not-allowed"
                          : "bg-[#D33333] text-white hover:bg-[#b82c2c]"
                      }`}
                    >
                      Start {nextPhase.label} →
                    </button>
                  );
                })()}
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 transition-all text-[11px] font-medium"
                >
                  <Eye className="size-3.5" />
                  Preview
                </button>
              </div>
            </div>
            {/* Current phase hint */}
            <p className="text-[11px] text-zinc-400 mt-1.5 ml-0.5">
              {productionPhase === "translating" ? translatingHintJSX : PHASES[phaseIndex].hint}
            </p>
          </div>

          {/* Languages */}
          <div id="languages-section" className="px-7 py-5">
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
                  <div className="relative group">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wider transition-all ${
                        i === 0 ? "bg-[#D33333] text-white" : "bg-zinc-100 text-zinc-600 group-hover:opacity-40"
                      }`}
                      style={{ boxShadow: i === 0 ? '0 2px 8px 0 rgba(0,0,0,0.15)' : 'none' }}
                    >
                      {lang.toUpperCase()}
                    </div>
                    {i > 0 && (
                      <button
                        onClick={() => setSelectedLanguages(prev => prev.filter(c => c !== lang))}
                        className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${lang}`}
                      >
                        <X className="size-4 text-zinc-600" />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
                    {i === 0 ? "Primary" : languages.find(l => l.code === lang)?.name}
                  </span>
                </div>
              ))}
              {languages.filter(l => !selectedLanguages.includes(l.code)).length > 0 && (
                <div className="flex flex-col items-center gap-1.5" ref={langPickerRef}>
                  <div className="relative">
                    <button
                      onClick={() => setShowLangPicker(v => !v)}
                      className="size-10 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all"
                    >
                      <Plus className="size-3.5" />
                    </button>
                    {showLangPicker && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-zinc-100 rounded-2xl shadow-xl z-30 p-1.5 min-w-[170px]">
                        {languages.filter(l => !selectedLanguages.includes(l.code)).map(l => (
                          <button
                            key={l.code}
                            onClick={() => { setSelectedLanguages(prev => [...prev, l.code]); setShowLangPicker(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-zinc-700 hover:bg-zinc-50 transition-colors"
                          >
                            <span className="text-base">{l.flag}</span>
                            <span className="font-medium">{l.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Add</span>
                </div>
              )}
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="size-4" />
                  Add POI
                </button>
              </div>

              {/* Challenge banner — shown only when no challenge exists */}
              {linkedChallengeId === "" && selectedPOIs.length > 0 && (
                <div className="mx-5 mt-4 flex items-center gap-3 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <Trophy className="size-4 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-[12px] text-zinc-500 flex-1">
                    Create a <strong className="text-zinc-700">Challenge</strong> for this guide to enable quiz questions on each POI and reward visitors who complete them.
                  </p>
                  <Link
                    to="/challenge"
                    className="text-[12px] font-semibold text-zinc-700 hover:text-zinc-900 whitespace-nowrap transition-colors"
                  >
                    Set up →
                  </Link>
                </div>
              )}

              <div className="p-5">
                {selectedPOIs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="relative inline-flex items-center justify-center mb-5">
                      <div className="size-16 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center">
                        <MapPin className="size-7 text-zinc-300" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-[15px] font-semibold text-zinc-800 mb-1.5">No points of interest yet</p>
                    <p className="text-[12px] text-zinc-400 leading-relaxed max-w-[210px] mx-auto mb-6">
                      POIs are the stops on your guide — each one has a script, image, and location.
                    </p>
                    <div className="relative inline-flex">
                      <span className="absolute inset-0 rounded-xl animate-ping bg-zinc-300 opacity-50" />
                      <button
                        onClick={() => setCreatingPOI(true)}
                        className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
                      >
                        <Plus className="size-4" />
                        Add your first POI
                      </button>
                    </div>
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
                        onQuiz={() => setEditingQuizPOI(poi)}
                        quizQuestion={poiQuestions[poi.id]}
                        hasChallenge={linkedChallengeId !== ""}
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
                    Link global events to promote inside this guide. <Link to="/events" className="underline underline-offset-2 hover:text-zinc-600 transition-colors">Manage events →</Link>
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEvent(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                >
                  <Plus className="size-3.5" />
                  Link Event
                </button>
              </div>

              <div className="p-4">
                {linkedEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                      <Calendar className="size-5 text-zinc-300" />
                    </div>
                    <p className="text-[13px] text-zinc-500 mb-0.5">No events linked</p>
                    <p className="text-[11px] text-zinc-400">Create events in <Link to="/events" className="underline underline-offset-2 hover:text-zinc-600 transition-colors">Events</Link>, then link them here</p>
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
                    {(["free", "paid"] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          if (type === accessType) return;
                          if (status === "published") { setPendingAccessType(type); }
                          else { setAccessType(type); }
                        }}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          accessType === type ? "border-zinc-900 bg-white" : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${accessType === type ? "border-zinc-900" : "border-zinc-300"}`}>
                            {accessType === type && <div className="size-2 rounded-full bg-zinc-900" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              {type === "free" ? <LockOpen className="size-3.5 text-zinc-600" /> : <DollarSign className="size-3.5 text-zinc-600" />}
                              <span className="text-[13px] font-semibold text-zinc-900">{type === "free" ? "Free Access" : "Paid Access"}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{type === "free" ? "Universal QR code" : "Unique QR per visitor"}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {accessType === "paid" && (
                    <p className="text-[11px] text-blue-600 mt-2 leading-relaxed">
                      Generate QR codes in Monetization after publishing.
                    </p>
                  )}
                </div>

                <button
                  className="w-full px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all disabled:opacity-40"
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
            <div className="p-5 border-b border-zinc-200">
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

            {/* Challenge */}
            <div className="p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <Trophy className="size-3.5 text-zinc-400" strokeWidth={1.5} />
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Challenge</p>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">Link a challenge to reward visitors who answer all quiz questions correctly.</p>
              <div className="relative">
                <select
                  value={linkedChallengeId}
                  onChange={(e) => setLinkedChallengeId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                >
                  <option value="">No challenge linked</option>
                  {mockChallenges.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <Trophy className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
              </div>
              {linkedChallengeId && (
                <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                  Challenge linked
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

