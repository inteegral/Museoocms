import { useState } from "react";
import { GripVertical, ImageIcon, Pencil, X, HelpCircle } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { Toggle } from "../../_layout/Toggle";
import type { GuidePOI } from "../../../../types";
import type { QuizQuestion } from "../../pois/POIEditor";

export function POIItem({ poi, onRemove, onEdit, onQuiz, quizQuestion, hasChallenge, index, movePOI }: {
  poi: GuidePOI;
  onRemove: () => void;
  onEdit: () => void;
  onQuiz: () => void;
  quizQuestion?: QuizQuestion;
  hasChallenge: boolean;
  index: number;
  movePOI: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "POI",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: "POI",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        movePOI(item.index, index);
        item.index = index;
      }
    },
  });

  const [isActive, setIsActive] = useState(true);
  const hasContent = poi.body && poi.body.length > 50;

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        group relative flex items-center gap-4 py-5 pr-5 pl-16 bg-white rounded-lg border transition-all cursor-move
        ${isDragging ? "opacity-40 scale-95 border-zinc-200" : "border-zinc-200 hover:border-zinc-300"}
      `}
      style={{
        boxShadow: isDragging ? "none" : "0 1px 3px 0 rgba(0, 0, 0, 0.04)",
        borderLeft: isDragging ? undefined : `3px solid ${hasContent ? "#18181b" : "#e4e4e7"}`,
      }}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10" onClick={e => e.stopPropagation()}>
        <Toggle checked={isActive} onChange={() => setIsActive(v => !v)} />
      </div>

      <GripVertical className="size-4 text-zinc-300 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className={`size-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 flex items-center justify-center transition-all duration-300 ${!isActive ? "grayscale opacity-50" : ""}`}>
        {poi.imageUrl
          ? <img src={poi.imageUrl} alt={poi.title} className="w-full h-full object-cover" />
          : <ImageIcon className="size-5 text-zinc-300" strokeWidth={1.5} />
        }
      </div>

      <div className={`flex-1 min-w-0 transition-opacity duration-300 ${!isActive ? "opacity-40" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-[15px] text-zinc-950 mb-1 leading-tight">{poi.title}</h4>
            <p className="text-[13px] text-zinc-600 line-clamp-2 leading-relaxed">{poi.body.slice(0, 120)}...</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {(() => {
              const s = poi.status ?? "draft";
              const cfg: Record<string, { label: string; cls: string }> = {
                draft:            { label: "Draft",          cls: "bg-zinc-100 text-zinc-500" },
                "in-progress":    { label: "In Progress",    cls: "bg-blue-50 text-blue-600" },
                "under-revision": { label: "Under Revision", cls: "bg-amber-50 text-amber-600" },
                complete:         { label: "Complete",       cls: "bg-emerald-50 text-emerald-600" },
              };
              const { label, cls } = cfg[s] ?? cfg["draft"];
              return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mr-1 ${cls}`}>{label}</span>;
            })()}
            {hasChallenge && (
              <button
                onClick={(e) => { e.stopPropagation(); onQuiz(); }}
                title={quizQuestion ? "Edit quiz question" : "Add quiz question"}
                className={`p-1.5 rounded transition-colors ${quizQuestion ? "text-violet-600 hover:text-violet-700 hover:bg-violet-50" : "text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100"}`}
              >
                <HelpCircle className="size-3.5" />
              </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors">
              <Pencil className="size-3.5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
