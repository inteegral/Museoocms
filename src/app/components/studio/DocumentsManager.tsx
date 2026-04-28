import { useState, useRef, useEffect } from "react";
import {
  FileText, Upload, Send, Lightbulb, BookOpen,
  X, Sparkles, Tag, MapPin, Check, Search, Plus, SlidersHorizontal,
  User, Users, GraduationCap, FlaskConical, BookMarked, Microscope, Zap, Smile,
  ArrowUp, ArrowDown, Route, Clock, ChevronRight, MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router";
import { PageShell } from "./PageShell";
import { mockPOIs, mockGuides } from "../../data/mockData";

type Doc = {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "docx" | "txt" | "md";
  uploadedAt: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  source?: string;
};

type Idea = {
  id: string;
  title: string;
  excerpt: string;
  source?: string;
  tags: string[];
  usedInPoi?: string;
};

type PlanPOI = {
  id: string;
  title: string;
  rationale: string;
  duration: string;
  note: string;
};

type PlanBrief = {
  title: string;
  duration: string;
  constraints: string;
};

const PLAN_DURATIONS = ["30 min", "45 min", "1 hour", "90 min"] as const;

const MOCK_PROPOSALS: Record<string, PlanPOI[]> = {
  family: [
    { id: "pp1", title: "The Story Wall", rationale: "Interactive intro that hooks younger visitors from the first moment.", duration: "4 min", note: "" },
    { id: "pp2", title: "Venus de Milo", rationale: "The 'missing arms' mystery is a perfect conversation starter for kids.", duration: "5 min", note: "" },
    { id: "pp3", title: "Corinthian Helmet", rationale: "A tactile reproduction is available — children can touch a replica.", duration: "6 min", note: "" },
    { id: "pp4", title: "Roman Mosaic", rationale: "Puzzle-like visuals engage younger audiences naturally.", duration: "5 min", note: "" },
    { id: "pp5", title: "Apollo Statue", rationale: "Close with a myth — Apollo's stories are accessible and memorable.", duration: "5 min", note: "" },
  ],
  default: [
    { id: "pp1", title: "Museum Entrance Hall", rationale: "Sets the historical context and prepares visitors for the journey ahead.", duration: "5 min", note: "" },
    { id: "pp2", title: "Venus de Milo", rationale: "Iconic centerpiece with high emotional and visual impact.", duration: "8 min", note: "" },
    { id: "pp3", title: "Attic Amphora", rationale: "Showcases Greek pottery craftsmanship with narrative depth.", duration: "7 min", note: "" },
    { id: "pp4", title: "Roman Mosaic", rationale: "Bridges the Greek and Roman periods in a natural narrative arc.", duration: "6 min", note: "" },
    { id: "pp5", title: "Apollo Statue", rationale: "Strong closing piece that embodies the classical ideal of beauty.", duration: "6 min", note: "" },
  ],
};

const INITIAL_DOCS: Doc[] = [
  { id: "d1", name: "Greek Collection Catalogue.pdf", size: "2.4 MB", type: "pdf", uploadedAt: "Apr 12" },
  { id: "d2", name: "Renaissance Paintings Notes.docx", size: "890 KB", type: "docx", uploadedAt: "Apr 18" },
  { id: "d3", name: "Visitor Accessibility Guide.pdf", size: "1.1 MB", type: "pdf", uploadedAt: "Apr 20" },
  { id: "d4", name: "Museum History 1891–2024.txt", size: "340 KB", type: "txt", uploadedAt: "Apr 22" },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m0",
    role: "ai",
    text: "Hi! I've read all your documents. Ask me anything about your collection, history, or accessibility — or let me help you draft descriptions for your POIs.",
  },
  {
    id: "m1",
    role: "user",
    text: "Tell me something interesting about the Greek collection for a POI intro.",
  },
  {
    id: "m2",
    role: "ai",
    text: "From the Greek Collection Catalogue, the most striking piece is the red-figure kylix (470 BC) depicting the symposium scene. The detail on the drapery suggests it was made in Athens, likely in the workshop of the Brygos Painter. Visitors often miss the tiny owl scratched inside the bowl — a maker's mark.",
    source: "Greek Collection Catalogue.pdf",
  },
];

