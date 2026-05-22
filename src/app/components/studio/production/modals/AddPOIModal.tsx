import { X, Plus, ImageIcon } from "lucide-react";
import type { GuidePOI } from "../../../../types";

export function AddPOIModal({ availablePOIs, onAdd, onCreate, onClose }: {
  availablePOIs: GuidePOI[];
  onAdd: (poi: GuidePOI) => void;
  onCreate: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[18px] font-semibold text-zinc-950">Add Point of Interest</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <div className="px-6 pt-3 pb-3 flex items-center justify-between border-b border-zinc-100 flex-shrink-0">
          <span className="text-[12px] text-zinc-400">{availablePOIs.length} available in library</span>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
          >
            <Plus className="size-3.5" />
            Create New
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            {availablePOIs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[14px] text-zinc-500 mb-1">All POIs are already added</p>
                <p className="text-[12px] text-zinc-400">Use "+ Create New" to add a new POI from scratch</p>
              </div>
            ) : (
              availablePOIs.map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => onAdd(poi)}
                  className="w-full flex items-start gap-4 p-4 border border-zinc-200 rounded-lg hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left"
                >
                  {poi.imageUrl
                    ? <img src={poi.imageUrl} alt={poi.title} className="size-16 rounded-lg object-cover flex-shrink-0" />
                    : <div className="size-16 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="size-6 text-zinc-300" strokeWidth={1.5} />
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[15px] text-zinc-950 mb-1">{poi.title}</h3>
                    <p className="text-[13px] text-zinc-600 line-clamp-2">{poi.body.slice(0, 100)}...</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
