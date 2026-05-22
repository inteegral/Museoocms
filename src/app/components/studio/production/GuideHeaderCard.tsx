import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Pencil, Check, Eye, Plus, X, Ticket, Unlock } from "lucide-react";
import { languages } from "../../../data/mockData";
import type { ProductionPhase } from "../../../types";

export const PHASES: { id: ProductionPhase; label: string; hint: string }[] = [
  { id: "scripting",   label: "Scripting",   hint: "Write and finalise the audio script for each POI." },
  { id: "translating", label: "Translation", hint: "Scripts are locked. Translations are being generated." },
  { id: "voicing",     label: "Voicing",     hint: "Assign voices and generate TTS audio for all languages." },
  { id: "review",      label: "Review",      hint: "Final check before publishing to visitors." },
];

export function GuideHeaderCard({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  status,
  accessBar,
  productionPhase,
  poiCount,
  completedPOIs,
  translationLanguages,
  translationsComplete,
  translatingHintJSX,
  onOpenModal,
  onTryAdvancePhase,
  onGoBack,
  onPreview,
  selectedLanguages,
  onLanguageAdd,
  onLanguageRemove,
}: {
  title: string;
  onTitleChange: (t: string) => void;
  description: string;
  onDescriptionChange: (d: string) => void;
  status: "draft" | "published";
  accessBar: { isPaid: boolean; used: number; total: number };
  productionPhase: ProductionPhase;
  poiCount: number;
  completedPOIs: number;
  translationLanguages: string[];
  translationsComplete: boolean;
  translatingHintJSX: ReactNode;
  onOpenModal: (modal: "translations" | "voicing") => void;
  onTryAdvancePhase: (phase: ProductionPhase) => void;
  onGoBack: (phase: ProductionPhase) => void;
  onPreview: () => void;
  selectedLanguages: string[];
  onLanguageAdd: (code: string) => void;
  onLanguageRemove: (code: string) => void;
}) {
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

  const phaseIndex = PHASES.findIndex(p => p.id === productionPhase);
  const nextPhase = PHASES[phaseIndex + 1] ?? null;
  const prevPhase = PHASES[phaseIndex - 1] ?? null;

  const { isPaid, used, total } = accessBar;
  const remaining = total - used;
  const pct = total ? Math.round((used / total) * 100) : 0;
  const isLow = total ? remaining / total < 0.15 : false;
  const barColor = isLow ? "#f59e0b" : isPaid ? "#8b5cf6" : "#10b981";

  return (
    <div className="mb-8 bg-white border border-zinc-200 rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)" }}>

      {/* Title & meta */}
      <div className="px-7 pt-7 pb-5 border-b border-zinc-100 group/header">
        <div className="flex items-start justify-between gap-4 mb-1">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-[26px] font-semibold text-zinc-950 tracking-tight flex-1 border-none outline-none bg-transparent focus:ring-0 placeholder:text-zinc-300 cursor-text"
            placeholder="Guide Title"
          />
          <div className="flex items-center gap-3 flex-shrink-0 mt-1.5">
            <Pencil className="size-3.5 text-zinc-300 group-hover/header:text-zinc-400 transition-colors" />
            <div className={`size-2 rounded-full ${status === "published" ? "bg-emerald-500" : "bg-zinc-300"}`} />
            <span className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wide">
              {status === "published" ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={1}
          className="text-[14px] text-zinc-500 leading-relaxed w-full border-none outline-none bg-transparent resize-none focus:ring-0 placeholder:text-zinc-300 cursor-text"
          placeholder="Add a description..."
        />
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
                isCurrent ? "bg-[#D33333] text-white" :
                isPast    ? "bg-zinc-100 text-zinc-400 line-through decoration-zinc-300" :
                            "bg-zinc-50 text-zinc-300"
              }`;
              return (
                <div key={phase.id} className="flex items-center gap-1">
                  {i > 0 && <div className={`w-5 h-px flex-shrink-0 ${isPast ? "bg-zinc-400" : "bg-zinc-200"}`} />}
                  {isClickable ? (
                    <button onClick={() => onOpenModal(modalKey)} className={`${pillClass} hover:opacity-75`}>
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
                onClick={() => onGoBack(prevPhase.id)}
                className="text-[11px] font-medium text-zinc-400 hover:text-zinc-700 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-50"
              >
                ← {prevPhase.label}
              </button>
            )}
            {nextPhase && (() => {
              const translationBlocked = nextPhase.id === "translating" && (poiCount === 0 || completedPOIs < poiCount);
              const voicingBlocked = nextPhase.id === "voicing" && translationLanguages.length > 0 && !translationsComplete;
              const isBlocked = translationBlocked || voicingBlocked;
              return (
                <button
                  onClick={() => onTryAdvancePhase(nextPhase.id)}
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
              onClick={onPreview}
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
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Languages</span>
          <span className="text-[11px] text-zinc-400">Additional languages require a translation package</span>
        </div>
        <div className="flex items-end gap-4">
          {selectedLanguages.map((lang, i) => (
            <div key={lang} className="flex flex-col items-center gap-1.5">
              <div className="relative group">
                <div
                  className={`size-10 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wider transition-all ${
                    i === 0 ? "bg-[#D33333] text-white" : "bg-zinc-100 text-zinc-600 group-hover:opacity-40"
                  }`}
                  style={{ boxShadow: i === 0 ? "0 2px 8px 0 rgba(0,0,0,0.15)" : "none" }}
                >
                  {lang.toUpperCase()}
                </div>
                {i > 0 && (
                  <button
                    onClick={() => onLanguageRemove(lang)}
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
                        onClick={() => { onLanguageAdd(l.code); setShowLangPicker(false); }}
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
  );
}
