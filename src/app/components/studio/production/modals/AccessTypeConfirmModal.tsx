import { AlertCircle } from "lucide-react";

export function AccessTypeConfirmModal({ pendingAccessType, onConfirm, onCancel }: {
  pendingAccessType: "free" | "paid";
  onConfirm: () => void;
  onCancel: () => void;
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
          <p className="text-[17px] font-semibold text-zinc-900 tracking-tight leading-snug mb-2">
            Change access on published guide
          </p>
          <p className="text-[13px] text-zinc-400 leading-relaxed mb-5">
            This guide is live. Switching to{" "}
            <span className="font-semibold text-zinc-600">{pendingAccessType}</span> access will take effect
            immediately for all visitors.
          </p>
          {pendingAccessType === "paid" ? (
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3 mb-6 text-[12px] text-zinc-600 leading-relaxed">
              Visitors using the current universal QR will lose access. Unique codes will be required.
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3 mb-6 text-[12px] text-zinc-600 leading-relaxed">
              The guide will become freely accessible to anyone with the universal QR. Existing paid codes will stop being required.
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button
              onClick={onConfirm}
              className="w-full py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
            >
              Yes, change it
            </button>
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
