import { useState } from "react";
import {
  Trophy, Plus, ChevronLeft, Trash2, Edit3,
  Zap, Users, Award,
  CheckCircle2, Circle, GripVertical,
} from "lucide-react";
import { mockGuides, mockPOIs } from "../../data/mockData";
import { PageShell } from "./PageShell";

// ── Types ─────────────────────────────────────────────────────────────────────
interface HuntQuestion {
  id: string;
  poiId: string;
  poiTitle: string;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
}

interface Hunt {
  id: string;
  title: string;
  guideId: string;
  guideName: string;
  status: "active" | "draft";
  prize: string;
  prizeCode: string;
  completions: number;
  questions: HuntQuestion[];
  createdAt: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const INITIAL_HUNTS: Hunt[] = [
  {
    id: "hunt-1",
    title: "Greek Art Challenge",
    guideId: "guide-1",
    guideName: "Complete Museum Tour",
    status: "active",
    prize: "10% discount at the museum bookshop",
    prizeCode: "HUNT2024",
    completions: 47,
    questions: [
      {
        id: "q-1", poiId: "poi-1", poiTitle: "Venus de Milo",
        question: "From which period does the Venus de Milo date?",
        options: ["5th century BC", "Hellenistic period (130–100 BC)", "Roman period 1st century AD", "Byzantine 4th century"],
        correct: 1,
      },
      {
        id: "q-2", poiId: "poi-2", poiTitle: "Attic Amphora",
        question: "What decoration technique is used on this amphora?",
        options: ["Red-figure", "Black-figure", "White-ground", "Relief"],
        correct: 1,
      },
      {
        id: "q-3", poiId: "poi-3", poiTitle: "Roman Mosaic",
        question: "In which year was this mosaic discovered?",
        options: ["1967", "1987", "2001", "2010"],
        correct: 1,
      },
    ],
    createdAt: "10 Mar 2026",
  },
  {
    id: "hunt-2",
    title: "Family Discovery Game",
    guideId: "guide-3",
    guideName: "Family Tour",
    status: "draft",
    prize: "Free children's activity kit",
    prizeCode: "FAMILY24",
    completions: 0,
    questions: [
      {
        id: "q-4", poiId: "poi-4", poiTitle: "Corinthian Helmet",
        question: "What material is the Corinthian helmet made of?",
        options: ["Iron", "Bronze", "Copper", "Steel"],
        correct: 1,
      },
    ],
    createdAt: "20 Mar 2026",
  },
];

// ── Toggle pill ───────────────────────────────────────────────────────────────
function TogglePill({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        position: "relative", width: 44, height: 24, borderRadius: 12,
        background: active ? "#D33333" : "#e4e4e7",
        border: "none", cursor: "pointer", padding: 0,
        transition: "background 0.2s ease", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 4,
        left: active ? 24 : 4,
        width: 16, height: 16, borderRadius: "50%",
        background: "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        transition: "left 0.2s ease",
      }} />
    </button>
  );
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

function makeEmptyQuestion(poi: typeof mockPOIs[0]): HuntQuestion {
  return {
    id: `q-${Date.now()}-${poi.id}`,
    poiId: poi.id,
    poiTitle: poi.title,
    question: "",
    options: ["", "", "", ""],
    correct: 0,
  };
}

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "active" | "draft" }) {
  return status === "active" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
      <span className="size-1.5 rounded-full bg-zinc-400 inline-block" />
      Draft
    </span>
  );
}

