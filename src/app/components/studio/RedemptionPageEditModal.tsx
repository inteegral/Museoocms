import { X } from "lucide-react";
import { useState } from "react";

interface RedemptionPageContent {
  title: string;
  description: string;
  buttonText: string;
}

interface Props {
  guideName: string;
  initial: RedemptionPageContent;
  onSave: (content: RedemptionPageContent) => void;
  onClose: () => void;
}

export function RedemptionPageEditModal({ guideName, initial, onSave, onClose }: Props) {
  const [content, setContent] = useState<RedemptionPageContent>(initial);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <h2 className="text-[15px] font-semibold text-zinc-900">Edit redemption page</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">{guideName}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Title</label>
            <input
              type="text"
              value={content.title}
              onChange={e => setContent({ ...content, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Description</label>
            <textarea
              value={content.description}
              onChange={e => setContent({ ...content, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors resize-none"
            />
            <p className="text-[11px] text-zinc-400 mt-1">Shown below the title. Keep it short — one sentence.</p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Button text</label>
            <input
              type="text"
              value={content.buttonText}
              onChange={e => setContent({ ...content, buttonText: e.target.value })}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-zinc-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-xl hover:bg-zinc-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
            Save changes
          </button>
        </div>

      </div>
    </div>
  );
}
