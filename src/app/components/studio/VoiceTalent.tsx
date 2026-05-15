import {
  Mic,
  Play,
  Pause,
  Search,
  Plus,
  X,
  Check,
  Upload,
  ChevronDown,
  Volume2,
  Pencil,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PageShell } from "./PageShell";
import { mockPOIs } from "../../data/mockData";

interface VoiceTalent {
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

interface Pronunciation {
  id: string;
  word: string;
  ipa: string;
  simplified: string;
  foundIn: string[];
  status: "pending" | "approved" | "overridden";
  override?: string;
}

const mockVoices: VoiceTalent[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    language: "EN",
    gender: "female",
    age: "adult",
    style: ["Warm", "Professional", "Clear"],
    description: "Perfect for museum tours and art galleries. Clear pronunciation with a warm, engaging tone.",
    avatarUrl: "https://images.unsplash.com/photo-1768853972795-2739a9685567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwc3R1ZGlvfGVufDF8fHx8MTc3NDg3NzIyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "2",
    name: "Marco Rossi",
    language: "IT",
    gender: "male",
    age: "adult",
    style: ["Professional", "Authoritative", "Deep"],
    description: "Ideal for historical narratives and cultural heritage sites. Deep, authoritative voice.",
    avatarUrl: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzQ4NDIwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "3",
    name: "Sofia García",
    language: "ES",
    gender: "female",
    age: "young",
    style: ["Energetic", "Friendly", "Modern"],
    description: "Great for contemporary art and modern exhibitions. Energetic and approachable.",
    avatarUrl: "https://images.unsplash.com/photo-1614436201459-156d322d38c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDgwMjQ0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "4",
    name: "Jean Dupont",
    language: "FR",
    gender: "male",
    age: "senior",
    style: ["Calm", "Sophisticated", "Refined"],
    description: "Perfect for classical art and fine arts museums. Sophisticated and refined tone.",
    avatarUrl: "https://images.unsplash.com/photo-1695266391814-a276948f1775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYW4lMjBlbGVnYW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0ODg3MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "5",
    name: "Emma Watson",
    language: "EN",
    gender: "female",
    age: "young",
    style: ["Friendly", "Conversational", "Bright"],
    description: "Ideal for interactive exhibits and family-friendly tours. Bright and conversational.",
    avatarUrl: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0ODM1ODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "6",
    name: "Klaus Schmidt",
    language: "DE",
    gender: "male",
    age: "adult",
    style: ["Clear", "Precise", "Professional"],
    description: "Excellent for technical and scientific museums. Clear and precise pronunciation.",
    avatarUrl: "https://images.unsplash.com/photo-1649712041612-021cf78bca23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ4ODczNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const mockAudioGuides: AudioGuide[] = [
  { id: "1", name: "Renaissance Masterpieces", totalPOIs: 24, status: "published", currentVoice: "Sarah Mitchell" },
  { id: "2", name: "Ancient Egypt Collection", totalPOIs: 18, status: "published" },
  { id: "3", name: "Modern Art Gallery", totalPOIs: 32, status: "draft" },
  { id: "4", name: "Sculpture Garden Tour", totalPOIs: 15, status: "draft" },
];

const mockPronunciations: Pronunciation[] = [
  {
    id: "p1",
    word: "Aphrodite",
    ipa: "/æˈfrɒd.ɪ.ti/",
    simplified: "af-ROD-it-ee",
    foundIn: ["Apollo Statue"],
    status: "pending",
  },
  {
    id: "p2",
    word: "Hellenistic",
    ipa: "/ˌhel.əˈnɪs.tɪk/",
    simplified: "hel-uh-NIS-tik",
    foundIn: ["Attic Amphora"],
    status: "pending",
  },
  {
    id: "p3",
    word: "tesserae",
    ipa: "/ˈtes.ər.iː/",
    simplified: "TES-er-ee",
    foundIn: ["Roman Mosaic"],
    status: "pending",
  },
];

function stripPunctuation(token: string): string {
  return token.replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase();
}

// ── Voice Generation Modal ────────────────────────────────────────────────────
const WAVE = [38, 62, 28, 75, 50, 82, 44, 90, 34, 58, 70, 40, 85, 52, 66, 30, 73, 48, 78, 42];

function VoiceGenerationModal({ voice, onClose, onPublish }: { voice: VoiceTalent; onClose: () => void; onPublish?: () => void }) {
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
                className="w-full py-3 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                className="w-full py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
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
                className="w-full py-3 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
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
              className="w-full py-3 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              Proceed to publish <ArrowRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function VoiceTalent({ onPublish }: { onPublish?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<"script" | "pronunciations" | "catalog">("script");

  // Catalog state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [selectedVoiceForAssignment, setSelectedVoiceForAssignment] = useState<VoiceTalent | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  // Pronunciations state
  const [pronunciations, setPronunciations] = useState<Pronunciation[]>(mockPronunciations);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [playingPron, setPlayingPron] = useState<string | null>(null);
  const [popover, setPopover] = useState<{ word: string; poiTitle: string; x: number; y: number } | null>(null);

  const pendingCount = pronunciations.filter((p) => p.status === "pending").length;

  const filteredVoices = mockVoices.filter((voice) => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filterLanguage === "all" || voice.language === filterLanguage;
    const matchesGender = filterGender === "all" || voice.gender === filterGender;
    return matchesSearch && matchesLanguage && matchesGender;
  });

