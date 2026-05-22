import type { ReactNode } from "react";
import { AlertCircle, Check } from "lucide-react";

export function PhaseTransitionModal({ targetLabel, isBack, noLangs, hintText, onConfirm, onAddLanguage, onSkipToVoicing, onCancel }: {
  targetLabel: string;
  isBack: boolean;
  noLangs: boolean;
  hintText: ReactNode;
  onConfirm: () => void;
  onAddLanguage: () => void;
  onSkipToVoicing: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-zinc-950/50 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-300" />
        <div className="px-7 pt-8 pb-7">
          <div className="mb-5">
            <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-lg shadow-zinc-900/20">
              {isBack || noLangs
                ? <AlertCircle className="size-5 text-white" />
                : <Check className="size-5 text-white" />
              }
            </div>
          </div>
          <p className="text-[17px] font-semibold text-zinc-900 tracking-tight leading-snug mb-2">
            {isBack ? `Back to ${targetLabel}?` : `Start ${targetLabel}?`}
          </p>
          <p className="text-[13px] text-zinc-400 leading-relaxed">{hintText}</p>
          <div className="mt-7 flex flex-col gap-2">
            {noLangs ? (
              <>
                <button
                  onClick={onAddLanguage}
                  className="w-full py-2.5 bg-zinc-900 text-white text-[13px] font-medium rounded-xl hover:bg-zinc-700 transition-all"
                >
                  Add a language
                </button>
                <button
                  onClick={onSkipToVoicing}
                  className="w-full py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
                >
                  Skip to Voicing →
                </button>
              </>
            ) : (
              <button
                onClick={onConfirm}
                className="w-full py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
              >
                {isBack ? "Go back" : "Confirm"}
              </button>
            )}
            <button
              onClick={onCancel}
              className="w-full py-2.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
