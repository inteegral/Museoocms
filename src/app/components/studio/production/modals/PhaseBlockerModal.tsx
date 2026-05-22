import { AlertCircle } from "lucide-react";

export function PhaseBlockerModal({ title, detail, onGotoScripting, onClose }: {
  title: string;
  detail: string;
  onGotoScripting: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-zinc-950/50 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-300" />
        <div className="px-7 pt-8 pb-7">
          <div className="mb-5">
            <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-lg shadow-zinc-900/20">
              <AlertCircle className="size-5 text-white" />
            </div>
          </div>
          <p className="text-[17px] font-semibold text-zinc-900 tracking-tight leading-snug mb-2">{title}</p>
          <p className="text-[13px] text-zinc-400 leading-relaxed">{detail}</p>
          <div className="mt-7 flex flex-col gap-2">
            <button
              onClick={onGotoScripting}
              className="w-full px-4 py-2.5 text-[13px] font-medium bg-[#D33333] text-white rounded-xl hover:bg-[#b82c2c] transition-all"
            >
              Go to Scripting
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-600 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