// ── Question card (editor) ─────────────────────────────────────────────────────
function QuestionCard({
  q, index, onChange, allPOIs,
}: {
  q: HuntQuestion;
  index: number;
  onChange: (updated: HuntQuestion) => void;
  allPOIs: typeof mockPOIs;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      {/* POI header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
        <GripVertical className="size-4 text-zinc-300 flex-shrink-0" />
        <div
          className="size-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[11px] font-semibold"
          style={{ background: "#D33333" }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <select
          value={q.poiId}
          onChange={(e) => {
            const p = allPOIs.find(p => p.id === e.target.value);
            if (p) onChange({ ...q, poiId: p.id, poiTitle: p.title });
          }}
          className="flex-1 text-[13px] font-medium text-zinc-800 bg-transparent border-none focus:outline-none cursor-pointer min-w-0"
        >
          {allPOIs.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="p-5 space-y-4">
        {/* Question text */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
            Question
          </label>
          <textarea
            value={q.question}
            onChange={(e) => onChange({ ...q, question: e.target.value })}
            placeholder="What do you want visitors to discover about this work?"
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-[13px] text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 resize-none"
          />
        </div>

        {/* Answer options */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
            Answer options — click to mark correct
          </label>
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onChange({ ...q, correct: oi as 0|1|2|3 })}
                  className="flex-shrink-0 size-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                  style={{
                    background: q.correct === oi ? "#D33333" : "transparent",
                    color: q.correct === oi ? "white" : "#a1a1aa",
                    border: q.correct === oi ? "none" : "1.5px solid #e4e4e7",
                  }}
                >
                  {OPTION_LABELS[oi]}
                </button>
                <input
                  value={opt}
                  onChange={(e) => {
                    const opts = [...q.options] as [string,string,string,string];
                    opts[oi] = e.target.value;
                    onChange({ ...q, options: opts });
                  }}
                  placeholder={`Option ${OPTION_LABELS[oi]}`}
                  className={`flex-1 px-3 py-2 rounded-lg border text-[13px] focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors ${
                    q.correct === oi
                      ? "border-red-200 bg-red-50/40 text-zinc-800"
                      : "border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-300 focus:border-red-300"
                  }`}
                />
                {q.correct === oi && (
                  <CheckCircle2 className="size-4 flex-shrink-0" style={{ color: "#D33333" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hunt Editor ────────────────────────────────────────────────────────────────
function HuntEditor({
  hunt,
  onSave,
  onCancel,
}: {
  hunt: Hunt | null;
  onSave: (h: Hunt) => void;
  onCancel: () => void;
}) {
  const isNew = hunt === null;
  const guideOptions = mockGuides;

  const [title, setTitle] = useState(hunt?.title ?? "");
  const [guideId, setGuideId] = useState(hunt?.guideId ?? guideOptions[0]?.id ?? "");
  const [prize, setPrize] = useState(hunt?.prize ?? "");
  const [prizeCode, setPrizeCode] = useState(hunt?.prizeCode ?? "");
  const [status, setStatus] = useState<"active" | "draft">(hunt?.status ?? "draft");
  const [questions, setQuestions] = useState<HuntQuestion[]>(() => {
    if (hunt) return hunt.questions;
    return mockPOIs.slice(0, 3).map(makeEmptyQuestion);
  });

  const selectedGuide = guideOptions.find(g => g.id === guideId);

  const updateQ = (idx: number, updated: HuntQuestion) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? updated : q));
  };

  const handleSave = () => {
    const saved: Hunt = {
      id: hunt?.id ?? `hunt-${Date.now()}`,
      title: title || "Untitled Hunt",
      guideId,
      guideName: selectedGuide?.title ?? "",
      status,
      prize,
      prizeCode,
      completions: hunt?.completions ?? 0,
      questions,
      createdAt: hunt?.createdAt ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    onSave(saved);
  };

  return (
    <PageShell>
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onCancel}
          className="size-8 flex items-center justify-center rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors"
        >
          <ChevronLeft className="size-4 text-zinc-600" />
        </button>
        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Hunt title…"
            className="w-full text-[22px] font-semibold text-zinc-900 tracking-tight bg-transparent border-none focus:outline-none placeholder:text-zinc-300"
          />
          <p className="text-[13px] text-zinc-400 mt-0.5">
            {isNew ? "Create a quiz tied to an audio guide" : "Edit hunt"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[13px] text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-[13px] font-semibold text-white rounded-lg transition-all active:scale-95"
            style={{ background: "#D33333" }}
          >
            Save Hunt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: settings */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4">
            <h2 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wide">Settings</h2>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Hunt name</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Greek Art Challenge"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-[13px] text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Linked guide</label>
              <select
                value={guideId}
                onChange={e => setGuideId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-[13px] text-zinc-800 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 bg-white"
              >
                {guideOptions.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Status</label>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-zinc-200">
                <span className="text-[13px] font-medium" style={{ color: status === "active" ? "#D33333" : "#71717a" }}>
                  {status === "active" ? "Active" : "Draft"}
                </span>
                <TogglePill active={status === "active"} onChange={() => setStatus(s => s === "active" ? "draft" : "active")} />
              </div>
            </div>
          </div>

          {/* Prize */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="size-4" style={{ color: "#D33333" }} />
              <h2 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wide">Prize</h2>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                value={prize}
                onChange={e => setPrize(e.target.value)}
                placeholder="e.g. 10% discount at the museum bookshop"
                rows={2}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-[13px] text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Voucher code</label>
              <input
                value={prizeCode}
                onChange={e => setPrizeCode(e.target.value.toUpperCase())}
                placeholder="e.g. HUNT2024"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-[13px] font-mono text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              />
              <p className="text-[10px] text-zinc-400 mt-1">Shown to visitor after completing all questions correctly</p>
            </div>
          </div>
        </div>

        {/* Right: questions */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wide">
              Questions · {questions.length}
            </h2>
            <button
              type="button"
              onClick={() => {
                const nextPoi = mockPOIs[questions.length % mockPOIs.length];
                setQuestions(qs => [...qs, makeEmptyQuestion(nextPoi)]);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <Plus className="size-3.5" />
              Add question
            </button>
          </div>

          {questions.map((q, i) => (
            <div key={q.id} className="relative group">
              <QuestionCard q={q} index={i} onChange={updated => updateQ(i, updated)} allPOIs={mockPOIs} />
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => setQuestions(qs => qs.filter((_, idx) => idx !== i))}
                  className="absolute top-3 right-3 size-7 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-red-500 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </PageShell>
  );
}

// ── Hunt List ──────────────────────────────────────────────────────────────────
export function Hunt() {
  const [hunts, setHunts] = useState<Hunt[]>(INITIAL_HUNTS);
  const [editing, setEditing] = useState<Hunt | null | "new">(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalCompletions = hunts.reduce((s, h) => s + h.completions, 0);
  const activeCount = hunts.filter(h => h.status === "active").length;

  const handleSave = (h: Hunt) => {
    setHunts(hs => {
      const idx = hs.findIndex(x => x.id === h.id);
      return idx >= 0 ? hs.map(x => x.id === h.id ? h : x) : [...hs, h];
    });
    setEditing(null);
  };

  const handleToggleStatus = (id: string) => {
    setHunts(hs => hs.map(h =>
      h.id === id ? { ...h, status: h.status === "active" ? "draft" : "active" } : h
    ));
  };

  const handleDelete = (id: string) => {
    setHunts(hs => hs.filter(h => h.id !== id));
    setDeleteId(null);
  };

  // Editor view
  if (editing !== null) {
    return (
      <HuntEditor
        hunt={editing === "new" ? null : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(211,51,51,0.08)" }}>
            <Trophy className="size-5" style={{ color: "#D33333" }} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Hunt</h1>
            <p className="text-[13px] text-zinc-400 mt-0.5">Quiz tied to each audio stop — reward visitors who listen carefully</p>
          </div>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white rounded-xl transition-all active:scale-95"
          style={{ background: "#D33333" }}
        >
          <Plus className="size-4" />
          New Hunt
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Hunts", value: hunts.length, icon: Trophy },
          { label: "Active", value: activeCount, icon: Zap },
          { label: "Completions", value: totalCompletions, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-zinc-200 rounded-xl px-5 py-4 flex items-center gap-4">
            <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(211,51,51,0.07)" }}>
              <Icon className="size-4" style={{ color: "#D33333" }} />
            </div>
            <div>
              <p className="text-[22px] font-semibold text-zinc-900 leading-none">{value}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hunt cards */}
      {hunts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="size-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(211,51,51,0.07)" }}>
            <Trophy className="size-7" style={{ color: "#D33333" }} />
          </div>
          <p className="text-[15px] font-medium text-zinc-700 mb-1">No hunts yet</p>
          <p className="text-[13px] text-zinc-400 mb-5">Create your first quiz to engage visitors at each stop</p>
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl"
            style={{ background: "#D33333" }}
          >
            <Plus className="size-4" />
            Create Hunt
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {hunts.map((h) => (
            <div
              key={h.id}
              className="bg-white border border-zinc-200 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-zinc-300 transition-colors group"
            >
              {/* Icon */}
              <div
                className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(211,51,51,0.07)" }}
              >
                <Trophy className="size-5" style={{ color: "#D33333" }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] font-semibold text-zinc-900 truncate">{h.title}</span>
                  <StatusBadge status={h.status} />
                </div>
                <div className="flex items-center gap-3 text-[12px] text-zinc-400">
                  <span className="truncate">{h.guideName}</span>
                  <span>·</span>
                  <span>{h.questions.length} questions</span>
                  <span>·</span>
                  <span>{h.completions} completions</span>
                </div>
              </div>

              {/* Prize chip */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 flex-shrink-0">
                <Award className="size-3.5 text-amber-500" />
                <span className="text-[11px] font-medium text-amber-700 max-w-[140px] truncate">{h.prize}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <TogglePill active={h.status === "active"} onChange={() => handleToggleStatus(h.id)} />
                <button
                  onClick={() => setEditing(h)}
                  className="size-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white transition-colors"
                >
                  <Edit3 className="size-3.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => setDeleteId(h.id)}
                  className="size-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:border-red-200 hover:text-red-500 bg-white transition-colors text-zinc-400"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="size-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="size-5 text-red-500" />
            </div>
            <h3 className="text-[15px] font-semibold text-zinc-900 mb-1">Delete hunt?</h3>
            <p className="text-[13px] text-zinc-500 mb-5">This will permanently remove the hunt and all its questions. This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 text-[13px] font-medium text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageShell>
  );
}
