import { useState } from "react";
import { FileText, X } from "lucide-react";
import { Link } from "react-router";

type Source = { name: string; type: "library" | "uploaded" };

export function SourcesDrawer({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);
  if (sources.length === 0) return null;
  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed bottom-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-[13px] font-medium transition-all duration-200 ${
          open ? "bg-zinc-800 text-white scale-95" : "bg-white text-zinc-700 hover:bg-zinc-50 hover:scale-105 border border-zinc-200"
        }`}
        style={{ right: "88px" }}
        title="Context"
      >
        <FileText className="size-4 flex-shrink-0" strokeWidth={1.5} />
        Context
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 z-50 bg-white border-l border-zinc-200 flex flex-col shadow-xl" style={{ boxShadow: "-4px 0 24px 0 rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-zinc-400" />
                <p className="text-sm font-semibold text-zinc-900">Sources</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <p className="px-5 py-3 text-[11px] text-zinc-400 border-b border-zinc-100">
              Documents used to generate this guide's content.
            </p>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {sources.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors">
                  <FileText className="size-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="text-xs text-zinc-700 flex-1 truncate">{s.name}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    s.type === "library" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {s.type === "library" ? "library" : "uploaded"}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-zinc-100">
              <Link to="/guides/new" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2">
                Edit sources
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
