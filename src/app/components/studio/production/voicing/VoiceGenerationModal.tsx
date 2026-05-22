import { useState, useEffect } from "react";
import { X, Check, ArrowRight, Pause, Play, CheckCircle2 } from "lucide-react";
import { mockPOIs } from "../../../../data/mockData";

export interface VoiceActor {
  id: string;
  name: string;
  language: string;
  gender: "male" | "female" | "neutral";
  age: "young" | "adult" | "senior";
  style: string[];
  description: string;
  avatarUrl: string;
}

interface AudioGuide {
  id: string;
  name: string;
  totalPOIs: number;
  status: "draft" | "published";
  currentVoice?: string;
}

const mockAudioGuides: AudioGuide[] = [
  { id: "1", name: "Renaissance Masterpieces", totalPOIs: 24, status: "published", currentVoice: "Sarah Mitchell" },
  { id: "2", name: "Ancient Egypt Collection", totalPOIs: 18, status: "published" },
  { id: "3", name: "Modern Art Gallery", totalPOIs: 32, status: "draft" },
  { id: "4", name: "Sculpture Garden Tour", totalPOIs: 15, status: "draft" },
];

export function stripPunctuation(token: string): string {
  return token.replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase();
}

const WAVE = [38, 62, 28, 75, 50, 82, 44, 90, 34, 58, 70, 40, 85, 52, 66, 30, 73, 48, 78, 42];

