import { X, QrCode, Globe, Play, MapPin, Clock, Star } from "lucide-react";

interface LandingPage {
  id: string;
  guideName: string;
  url: string;
  status: "published" | "draft";
  views: number;
  scans: number;
  thumbnail: string;
  createdAt: string;
}

interface Props {
  page: LandingPage;
  onClose: () => void;
}

export function LandingPagePreviewModal({ page, onClose }: Props) {
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
            {page.url}
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Page content */}
        <div className="overflow-y-auto flex-1">

          {/* Hero */}
          <div className="relative h-52 bg-zinc-900">
            <img
              src={page.thumbnail}
              alt={page.guideName}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {page.status === "draft" && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                Draft Preview
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">Audio Guide</p>
              <h1 className="text-[20px] font-semibold text-white leading-tight">{page.guideName}</h1>
            </div>
          </div>

          {/* Guide meta */}
          <div className="px-5 py-4 flex items-center gap-5 border-b border-zinc-100">
            {[
              { icon: Clock, label: "45 min" },
              { icon: MapPin, label: "12 stops" },
              { icon: Star, label: "4.8 · 234 reviews" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="size-3.5 text-zinc-400" strokeWidth={1.5} />
                <span className="text-[12px] text-zinc-500">{label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="px-5 py-4 border-b border-zinc-100">
            <p className="text-[13px] text-zinc-600 leading-relaxed">
              Discover the masterpieces of the Renaissance with this immersive audio guide. Explore iconic works by Botticelli, Leonardo, and Michelangelo with expert commentary.
            </p>
          </div>

          {/* CTA */}
          <div className="px-5 py-5 space-y-3">
            <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 text-white text-[14px] font-semibold rounded-xl hover:bg-zinc-800 transition-colors">
              <Play className="size-4 fill-white stroke-none" />
              Start Audio Guide
            </button>
            <p className="text-center text-[11px] text-zinc-400">Free · No app required · Works in browser</p>
          </div>

          {/* QR section */}
          <div className="mx-5 mb-5 p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-4">
            <div className="size-14 bg-white border border-zinc-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <QrCode className="size-8 text-zinc-400" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-zinc-800 mb-0.5">Scan to open on your phone</p>
              <p className="text-[11px] text-zinc-400">Or visit <span className="text-zinc-600 font-medium">{page.url}</span></p>
            </div>
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
