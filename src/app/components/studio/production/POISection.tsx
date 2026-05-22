import { Plus, MapPin, Trophy } from "lucide-react";
import { Link } from "react-router";
import { POIItem } from "./scripting/POIItem";
import type { GuidePOI } from "../../../types";
import type { QuizQuestion } from "../pois/POIEditor";

export function POISection({
  selectedPOIs,
  poiQuestions,
  linkedChallengeId,
  maxPOIs,
  movePOI,
  onAddPOI,
  onCreatePOI,
  onEditPOI,
  onRemovePOI,
  onQuizPOI,
}: {
  selectedPOIs: GuidePOI[];
  poiQuestions: Record<string, QuizQuestion>;
  linkedChallengeId: string;
  maxPOIs: number;
  movePOI: (dragIndex: number, hoverIndex: number) => void;
  onAddPOI: () => void;
  onCreatePOI: () => void;
  onEditPOI: (poi: GuidePOI) => void;
  onRemovePOI: (poiId: string) => void;
  onQuizPOI: (poi: GuidePOI) => void;
}) {
  return (
    <div id="poi-section" className="bg-white rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)" }}>
      <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-zinc-900">Points of Interest</h2>
          <p className="text-[12px] text-zinc-400 mt-0.5">Drag to reorder · {selectedPOIs.length}/{maxPOIs} used</p>
        </div>
        <button
          onClick={onAddPOI}
          disabled={selectedPOIs.length >= maxPOIs}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="size-4" />
          Add POI
        </button>
      </div>

      {/* Challenge banner — shown only when no challenge exists */}
      {linkedChallengeId === "" && selectedPOIs.length > 0 && (
        <div className="mx-5 mt-4 flex items-center gap-3 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl">
          <Trophy className="size-4 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-[12px] text-zinc-500 flex-1">
            Create a <strong className="text-zinc-700">Challenge</strong> for this guide to enable quiz questions on each POI and reward visitors who complete them.
          </p>
          <Link to="/challenge" className="text-[12px] font-semibold text-zinc-700 hover:text-zinc-900 whitespace-nowrap transition-colors">
            Set up →
          </Link>
        </div>
      )}

      <div className="p-5">
        {selectedPOIs.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative inline-flex items-center justify-center mb-5">
              <div className="size-16 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center">
                <MapPin className="size-7 text-zinc-300" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-[15px] font-semibold text-zinc-800 mb-1.5">No points of interest yet</p>
            <p className="text-[12px] text-zinc-400 leading-relaxed max-w-[210px] mx-auto mb-6">
              POIs are the stops on your guide — each one has a script, image, and location.
            </p>
            <div className="relative inline-flex">
              <span className="absolute inset-0 rounded-xl animate-ping bg-zinc-300 opacity-50" />
              <button
                onClick={onCreatePOI}
                className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
              >
                <Plus className="size-4" />
                Add your first POI
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedPOIs.map((poi, index) => (
              <POIItem
                key={poi.id}
                poi={poi}
                index={index}
                onRemove={() => onRemovePOI(poi.id)}
                onEdit={() => onEditPOI(poi)}
                onQuiz={() => onQuizPOI(poi)}
                quizQuestion={poiQuestions[poi.id]}
                hasChallenge={linkedChallengeId !== ""}
                movePOI={movePOI}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