const INITIAL_IDEAS: Idea[] = [
  {
    id: "i1",
    title: "The hidden owl in the kylix",
    excerpt: "Visitors often miss the tiny owl scratched inside the bowl — a maker's mark.",
    source: "Greek Collection Catalogue.pdf",
    tags: ["Greek", "POI intro"],
  },
  {
    id: "i2",
    title: "Accessibility: tactile reproduction route",
    excerpt: "Four reproductions are available along the west wing for visually impaired visitors.",
    source: "Visitor Accessibility Guide.pdf",
    tags: ["Accessibility"],
  },
];

const AI_RESPONSES: { trigger: string; text: string; source: string }[] = [
  {
    trigger: "renaissance",
    text: "The Renaissance notes highlight Botticelli's influence on the Florentine school represented in your collection. Three panels in Room 4 were attributed to his workshop in the 1994 restoration — not to the master himself, but the quality is exceptional.",
    source: "Renaissance Paintings Notes.docx",
  },
  {
    trigger: "accessibility",
    text: "According to the Visitor Accessibility Guide, four tactile reproductions are available along the west wing. The audio guide stops are designed for wheelchair height and all ramps have grip rails. The guide suggests a 45-minute reduced-pace route.",
    source: "Visitor Accessibility Guide.pdf",
  },
  {
    trigger: "history",
    text: "Your museum was founded in 1891 by Count Emilio Ferretti as a private collection. It opened to the public in 1923. The 2001 renovation added the underground storage facility that now houses over 3,000 unexhibited pieces.",
    source: "Museum History 1891–2024.txt",
  },
];

const AUDIENCES = ["Adults", "Families & Kids", "School Groups", "Experts"] as const;
const TONES = ["Narrative", "Academic", "Short & Direct", "Playful"] as const;
type Audience = typeof AUDIENCES[number];
type Tone = typeof TONES[number];

const TONE_VARIANTS: Partial<Record<string, Partial<Record<Audience, string>>>> = {
  renaissance: {
    "Families & Kids": "Did you know some paintings in your museum were made by Botticelli's students? In Room 4 there are three panels — they look almost like the real Botticelli, but experts found small differences during a restoration in 1994. Can you spot them?",
    "Experts": "Three panels in Room 4 carry strong workshop attribution to the Bottega del Botticelli, confirmed by infrared reflectography during the 1994 restoration. Underdrawing style and pigment analysis suggest a date between 1485–1495.",
    "School Groups": "These paintings were made in Botticelli's workshop around 500 years ago! A team of restorers in 1994 used special cameras to look underneath the paint and figure out who really made them.",
  },
  accessibility: {
    "Families & Kids": "Great news for families! There are four special touch stations along the west wing where kids (and adults!) can feel the shapes of famous artworks. The whole route takes about 45 minutes at a relaxed pace.",
    "Experts": "The accessibility programme includes haptic reproductions at 4 nodes along the west corridor, with audio stops calibrated at seated height (approx. 110cm). A reduced-pace route is documented at ~45 min.",
    "School Groups": "Your museum has a touch tour! Four stations let students feel reproductions of real artworks — perfect for groups with visual impairments or anyone who learns by touching.",
  },
  history: {
    "Families & Kids": "Your museum is over 130 years old! It started as a private collection belonging to Count Emilio Ferretti, who loved art so much he wanted to share it with everyone. It opened to the public in 1923.",
    "Experts": "Founded 1891 as the Ferretti private collection, institutionalised and opened to the public 1923. The 2001 expansion introduced a climate-controlled sub-ground storage facility, currently housing ~3,000 unexhibited artefacts.",
    "School Groups": "This museum was started by a count named Emilio Ferretti back in 1891. After he passed away, it was turned into a public museum so everyone could enjoy the art he collected.",
  },
};

