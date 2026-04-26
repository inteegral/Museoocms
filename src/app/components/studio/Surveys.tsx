import {
  ClipboardList, Plus, X, Trash2, Edit, Check,
  GripVertical, Type, CheckSquare, Star, ChevronDown, Headphones,
} from "lucide-react";
import { useState } from "react";
import { PageShell } from "./PageShell";

interface Question {
  id: string;
  type: "text" | "rating" | "multiple_choice";
  question: string;
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  name: string;
  description: string;
  guideName?: string;
  questions: Question[];
  createdAt: string;
  responses: number;
  status: "active" | "draft";
}

const guideNames = [
  "Renaissance Masterpieces",
  "Ancient Egypt Collection",
  "Modern Art Gallery",
  "Sculpture Garden Tour",
];

const initialSurveys: Survey[] = [
  {
    id: "1",
    name: "Post-Visit Experience Survey",
    description: "Collect feedback about the overall visitor experience",
    questions: [
      { id: "q1", type: "rating", question: "How would you rate your overall experience?", required: true },
      { id: "q2", type: "text", question: "What did you enjoy most about your visit?", required: true },
      { id: "q3", type: "multiple_choice", question: "How did you hear about us?", required: false, options: ["Social Media", "Friend/Family", "Website", "Tourist Guide", "Other"] },
    ],
    guideName: "Renaissance Masterpieces",
    createdAt: "2024-03-20",
    responses: 156,
    status: "active",
  },
  {
    id: "2",
    name: "Audio Quality Feedback",
    description: "Evaluate the audio guide technical quality",
    questions: [
      { id: "q1", type: "rating", question: "Rate the audio quality", required: true },
      { id: "q2", type: "rating", question: "Rate the voice clarity", required: true },
      { id: "q3", type: "text", question: "Any technical issues encountered?", required: false },
    ],
    createdAt: "2024-03-15",
    responses: 89,
    status: "active",
  },
];

