import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Plus, GripVertical, X, Globe, Sparkles, FileText, CheckCircle2, AlertCircle, DollarSign, LockOpen } from "lucide-react";
import { mockGuides, mockPOIs, languages } from "../../data/mockData";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AIAssistant } from "./AIAssistant";

interface POI {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  orderIndex: number;
}

function POIItem({ poi, onRemove, index, movePOI }: { 
  poi: POI; 
  onRemove: () => void;
  index: number;
  movePOI: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "POI",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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

  const hasContent = poi.body && poi.body.length > 50;

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        group flex items-start gap-4 p-5 bg-white rounded-lg border border-zinc-200
        cursor-move hover:border-zinc-300 transition-all
        ${isDragging ? "opacity-40 scale-95" : ""}
      `}
      style={{
        boxShadow: isDragging ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
      }}
    >
      <GripVertical className="size-5 text-zinc-400 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="size-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
        <img src={poi.imageUrl} alt={poi.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-[15px] text-zinc-950 mb-1 leading-tight">
              {poi.title}
            </h4>
            <p className="text-[13px] text-zinc-600 line-clamp-2 leading-relaxed">
              {poi.body.slice(0, 120)}...
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasContent ? (
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="size-4" />
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="size-4" />
              </div>
            )}
            <button
              onClick={onRemove}
              className="text-zinc-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideEditorContent() {
  const { id } = useParams();
  const guide = mockGuides.find((g) => g.id === id);
  const [selectedPOIs, setSelectedPOIs] = useState<POI[]>(mockPOIs.slice(0, guide?.poiCount || 0));
  const [title, setTitle] = useState(guide?.title || "");
  const [description, setDescription] = useState(guide?.description || "");
  const [showAddPOI, setShowAddPOI] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(guide?.languages || ["it"]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">(guide?.status || "draft");
  const [accessType, setAccessType] = useState<"free" | "paid">("free");

  const movePOI = (dragIndex: number, hoverIndex: number) => {
    const newPOIs = [...selectedPOIs];
    const [removed] = newPOIs.splice(dragIndex, 1);
    newPOIs.splice(hoverIndex, 0, removed);
    setSelectedPOIs(newPOIs);
  };

  const removePOI = (poiId: string) => {
    setSelectedPOIs(selectedPOIs.filter((p) => p.id !== poiId));
  };

  const addPOI = (poi: POI) => {
    setSelectedPOIs([...selectedPOIs, poi]);
    setShowAddPOI(false);
  };

  const handleAIProposal = (proposal: any) => {
    // Apply AI proposal
    if (proposal.structure?.pois) {
      const newPOIs = proposal.structure.pois
        .slice(0, maxPOIs)
        .map((suggestedPOI: any, index: number) => {
          const existingPOI = mockPOIs[index] || mockPOIs[0];
          return { ...existingPOI, orderIndex: suggestedPOI.order };
        });
      setSelectedPOIs(newPOIs);
    }
    setShowAIAssistant(false);
  };

  const availablePOIs = mockPOIs.filter(
    (poi) => !selectedPOIs.find((sp) => sp.id === poi.id)
  );

  const maxPOIs = 10; // Free tier limit
  const completedPOIs = selectedPOIs.filter(p => p.body && p.body.length > 50).length;
  const progressPercentage = selectedPOIs.length > 0 ? Math.round((completedPOIs / selectedPOIs.length) * 100) : 0;

  if (!guide) {
    return <div className="p-8">Audioguida non trovata</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/studio/guides"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-zinc-600 hover:text-zinc-900 mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Guides
          </Link>

          {/* Title & Description */}
          <div className="mb-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[32px] font-semibold text-zinc-950 tracking-tight w-full border-none outline-none bg-transparent mb-3 focus:ring-0 placeholder:text-zinc-400"
              placeholder="Guide Title"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="text-[15px] text-zinc-600 leading-relaxed w-full border-none outline-none bg-transparent resize-none focus:ring-0 placeholder:text-zinc-400"
              placeholder="Add a description for your guide..."
            />
          </div>

          {/* Status & Progress Bar */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className={`size-2 rounded-full ${status === 'published' ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
              <span className="text-[13px] font-semibold text-zinc-600 uppercase tracking-wide">
                {status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-semibold text-zinc-600 uppercase tracking-wide">
                  Content Progress
                </span>
                <span className="text-[12px] font-semibold text-zinc-900">
                  {completedPOIs}/{selectedPOIs.length} POIs
                </span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-900 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-zinc-200 rounded-lg p-4" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="text-[28px] font-light text-zinc-950 mb-1">
                {selectedPOIs.length}
              </div>
              <div className="text-[12px] font-semibold text-zinc-600 uppercase tracking-wide">
                Total POIs
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-4" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="text-[28px] font-light text-zinc-950 mb-1">
                {selectedLanguages.length}
              </div>
              <div className="text-[12px] font-semibold text-zinc-600 uppercase tracking-wide">
                Languages
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-4" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="text-[28px] font-light text-zinc-950 mb-1">
                {progressPercentage}%
              </div>
              <div className="text-[12px] font-semibold text-zinc-600 uppercase tracking-wide">
                Complete
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* POIs Section */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-semibold text-zinc-950 mb-1">
                    Points of Interest
                  </h2>
                  <p className="text-[13px] text-zinc-600">
                    Drag to reorder • {selectedPOIs.length}/{maxPOIs} used
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPOI(true)}
                  disabled={selectedPOIs.length >= maxPOIs}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Plus className="size-4" />
                  Add POI
                </button>
              </div>

              <div className="p-6">
                {selectedPOIs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="size-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="size-8 text-zinc-400" />
                    </div>
                    <p className="text-[15px] text-zinc-600 mb-1">No POIs added yet</p>
                    <p className="text-[13px] text-zinc-500">
                      Add POIs manually or use AI Assistant to build your narrative
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPOIs.map((poi, index) => (
                      <POIItem
                        key={poi.id}
                        poi={poi}
                        index={index}
                        onRemove={() => removePOI(poi.id)}
                        movePOI={movePOI}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant CTA - Only if guide needs development */}
            {(selectedPOIs.length === 0 || completedPOIs < selectedPOIs.length) && (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-6 text-white" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 size-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="size-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold mb-2">
                      {selectedPOIs.length === 0 ? 'Build with AI Assistant' : 'Enhance with AI Assistant'}
                    </h3>
                    <p className="text-[13px] text-zinc-300 leading-relaxed mb-4">
                      {selectedPOIs.length === 0 
                        ? 'Let AI create a complete narrative structure based on your museum\'s documents and context.'
                        : `${selectedPOIs.length - completedPOIs} POIs need content development. AI can help craft engaging audio scripts.`
                      }
                    </p>
                    <button
                      onClick={() => setShowAIAssistant(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-900 text-[13px] font-semibold rounded-lg hover:bg-zinc-100 transition-all"
                    >
                      <Sparkles className="size-4" />
                      {selectedPOIs.length === 0 ? 'Start Building' : 'Develop Content'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Section */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <h3 className="text-[14px] font-semibold text-zinc-950 mb-4 uppercase tracking-wide">
                Publishing
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Access Type Toggle */}
                <div>
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-3">
                    Access Type
                  </label>
                  
                  <div className="space-y-2">
                    {/* Free Option */}
                    <button
                      onClick={() => setAccessType("free")}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        accessType === "free"
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          accessType === "free" ? "border-zinc-900" : "border-zinc-300"
                        }`}>
                          {accessType === "free" && (
                            <div className="size-2.5 rounded-full bg-zinc-900" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <LockOpen className="size-4 text-zinc-700" />
                            <span className="font-semibold text-[14px] text-zinc-950">
                              Free Access
                            </span>
                          </div>
                          <p className="text-[12px] text-zinc-600 leading-relaxed">
                            Single universal QR code for everyone
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Paid Option */}
                    <button
                      onClick={() => setAccessType("paid")}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        accessType === "paid"
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          accessType === "paid" ? "border-zinc-900" : "border-zinc-300"
                        }`}>
                          {accessType === "paid" && (
                            <div className="size-2.5 rounded-full bg-zinc-900" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="size-4 text-zinc-700" />
                            <span className="font-semibold text-[14px] text-zinc-950">
                              Paid Access
                            </span>
                          </div>
                          <p className="text-[12px] text-zinc-600 leading-relaxed">
                            Unique QR per visitor (device-locked)
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Info text */}
                  {accessType === "paid" && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-[11px] text-blue-700 leading-relaxed">
                        💡 Generate unique QR codes in <strong>Monetization</strong> section after publishing
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  className="w-full px-4 py-2.5 bg-zinc-900 text-white text-[14px] font-semibold rounded-lg hover:bg-zinc-800 transition-all shadow-sm"
                  disabled={selectedPOIs.length === 0}
                >
                  {status === 'published' ? 'Update Guide' : 'Publish Guide'}
                </button>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <h3 className="text-[14px] font-semibold text-zinc-950 mb-4 uppercase tracking-wide">
                Languages
              </h3>

              <div className="space-y-2 mb-4">
                {selectedLanguages.map((lang) => {
                  const langData = languages.find((l) => l.code === lang);
                  return (
                    <div key={lang} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <span className="text-[20px]">{langData?.flag}</span>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold text-zinc-900">
                          {langData?.name}
                        </div>
                        {lang === "it" && (
                          <div className="text-[11px] text-zinc-500 uppercase tracking-wide">
                            Primary
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="w-full px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2">
                <Plus className="size-4" />
                Add Language
              </button>

              <p className="text-[11px] text-zinc-500 mt-3 leading-relaxed">
                Additional languages require a translation package
              </p>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <h3 className="text-[14px] font-semibold text-zinc-950 mb-4 uppercase tracking-wide">
                Metadata
              </h3>
              
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Created</span>
                  <span className="font-medium text-zinc-900">Jan 22, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Last Modified</span>
                  <span className="font-medium text-zinc-900">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">POIs</span>
                  <span className="font-medium text-zinc-900">{selectedPOIs.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add POI Modal */}
      {showAddPOI && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-zinc-950">Add Point of Interest</h2>
              <button
                onClick={() => setShowAddPOI(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {availablePOIs.map((poi) => (
                  <button
                    key={poi.id}
                    onClick={() => addPOI(poi)}
                    className="w-full flex items-start gap-4 p-4 border border-zinc-200 rounded-lg hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left"
                  >
                    <img
                      src={poi.imageUrl}
                      alt={poi.title}
                      className="size-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[15px] text-zinc-950 mb-1">
                        {poi.title}
                      </h3>
                      <p className="text-[13px] text-zinc-600 line-clamp-2">
                        {poi.body.slice(0, 100)}...
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant
          guideName={title}
          onClose={() => setShowAIAssistant(false)}
          onAccept={handleAIProposal}
          documentsContext={[
            { id: "1", name: "Museum_History.pdf", type: "pdf" },
            { id: "2", name: "Artwork_Catalog.pdf", type: "pdf" },
          ]}
        />
      )}
    </div>
  );
}

export function GuideEditor() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GuideEditorContent />
    </DndProvider>
  );
}