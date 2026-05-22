import { X } from "lucide-react";
import { VoiceTalent } from "./voicing/VoiceTalent";

export function VoicingModal({ title, onClose, onPublish }: {
  title: string;
  onClose: () => void;
  onPublish: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 flex-shrink-0">
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Voicing</p>
            <p className="text-[14px] font-semibold text-zinc-900">{title}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <VoiceTalent onPublish={onPublish} />
        </div>
      </div>
    </div>
  );
}
