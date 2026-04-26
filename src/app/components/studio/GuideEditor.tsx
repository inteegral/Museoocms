import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Plus, GripVertical, X, Globe, Sparkles, FileText, CheckCircle2, AlertCircle, DollarSign, LockOpen, Pencil, ClipboardList, UserCircle2 } from "lucide-react";
import { mockGuides, mockPOIs, languages, mockSurveys } from "../../data/mockData";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AIAssistant } from "./AIAssistant";
import { POIEditor } from "./POIEditor";
import { PageShell } from "./PageShell";
import { getMemberByGuideId, teamMembers, type TeamMember } from "../../data/teamData";

interface POI {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  orderIndex: number;
}

function POIItem({ poi, onRemove, onEdit, index, movePOI }: {
  poi: POI;
  onRemove: () => void;
  onEdit: () => void;
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
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {hasContent ? (
              <CheckCircle2 className="size-4 text-emerald-500 mr-1" />
            ) : (
              <AlertCircle className="size-4 text-amber-500 mr-1" />
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <X className="size-3.5" />
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
  const [editingPOI, setEditingPOI] = useState<POI | null>(null);
  const [creatingPOI, setCreatingPOI] = useState(false);
  const [linkedSurveyId, setLinkedSurveyId] = useState<string>("");
  const [responsible, setResponsible] = useState<TeamMember | undefined>(() =>
    id ? getMemberByGuideId(id) : undefined
  );
  const [responsiblePickerOpen, setResponsiblePickerOpen] = useState(false);
  const assignableMembers = teamMembers.filter((m) => m.status === "active");

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

  const savePOI = (updated: any) => {
    setSelectedPOIs(selectedPOIs.map((p) =>
      p.id === updated.id ? { ...p, title: updated.title, body: updated.audioScript ?? p.body } : p
    ));
    setEditingPOI(null);
  };

  const blankEditorPOI = () => ({
    id: `poi-new-${Date.now()}`,
    title: "",
    description: "",
    status: "in-progress" as const,
    category: "General",
    imageUrl: "",
    audioScript: "",
    updatedAt: "now",
  });

  const handleNewPOISave = (saved: any) => {
    const newPOI: POI = {
      id: saved.id,
      title: saved.title,
      body: saved.audioScript ?? "",
      imageUrl: saved.imageUrl ?? "",
      orderIndex: selectedPOIs.length,
    };
    setSelectedPOIs([...selectedPOIs, newPOI]);
    setCreatingPOI(false);
    setShowAddPOI(false);
  };

  const toEditorPOI = (poi: POI) => ({
    id: poi.id,
    title: poi.title,
    description: "",
    status: "in-progress" as const,
    category: "General",
    imageUrl: poi.imageUrl,
    audioScript: poi.body,
    updatedAt: "now",
  });

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
    return <div className="p-8">Guide not found</div>;
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Guides
        </Link>

        {/* Guide Header Card */}
        <div className="mb-8 bg-white border border-zinc-200 rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)' }}>
          {/* Title & meta */}
          <div className="px-7 pt-7 pb-5 border-b border-zinc-100 group/header">
            <div className="flex items-start justify-between gap-4 mb-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-[26px] font-semibold text-zinc-950 tracking-tight flex-1 border-none outline-none bg-transparent focus:ring-0 placeholder:text-zinc-300 cursor-text"
                placeholder="Guide Title"
              />
              <div className="flex items-center gap-3 flex-shrink-0 mt-1.5">
                <Pencil className="size-3.5 text-zinc-300 group-hover/header:text-zinc-400 transition-colors" />
                <div className={`size-2 rounded-full ${status === 'published' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                <span className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wide">
                  {status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={1}
              className="text-[14px] text-zinc-500 leading-relaxed w-full border-none outline-none bg-transparent resize-none focus:ring-0 placeholder:text-zinc-300 cursor-text"
              placeholder="Add a description..."
            />
          </div>

          {/* Progress */}
          <div className="px-7 py-4 border-b border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                Content Progress
              </span>
              <span className="text-[12px] font-semibold text-zinc-700">
                {completedPOIs}/{selectedPOIs.length} POIs
              </span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Languages */}
          <div className="px-7 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                Languages
              </span>
              <span className="text-[11px] text-zinc-400">
                Additional languages require a translation package
              </span>
            </div>
            <div className="flex items-end gap-4">
              {selectedLanguages.map((lang, i) => (
                <div key={lang} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center text-[12px] font-bold tracking-wider ${
                      i === 0 ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                    style={{ boxShadow: i === 0 ? '0 2px 8px 0 rgba(0,0,0,0.15)' : 'none' }}
                  >
                    {lang.toUpperCase()}
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
                    {i === 0 ? "Primary" : languages.find(l => l.code === lang)?.name}
                  </span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1.5">
                <button className="size-10 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all">
                  <Plus className="size-3.5" />
                </button>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Add</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip — no card, just numbers inline */}
        <div className="flex items-center gap-8 mb-10 px-1">
          <div>
            <span className="text-[22px] font-light text-zinc-900">{selectedPOIs.length}</span>
            <span className="ml-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">POIs</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{selectedLanguages.length}</span>
            <span className="ml-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Languages</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{progressPercentage}%</span>
            <span className="ml-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Complete</span>
          </div>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main — dominant zone */}
          <div className="lg:col-span-2 space-y-6">
            {/* POIs Section */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)' }}>
              <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-zinc-900">Points of Interest</h2>
                  <p className="text-[12px] text-zinc-400 mt-0.5">
                    Drag to reorder · {selectedPOIs.length}/{maxPOIs} used
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPOI(true)}
                  disabled={selectedPOIs.length >= maxPOIs}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="size-4" />
                  Add POI
                </button>
              </div>
              <div className="p-5">
                {selectedPOIs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="size-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="size-7 text-zinc-400" />
                    </div>
                    <p className="text-[14px] text-zinc-600 mb-1">No POIs added yet</p>
                    <p className="text-[12px] text-zinc-400">Add POIs manually or use AI Assistant</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPOIs.map((poi, index) => (
                      <POIItem
                        key={poi.id}
                        poi={poi}
                        index={index}
                        onRemove={() => removePOI(poi.id)}
                        onEdit={() => setEditingPOI(poi)}
                        movePOI={movePOI}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI CTA */}
            {(selectedPOIs.length === 0 || completedPOIs < selectedPOIs.length) && (
              <div className="bg-zinc-900 rounded-xl p-6 text-white" style={{ boxShadow: '0 4px 12px 0 rgba(0,0,0,0.12)' }}>
                <div className="flex items-start gap-4">
                  <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold mb-1">
                      {selectedPOIs.length === 0 ? 'Build with AI Assistant' : 'Enhance with AI Assistant'}
                    </h3>
                    <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">
                      {selectedPOIs.length === 0
                        ? "Let AI create a complete narrative structure from your museum's documents."
                        : `${selectedPOIs.length - completedPOIs} POIs need content. AI can help craft engaging audio scripts.`}
                    </p>
                    <button
                      onClick={() => setShowAIAssistant(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 text-[13px] font-semibold rounded-lg hover:bg-zinc-100 transition-all"
                    >
                      <Sparkles className="size-4" />
                      {selectedPOIs.length === 0 ? 'Start Building' : 'Develop Content'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — secondary panel */}
          <div className="bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
            {/* Publishing */}
            <div className="p-5 border-b border-zinc-200">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-4">Publishing</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-zinc-500 mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-zinc-500 mb-1.5">Access Type</label>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setAccessType("free")}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        accessType === "free" ? "border-zinc-900 bg-white" : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${accessType === "free" ? "border-zinc-900" : "border-zinc-300"}`}>
                          {accessType === "free" && <div className="size-2 rounded-full bg-zinc-900" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <LockOpen className="size-3.5 text-zinc-600" />
                            <span className="text-[13px] font-semibold text-zinc-900">Free Access</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Universal QR code</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setAccessType("paid")}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        accessType === "paid" ? "border-zinc-900 bg-white" : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${accessType === "paid" ? "border-zinc-900" : "border-zinc-300"}`}>
                          {accessType === "paid" && <div className="size-2 rounded-full bg-zinc-900" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="size-3.5 text-zinc-600" />
                            <span className="text-[13px] font-semibold text-zinc-900">Paid Access</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Unique QR per visitor</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  {accessType === "paid" && (
                    <p className="text-[11px] text-blue-600 mt-2 leading-relaxed">
                      Generate QR codes in Monetization after publishing.
                    </p>
                  )}
                </div>

                <button
                  className="w-full px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-40"
                  disabled={selectedPOIs.length === 0}
                >
                  {status === 'published' ? 'Update Guide' : 'Publish Guide'}
                </button>
              </div>
            </div>

            {/* Responsible */}
            <div className="p-5 border-b border-zinc-200">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Responsible</p>
              {responsible ? (
                <div className="group/resp">
                  <div className="flex items-start gap-2.5">
                    {/* Avatar */}
                    <div className="size-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                      {responsible.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-800 leading-tight">{responsible.name}</p>
                      <p className="text-[11px] text-zinc-400">{responsible.email}</p>
                      {responsible.bio && (
                        <p className="text-[11px] text-zinc-400 italic mt-1 leading-snug">{responsible.bio}</p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setResponsiblePickerOpen(true)}
                    className="mt-2 text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button onClick={() => setResponsiblePickerOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-zinc-200 rounded-lg text-[12px] text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 hover:bg-zinc-50 transition-all"
                >
                  <UserCircle2 className="size-4" strokeWidth={1.5} />
                  Assign responsible
                </button>
              )}

              {/* Picker dropdown */}
              {responsiblePickerOpen && (
                <div className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setResponsiblePickerOpen(false)}
                >
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100">
                      <p className="text-[13px] font-semibold text-zinc-900">Assign responsible</p>
                      <button onClick={() => setResponsiblePickerOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {assignableMembers.map((m) => (
                        <button key={m.id}
                          onClick={() => { setResponsible(m); setResponsiblePickerOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${responsible?.id === m.id ? "bg-violet-50" : "hover:bg-zinc-50"}`}
                        >
                          <div className="size-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[10px] flex-shrink-0">
                            {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-zinc-800">{m.name}</p>
                            {m.bio && <p className="text-[11px] text-zinc-400 truncate italic">{m.bio}</p>}
                          </div>
                          {responsible?.id === m.id && <CheckCircle2 className="size-4 text-violet-500 flex-shrink-0" />}
                        </button>
                      ))}
                      <div className="h-px bg-zinc-100 my-1" />
                      <button onClick={() => { setResponsible(undefined); setResponsiblePickerOpen(false); }}
                        className="w-full px-3 py-2 text-[12px] text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg text-left transition-colors"
                      >
                        Remove assignment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="p-5 border-b border-zinc-200">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Metadata</p>
              <div className="space-y-2.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Created</span>
                  <span className="font-medium text-zinc-700">Jan 22, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Last Modified</span>
                  <span className="font-medium text-zinc-700">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">POIs</span>
                  <span className="font-medium text-zinc-700">{selectedPOIs.length}</span>
                </div>
              </div>
            </div>

            {/* Survey */}
            <div className="p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <ClipboardList className="size-3.5 text-zinc-400" strokeWidth={1.5} />
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Survey</p>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">Associate a feedback survey to be shown to visitors after completing this guide.</p>
              <div className="relative">
                <select
                  value={linkedSurveyId}
                  onChange={(e) => setLinkedSurveyId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                >
                  <option value="">No survey linked</option>
                  {mockSurveys.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <Globe className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
              </div>
              {linkedSurveyId && (
                <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                  Survey linked
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* POI Editor — edit existing */}
      {editingPOI && (
        <POIEditor
          poi={toEditorPOI(editingPOI)}
          onClose={() => setEditingPOI(null)}
          onSave={savePOI}
          onDelete={() => { removePOI(editingPOI.id); setEditingPOI(null); }}
        />
      )}

      {/* POI Editor — create new */}
      {creatingPOI && (
        <POIEditor
          poi={blankEditorPOI()}
          onClose={() => setCreatingPOI(false)}
          onSave={handleNewPOISave}
          onDelete={() => setCreatingPOI(false)}
        />
      )}

      {/* Add POI Modal */}
      {showAddPOI && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-[18px] font-semibold text-zinc-950">Add Point of Interest</h2>
              <button
                onClick={() => setShowAddPOI(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Subheader */}
            <div className="px-6 pt-3 pb-3 flex items-center justify-between border-b border-zinc-100 flex-shrink-0">
              <span className="text-[12px] text-zinc-400">
                {availablePOIs.length} available in library
              </span>
              <button
                onClick={() => { setShowAddPOI(false); setCreatingPOI(true); }}
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
                  ))
                )}
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
    </PageShell>
  );
}

export function GuideEditor() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GuideEditorContent />
    </DndProvider>
  );
}