  const togglePlay = (voiceId: string) => {
    setPlayingVoice(playingVoice === voiceId ? null : voiceId);
    if (playingVoice !== voiceId) setTimeout(() => setPlayingVoice(null), 3000);
  };

  const togglePlayPron = (id: string) => {
    setPlayingPron(playingPron === id ? null : id);
    if (playingPron !== id) setTimeout(() => setPlayingPron(null), 2000);
  };


  const approvePronunciation = (id: string) => {
    setPronunciations((prev) => prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p)));
  };

  const startEdit = (p: Pronunciation) => {
    setEditingId(p.id);
    setEditValue(p.override ?? p.simplified);
  };

  const saveOverride = (id: string) => {
    setPronunciations((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "overridden", override: editValue } : p))
    );
    setEditingId(null);
    setEditValue("");
  };

  const handleWordClick = (e: React.MouseEvent, token: string, clean: string, poiTitle: string) => {
    if (!clean) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopover({ word: clean, poiTitle, x: rect.left, y: rect.bottom });
  };

  const addToReview = (word: string, poiTitle: string) => {
    setPronunciations((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, word, ipa: "—", simplified: "—", foundIn: [poiTitle], status: "pending" },
    ]);
    setPopover(null);
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Stepper */}
        {(() => {
          const steps: { key: "script" | "pronunciations" | "catalog"; label: string }[] = [
            { key: "script",         label: "Script" },
            { key: "pronunciations", label: "Pronunciations" },
            { key: "catalog",        label: "Voice Talent" },
          ];
          const activeIdx = steps.findIndex(s => s.key === activeTab);
          return (
            <div className="flex items-center gap-2 mb-8">
              {steps.map((step, i) => {
                const isActive   = step.key === activeTab;
                const isComplete = i < activeIdx;
                const isLast     = i === steps.length - 1;
                return (
                  <div key={step.key} className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab(step.key)}
                      className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
                        isActive ? "text-zinc-900" : isComplete ? "text-zinc-400 hover:text-zinc-600" : "text-zinc-300 hover:text-zinc-500"
                      }`}
                    >
                      <span className={`text-[11px] tabular-nums ${isActive ? "font-semibold" : ""}`}>
                        {isComplete ? "✓" : `${i + 1}.`}
                      </span>
                      {step.label}
                      {step.key === "pronunciations" && pendingCount > 0 && (
                        <span className="size-4 rounded-full bg-amber-400 text-white text-[9px] font-bold flex items-center justify-center">{pendingCount}</span>
                      )}
                    </button>
                    {!isLast && <span className="text-zinc-200 text-[12px]">·</span>}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ── Voice Catalog tab ── */}
        {activeTab === "catalog" && (
          <>
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Voice Talent</h1>
                <p className="text-[13px] text-zinc-500">{mockVoices.length} voices available</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
                <Upload className="size-4" />
                Upload Custom Voice
              </button>
            </div>

            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search voices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Languages</option>
                    <option value="EN">English</option>
                    <option value="IT">Italian</option>
                    <option value="ES">Spanish</option>
                    <option value="FR">French</option>
                    <option value="DE">German</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="neutral">Neutral</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVoices.map((voice) => (
                <div
                  key={voice.id}
                  className="flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all p-6"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)" }}
                >
                  <div className="flex justify-center mb-5">
                    <div className="relative">
                      <img src={voice.avatarUrl} alt={voice.name} className="size-28 rounded-full object-cover" />
                      <button
                        onClick={() => togglePlay(voice.id)}
                        className="absolute -bottom-1.5 -right-1.5 size-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-all shadow-lg"
                      >
                        {playingVoice === voice.id ? (
                          <Pause className="size-4 text-white" />
                        ) : (
                          <Play className="size-4 text-white ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-[15px] font-semibold text-zinc-900 mb-0.5">{voice.name}</h3>
                    <p className="text-[12px] text-zinc-400 mb-4">
                      {voice.language} · {voice.gender.charAt(0).toUpperCase() + voice.gender.slice(1)} · {voice.age.charAt(0).toUpperCase() + voice.age.slice(1)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                      {voice.style.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[11px] font-semibold rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[13px] text-zinc-500 leading-relaxed mb-6">{voice.description}</p>
                    <button
                      onClick={() => setSelectedVoiceForAssignment(voice)}
                      className="mt-auto w-full px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
                    >
                      Use Voice
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredVoices.length === 0 && (
              <div className="text-center py-16">
                <Mic className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">No voices found</h3>
                <p className="text-[14px] text-zinc-600">Try adjusting your filters or search query</p>
              </div>
            )}
          </>
        )}

        {/* ── Pronunciations tab ── */}
        {activeTab === "pronunciations" && (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Pronunciations</h1>
                <p className="text-[13px] text-zinc-500">
                  Review how the AI voice will pronounce uncertain words before generating audio.
                </p>
              </div>
              {pendingCount === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-semibold rounded-full">
                  <CheckCircle2 className="size-4" /> All validated
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-[12px] font-semibold rounded-full">
                  <AlertCircle className="size-4" /> {pendingCount} pending
                </span>
              )}
            </div>

            <div className="space-y-3">
              {pronunciations.map((p) => {
                const isEditing = editingId === p.id;
                const isPlaying = playingPron === p.id;

                return (
                  <div
                    key={p.id}
                    className={`bg-white border rounded-xl px-5 py-4 transition-all ${
                      p.status === "approved" || p.status === "overridden"
                        ? "border-zinc-200 opacity-60"
                        : "border-zinc-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">

                      {/* Status dot */}
                      <div className={`mt-0.5 size-2 rounded-full flex-shrink-0 ${
                        p.status === "approved" ? "bg-emerald-500" :
                        p.status === "overridden" ? "bg-blue-500" : "bg-amber-400"
                      }`} />

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="text-[17px] font-semibold text-zinc-900">{p.word}</span>
                          <span className="text-[12px] text-zinc-400 font-mono">{p.ipa}</span>
                        </div>

                        {/* Simplified / override */}
                        <p className="text-[12px] text-zinc-500 mb-2">
                          {p.status === "overridden" && p.override
                            ? <><span className="text-blue-600 font-semibold">{p.override}</span> <span className="text-zinc-300">(custom)</span></>
                            : p.simplified}
                        </p>

                        {/* Found in */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.foundIn.map((name) => (
                            <span key={name} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[11px] font-medium rounded-full">
                              {name}
                            </span>
                          ))}
                        </div>

                        {/* Edit input */}
                        {isEditing && (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              placeholder="e.g. af-ROD-it-ee"
                              className="flex-1 px-3 py-1.5 border border-zinc-300 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent font-mono"
                            />
                            <button
                              onClick={() => { setEditingId(null); setEditValue(""); }}
                              className="px-3 py-1.5 text-[12px] font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveOverride(p.id)}
                              disabled={!editValue.trim()}
                              className="px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all disabled:opacity-40"
                            >
                              Save override
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {!isEditing && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Preview */}
                          <button
                            onClick={() => togglePlayPron(p.id)}
                            title="Preview pronunciation"
                            className={`size-8 rounded-full flex items-center justify-center transition-all ${
                              isPlaying
                                ? "bg-zinc-900 text-white"
                                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                            }`}
                          >
                            {isPlaying ? <Pause className="size-3.5" /> : <Volume2 className="size-3.5" />}
                          </button>

                          {p.status === "pending" ? (
                            <>
                              <button
                                onClick={() => startEdit(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 transition-all"
                              >
                                <Pencil className="size-3" /> Edit
                              </button>
                              <button
                                onClick={() => approvePronunciation(p.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
                              >
                                <Check className="size-3" /> Approve
                              </button>
                            </>
                          ) : (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                              p.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                            }`}>
                              {p.status === "approved" ? "Approved" : "Overridden"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {pronunciations.length === 0 && (
              <div className="text-center py-16">
                <CheckCircle2 className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">No words to review</h3>
                <p className="text-[14px] text-zinc-500">All pronunciations look good.</p>
              </div>
            )}

            {/* Next step */}
            <div className="mt-10 pt-8 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-[13px] text-zinc-400">
                Step 2 of 3 ·{" "}
                {pendingCount > 0
                  ? `${pendingCount} word${pendingCount > 1 ? "s" : ""} still pending — you can proceed anyway.`
                  : "All pronunciations validated. Ready to assign a voice."}
              </p>
              <button
                onClick={() => setActiveTab("catalog")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all"
              >
                Next: Assign Voice
                <ArrowRight className="size-4" />
              </button>
            </div>
          </>
        )}

        {/* ── Script tab ── */}
        {activeTab === "script" && (
          <>
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Audio Script</h1>
                <p className="text-[13px] text-zinc-500">
                  Click any word to add it to pronunciation review. Highlighted words are already tracked.
                </p>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 flex-shrink-0 pt-1">
                {[
                  { color: "bg-amber-400", label: "Pending" },
                  { color: "bg-emerald-500", label: "Approved" },
                  { color: "bg-blue-500", label: "Overridden" },
                ].map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                    <span className={`w-4 h-0.5 rounded inline-block ${color}`} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {mockPOIs.map((poi) => (
                <div
                  key={poi.id}
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}
                >
                  <div className="px-6 py-3.5 border-b border-zinc-100 bg-zinc-50 flex items-center gap-3">
                    <h3 className="text-[13px] font-semibold text-zinc-900">{poi.title}</h3>
                    <span className="text-[11px] text-zinc-400">
                      {poi.body.split(" ").length} words
                    </span>
                  </div>
                  <p className="px-6 py-5 text-[14px] text-zinc-700 leading-relaxed">
                    {poi.body.split(" ").map((token, i) => {
                      const clean = stripPunctuation(token);
                      if (!clean) return <span key={i}>{token} </span>;
                      const pron = pronunciations.find((p) => p.word.toLowerCase() === clean);
                      const underlineCls = pron
                        ? pron.status === "pending"
                          ? "underline decoration-amber-400 decoration-2"
                          : pron.status === "approved"
                          ? "underline decoration-emerald-500 decoration-2"
                          : "underline decoration-blue-500 decoration-2"
                        : "";
                      return (
                        <span key={i}>
                          <span
                            onClick={(e) => handleWordClick(e, token, clean, poi.title)}
                            className={`cursor-pointer rounded px-0.5 -mx-0.5 hover:bg-zinc-100 transition-colors ${underlineCls}`}
                          >
                            {token}
                          </span>{" "}
                        </span>
                      );
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Next step */}
            <div className="mt-10 pt-8 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-[13px] text-zinc-400">Step 1 of 3 · Reviewed? Move to pronunciation check.</p>
              <button
                onClick={() => setActiveTab("pronunciations")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all"
              >
                Next: Pronunciations
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Popover */}
            {popover && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />
                <div
                  className="fixed z-50 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 w-60"
                  style={{ left: popover.x, top: popover.y + 6 }}
                >
                  {(() => {
                    const existing = pronunciations.find(
                      (p) => p.word.toLowerCase() === popover.word.toLowerCase()
                    );
                    return (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[15px] font-semibold text-zinc-900 capitalize">{popover.word}</span>
                          <button onClick={() => setPopover(null)} className="text-zinc-400 hover:text-zinc-700">
                            <X className="size-4" />
                          </button>
                        </div>

                        {existing ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                existing.status === "pending" ? "bg-amber-50 text-amber-700" :
                                existing.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                                "bg-blue-50 text-blue-700"
                              }`}>
                                {existing.status.charAt(0).toUpperCase() + existing.status.slice(1)}
                              </span>
                              {existing.ipa !== "—" && (
                                <span className="text-[11px] text-zinc-400 font-mono">{existing.ipa}</span>
                              )}
                            </div>
                            {(existing.override ?? existing.simplified) !== "—" && (
                              <p className="text-[12px] text-zinc-500 mb-3">{existing.override ?? existing.simplified}</p>
                            )}
                            {existing.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { approvePronunciation(existing.id); setPopover(null); }}
                                  className="flex-1 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
                                >
                                  <Check className="size-3 inline mr-1" />Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveTab("pronunciations");
                                    setEditingId(existing.id);
                                    setEditValue(existing.override ?? existing.simplified);
                                    setPopover(null);
                                  }}
                                  className="flex-1 py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-700 rounded-lg hover:bg-zinc-50 transition-all"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                            {existing.status !== "pending" && (
                              <button
                                onClick={() => setPopover(null)}
                                className="w-full py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 transition-all"
                              >
                                Close
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-[12px] text-zinc-500 mb-3">
                              Not in review. Add it to check how the voice will pronounce it.
                            </p>
                            <button
                              onClick={() => addToReview(popover.word, popover.poiTitle)}
                              className="w-full py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
                            >
                              + Add to review
                            </button>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {selectedVoiceForAssignment && (
        <VoiceGenerationModal
          voice={selectedVoiceForAssignment}
          onClose={() => setSelectedVoiceForAssignment(null)}
          onPublish={onPublish}
        />
      )}
    </PageShell>
  );
}
