import { useState } from "react";
import { X } from "lucide-react";
import type { GuidePOI } from "../../../types";
import type { QuizQuestion } from "../pois/POIEditor";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export function POIQuizModal({ poi, existing, onSave, onRemove, onClose }: {
  poi: GuidePOI;
  existing?: QuizQuestion;
  onSave: (q: QuizQuestion) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState(existing?.question ?? "");
  const [options, setOptions] = useState<[string, string, string, string]>(existing?.options ?? ["", "", "", ""]);
  const [correct, setCorrect] = useState<0 | 1 | 2 | 3>(existing?.correct ?? 0);

  const canSave = question.trim() && options.every((o) => o.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-zinc-100">
          <div>
            <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-widest mb-0.5">Quiz question</p>
            <p className="text-sm font-semibold text-zinc-900 leading-tight">{poi.title}</p>
          </div>
          <button onClick={onClose} className="text-zinc-300 hover:text-zinc-500 transition-colors mt-0.5">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              placeholder="What do you want visitors to discover about this work?"
              className="w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none text-zinc-800 placeholder:text-zinc-300"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
              Answer options — tap to mark correct
            </label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    onClick={() => setCorrect(i as 0 | 1 | 2 | 3)}
                    className={`size-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold transition-all border ${
                      correct === i ? "bg-violet-600 border-violet-600 text-white" : "border-zinc-300 text-zinc-400 hover:border-violet-300"
                    }`}
                  >
                    {OPTION_LABELS[i]}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const next = [...options] as [string, string, string, string];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Option ${OPTION_LABELS[i]}`}
                    className="flex-1 text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 text-zinc-800 placeholder:text-zinc-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-between gap-3">
          {existing ? (
            <button onClick={onRemove} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove question</button>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
            <button
              onClick={() => onSave({ question, options, correct })}
              disabled={!canSave}
              className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