const POI_GUIDE_MAP: Record<string, string> = {
  "poi-1": "guide-1",
  "poi-2": "guide-1",
  "poi-3": "guide-2",
  "poi-4": "guide-2",
  "poi-5": "guide-3",
};

const DOC_TYPE_COLORS: Record<Doc["type"], string> = {
  pdf: "bg-red-50 text-red-500",
  docx: "bg-blue-50 text-blue-500",
  txt: "bg-zinc-100 text-zinc-500",
  md: "bg-purple-50 text-purple-500",
};

function DocIcon({ type }: { type: Doc["type"] }) {
  return (
    <div className={`size-7 rounded-lg flex items-center justify-center flex-shrink-0 ${DOC_TYPE_COLORS[type]}`}>
      <FileText className="size-3.5" strokeWidth={1.5} />
    </div>
  );
}

function PoiPickerModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (poiId: string, poiTitle: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = mockPOIs.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  const selectedPoi = mockPOIs.find((p) => p.id === selected);

  return (
    <div className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col" style={{ maxHeight: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-[14px] font-semibold text-zinc-900">Use in a POI</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">Choose which POI to send this idea to</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors"><X className="size-4" /></button>
        </div>
        <div className="px-4 py-3 border-b border-zinc-100">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus-within:border-zinc-400 transition-colors">
            <Search className="size-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search POIs…" className="flex-1 bg-transparent outline-none text-[13px] text-zinc-800 placeholder-zinc-400" />
            {search && <button onClick={() => setSearch("")} className="text-zinc-400 hover:text-zinc-600"><X className="size-3" /></button>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-1.5">
          {filtered.length === 0 && <div className="text-center py-8 text-[12px] text-zinc-400">No POIs match "{search}"</div>}
          {filtered.map((poi) => {
            const guide = mockGuides.find((g) => g.id === POI_GUIDE_MAP[poi.id]);
            const isSelected = selected === poi.id;
            return (
              <button key={poi.id} onClick={() => setSelected(poi.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-zinc-50"}`}>
                <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "bg-blue-100 text-blue-600" : "bg-zinc-100 text-zinc-500"}`}>
                  <MapPin className="size-4" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium truncate ${isSelected ? "text-blue-700" : "text-zinc-800"}`}>{poi.title}</p>
                  {guide && <p className="text-[11px] text-zinc-400 truncate mt-0.5">{guide.title}</p>}
                </div>
                {isSelected && <Check className="size-4 text-blue-500 flex-shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
        <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-400 truncate">{selectedPoi ? `Selected: ${selectedPoi.title}` : "No POI selected"}</p>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-[12px] text-zinc-500 hover:bg-zinc-100 transition-colors">Cancel</button>
            <button disabled={!selected} onClick={() => selectedPoi && onConfirm(selectedPoi.id, selectedPoi.title)} className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors">Apply to POI</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveIdeaModal({
  defaultTitle,
  onSave,
  onClose,
}: {
  defaultTitle: string;
  onSave: (title: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(defaultTitle);
  return (
    <div className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-amber-500" strokeWidth={1.5} />
            <h2 className="text-[14px] font-semibold text-zinc-900">Save as idea</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors"><X className="size-4" /></button>
        </div>
        <div className="px-5 py-4">
          <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Title</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && title.trim() && onSave(title.trim())}
            placeholder="Give this idea a name…"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 transition-colors"
          />
        </div>
        <div className="px-5 pb-4 flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-[12px] text-zinc-500 hover:bg-zinc-100 transition-colors">Cancel</button>
          <button disabled={!title.trim()} onClick={() => title.trim() && onSave(title.trim())} className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-30 transition-colors">Save idea</button>
        </div>
      </div>
    </div>
  );
}

function IdeaCard({
  idea,
  onDelete,
  onUseInPoi,
  onAddTag,
  onRemoveTag,
}: {
  idea: Idea;
  onDelete: () => void;
  onUseInPoi: (poiId: string, poiTitle: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-3 relative">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-[12px] font-semibold text-zinc-900 leading-snug">{idea.title}</p>
        <button onClick={onDelete} className="text-zinc-300 hover:text-zinc-500 transition-colors flex-shrink-0 mt-0.5">
          <X className="size-3" />
        </button>
      </div>
      <p className="text-[11px] text-zinc-400 leading-relaxed mb-2 italic">"{idea.excerpt}"</p>
      {idea.source && (
        <div className="flex items-center gap-1 mb-2.5">
          <BookOpen className="size-2.5 text-zinc-300 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-[10px] text-zinc-400 truncate">{idea.source}</span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {idea.tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-500 group">
            <Tag className="size-2" strokeWidth={1.5} />
            {t}
            <button onClick={() => onRemoveTag(t)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 hover:text-red-400">
              <X className="size-2" />
            </button>
          </span>
        ))}
        <div className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-400 transition-colors">
          <Plus className="size-2.5" strokeWidth={2} />
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagInput.trim()) {
                onAddTag(tagInput.trim());
                setTagInput("");
              }
            }}
            placeholder="tag"
            className="bg-transparent outline-none w-10 placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Use in POI */}
      {idea.usedInPoi ? (
        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
          <Check className="size-3" strokeWidth={2.5} />
          Used in {idea.usedInPoi}
        </div>
      ) : (
        <>
          <button onClick={() => setPickerOpen(true)} className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors font-medium">
            <MapPin className="size-3" strokeWidth={1.5} />
            Use in a POI
          </button>
          {pickerOpen && (
            <PoiPickerModal
              onConfirm={(poiId, poiTitle) => { onUseInPoi(poiId, poiTitle); setPickerOpen(false); }}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export function DocumentsManager() {
  const navigate = useNavigate();
  const [docs] = useState<Doc[]>(INITIAL_DOCS);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  const [ideasOpen, setIdeasOpen] = useState(true);
  const [selectionTooltip, setSelectionTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [pendingSave, setPendingSave] = useState<{ text: string; source?: string } | null>(null);
  const [audience, setAudience] = useState<Audience>("Adults");
  const [tone, setTone] = useState<Tone>("Narrative");
  const [toneOpen, setToneOpen] = useState(false);
  // Plan mode
  const [mode, setMode] = useState<"chat" | "plan">("chat");
  const [planBrief, setPlanBrief] = useState<PlanBrief>({ title: "", duration: "45 min", constraints: "" });
  const [planProposal, setPlanProposal] = useState<PlanPOI[] | null>(null);
  const [planGenerating, setPlanGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const toneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toneRef.current && !toneRef.current.contains(e.target as Node)) {
        setToneOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Dismiss selection tooltip on scroll or outside click
  useEffect(() => {
    const dismiss = () => setSelectionTooltip(null);
    window.addEventListener("mousedown", dismiss);
    return () => window.removeEventListener("mousedown", dismiss);
  }, []);

  function handleMessagesMouseUp(e: React.MouseEvent) {
    e.stopPropagation(); // prevent window mousedown from firing immediately
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setSelectionTooltip(null);
      return;
    }
    const text = sel.toString().trim();
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelectionTooltip({ text, x: rect.left + rect.width / 2, y: rect.top });
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    setMessages((prev) => [...prev, { id: `m${Date.now()}`, role: "user", text }]);
    setThinking(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      const match = AI_RESPONSES.find((r) => lower.includes(r.trigger));
      const toneVariant = match ? TONE_VARIANTS[match.trigger]?.[audience] : undefined;
      const responseText = toneVariant ?? (match ? match.text : "I searched through your documents but didn't find a specific reference to that topic. Try rephrasing, or upload more documents to expand the knowledge base.");
      setMessages((prev) => [...prev, {
        id: `m${Date.now() + 1}`,
        role: "ai",
        text: responseText,
        source: match?.source,
      }]);
      setThinking(false);
    }, 1200);
  }

  function saveIdea(title: string) {
    if (!pendingSave) return;
    const newIdea: Idea = {
      id: `i${Date.now()}`,
      title,
      excerpt: pendingSave.text.slice(0, 140),
      source: pendingSave.source,
      tags: [audience, tone],
    };
    setIdeas((prev) => [newIdea, ...prev]);
    setPendingSave(null);
    setSelectionTooltip(null);
    setIdeasOpen(true);
    window.getSelection()?.removeAllRanges();
  }

  function usePoiForIdea(ideaId: string, poiTitle: string) {
    setIdeas((prev) => prev.map((i) => (i.id === ideaId ? { ...i, usedInPoi: poiTitle } : i)));
  }

  function addTag(ideaId: string, tag: string) {
    setIdeas((prev) => prev.map((i) => i.id === ideaId && !i.tags.includes(tag) ? { ...i, tags: [...i.tags, tag] } : i));
  }

  function removeTag(ideaId: string, tag: string) {
    setIdeas((prev) => prev.map((i) => i.id === ideaId ? { ...i, tags: i.tags.filter((t) => t !== tag) } : i));
  }

  function generateProposal() {
    if (!planBrief.title.trim()) return;
    setPlanGenerating(true);
    setPlanProposal(null);
    setTimeout(() => {
      const key = planBrief.title.toLowerCase().includes("famil") || planBrief.title.toLowerCase().includes("kid") || audience === "Families & Kids" ? "family" : "default";
      setPlanProposal(MOCK_PROPOSALS[key].map((p) => ({ ...p, id: `pp${Date.now()}${p.id}` })));
      setPlanGenerating(false);
    }, 1800);
  }

  function movePlanPoi(index: number, dir: -1 | 1) {
    setPlanProposal((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const swap = index + dir;
      if (swap < 0 || swap >= next.length) return next;
      [next[index], next[swap]] = [next[swap], next[index]];
      return next;
    });
  }

  function removePlanPoi(id: string) {
    setPlanProposal((prev) => prev ? prev.filter((p) => p.id !== id) : prev);
  }

  function updatePlanPoiNote(id: string, note: string) {
    setPlanProposal((prev) => prev ? prev.map((p) => p.id === id ? { ...p, note } : p) : prev);
  }

  function createGuideDraft() {
    navigate("/guides/new");
  }

  const planTotalMin = planProposal
    ? planProposal.reduce((sum, p) => sum + parseInt(p.duration), 0)
    : 0;

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-zinc-900">Co-Curator</h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">Your AI assistant — explores the knowledge base and helps you create better content</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] font-medium transition-colors">
            <Upload className="size-3.5" strokeWidth={1.5} />
            Upload document
          </button>
        </div>

        {/* 3-panel card */}
        <div className="flex rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm" style={{ height: "calc(100vh - 220px)", minHeight: 480 }}>

          {/* Left: Document list */}
          <aside className="w-[200px] flex-shrink-0 flex flex-col border-r border-zinc-100">
            <div className="px-3 py-3 border-b border-zinc-100">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Knowledge Base</p>
            </div>
            <div className="flex-1 overflow-y-auto py-1.5">
              <button onClick={() => setActiveDocId(null)} className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${activeDocId === null ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"}`}>
                <Sparkles className="size-3.5 flex-shrink-0 text-zinc-400" strokeWidth={1.5} />
                <span className="text-[12px] font-medium">All documents</span>
              </button>
              {docs.map((doc) => (
                <button key={doc.id} onClick={() => setActiveDocId(doc.id)} className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${activeDocId === doc.id ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"}`}>
                  <DocIcon type={doc.type} />
                  <span className="text-[11px] font-medium leading-tight truncate flex-1">{doc.name}</span>
                </button>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-zinc-100">
              <p className="text-[10px] text-zinc-400">{docs.length} docs indexed</p>
            </div>
          </aside>

          {/* Center: Chat / Plan */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Context bar */}
            <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center gap-2">
              {/* Mode tabs */}
              <div className="flex items-center gap-0.5 bg-zinc-100 rounded-lg p-0.5 flex-shrink-0">
                <button onClick={() => setMode("chat")} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${mode === "chat" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>
                  <MessageSquare className="size-3" strokeWidth={1.5} />
                  Chat
                </button>
                <button onClick={() => setMode("plan")} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${mode === "plan" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>
                  <Route className="size-3" strokeWidth={1.5} />
                  Plan a guide
                </button>
              </div>

              {mode === "chat" && !activeDocId && (
                <>
                  <Sparkles className="size-3.5 text-zinc-400" strokeWidth={1.5} />
                  <span className="text-[11px] text-zinc-400">Chatting with all documents</span>
                </>
              )}
              {mode === "chat" && activeDocId && (
                <>
                  <DocIcon type={docs.find((d) => d.id === activeDocId)!.type} />
                  <span className="text-[12px] font-medium text-zinc-700 truncate">{docs.find((d) => d.id === activeDocId)?.name}</span>
                  <button onClick={() => setActiveDocId(null)} className="ml-1 text-zinc-400 hover:text-zinc-600"><X className="size-3" /></button>
                </>
              )}
              <div className="ml-auto flex items-center gap-2">
                {/* Tone selector */}
                <div className="relative" ref={toneRef}>
                  <button
                    onClick={() => setToneOpen((v) => !v)}
                    className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${toneOpen ? "bg-violet-50 text-violet-700 border border-violet-200" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}
                  >
                    <SlidersHorizontal className="size-3" strokeWidth={1.5} />
                    {audience} · {tone}
                  </button>
                  {toneOpen && (
                    <div className="absolute right-0 top-full mt-1.5 z-30 bg-white border border-zinc-200 rounded-2xl shadow-xl w-[340px]" onClick={(e) => e.stopPropagation()}>
                      <div className="px-4 pt-4 pb-3 border-b border-zinc-100">
                        <p className="text-[13px] font-semibold text-zinc-900">Voice settings</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Tune how the AI writes for your audience</p>
                      </div>

                      <div className="px-4 py-3 border-b border-zinc-100">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Audience</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {([
                            { value: "Adults", icon: User, desc: "General public" },
                            { value: "Families & Kids", icon: Users, desc: "Parents with children" },
                            { value: "School Groups", icon: GraduationCap, desc: "Students & teachers" },
                            { value: "Experts", icon: FlaskConical, desc: "Researchers & scholars" },
                          ] as const).map(({ value, icon: Icon, desc }) => (
                            <button
                              key={value}
                              onClick={() => setAudience(value)}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                audience === value
                                  ? "border-violet-300 bg-violet-50"
                                  : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                              }`}
                            >
                              <div className={`size-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${audience === value ? "bg-violet-100 text-violet-600" : "bg-zinc-100 text-zinc-500"}`}>
                                <Icon className="size-3.5" strokeWidth={1.5} />
                              </div>
                              <div>
                                <p className={`text-[11px] font-semibold leading-tight ${audience === value ? "text-violet-700" : "text-zinc-700"}`}>{value}</p>
                                <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="px-4 py-3">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">Tone</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {([
                            { value: "Narrative", icon: BookMarked, desc: "Story-driven, immersive" },
                            { value: "Academic", icon: Microscope, desc: "Precise, referenced" },
                            { value: "Short & Direct", icon: Zap, desc: "Concise, scannable" },
                            { value: "Playful", icon: Smile, desc: "Light, engaging" },
                          ] as const).map(({ value, icon: Icon, desc }) => (
                            <button
                              key={value}
                              onClick={() => setTone(value)}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                tone === value
                                  ? "border-violet-300 bg-violet-50"
                                  : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                              }`}
                            >
                              <div className={`size-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${tone === value ? "bg-violet-100 text-violet-600" : "bg-zinc-100 text-zinc-500"}`}>
                                <Icon className="size-3.5" strokeWidth={1.5} />
                              </div>
                              <div>
                                <p className={`text-[11px] font-semibold leading-tight ${tone === value ? "text-violet-700" : "text-zinc-700"}`}>{value}</p>
                                <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIdeasOpen((v) => !v)}
                  className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${ideasOpen ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}
                >
                  <Lightbulb className="size-3" strokeWidth={1.5} />
                  Ideas {ideas.length > 0 && `(${ideas.length})`}
                </button>
              </div>
            </div>

            {/* Plan a guide UI */}
            {mode === "plan" && (
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {!planProposal && !planGenerating && (
                  <div className="max-w-lg mx-auto pt-4">
                    <div className="mb-6">
                      <h2 className="text-[15px] font-semibold text-zinc-900">New guide proposal</h2>
                      <p className="text-[12px] text-zinc-400 mt-0.5">Describe your idea and the AI will suggest a sequence of listening stops.</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest block mb-1.5">Guide title</label>
                        <input
                          value={planBrief.title}
                          onChange={(e) => setPlanBrief((b) => ({ ...b, title: e.target.value }))}
                          placeholder="e.g. Greek Collection Highlights"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest block mb-1.5">Estimated duration</label>
                        <div className="flex gap-2">
                          {PLAN_DURATIONS.map((d) => (
                            <button key={d} onClick={() => setPlanBrief((b) => ({ ...b, duration: d }))} className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${planBrief.duration === d ? "border-violet-300 bg-violet-50 text-violet-700" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}>
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest block mb-1.5">Constraints <span className="text-zinc-300 font-normal normal-case tracking-normal">(optional)</span></label>
                        <textarea
                          value={planBrief.constraints}
                          onChange={(e) => setPlanBrief((b) => ({ ...b, constraints: e.target.value }))}
                          placeholder="e.g. Ground floor only, max 5 stops, focus on Greek pottery…"
                          rows={2}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 transition-colors resize-none"
                        />
                      </div>
                      <div className="pt-1 flex items-center gap-3">
                        <button
                          onClick={generateProposal}
                          disabled={!planBrief.title.trim()}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-white text-[13px] font-medium transition-colors"
                        >
                          <Sparkles className="size-3.5" strokeWidth={1.5} />
                          Generate proposal
                        </button>
                        <p className="text-[11px] text-zinc-400">Audience: <span className="font-medium text-zinc-600">{audience}</span></p>
                      </div>
                    </div>
                  </div>
                )}

                {planGenerating && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="size-2 rounded-full bg-zinc-300" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                    <p className="text-[12px]">Building your guide proposal…</p>
                  </div>
                )}

                {planProposal && !planGenerating && (
                  <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-[15px] font-semibold text-zinc-900">{planBrief.title}</h2>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{planProposal.length} stops · ~{planTotalMin} min · {audience}</p>
                      </div>
                      <button onClick={() => { setPlanProposal(null); setPlanGenerating(false); }} className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors">
                        ← Restart
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {planProposal.map((poi, i) => (
                        <div key={poi.id} className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5">
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col gap-0.5 flex-shrink-0 mt-0.5">
                              <button onClick={() => movePlanPoi(i, -1)} disabled={i === 0} className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 transition-colors"><ArrowUp className="size-3" strokeWidth={2} /></button>
                              <button onClick={() => movePlanPoi(i, 1)} disabled={i === planProposal.length - 1} className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 transition-colors"><ArrowDown className="size-3" strokeWidth={2} /></button>
                            </div>
                            <div className="size-5 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">{i + 1}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[13px] font-semibold text-zinc-900">{poi.title}</p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                                    <Clock className="size-3" strokeWidth={1.5} />{poi.duration}
                                  </span>
                                  <button onClick={() => removePlanPoi(poi.id)} className="text-zinc-300 hover:text-red-400 transition-colors"><X className="size-3.5" /></button>
                                </div>
                              </div>
                              <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{poi.rationale}</p>
                              <input
                                value={poi.note}
                                onChange={(e) => updatePlanPoiNote(poi.id, e.target.value)}
                                placeholder="Add a note for the editor…"
                                className="mt-2 w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-700 placeholder-zinc-300 outline-none focus:border-zinc-400 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setPlanProposal((prev) => prev ? [...prev, { id: `pp${Date.now()}`, title: "New stop", rationale: "", duration: "5 min", note: "" }] : prev)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 text-[12px] font-medium transition-colors mb-4"
                    >
                      <Plus className="size-3.5" strokeWidth={2} />
                      Add stop manually
                    </button>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
                      <p className="text-[12px] text-zinc-500">Total: <span className="font-semibold text-zinc-800">~{planTotalMin} min</span></p>
                      <button onClick={createGuideDraft} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-medium transition-colors">
                        Create guide draft
                        <ChevronRight className="size-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {mode === "chat" && <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
              onMouseUp={handleMessagesMouseUp}
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" ? (
                    <div className="mr-14 max-w-[480px] w-full">
                      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3 select-text">
                        <p className="text-[13px] text-zinc-800 leading-relaxed">{msg.text}</p>
                        {msg.source && (
                          <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-zinc-200">
                            <BookOpen className="size-3 text-zinc-400" strokeWidth={1.5} />
                            <span className="text-[11px] text-zinc-400">{msg.source}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="ml-14 max-w-[420px]">
                      <div className="bg-zinc-100 rounded-2xl rounded-tr-sm px-4 py-3 select-text">
                        <p className="text-[13px] text-zinc-700 leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className="mr-14 bg-zinc-50 border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="size-1.5 rounded-full bg-zinc-300" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>}

            {/* Input — chat only */}
            {mode === "chat" && <div className="px-4 py-3 border-t border-zinc-100">
              <div className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus-within:border-zinc-400 transition-colors">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask anything about your collection…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent outline-none text-[13px] text-zinc-800 placeholder-zinc-400 leading-relaxed"
                  style={{ maxHeight: 100, overflowY: "auto" }}
                />
                <button onClick={sendMessage} disabled={!input.trim() || thinking} className="size-7 rounded-lg bg-zinc-700 hover:bg-zinc-800 disabled:opacity-30 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Send className="size-3 text-white" strokeWidth={2} />
                </button>
              </div>
            </div>}
          </div>

          {/* Right: Ideas panel */}
          {ideasOpen && (
            <aside className="w-[240px] flex-shrink-0 flex flex-col border-l border-zinc-100">
              <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="size-3.5 text-amber-500" strokeWidth={1.5} />
                  <p className="text-[12px] font-semibold text-zinc-800">Saved Ideas</p>
                </div>
                <button onClick={() => setIdeasOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  <X className="size-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {ideas.length === 0 && (
                  <div className="text-center py-8">
                    <Lightbulb className="size-7 text-zinc-200 mx-auto mb-2" strokeWidth={1} />
                    <p className="text-[11px] text-zinc-400">Select any text in the chat to save an idea.</p>
                  </div>
                )}
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onDelete={() => setIdeas((prev) => prev.filter((i) => i.id !== idea.id))}
                    onUseInPoi={(poiId, poiTitle) => usePoiForIdea(idea.id, poiTitle)}
                    onAddTag={(tag) => addTag(idea.id, tag)}
                    onRemoveTag={(tag) => removeTag(idea.id, tag)}
                  />
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Selection tooltip */}
      {selectionTooltip && (
        <div
          className="fixed z-40 pointer-events-auto"
          style={{ left: selectionTooltip.x, top: selectionTooltip.y, transform: "translate(-50%, calc(-100% - 8px))" }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { setPendingSave({ text: selectionTooltip.text }); setSelectionTooltip(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-xl text-[12px] font-medium shadow-lg hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            <Lightbulb className="size-3.5 text-amber-400" strokeWidth={1.5} />
            Save as idea
          </button>
          <div className="w-2 h-2 bg-zinc-900 rotate-45 mx-auto -mt-1 rounded-sm" />
        </div>
      )}

      {/* Save idea modal */}
      {pendingSave && (
        <SaveIdeaModal
          defaultTitle={pendingSave.text.slice(0, 60)}
          onSave={saveIdea}
          onClose={() => setPendingSave(null)}
        />
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </PageShell>
  );
}
