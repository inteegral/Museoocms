import { X, Globe } from "lucide-react";

interface RedemptionPageContent {
  title: string;
  description: string;
  buttonText: string;
}

interface Props {
  guideName: string;
  redemptionUrl: string;
  thumbnail: string;
  content: RedemptionPageContent;
  onClose: () => void;
}

export function RedemptionPagePreviewModal({ guideName, redemptionUrl, thumbnail, content, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>

        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 border-b border-zinc-200 flex-shrink-0">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 mx-3 px-3 py-1.5 bg-white rounded-md border border-zinc-200 text-[11px] text-zinc-500 truncate font-mono">
            {redemptionUrl}
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Page content */}
        <div className="overflow-y-auto flex-1">

          {/* Hero */}
          <div className="relative h-48 bg-zinc-900">
            <img src={thumbnail} alt={guideName} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">Audio Guide · Paid Access</p>
              <h1 className="text-[20px] font-semibold text-white leading-tight">{content.title}</h1>
            </div>
          </div>

          {/* Redemption form */}
          <div className="px-5 py-6 space-y-4">
            <div>
              <p className="text-[14px] font-semibold text-zinc-900 mb-1">Enter your access code</p>
              <p className="text-[12px] text-zinc-500">{content.description}</p>
            </div>

            <div className="flex items-center gap-2 px-4 py-3.5 border-2 border-zinc-200 rounded-xl focus-within:border-zinc-900 transition-colors">
              <span className="font-mono text-[15px] text-zinc-400 tracking-[0.2em]">ABC · 123</span>
            </div>

            <button className="w-full py-3.5 bg-zinc-900 text-white text-[14px] font-semibold rounded-xl hover:bg-zinc-800 transition-colors">
              {content.buttonText}
            </button>

            <p className="text-center text-[11px] text-zinc-400">Single-use code · Locked to this device · No app required</p>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 flex items-center justify-center gap-1.5">
            <Globe className="size-3 text-zinc-300" strokeWidth={1.5} />
            <span className="text-[10px] text-zinc-300">Powered by Museoo</span>
          </div>

        </div>
      </div>
    </div>
  );
}
