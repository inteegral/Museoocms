import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, BookOpen, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  source?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m0",
    role: "ai",
    text: "Hi! Ask me anything about your collection, documents, or get help drafting POI content.",
  },
];

const AI_RESPONSES: { trigger: string; text: string; source: string }[] = [
  {
    trigger: "greek",
    text: "From the Greek Collection Catalogue, the most striking piece is the red-figure kylix (470 BC). Visitors often miss the tiny owl scratched inside the bowl — a maker's mark by the Brygos Painter.",
    source: "Greek Collection Catalogue.pdf",
  },
  {
    trigger: "renaissance",
    text: "Three panels in Room 4 are attributed to Botticelli's workshop (confirmed 1994 restoration). The underdrawing style and pigment analysis suggest a date between 1485–1495.",
    source: "Renaissance Paintings Notes.docx",
  },
  {
    trigger: "accessibility",
    text: "Four tactile reproductions are available along the west wing. Audio stops are designed at wheelchair height. The reduced-pace route takes ~45 minutes.",
    source: "Visitor Accessibility Guide.pdf",
  },
  {
    trigger: "history",
    text: "Founded in 1891 by Count Emilio Ferretti, opened to the public in 1923. The 2001 renovation added underground storage housing over 3,000 unexhibited pieces.",
    source: "Museum History 1891–2024.txt",
  },
];

export function AIAssistantDrawer() {
  const location = useLocation();
  const isFullWorkspace = location.pathname.startsWith("/documents");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  function sendMessage() {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    setMessages((prev) => [...prev, { id: `m${Date.now()}`, role: "user", text }]);
    setThinking(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      const match = AI_RESPONSES.find((r) => lower.includes(r.trigger));
      setMessages((prev) => [...prev, {
        id: `m${Date.now() + 1}`,
        role: "ai",
        text: match
          ? match.text
          : "I didn't find a specific reference to that in your documents. Try asking about the Greek collection, Renaissance paintings, accessibility, or museum history.",
        source: match?.source,
      }]);
      setThinking(false);
    }, 1000);
  }

  if (isFullWorkspace) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 size-12 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-200 ${
          open
            ? "bg-zinc-800 rotate-0 scale-95"
            : "bg-violet-600 hover:bg-violet-700 hover:scale-105"
        }`}
        title="AI Assistant"
      >
        {open
          ? <X className="size-5 text-white" strokeWidth={2} />
          : <Sparkles className="size-5 text-white" strokeWidth={1.5} />
        }
      </button>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-40 w-[380px] bg-white border-l border-zinc-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-zinc-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-xl bg-violet-100 flex items-center justify-center">
              <Sparkles className="size-4 text-violet-600" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zinc-900 leading-tight">Co-Curator</p>
              <p className="text-[10px] text-zinc-400">AI assistant</p>
            </div>
          </div>
          <Link
            to="/documents"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-violet-600 transition-colors"
          >
            Full workspace
            <ArrowUpRight className="size-3" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" ? (
                <div className="max-w-[300px] w-full">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl rounded-tl-sm px-3.5 py-3">
                    <p className="text-[13px] text-zinc-800 leading-relaxed">{msg.text}</p>
                    {msg.source && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-200">
                        <BookOpen className="size-3 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-[10px] text-zinc-400 truncate">{msg.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-[260px]">
                  <div className="bg-zinc-100 rounded-2xl rounded-tr-sm px-3.5 py-3">
                    <p className="text-[13px] text-zinc-700 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex justify-start">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl rounded-tl-sm px-3.5 py-3">
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
        <div className="px-4 py-3 border-t border-zinc-100 flex-shrink-0">
          <div className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus-within:border-zinc-400 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about your collection…"
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-[13px] text-zinc-800 placeholder-zinc-400 leading-relaxed"
              style={{ maxHeight: 80, overflowY: "auto" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || thinking}
              className="size-7 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-30 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <Send className="size-3 text-white" strokeWidth={2} />
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1.5 text-center">Enter to send · <Link to="/documents" onClick={() => setOpen(false)} className="hover:text-violet-500 transition-colors">Full workspace →</Link></p>
        </div>
      </div>

      {/* Subtle backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-zinc-950/20"
          onClick={() => setOpen(false)}
        />
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
