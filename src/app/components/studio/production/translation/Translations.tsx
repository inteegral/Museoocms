import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  Search, Sparkles, CheckCircle2,
  ChevronDown, RotateCcw,
  Clock, Eye, ChevronLeft, ChevronRight, User,
  ShieldCheck, MessageSquare,
} from "lucide-react";
import { ReviewerPicker, certifiedReviewers, type CertifiedReviewer } from "./ReviewerPicker";
import { allVoices, type Voice, type AudioStatus } from "./TranslationAudioPanel";
import { PageShell } from "../../_layout/PageShell";

// ─── Types ─────────────────────────────────────────────────────────────────────
type TextStatus = "draft" | "review" | "approved" | "expert-review" | "expert-done";

interface ExpertReview {
  reviewerId: string;
  reviewerName: string;
  reviewerBadge: string;
  reviewerAvatar: string;
  originalText: string;
  suggestedText: string;
  comment: string;
  returnedAt?: string;
}

interface Translation {
  text: string;
  status: TextStatus;
  audioStatus: AudioStatus;
  aiDrafted?: boolean;
  expertReview?: ExpertReview;
}

interface POI { id: string; name: string; sourceText: string; translations: Record<string, Translation> }
interface Guide { id: string; name: string; targetLanguages: string[]; voiceAssignments: Record<string, string | null> }

// ─── Data ──────────────────────────────────────────────────────────────────────
const CURATOR_NAME = "Anna Ferretti";


const initialGuides: Guide[] = [
  { id: "guide-1", name: "Complete Museum Tour", targetLanguages: ["IT", "ES", "FR"], voiceAssignments: { IT: "v2", ES: null, FR: null } },
  { id: "guide-2", name: "Highlights - Must-See Masterpieces", targetLanguages: ["IT", "ES"], voiceAssignments: { IT: "v2", ES: null } },
  { id: "guide-3", name: "Family Tour", targetLanguages: ["IT", "ES"], voiceAssignments: { IT: null, ES: null } },
];

const draft = { text: "", status: "draft" as const, audioStatus: "none" as const };

const initialPOIs: POI[] = [
  {
    id: "p1", name: "Renaissance Hall",
    sourceText: "This magnificent hall showcases the finest examples of Renaissance art from the 15th and 16th centuries. The space was designed to immerse visitors in the grandeur of the period, with soaring ceilings and carefully curated lighting that brings each masterpiece to life.",
    translations: {
      IT: { text: "Questa magnifica sala presenta i migliori esempi dell'arte rinascimentale del XV e XVI secolo.", status: "approved", audioStatus: "ready" },
      ES: draft, FR: draft,
    },
  },
  {
    id: "p2", name: "Leonardo's Workshop",
    sourceText: "Step into the recreated workshop of Leonardo da Vinci, where genius and craftsmanship converged. This space replicates the environment where Leonardo developed his groundbreaking inventions and created his most celebrated artworks.",
    translations: {
      IT: { text: "Entra nel laboratorio ricreato di Leonardo da Vinci, dove genio e maestria si incontrano.", status: "approved", audioStatus: "ready" },
      ES: draft, FR: draft,
    },
  },
  {
    id: "p3", name: "The Last Supper Room",
    sourceText: "This room houses a faithful reproduction of The Last Supper by Leonardo da Vinci. Visitors can study the intricate details of this masterpiece, including the emotional expressions of the apostles.",
    translations: {
      IT: { text: "Questa sala ospita una fedele riproduzione dell'Ultima Cena di Leonardo da Vinci.", status: "approved", audioStatus: "ready" },
      ES: draft, FR: draft,
    },
  },
  {
    id: "p4", name: "Michelangelo's Sculptures",
    sourceText: "Marvel at the mastery of Michelangelo's sculptural works. The raw power and emotional depth captured in marble continues to astonish viewers five centuries after their creation.",
    translations: {
      IT: { text: "Ammira la maestria delle opere scultoree di Michelangelo. La potenza e la profondità emotiva catturate nel marmo continuano a stupire i visitatori cinque secoli dopo la loro creazione.", status: "approved", audioStatus: "pending" },
      ES: draft, FR: draft,
    },
  },
  {
    id: "p5", name: "Raphael Gallery",
    sourceText: "Explore the harmonious compositions of Raphael, whose work represents the pinnacle of Renaissance artistic achievement. The gallery presents a curated selection of his most significant paintings.",
    translations: {
      IT: { text: "Esplora le composizioni armoniose di Raffaello, la cui opera rappresenta il vertice del Rinascimento artistico. La galleria presenta una selezione curata dei suoi dipinti più significativi.", status: "approved", audioStatus: "pending" },
      ES: draft, FR: draft,
    },
  },
];

