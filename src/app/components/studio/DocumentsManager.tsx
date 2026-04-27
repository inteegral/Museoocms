import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Upload,
  Send,
  Lightbulb,
  BookOpen,
  X,
  Sparkles,
  Tag,
  MapPin,
  Check,
  Search,
} from "lucide-react";
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
  saved?: boolean;
};

type Idea = {
  id: string;
  title: string;
  excerpt: string;
  source?: string;
  tags: string[];
  usedInPoi?: string;
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

// Mock mapping: which guide each POI belongs to
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

  const filtered = mockPOIs.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPoi = mockPOIs.find((p) => p.id === selected);

  return (
    <div
      className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        style={{ maxHeight: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-[14px] font-semibold text-zinc-900">Use in a POI</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">Choose which POI to send this idea to</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-zinc-100">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus-within:border-zinc-400 transition-colors">
            <Search className="size-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search POIs…"
              className="flex-1 bg-transparent outline-none text-[13px] text-zinc-800 placeholder-zinc-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-zinc-400 hover:text-zinc-600">
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* POI list */}
        <div className="flex-1 overflow-y-auto py-1.5">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-[12px] text-zinc-400">No POIs match "{search}"</div>
          )}
          {filtered.map((poi) => {
            const guideId = POI_GUIDE_MAP[poi.id];
            const guide = mockGuides.find((g) => g.id === guideId);
            const isSelected = selected === poi.id;
            return (
              <button
                key={poi.id}
                onClick={() => setSelected(poi.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isSelected ? "bg-blue-50" : "hover:bg-zinc-50"
                }`}
              >
                <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? "bg-blue-100 text-blue-600" : "bg-zinc-100 text-zinc-500"
                }`}>
                  <MapPin className="size-4" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium truncate ${isSelected ? "text-blue-700" : "text-zinc-800"}`}>
                    {poi.title}
                  </p>
                  {guide && (
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">{guide.title}</p>
                  )}
                </div>
                {isSelected && <Check className="size-4 text-blue-500 flex-shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-400 truncate">
            {selectedPoi ? `Selected: ${selectedPoi.title}` : "No POI selected"}
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-[12px] text-zinc-500 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selected}
              onClick={() => selectedPoi && onConfirm(selectedPoi.id, selectedPoi.title)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              Apply to POI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IdeaCard({
  idea,
  onDelete,
  onUseInPoi,
}: {
  idea: Idea;
  onDelete: () => void;
  onUseInPoi: (poiId: string, poiTitle: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

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
        <div className="flex items-center gap-1 mb-2">
          <BookOpen className="size-2.5 text-zinc-300 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-[10px] text-zinc-400 truncate">{idea.source}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {idea.tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-500">
            <Tag className="size-2" strokeWidth={1.5} />
            {t}
          </span>
        ))}
      </div>

      {idea.usedInPoi ? (
        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
          <Check className="size-3" strokeWidth={2.5} />
          Used in {idea.usedInPoi}
        </div>
      ) : (
        <>
          <button
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors font-medium"
          >
            <MapPin className="size-3" strokeWidth={1.5} />
            Use in a POI
          </button>
          {pickerOpen && (
            <PoiPickerModal
              onConfirm={(poiId, poiTitle) => {
                onUseInPoi(poiId, poiTitle);
                setPickerOpen(false);
              }}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export function DocumentsManager() {
  const [docs] = useState<Doc[]>(INITIAL_DOCS);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  const [ideasOpen, setIdeasOpen] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveTitle, setSaveTitle] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function sendMessage() {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    const userMsg: ChatMessage = { id: `m${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      const match = AI_RESPONSES.find((r) => lower.includes(r.trigger));
      const aiMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: "ai",
        text: match
          ? match.text
          : "I searched through your documents but didn't find a specific reference to that topic. Try rephrasing, or upload more documents to expand the knowledge base.",
        source: match?.source,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setThinking(false);
    }, 1200);
  }

  function startSave(msgId: string, excerpt: string) {
    setSavingId(msgId);
    setSaveTitle(excerpt.slice(0, 60));
  }

  function usePoiForIdea(ideaId: string, poiTitle: string) {
    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, usedInPoi: poiTitle } : i))
    );
  }

  function confirmSave(msg: ChatMessage) {
    if (!saveTitle.trim()) return;
    const newIdea: Idea = {
      id: `i${Date.now()}`,
      title: saveTitle.trim(),
      excerpt: msg.text.slice(0, 120),
      source: msg.source,
      tags: [],
    };
    setIdeas((prev) => [newIdea, ...prev]);
    setSavingId(null);
    setSaveTitle("");
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, saved: true } : m)));
    setIdeasOpen(true);
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-zinc-900">Knowledge Base</h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">Chat with your documents and capture ideas</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] font-medium transition-colors">
              <Upload className="size-3.5" strokeWidth={1.5} />
              Upload document
            </button>
          </div>
        </div>

        {/* 3-panel card */}
        <div
          className="flex rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm"
          style={{ height: "calc(100vh - 220px)", minHeight: 480 }}
        >
          {/* Left: Document list */}
          <aside className="w-[200px] flex-shrink-0 flex flex-col border-r border-zinc-100">
            <div className="px-3 py-3 border-b border-zinc-100">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Documents</p>
            </div>
            <div className="flex-1 overflow-y-auto py-1.5">
              <button
                onClick={() => setActiveDocId(null)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                  activeDocId === null
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                }`}
              >
                <Sparkles className="size-3.5 flex-shrink-0 text-zinc-400" strokeWidth={1.5} />
                <span className="text-[12px] font-medium">All documents</span>
              </button>
              {docs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                    activeDocId === doc.id
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                  }`}
                >
                  <DocIcon type={doc.type} />
                  <span className="text-[11px] font-medium leading-tight truncate flex-1">{doc.name}</span>
                </button>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-zinc-100">
              <p className="text-[10px] text-zinc-400">{docs.length} docs indexed</p>
            </div>
          </aside>

          {/* Center: Chat */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Context bar */}
            <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center gap-2">
              {activeDocId ? (
                <>
                  <DocIcon type={docs.find((d) => d.id === activeDocId)!.type} />
                  <span className="text-[12px] font-medium text-zinc-700 truncate">
                    {docs.find((d) => d.id === activeDocId)?.name}
                  </span>
                  <button onClick={() => setActiveDocId(null)} className="ml-1 text-zinc-400 hover:text-zinc-600">
                    <X className="size-3" />
                  </button>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 text-zinc-400" strokeWidth={1.5} />
                  <span className="text-[11px] text-zinc-400">Chatting with all documents</span>
                </>
              )}
              <div className="ml-auto">
                <button
                  onClick={() => setIdeasOpen((v) => !v)}
                  className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${
                    ideasOpen
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  <Lightbulb className="size-3" strokeWidth={1.5} />
                  Ideas {ideas.length > 0 && `(${ideas.length})`}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" ? (
                    <div className="max-w-[520px] w-full">
                      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-[13px] text-zinc-800 leading-relaxed">{msg.text}</p>
                        {msg.source && (
                          <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-zinc-200">
                            <BookOpen className="size-3 text-zinc-400" strokeWidth={1.5} />
                            <span className="text-[11px] text-zinc-400">{msg.source}</span>
                          </div>
                        )}
                      </div>
                      {msg.source && !msg.saved && savingId !== msg.id && (
                        <button
                          onClick={() => startSave(msg.id, msg.text)}
                          className="mt-1.5 flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-600 transition-colors"
                        >
                          <Lightbulb className="size-3" strokeWidth={1.5} />
                          Save idea
                        </button>
                      )}
                      {msg.saved && (
                        <p className="mt-1.5 text-[11px] text-emerald-500 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                          Saved to ideas
                        </p>
                      )}
                      {savingId === msg.id && (
                        <div className="mt-1.5 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex gap-2 items-center">
                          <input
                            autoFocus
                            value={saveTitle}
                            onChange={(e) => setSaveTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && confirmSave(msg)}
                            placeholder="Title for this idea…"
                            className="flex-1 text-[12px] bg-transparent outline-none text-zinc-800 placeholder-zinc-400"
                          />
                          <button onClick={() => confirmSave(msg)} className="text-[11px] font-medium text-amber-700 hover:text-amber-900">
                            Save
                          </button>
                          <button onClick={() => setSavingId(null)} className="text-zinc-400 hover:text-zinc-600">
                            <X className="size-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-[420px]">
                      <div className="bg-zinc-100 rounded-2xl rounded-tr-sm px-4 py-3">
                        <p className="text-[13px] text-zinc-700 leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="size-1.5 rounded-full bg-zinc-300"
                          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-zinc-100">
              <div className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus-within:border-zinc-400 transition-colors">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask anything about your collection…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent outline-none text-[13px] text-zinc-800 placeholder-zinc-400 leading-relaxed"
                  style={{ maxHeight: 100, overflowY: "auto" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || thinking}
                  className="size-7 rounded-lg bg-zinc-700 hover:bg-zinc-800 disabled:opacity-30 flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <Send className="size-3 text-white" strokeWidth={2} />
                </button>
              </div>
            </div>
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
                    <p className="text-[11px] text-zinc-400">No ideas saved yet.</p>
                  </div>
                )}
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onDelete={() => setIdeas((prev) => prev.filter((i) => i.id !== idea.id))}
                    onUseInPoi={(poiId, poiTitle) => usePoiForIdea(idea.id, poiTitle)}
                  />
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </PageShell>
  );
}
