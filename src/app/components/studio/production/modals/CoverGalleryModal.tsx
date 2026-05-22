import { X, Check } from "lucide-react";

export const COVER_GALLERY = [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
  "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80",
  "https://images.unsplash.com/photo-1579541671172-43429ce17aca?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800&q=80",
  "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&q=80",
  "https://images.unsplash.com/photo-1580974852861-c381510bc98d?w=800&q=80",
  "https://images.unsplash.com/photo-1569779213435-ba3167dde7cc?w=800&q=80",
  "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&q=80",
  "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?w=800&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
];

export function CoverGalleryModal({ thumbnail, onSelect, onClose }: {
  thumbnail: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-zinc-950">Choose Cover Image</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3 max-h-[420px] overflow-y-auto">
          {COVER_GALLERY.map((url) => (
            <button
              key={url}
              onClick={() => onSelect(url)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${thumbnail === url ? "border-zinc-900" : "border-transparent hover:border-zinc-300"}`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              {thumbnail === url && (
                <div className="absolute inset-0 bg-zinc-900/30 flex items-center justify-center">
                  <Check className="size-5 text-white drop-shadow" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