// ─── Word diff ─────────────────────────────────────────────────────────────────
function wordDiff(a: string, b: string): { text: string; type: "same" | "del" | "ins" }[] {
  const aw = a.split(/(\s+)/), bw = b.split(/(\s+)/);
  const m = aw.length, n = bw.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = aw[i - 1] === bw[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const out: { text: string; type: "same" | "del" | "ins" }[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aw[i - 1] === bw[j - 1]) { out.unshift({ text: aw[i - 1], type: "same" }); i--; j--; }
    else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) { out.unshift({ text: bw[j - 1], type: "ins" }); j--; }
    else { out.unshift({ text: aw[i - 1], type: "del" }); i--; }
  }
  return out;
}

// ─── DiffView ─────────────────────────────────────────────────────────────────
function DiffView({ original, suggested }: { original: string; suggested: string }) {
  const tokens = wordDiff(original, suggested);
  return (
    <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 text-[13px] leading-relaxed min-h-[160px]">
      {tokens.map((t, i) => {
        if (t.type === "same") return <span key={i}>{t.text}</span>;
        if (t.type === "del") return (
          <span key={i} className="line-through text-red-500 bg-red-50 rounded px-0.5">{t.text}</span>
        );
        return (
          <span key={i} className="underline decoration-2 text-emerald-700 bg-emerald-50 rounded px-0.5">{t.text}</span>
        );
      })}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function Translations({ defaultGuideId, languages, onCompletionChange }: { defaultGuideId?: string; languages?: string[]; onCompletionChange?: (done: boolean) => void } = {}) {
  const locked = !!defaultGuideId;
  const [pois, setPois] = useState<POI[]>(() => {
    try {
      const saved = localStorage.getItem("museoo_pois");
      return saved ? JSON.parse(saved) : initialPOIs;
    } catch { return initialPOIs; }
  });
  const resolvedGuides = languages && defaultGuideId
    ? initialGuides.map(g => g.id === defaultGuideId ? { ...g, targetLanguages: languages.map(l => l.toUpperCase()) } : g)
    : initialGuides;
  const [guides] = useState<Guide[]>(resolvedGuides);
  const initialGuide = resolvedGuides.find(g => g.id === defaultGuideId) ?? resolvedGuides[0];
  const [guideId, setGuideId] = useState(initialGuide.id);
  const [lang, setLang] = useState(initialGuide.targetLanguages[1] ?? initialGuide.targetLanguages[0]);
  const [poiId, setPoiId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [search, setSearch] = useState("");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [voiceSearch, setVoiceSearch] = useState("");
  const [voiceAssignments, setVoiceAssignments] = useState<Record<string, Record<string, string | null>>>(() => {
    try {
      const saved = localStorage.getItem("museoo_voiceAssignments");
      return saved ? JSON.parse(saved) : Object.fromEntries(initialGuides.map(g => [g.id, { ...g.voiceAssignments }]));
    } catch { return Object.fromEntries(initialGuides.map(g => [g.id, { ...g.voiceAssignments }])); }
  });
  const [generating, setGenerating] = useState(false);
  const [showReviewerPicker, setShowReviewerPicker] = useState(false);

  const guide = guides.find(g => g.id === guideId)!;
  const translationLangs = guide.targetLanguages.slice(1);

  useEffect(() => {
    localStorage.setItem("museoo_pois", JSON.stringify(pois));
  }, [pois]);

  useEffect(() => {
    localStorage.setItem("museoo_voiceAssignments", JSON.stringify(voiceAssignments));
  }, [voiceAssignments]);

  useEffect(() => {
    if (!onCompletionChange || translationLangs.length === 0) return;
    const allDone = pois.every(p => translationLangs.every(l => p.translations[l]?.status === "approved"));
    onCompletionChange(allDone);
  }, [pois, guideId]);
  const poi = pois.find(p => p.id === poiId) ?? null;
  const trans = poi ? poi.translations[lang] : undefined;
  const voiceId = voiceAssignments[guideId]?.[lang] ?? null;
  const voice = voiceId ? allVoices.find(v => v.id === voiceId) ?? null : null;
  const filteredPOIs = pois.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const complete = pois.filter(p => p.translations[lang]?.status === "approved").length;

  const patch = (update: Partial<Translation>) => {
    if (!poiId) return;
    setPois(prev => prev.map(x =>
      x.id === poiId ? { ...x, translations: { ...x.translations, [lang]: { ...x.translations[lang], ...update } } } : x
    ));
  };

  const openPOI = (p: POI, l?: string) => {
    const al = l ?? lang;
    setPoiId(p.id); if (l) setLang(l);
    setEditingText(p.translations[al]?.text ?? "");
    setShowVoicePicker(false); setShowReviewerPicker(false);
  };
  const closePOI = () => { setPoiId(null); setShowVoicePicker(false); setShowReviewerPicker(false); };

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const name = searchParams.get("poi");
    if (!name) return;
    const match = pois.find(p => p.name.toLowerCase().includes(name.toLowerCase())) ?? pois[0];
    if (match) openPOI(match);
    setSearchParams({}, { replace: true });
  }, []);
  const changeGuide = (id: string) => { const g = guides.find(x => x.id === id)!; setGuideId(id); setLang(g.targetLanguages[1] ?? g.targetLanguages[0]); setPoiId(null); };
  const changeLang = (l: string) => { setLang(l); if (poi) setEditingText(poi.translations[l]?.text ?? ""); };
  const togglePlay = (id: string) => { setPlayingVoice(prev => { if (prev === id) return null; setTimeout(() => setPlayingVoice(null), 3000); return id; }); };
  const assignVoice = (v: Voice) => { setVoiceAssignments(prev => ({ ...prev, [guideId]: { ...prev[guideId], [lang]: v.id } })); patch({ audioStatus: "pending" }); setShowVoicePicker(false); setVoiceSearch(""); };

  const generateAIDraft = () => {
    setGenerating(true);
    setTimeout(() => {
      const aiText = "[AI draft] " + poi!.sourceText;
      setEditingText(aiText);
      patch({ text: aiText, status: "draft", aiDrafted: true });
      setGenerating(false);
    }, 1400);
  };

  const requestExpertReview = (reviewer: CertifiedReviewer) => {
    patch({
      status: "expert-review",
      expertReview: {
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        reviewerBadge: reviewer.badge,
        reviewerAvatar: reviewer.avatarUrl,
        originalText: editingText,
        suggestedText: "",
        comment: "",
      },
    });
    setShowReviewerPicker(false);
  };

  // Simulate expert returning corrections (prototype only)
  const simulateExpertReturn = () => {
    if (!trans?.expertReview) return;
    const original = trans.expertReview.originalText;
    // Simulate a few corrections: replace some words
    const suggested = original
      .replace("[AI draft] ", "")
      .replace("showcases", "presents")
      .replace("finest", "most significant")
      .replace("immerse", "envelop")
      .replace("presenta", "ospita con orgoglio")
      .replace("magnífica", "grandiosa")
      .replace("los mejores", "algunos de los más destacados");
    patch({
      status: "expert-done",
      expertReview: {
        ...trans.expertReview,
        suggestedText: suggested,
        comment: "Adjusted terminology to align with standard museum language. 'Presents' is more neutral than 'showcases'. Minor stylistic refinements throughout.",
        returnedAt: new Date().toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      },
    });
  };

  const acceptExpertSuggestion = () => {
    const suggested = trans?.expertReview?.suggestedText ?? editingText;
    setEditingText(suggested);
    patch({ text: suggested, status: "approved", expertReview: undefined });
  };

  const rejectExpertSuggestion = () => {
    patch({ status: "review", expertReview: undefined });
  };

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (poi) {
    const poiIndex = pois.findIndex(p => p.id === poi.id);
    const isApproved = trans?.status === "approved";
    const isExpertReview = trans?.status === "expert-review";
    const isExpertDone = trans?.status === "expert-done";
    const isReview = trans?.status === "review";
    const isAIDraft = !isApproved && !isExpertReview && !isExpertDone && trans?.aiDrafted && trans?.text;
    const isEmpty = !trans?.text && !editingText;

    const textareaBg = isApproved ? "bg-white" : isExpertDone ? "bg-white" : isReview ? "bg-amber-50/60" : isAIDraft ? "bg-violet-50/50" : "bg-white";
    const textareaBorder = isApproved ? "border-emerald-200" : isExpertDone ? "border-teal-200" : isReview ? "border-amber-200" : isAIDraft ? "border-violet-200" : "border-zinc-200";

    // Status bar config
    const statusBar = (() => {
      if (isApproved) return { bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100", icon: <CheckCircle2 className="size-5 text-emerald-600" />, title: "Approved by curator", desc: `${CURATOR_NAME} has validated this translation.`, titleColor: "text-emerald-900", descColor: "text-emerald-700" };
      if (isExpertDone) return { bg: "bg-teal-50", border: "border-teal-200", iconBg: "bg-teal-100", icon: <ShieldCheck className="size-5 text-teal-600" />, title: `${trans?.expertReview?.reviewerName} returned corrections`, desc: "Review the highlighted diff below, accept or reject — you have the final word.", titleColor: "text-teal-900", descColor: "text-teal-700" };
      if (isExpertReview) return { bg: "bg-orange-50", border: "border-orange-200", iconBg: "bg-orange-100", icon: <Clock className="size-5 text-orange-500" />, title: `Sent to ${trans?.expertReview?.reviewerName} · Awaiting review`, desc: `Expected turnaround: ${certifiedReviewers.find(r => r.id === trans?.expertReview?.reviewerId)?.turnaround ?? "48h"}. You'll be notified when corrections arrive.`, titleColor: "text-orange-900", descColor: "text-orange-700" };
      if (isReview) return { bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100", icon: <Eye className="size-5 text-amber-600" />, title: "AI draft ready — awaiting your review", desc: "Read, edit if needed, then approve or send to an expert. Your signature gives it authority.", titleColor: "text-amber-900", descColor: "text-amber-700" };
      return { bg: "bg-violet-50", border: "border-violet-200", iconBg: "bg-violet-100", icon: <Sparkles className="size-5 text-violet-600" />, title: "AI drafted · not yet reviewed", desc: "The AI wrote a first draft. Review it, correct it — you have the final word.", titleColor: "text-violet-900", descColor: "text-violet-600" };
    })();

    return (
      <PageShell>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={closePOI} className="size-8 flex items-center justify-center rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors flex-shrink-0">
              <ChevronLeft className="size-4 text-zinc-600" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">{guide.name}</p>
              <h1 className="text-[20px] font-semibold text-zinc-900 tracking-tight truncate">{poi.name}</h1>
            </div>
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1 flex-shrink-0">
              {translationLangs.map(l => (
                <button key={l} onClick={() => changeLang(l)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${lang === l ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}>{l}</button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { const p = pois[poiIndex - 1]; if (p) openPOI(p); }} disabled={poiIndex === 0}
                className="size-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 transition-all">
                <ChevronLeft className="size-4 text-zinc-600" />
              </button>
              <span className="text-[11px] text-zinc-400 px-1">{poiIndex + 1}/{pois.length}</span>
              <button onClick={() => { const p = pois[poiIndex + 1]; if (p) openPOI(p); }} disabled={poiIndex === pois.length - 1}
                className="size-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 transition-all">
                <ChevronRight className="size-4 text-zinc-600" />
              </button>
            </div>
          </div>

          {/* Status bar */}
          {!isEmpty && (
            <div className={`flex items-center gap-4 px-5 py-4 rounded-xl border mb-6 ${statusBar.bg} ${statusBar.border}`}>
              <div className={`size-9 rounded-xl flex items-center justify-center flex-shrink-0 ${statusBar.iconBg}`}>{statusBar.icon}</div>
              <div className="flex-1">
                <p className={`text-[13px] font-semibold ${statusBar.titleColor}`}>{statusBar.title}</p>
                <p className={`text-[12px] mt-0.5 ${statusBar.descColor}`}>{statusBar.desc}</p>
              </div>
              {/* Reviewer card (expert states) */}
              {(isExpertReview || isExpertDone) && trans?.expertReview && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <img src={trans.expertReview.reviewerAvatar} alt="" className="size-7 rounded-full object-cover" />
                  <div className="text-right">
                    <p className={`text-[11px] font-semibold ${statusBar.titleColor}`}>{trans.expertReview.reviewerName}</p>
                    <p className={`text-[10px] ${statusBar.descColor}`}>{trans.expertReview.reviewerBadge}</p>
                  </div>
                </div>
              )}
              {/* Curator name (approved) */}
              {isApproved && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="size-7 rounded-full bg-emerald-200 flex items-center justify-center"><User className="size-3.5 text-emerald-700" /></div>
                  <span className="text-[12px] font-semibold text-emerald-800">{CURATOR_NAME}</span>
                  <button onClick={() => patch({ status: "draft" })} className="ml-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900">
                    <RotateCcw className="size-3" />Reopen
                  </button>
                </div>
              )}
              {/* Simulate return (prototype) */}
              {isExpertReview && (
                <button onClick={simulateExpertReturn}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors flex-shrink-0">
                  Simulate Return ↩
                </button>
              )}
              {/* Approve from review */}
              {isReview && (
                <button onClick={() => patch({ status: "approved", text: editingText })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all active:scale-95 flex-shrink-0">
                  <CheckCircle2 className="size-4" />Approve
                </button>
              )}
            </div>
          )}

          {/* 2-column editor */}
          <div className="grid grid-cols-[1fr_1.2fr] gap-10 items-start">

            {/* Col 1: Source */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded tracking-wider">EN</span>
                <span className="text-[12px] font-semibold text-zinc-500">Original</span>
                <span className="ml-auto text-[11px] text-zinc-400">{poi.sourceText.length} chars</span>
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-[13px] text-zinc-600 leading-relaxed min-h-[280px]">{poi.sourceText}</div>
            </div>

            {/* Col 2: Translation */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-[#D33333] text-white text-[10px] font-bold rounded tracking-wider">{lang}</span>
                <span className="text-[12px] font-semibold text-zinc-500">Translation</span>
                {isAIDraft && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700"><Sparkles className="size-2.5" />AI draft</span>}
                {isApproved && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-2.5" />Approved</span>}
                {isExpertDone && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-700"><ShieldCheck className="size-2.5" />Expert reviewed</span>}
                <span className="ml-auto text-[11px] text-zinc-400">{editingText.length} chars</span>
              </div>

              {/* Reviewer picker panel */}
              {showReviewerPicker ? (
                <ReviewerPicker lang={lang} onSelect={requestExpertReview} onClose={() => setShowReviewerPicker(false)} />
              ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center min-h-[280px] rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 gap-4 p-6 text-center">
                  <div className="size-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                    <Sparkles className="size-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-violet-900 mb-1">No translation yet</p>
                    <p className="text-[12px] text-violet-600 leading-relaxed">Let AI write a first draft — then you edit, review, or send to an expert.</p>
                  </div>
                  <button onClick={generateAIDraft} disabled={generating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-60">
                    {generating ? <><span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Generating…</> : <><Sparkles className="size-4" />Generate AI Draft</>}
                  </button>
                  <button onClick={() => { setEditingText(""); patch({ text: "", status: "draft", aiDrafted: false }); }} className="text-[12px] text-violet-500 hover:text-violet-700 transition-colors">Write manually instead</button>
                </div>
              ) : isExpertDone && trans?.expertReview ? (
                <div className="space-y-3">
                  {/* Expert comment */}
                  {trans.expertReview.comment && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-teal-200 bg-teal-50/40">
                      <MessageSquare className="size-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wide mb-0.5">Expert note · {trans.expertReview.returnedAt}</p>
                        <p className="text-[12px] text-teal-800 leading-relaxed">{trans.expertReview.comment}</p>
                      </div>
                    </div>
                  )}
                  {/* Diff view */}
                  <DiffView original={trans.expertReview.originalText} suggested={trans.expertReview.suggestedText} />
                  <div className="flex items-center gap-2 justify-end pt-1">
                    <button onClick={rejectExpertSuggestion} className="px-4 py-2 text-[12px] font-semibold text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all">
                      Reject corrections
                    </button>
                    <button onClick={acceptExpertSuggestion}
                      className="flex items-center gap-2 px-5 py-2 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all active:scale-95">
                      <CheckCircle2 className="size-4" />Accept & Approve
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <textarea value={editingText} onChange={e => { setEditingText(e.target.value); patch({ text: e.target.value }); }}
                    disabled={isApproved || isExpertReview}
                    placeholder={`${lang} translation…`}
                    className={`w-full p-4 border rounded-xl text-[13px] text-zinc-900 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed transition-all min-h-[280px] ${textareaBg} ${textareaBorder}`} />
                  {/* Action bar */}
                  {!isApproved && !isExpertReview && (
                    <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
                      <button onClick={() => setShowReviewerPicker(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold text-teal-700 border border-teal-200 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all">
                        <ShieldCheck className="size-3.5" />Request Expert Review
                      </button>
                      {trans?.status !== "review" && (
                        <button onClick={() => patch({ status: "review", text: editingText })}
                          className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all">
                          <Eye className="size-3.5" />Submit for Review
                        </button>
                      )}
                      <button onClick={() => patch({ status: "approved", text: editingText })}
                        className="flex items-center gap-2 px-5 py-2 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all active:scale-95">
                        <CheckCircle2 className="size-4" />Approve
                      </button>
                    </div>
                  )}
                  {isExpertReview && (
                    <button onClick={() => patch({ status: "draft", expertReview: undefined })}
                      className="text-[11px] text-zinc-400 hover:text-zinc-600 text-right transition-colors">
                      Cancel request
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </PageShell>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl flex items-center justify-center bg-violet-50">
              <Sparkles className="size-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Translations</h1>
              <p className="text-[13px] text-zinc-400 mt-0.5">AI drafts · curator approves · expert certifies</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {!locked && (
            <div className="relative">
              <select value={guideId} onChange={e => changeGuide(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] font-semibold text-zinc-900 focus:outline-none cursor-pointer">
                {initialGuides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
            </div>
          )}
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1">
            {translationLangs.map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${lang === l ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}>{l}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-32 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${(complete / pois.length) * 100}%` }} />
            </div>
            <span className="text-[12px] font-semibold text-zinc-500">{complete}/{pois.length} complete</span>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input type="text" placeholder="Search POIs…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900" />
        </div>

        <div className="space-y-2">
          {filteredPOIs.map((p, i) => {
            const t = p.translations[lang];
            const isDone = t?.status === "approved";
            const isUnderReview = t?.status === "review" || t?.status === "expert-review" || t?.status === "expert-done";

            const { label, cls } = isDone
              ? { label: "Translation Complete",     cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
              : isUnderReview
              ? { label: "Translation Under Review", cls: "bg-amber-50 text-amber-700 border-amber-200" }
              : { label: "Translation Draft",        cls: "bg-zinc-100 text-zinc-500 border-zinc-200" };

            const toggleStatus = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (!isDone && !t?.text?.trim()) return;
              setPois(prev => prev.map(x =>
                x.id === p.id
                  ? { ...x, translations: { ...x.translations, [lang]: { ...(x.translations[lang] ?? { audioStatus: "none" as const }), status: isDone ? "draft" : "approved", text: x.translations[lang]?.text ?? "" } } }
                  : x
              ));
            };

            return (
              <div key={p.id}
                className={`w-full group flex items-center gap-4 px-5 py-4 bg-white rounded-xl border transition-all ${isDone ? "border-emerald-200" : "border-zinc-200"}`}
                style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                <span className="text-[11px] font-medium text-zinc-400 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <button onClick={() => openPOI(p)} className={`flex-1 text-[14px] font-semibold truncate text-left ${isDone ? "text-emerald-800" : "text-zinc-900"}`}>{p.name}</button>
                <button onClick={toggleStatus}
                  title={isDone ? "Mark as draft" : "Mark as complete"}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 transition-all hover:opacity-75 ${cls}`}>
                  {label}
                </button>
                <button onClick={() => openPOI(p)} className="flex-shrink-0">
                  <ChevronRight className="size-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