export function VoiceGenerationModal({ voice, onClose, onPublish }: { voice: VoiceActor; onClose: () => void; onPublish?: () => void }) {
  const [step, setStep]           = useState<"select" | "generating" | "review" | "all" | "done">("select");
  const [testPOI, setTestPOI]     = useState<number | null>(null);
  const [playing, setPlaying]     = useState(false);
  const [progress, setProgress]   = useState(0);
  const [statuses, setStatuses]   = useState<("queued" | "generating" | "done")[]>(mockPOIs.map(() => "queued"));
  const [doneCount, setDoneCount] = useState(0);

  // Auto-advance: generating → review
  useEffect(() => {
    if (step !== "generating") return;
    const t = setTimeout(() => setStep("review"), 2600);
    return () => clearTimeout(t);
  }, [step]);

  // Sample playback simulation
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setPlaying(false); return 100; }
        return p + 0.9;
      });
    }, 80);
    return () => clearInterval(id);
  }, [playing]);

  // Batch generation simulation
  useEffect(() => {
    if (step !== "all") return;
    let stopped = false;
    let idx = 0;
    const tick = () => {
      if (stopped) return;
      setStatuses(prev => {
        const next = [...prev];
        if (idx > 0) next[idx - 1] = "done";
        if (idx < next.length) next[idx] = "generating";
        return next;
      });
      setDoneCount(idx);
      if (idx >= mockPOIs.length) {
        setTimeout(() => {
          if (stopped) return;
          setStatuses(mockPOIs.map(() => "done"));
          setDoneCount(mockPOIs.length);
          setTimeout(() => { if (!stopped) setStep("done"); }, 400);
        }, 380);
      } else {
        idx++;
        setTimeout(tick, 420);
      }
    };
    tick();
    return () => { stopped = true; };
  }, [step]);

  const poi      = testPOI !== null ? mockPOIs[testPOI] : null;
  const guide    = mockAudioGuides[0];
  const stepIdx  = { select: 0, generating: 1, review: 1, all: 2, done: 2 }[step];
  const fmt      = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const elapsed  = fmt((progress / 100) * 90);

  return (
    <div className="fixed inset-0 bg-zinc-950/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 460, maxHeight: "88vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3.5 border-b border-zinc-100 flex-shrink-0">
          <img src={voice.avatarUrl} alt="" className="size-8 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-zinc-900 leading-none">{voice.name}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{voice.language} · {voice.gender}</p>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-1 mr-1">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
                i === stepIdx ? "w-5 bg-zinc-900" : i < stepIdx ? "w-1 bg-zinc-400" : "w-1 bg-zinc-200"
              }`} />
            ))}
          </div>
          <button onClick={onClose} className="size-7 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-all">
            <X className="size-3.5" />
          </button>
        </div>

        {/* ── Step 1: Select POI ── */}
        {step === "select" && (
          <div className="flex-1 overflow-y-auto flex flex-col" style={{ scrollbarWidth: "none" }}>
            <div className="px-5 pt-5 pb-3">
              <p className="text-[16px] font-semibold text-zinc-900 mb-1">Choose a stop to preview</p>
              <p className="text-[12px] text-zinc-400 leading-relaxed">
                We'll generate a short sample so you can approve the voice before creating all tracks.
              </p>
            </div>
            <div className="flex-1 px-3 py-1 space-y-0.5">
              {mockPOIs.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setTestPOI(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    testPOI === i ? "border-zinc-900 bg-zinc-50" : "border-transparent hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-[11px] font-bold text-zinc-300 w-4 tabular-nums flex-shrink-0">{i + 1}</span>
                  {p.imageUrl && <img src={p.imageUrl} alt="" className="size-8 rounded-lg object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-zinc-800 truncate">{p.title}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{p.body.slice(0, 55)}…</p>
                  </div>
                  {testPOI === i && (
                    <div className="size-4 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0">
                      <Check className="size-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="px-5 pt-3 pb-5">
              <button
                onClick={() => { setStep("generating"); setProgress(0); setPlaying(false); }}
                disabled={testPOI === null}
                className="w-full py-3 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Generate test sample <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Generating (auto-advance) ── */}
        {step === "generating" && (
          <div className="flex-1 flex flex-col items-center justify-center py-14 px-6">
            <div className="flex items-end gap-[3px] mb-7 h-10">
              {WAVE.map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-zinc-800"
                  style={{
                    height: `${h}%`,
                    animation: "vtbar 0.9s ease-in-out infinite",
                    animationDelay: `${(i % 5) * 0.12}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-[15px] font-semibold text-zinc-900 mb-1.5">Generating sample…</p>
            <p className="text-[12px] text-zinc-400">{poi?.title}</p>
            <div className="flex gap-1.5 mt-5 flex-wrap justify-center">
              {voice.style.map(s => (
                <span key={s} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[11px] rounded-full">{s}</span>
              ))}
            </div>
            <style>{`@keyframes vtbar { 0%,100%{transform:scaleY(.35)} 50%{transform:scaleY(1)} }`}</style>
          </div>
        )}

        {/* ── Step 3: Review sample ── */}
        {step === "review" && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">Sample · Stop {(testPOI ?? 0) + 1}</p>
              <p className="text-[16px] font-semibold text-zinc-900">{poi?.title}</p>
            </div>

            {/* Player card */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4">
              {/* Waveform */}
              <div className="flex items-end gap-[2.5px] mb-3 h-9">
                {WAVE.map((h, i) => {
                  const pct = (i / WAVE.length) * 100;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-colors duration-100 ${pct <= progress ? "bg-zinc-800" : "bg-zinc-200"}`}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
              {/* Times */}
              <div className="flex justify-between text-[10px] text-zinc-400 mb-3 tabular-nums">
                <span>{elapsed}</span>
                <span>1:30</span>
              </div>
              {/* Play */}
              <button
                onClick={() => { setPlaying(p => !p); if (progress >= 100) { setProgress(0); setPlaying(true); } }}
                className="w-full py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all flex items-center justify-center gap-2"
              >
                {playing
                  ? <><Pause className="size-3.5" fill="white" /> Pause</>
                  : <><Play className="size-3.5 ml-0.5" fill="white" /> {progress > 0 ? "Resume" : "Play sample"}</>
                }
              </button>
            </div>

            {/* Voice tag */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl">
              <img src={voice.avatarUrl} alt="" className="size-7 rounded-full object-cover" />
              <p className="text-[12px] text-zinc-600 font-medium">{voice.name}</p>
              <span className="text-zinc-200">·</span>
              <p className="text-[11px] text-zinc-400">{voice.style.join(", ")}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => { setStep("all"); setStatuses(mockPOIs.map(() => "queued")); setDoneCount(0); }}
                className="w-full py-3 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all flex items-center justify-center gap-2"
              >
                Generate all {mockPOIs.length} tracks <ArrowRight className="size-3.5" />
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-[12px] font-medium text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                Try a different voice
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Generating all ── */}
        {step === "all" && (
          <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none" }}>
            {/* Progress header */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[14px] font-semibold text-zinc-900">Generating tracks</p>
                <p className="text-[12px] text-zinc-400 tabular-nums">{doneCount} / {mockPOIs.length}</p>
              </div>
              <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                  style={{ width: `${(doneCount / mockPOIs.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-0.5">
              {mockPOIs.map((p, i) => {
                const s = statuses[i];
                return (
                  <div key={p.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${s === "generating" ? "bg-zinc-50" : ""}`}>
                    <span className="text-[11px] font-bold text-zinc-300 w-4 tabular-nums flex-shrink-0">{i + 1}</span>
                    <p className={`flex-1 text-[13px] truncate transition-colors ${
                      s === "done" ? "text-zinc-400" : s === "generating" ? "font-semibold text-zinc-900" : "text-zinc-300"
                    }`}>{p.title}</p>
                    <div className="flex-shrink-0 w-4 flex justify-center">
                      {s === "done" && <Check className="size-3.5 text-emerald-500" />}
                      {s === "generating" && (
                        <div className="flex items-end gap-px h-3.5">
                          {[0,1,2].map(j => (
                            <div key={j} className="w-0.5 bg-zinc-600 rounded-full" style={{ height: 5, animation: "vtbar 0.6s ease-in-out infinite", animationDelay: `${j * 0.2}s` }} />
                          ))}
                        </div>
                      )}
                      {s === "queued" && <div className="size-1 rounded-full bg-zinc-200" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 5: Done ── */}
        {step === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center py-14 px-8 text-center">
            <div className="size-12 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
              <CheckCircle2 className="size-6 text-emerald-500" />
            </div>
            <p className="text-[18px] font-semibold text-zinc-900 mb-1.5">Voice mapping complete</p>
            <p className="text-[12px] text-zinc-500 mb-0.5">{mockPOIs.length} tracks · {voice.name}</p>
            <p className="text-[11px] text-zinc-400 mb-8">{guide.name}</p>
            <button
              onClick={() => { onClose(); onPublish?.(); }}
              className="w-full py-3 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all flex items-center justify-center gap-2"
            >
              {onPublish ? <><span>Proceed to publish</span><ArrowRight className="size-3.5" /></> : "Done"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