export function Surveys() {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Survey>>({ name: "", description: "", guideName: "", questions: [], status: "draft" });
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);

  const totalResponses = surveys.reduce((s, sv) => s + sv.responses, 0);
  const activeCount = surveys.filter(s => s.status === "active").length;

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setDraft({ name: "", description: "", guideName: "", questions: [], status: "draft" });
    setEditingQuestion(null);
  };

  const openEdit = (survey: Survey) => {
    setEditingId(survey.id);
    setDraft({ name: survey.name, description: survey.description, guideName: survey.guideName ?? "", questions: [...survey.questions], status: survey.status });
    setShowModal(true);
  };

  const addQuestion = () => {
    if (!editingQuestion?.question || !editingQuestion?.type) return;
    const q: Question = {
      id: `q${(draft.questions?.length ?? 0) + 1}-${Date.now()}`,
      type: editingQuestion.type,
      question: editingQuestion.question,
      required: editingQuestion.required ?? false,
      options: editingQuestion.options,
    };
    setDraft({ ...draft, questions: [...(draft.questions ?? []), q] });
    setEditingQuestion(null);
  };

  const saveSurvey = () => {
    if (!draft.name || !draft.questions?.length) return;
    if (editingId) {
      setSurveys(ss => ss.map(s => s.id === editingId
        ? { ...s, name: draft.name!, description: draft.description ?? "", guideName: draft.guideName, questions: draft.questions!, status: draft.status as "active" | "draft" }
        : s
      ));
    } else {
      setSurveys(ss => [...ss, {
        id: `s-${Date.now()}`,
        name: draft.name!,
        description: draft.description ?? "",
        guideName: draft.guideName,
        questions: draft.questions!,
        createdAt: new Date().toISOString().split("T")[0],
        responses: 0,
        status: draft.status as "active" | "draft",
      }]);
    }
    closeModal();
  };

  const deleteSurvey = (id: string) => setSurveys(ss => ss.filter(s => s.id !== id));

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl flex items-center justify-center bg-violet-50">
              <ClipboardList className="size-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Surveys</h1>
              <p className="text-[13px] text-zinc-400 mt-0.5">Collect structured feedback from your visitors</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white rounded-xl transition-all active:scale-95 bg-zinc-900 hover:bg-zinc-700"
          >
            <Plus className="size-4" />
            Create Survey
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Surveys", value: surveys.length, color: "bg-violet-50", icon: ClipboardList, iconColor: "text-violet-600" },
            { label: "Active", value: activeCount, color: "bg-emerald-50", icon: ClipboardList, iconColor: "text-emerald-600" },
            { label: "Total Responses", value: totalResponses, color: "bg-amber-50", icon: ClipboardList, iconColor: "text-amber-600" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-zinc-200 rounded-xl px-5 py-4">
              <p className="text-[22px] font-semibold text-zinc-900 leading-none">{value}</p>
              <p className="text-[11px] text-zinc-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Survey cards */}
        {surveys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-14 rounded-2xl flex items-center justify-center mb-4 bg-violet-50">
              <ClipboardList className="size-7 text-violet-500" />
            </div>
            <p className="text-[15px] font-medium text-zinc-700 mb-1">No surveys yet</p>
            <p className="text-[13px] text-zinc-400 mb-5">Create your first survey to start collecting structured feedback</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-zinc-900 hover:bg-zinc-700"
            >
              <Plus className="size-4" />Create Survey
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {surveys.map((survey) => (
              <div key={survey.id} className="p-5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all group" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[14px] font-semibold text-zinc-900 truncate">{survey.name}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                        survey.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"
                      }`}>
                        <span className={`size-1.5 rounded-full ${survey.status === "active" ? "bg-emerald-400" : "bg-zinc-400"}`} />
                        {survey.status === "active" ? "Active" : "Draft"}
                      </span>
                    </div>
                    <p className="text-[12px] text-zinc-500 leading-relaxed">{survey.description}</p>
                    {survey.guideName && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Headphones className="size-3 text-zinc-400" strokeWidth={1.5} />
                        <span className="text-[11px] text-zinc-500 font-medium">{survey.guideName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-4 pb-4 border-b border-zinc-100">
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Questions</p>
                    <p className="text-[16px] font-semibold text-zinc-900">{survey.questions.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Responses</p>
                    <p className="text-[16px] font-semibold text-zinc-900">{survey.responses}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Created</p>
                    <p className="text-[12px] text-zinc-600">{survey.createdAt}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openEdit(survey)} className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                    <Edit className="size-3.5 inline mr-1.5" />Edit
                  </button>
                  <button className="flex-1 px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
                    View Results
                  </button>
                  <button onClick={() => deleteSurvey(survey.id)} className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-400 hover:text-red-600 hover:border-red-200 rounded-lg transition-all">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-zinc-900">{editingId ? "Edit Survey" : "Create Survey"}</h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-700 transition-colors"><X className="size-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-zinc-700 mb-2">Survey Name *</label>
                <input
                  value={draft.name}
                  onChange={e => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g., Post-Visit Experience Survey"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-zinc-700 mb-2">Description</label>
                <textarea
                  value={draft.description}
                  onChange={e => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Describe the purpose of this survey..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-zinc-700 mb-1.5">Audio Guide <span className="text-zinc-400 font-normal">— optional</span></label>
                <div className="relative">
                  <select
                    value={draft.guideName}
                    onChange={e => setDraft({ ...draft, guideName: e.target.value })}
                    className="w-full appearance-none pl-4 pr-8 py-2.5 border border-zinc-200 rounded-lg text-[14px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white cursor-pointer"
                  >
                    <option value="">No specific guide</option>
                    {guideNames.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-zinc-700 mb-3">
                  Questions <span className="text-zinc-400 font-normal">({draft.questions?.length ?? 0})</span>
                </label>

                {(draft.questions ?? []).length > 0 && (
                  <div className="space-y-2 mb-3">
                    {draft.questions!.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-2.5">
                        <GripVertical className="size-4 text-zinc-300 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[11px] font-semibold text-zinc-400">Q{idx + 1}</span>
                            <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                              q.type === "rating" ? "bg-blue-50 text-blue-600" :
                              q.type === "text" ? "bg-violet-50 text-violet-600" : "bg-emerald-50 text-emerald-600"
                            }`}>
                              {q.type === "rating" ? "Rating" : q.type === "text" ? "Text" : "Multiple Choice"}
                            </span>
                            {q.required && <span className="px-1.5 py-0.5 bg-zinc-200 text-zinc-600 text-[10px] font-semibold rounded-full">Required</span>}
                          </div>
                          <p className="text-[13px] text-zinc-800">{q.question}</p>
                          {q.options && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {q.options.map((opt, i) => (
                                <span key={i} className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-500 text-[11px] rounded">{opt}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setDraft({ ...draft, questions: draft.questions!.filter((_, i) => i !== idx) })}
                          className="text-zinc-300 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {editingQuestion ? (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
                    <div>
                      <label className="block text-[12px] font-semibold text-zinc-600 mb-2">Question Type</label>
                      <div className="flex gap-2">
                        {([
                          { type: "rating" as const, label: "Rating", icon: Star },
                          { type: "text" as const, label: "Text", icon: Type },
                          { type: "multiple_choice" as const, label: "Multiple", icon: CheckSquare },
                        ]).map(({ type, label, icon: Icon }) => (
                          <button
                            key={type}
                            onClick={() => setEditingQuestion({ ...editingQuestion, type, ...(type === "multiple_choice" ? { options: ["Option 1", "Option 2"] } : {}) })}
                            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border transition-all ${
                              editingQuestion.type === type ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                            }`}
                          >
                            <Icon className="size-3.5" />{label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-zinc-600 mb-2">Question</label>
                      <input
                        value={editingQuestion.question ?? ""}
                        onChange={e => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                        placeholder="Enter your question..."
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                    </div>

                    {editingQuestion.type === "multiple_choice" && (
                      <div>
                        <label className="block text-[12px] font-semibold text-zinc-600 mb-2">Options (comma-separated)</label>
                        <input
                          value={editingQuestion.options?.join(", ") ?? ""}
                          onChange={e => setEditingQuestion({ ...editingQuestion, options: e.target.value.split(",").map(s => s.trim()) })}
                          placeholder="Option 1, Option 2, Option 3"
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingQuestion.required ?? false}
                        onChange={e => setEditingQuestion({ ...editingQuestion, required: e.target.checked })}
                        className="size-4 rounded border-zinc-300"
                      />
                      <span className="text-[13px] text-zinc-600">Required question</span>
                    </label>

                    <div className="flex gap-2">
                      <button onClick={addQuestion} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700">
                        <Check className="size-3.5" />Add Question
                      </button>
                      <button onClick={() => setEditingQuestion(null)} className="px-3 py-2 border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingQuestion({ type: "rating", question: "", required: false })}
                    className="w-full px-4 py-3 border-2 border-dashed border-zinc-200 text-zinc-500 text-[13px] font-semibold rounded-lg hover:border-zinc-400 hover:bg-zinc-50 transition-all"
                  >
                    <Plus className="size-4 inline mr-2" />Add Question
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-zinc-700 mb-2">Status</label>
                <div className="flex gap-2">
                  {(["draft", "active"] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setDraft({ ...draft, status: s })}
                      className={`flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg border transition-all ${
                        draft.status === s ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <button onClick={closeModal} className="px-5 py-2.5 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-200 rounded-lg transition-all">Cancel</button>
              <button
                onClick={saveSurvey}
                disabled={!draft.name || !draft.questions?.length}
                className="px-6 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editingId ? "Save Changes" : "Create Survey"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
