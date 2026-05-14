import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { Eye, MessageSquare, X, Check, CheckCircle2, Send } from "lucide-react";
import { mockGuides, mockPOIs } from "../../data/mockData";
import { getMemberByGuideId } from "../../data/teamData";
import { GuidePhonePreview } from "./GuidePreviewModal";

interface Annotation {
  id: string;
  x: number;
  y: number;
  scrollTopAtDrop: number;
  poiIndex: number;
  text: string;
  resolved: boolean;
}

const pois = mockPOIs.slice(0, 5);
const PHONE_HEIGHT = 790;

export function ReviewMode() {
  const { guideId } = useParams();
  const guide = mockGuides.find((g) => g.id === guideId);
  const responsible = guideId ? getMemberByGuideId(guideId) : undefined;

  const [activePOIIndex, setActivePOIIndex] = useState(0);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [commentMode, setCommentMode] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number; scrollTopAtDrop: number } | null>(null);
  const [draftText, setDraftText] = useState("");
  const [openPin, setOpenPin] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentScrollTop, setCurrentScrollTop] = useState(0);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  const phoneWrapRef = useRef<HTMLDivElement>(null);
  const draftInputRef = useRef<HTMLTextAreaElement>(null);

  const handleActivePOIChange = useCallback((index: number) => {
    setActivePOIIndex(index);
  }, []);

  const handleScrollRef = useCallback((el: HTMLDivElement | null) => {
    setScrollEl(el);
  }, []);

  // Attach scroll listener whenever the scroll container is available
  useEffect(() => {
    if (!scrollEl) return;
    const onScroll = () => setCurrentScrollTop(scrollEl.scrollTop);
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [scrollEl]);

  // Focus draft input when pending pin appears
  useEffect(() => {
    if (pendingPin) {
      setTimeout(() => draftInputRef.current?.focus(), 50);
    }
  }, [pendingPin]);

  // ESC cancels comment mode or pending pin
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPendingPin(null);
        setDraftText("");
        setCommentMode(false);
        setOpenPin(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handlePhoneClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!commentMode || !phoneWrapRef.current) return;
    const rect = phoneWrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const scrollTopAtDrop = scrollEl?.scrollTop ?? 0;
    setPendingPin({ x, y, scrollTopAtDrop });
    setDraftText("");
    setCommentMode(false);
  }

  function getPinY(baseY: number, scrollTopAtDrop: number) {
    return baseY + (scrollTopAtDrop - currentScrollTop) / PHONE_HEIGHT * 100;
  }

  function savePendingPin() {
    if (!pendingPin || !draftText.trim()) return;
    const id = `${Date.now()}`;
    setAnnotations((prev) => [...prev, {
      id,
      x: pendingPin.x,
      y: pendingPin.y,
      scrollTopAtDrop: pendingPin.scrollTopAtDrop,
      poiIndex: activePOIIndex,
      text: draftText.trim(),
      resolved: false,
    }]);
    setPendingPin(null);
    setDraftText("");
  }

  function cancelPendingPin() {
    setPendingPin(null);
    setDraftText("");
  }

  function toggleResolved(id: string) {
    setAnnotations((prev) => prev.map((a) => a.id === id ? { ...a, resolved: !a.resolved } : a));
  }

  function deleteAnnotation(id: string) {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (openPin === id) setOpenPin(null);
  }

  const filled = annotations.filter((a) => a.text.trim());

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <p className="text-[13px] text-zinc-500">Guide not found.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0d0d0d" }}>
        <div className="bg-white rounded-2xl border border-zinc-200 w-full max-w-md p-10 text-center">
          <div className={`size-14 rounded-full flex items-center justify-center mx-auto mb-5 ${filled.length > 0 ? "bg-amber-100" : "bg-emerald-100"}`}>
            <CheckCircle2 className={`size-7 ${filled.length > 0 ? "text-amber-600" : "text-emerald-600"}`} />
          </div>
          <p className="text-[17px] font-semibold text-zinc-900 mb-2">
            {filled.length > 0 ? "Feedback sent" : "Guide approved"}
          </p>
          <p className="text-[13px] text-zinc-500 leading-relaxed mb-6">
            {filled.length > 0
              ? `${filled.length} annotation${filled.length > 1 ? "s" : ""} sent to `
              : "Your approval has been sent to "}
            <span className="font-medium text-zinc-700">{responsible?.name ?? "the team"}</span>.
          </p>
          {filled.length > 0 && (
            <div className="text-left space-y-3">
              {filled.map((a, i) => (
                <div key={a.id} className="flex gap-3">
                  <span className="size-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">
                      Stop {a.poiIndex + 1} · {pois[a.poiIndex]?.title}
                    </p>
                    <p className="text-[12px] text-zinc-600 leading-relaxed">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0d0d" }}>

      {/* ── Amber banner ── */}
      <div className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 px-10 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Eye className="size-3.5 text-amber-600" />
          <span className="text-[11px] font-semibold text-amber-800">Review mode</span>
          <span className="text-[11px] text-amber-500">·</span>
          <span className="text-[11px] text-amber-600">
            {commentMode
              ? "Click anywhere on the guide to drop an annotation"
              : "Play the guide, then annotate any stop"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setCommentMode((v) => !v); setPendingPin(null); setDraftText(""); }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              commentMode
                ? "bg-amber-400 text-amber-900 shadow-[0_0_0_3px_rgba(251,191,36,0.3)]"
                : "bg-white/80 text-zinc-700 hover:bg-white border border-zinc-200"
            }`}
          >
            <MessageSquare className="size-3.5" />
            {commentMode ? "Click on the guide…" : "Annotate"}
          </button>

          <button
            onClick={() => setSubmitted(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
          >
            <Send className="size-3" />
            Send feedback
          </button>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex items-start justify-center gap-8 px-10 py-10">

        {/* ── Phone wrapper ── */}
        <div className="relative flex-shrink-0" ref={phoneWrapRef}>

          <GuidePhonePreview
            guideName={guide.title}
            onActivePOIChange={handleActivePOIChange}
            onScrollRef={handleScrollRef}
          />

          {/* Comment mode overlay */}
          <div
            onClick={handlePhoneClick}
            className="absolute inset-0 transition-all duration-200"
            style={{
              borderRadius: 50,
              pointerEvents: commentMode ? "auto" : "none",
              cursor: commentMode ? "crosshair" : "default",
              background: commentMode ? "rgba(251,191,36,0.08)" : "transparent",
              boxShadow: commentMode ? "inset 0 0 0 2px rgba(251,191,36,0.6)" : "none",
              zIndex: 20,
            }}
          />

          {/* Saved pins — Y adjusted for scroll position */}
          {annotations.map((ann, i) => {
            const ay = getPinY(ann.y, ann.scrollTopAtDrop);
            if (ay < 3 || ay > 97) return null;
            return (
              <div
                key={ann.id}
                style={{
                  position: "absolute",
                  left: `${ann.x}%`,
                  top: `${ay}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 30,
                  pointerEvents: "auto",
                }}
              >
                <button
                  onClick={() => setOpenPin(openPin === ann.id ? null : ann.id)}
                  className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg transition-all ${
                    ann.resolved
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-900 text-white hover:scale-110"
                  }`}
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                >
                  {i + 1}
                </button>

                {openPin === ann.id && (
                  <div
                    className="absolute z-40 bg-white rounded-xl border border-zinc-200 shadow-xl"
                    style={{ width: 220, top: "50%", left: "calc(100% + 10px)", transform: "translateY(-50%)" }}
                  >
                    <div className="flex items-center gap-2 px-3 pt-2.5 pb-1 border-b border-zinc-100">
                      <span className="size-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-[10px] font-semibold text-zinc-500 flex-1 truncate">
                        Stop {ann.poiIndex + 1} · {pois[ann.poiIndex]?.title}
                      </p>
                      <button onClick={() => deleteAnnotation(ann.id)} className="text-zinc-300 hover:text-zinc-600">
                        <X className="size-3" />
                      </button>
                    </div>
                    <p className={`px-3 py-2 text-[12px] leading-relaxed ${ann.resolved ? "line-through text-zinc-400" : "text-zinc-700"}`}>
                      {ann.text}
                    </p>
                    <div className="flex items-center justify-end px-3 pb-2.5">
                      <button
                        onClick={() => toggleResolved(ann.id)}
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold transition-colors ${ann.resolved ? "text-emerald-600 hover:text-zinc-500" : "text-zinc-400 hover:text-emerald-600"}`}
                      >
                        <Check className="size-3" />
                        {ann.resolved ? "Reopen" : "Resolve"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pending pin */}
          {pendingPin && (() => {
            const ay = getPinY(pendingPin.y, pendingPin.scrollTopAtDrop);
            return (
              <div
                style={{
                  position: "absolute",
                  left: `${pendingPin.x}%`,
                  top: `${ay}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 40,
                  pointerEvents: "auto",
                }}
              >
                <div className="size-6 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-900">{annotations.length + 1}</span>
                </div>

                <div
                  className="absolute bg-white rounded-xl border border-zinc-200 shadow-2xl overflow-hidden"
                  style={{ width: 240, top: "50%", left: "calc(100% + 12px)", transform: "translateY(-50%)" }}
                >
                  <div className="px-3 pt-3 pb-2 border-b border-zinc-100">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Stop {activePOIIndex + 1} · {pois[activePOIIndex]?.title}
                    </p>
                  </div>
                  <textarea
                    ref={draftInputRef}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); savePendingPin(); }
                      if (e.key === "Escape") cancelPendingPin();
                    }}
                    placeholder="Describe the issue… (Enter to save)"
                    rows={3}
                    className="w-full px-3 py-2.5 text-[12px] text-zinc-800 placeholder:text-zinc-300 resize-none focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2 px-3 pb-3">
                    <button onClick={cancelPendingPin} className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={savePendingPin}
                      disabled={!draftText.trim()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-semibold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Annotations sidebar ── */}
        {(annotations.length > 0 || submitted === false) && (
          <div
            className="bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 sticky top-10"
            style={{ width: 260, maxHeight: "calc(100vh - 80px)", marginTop: 50 }}
          >
            {annotations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 px-6 text-center">
                <MessageSquare className="size-6 text-white/20" />
                <p className="text-[12px] text-white/30 leading-relaxed">
                  Click <span className="font-semibold text-white/50">Annotate</span> then tap anywhere on the guide to leave a note.
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
                  <p className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">
                    {annotations.length} annotation{annotations.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2" style={{ scrollbarWidth: "none" }}>
                  {annotations.map((ann, i) => (
                    <button
                      key={ann.id}
                      onClick={() => setOpenPin(openPin === ann.id ? null : ann.id)}
                      className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all ${
                        openPin === ann.id ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className={`size-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5 ${ann.resolved ? "bg-emerald-500 text-white" : "bg-white text-zinc-900"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-white/40 mb-0.5 truncate">
                          Stop {ann.poiIndex + 1} · {pois[ann.poiIndex]?.title}
                        </p>
                        <p className={`text-[12px] leading-snug line-clamp-2 ${ann.resolved ? "line-through text-white/25" : "text-white/70"}`}>
                          {ann.text}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
