import { Search, Mic, Play, Pause, X, ArrowRight, Lock, Eye, CheckCircle2, RotateCcw, Clock } from "lucide-react";

export type AudioStatus = "none" | "pending" | "review" | "ready";

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: string;
  style: string[];
  avatarUrl: string;
}

export const allVoices: Voice[] = [
  { id: "v1", name: "Sarah Mitchell", language: "EN", gender: "Female", style: ["Warm", "Clear"], avatarUrl: "https://images.unsplash.com/photo-1768853972795-2739a9685567?w=200&h=200&fit=crop&crop=face" },
  { id: "v2", name: "Marco Rossi", language: "IT", gender: "Male", style: ["Professional", "Deep"], avatarUrl: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?w=200&h=200&fit=crop&crop=face" },
  { id: "v3", name: "Sofia García", language: "ES", gender: "Female", style: ["Friendly", "Modern"], avatarUrl: "https://images.unsplash.com/photo-1614436201459-156d322d38c6?w=200&h=200&fit=crop&crop=face" },
  { id: "v4", name: "Jean Dupont", language: "FR", gender: "Male", style: ["Calm", "Refined"], avatarUrl: "https://images.unsplash.com/photo-1695266391814-a276948f1775?w=200&h=200&fit=crop&crop=face" },
  { id: "v5", name: "Emma Watson", language: "EN", gender: "Female", style: ["Conversational", "Bright"], avatarUrl: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?w=200&h=200&fit=crop&crop=face" },
];

export function TranslationAudioPanel({ textApproved, audioStatus, voice, lang, showPicker, voiceSearch,
  onAdvance, onApprove, onReopen, onChooseVoice, onClosePicker, onVoiceSearch, onAssignVoice, onPlayToggle, playing }:
{ textApproved: boolean; audioStatus: AudioStatus | undefined; voice: Voice | null; lang: string;
  showPicker: boolean; voiceSearch: string;
  onAdvance: () => void; onApprove: () => void; onReopen: () => void;
  onChooseVoice: () => void; onClosePicker: () => void;
  onVoiceSearch: (q: string) => void; onAssignVoice: (v: Voice) => void;
  onPlayToggle: (id: string) => void; playing: string | null;
}) {
  if (!textApproved) {
    return (
      <div className="p-5 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col items-center text-center gap-2">
        <Lock className="size-4 text-zinc-300 mt-1" />
        <p className="text-[12px] font-semibold text-zinc-500">Locked</p>
        <p className="text-[11px] text-zinc-400 leading-relaxed">Approve the translation to unlock voice over.</p>
      </div>
    );
  }
  if (showPicker) {
    return (
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white flex flex-col" style={{ maxHeight: 320 }}>
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between flex-shrink-0">
          <span className="text-[12px] font-semibold text-zinc-700">Choose voice</span>
          <button onClick={onClosePicker} className="text-zinc-400 hover:text-zinc-700"><X className="size-4" /></button>
        </div>
        <div className="px-3 py-2 border-b border-zinc-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400" />
            <input value={voiceSearch} onChange={e => onVoiceSearch(e.target.value)} placeholder="Search…"
              className="w-full pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-zinc-900" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {allVoices.filter(v => v.name.toLowerCase().includes(voiceSearch.toLowerCase())).map(v => (
            <button key={v.id} onClick={() => onAssignVoice(v)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0">
              <img src={v.avatarUrl} alt={v.name} className="size-9 rounded-full object-cover flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-zinc-900 truncate">{v.name}</p>
                <p className="text-[11px] text-zinc-400">{v.language} · {v.gender}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); onPlayToggle(v.id); }}
                className="size-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center flex-shrink-0">
                {playing === v.id ? <Pause className="size-3 text-zinc-700" /> : <Play className="size-3 text-zinc-700 ml-0.5" />}
              </button>
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (!voice) {
    return (
      <div className="p-5 rounded-xl border border-zinc-200 bg-white flex flex-col gap-3">
        <div className="flex items-center gap-2"><Mic className="size-4 text-blue-500" /><p className="text-[12px] font-semibold text-zinc-700">No voice assigned</p></div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">Assign a voice talent to start the {lang} recording.</p>
        <button onClick={onChooseVoice} className="w-full py-2 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-colors flex items-center justify-center gap-1.5">
          Choose Voice <ArrowRight className="size-3.5" />
        </button>
      </div>
    );
  }
  const stateMap: Record<string, { bg: string; border: string; icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode }> = {
    pending: { bg: "bg-white", border: "border-zinc-200", icon: <Clock className="size-4 text-zinc-400" />, title: "Awaiting recording", desc: `Awaiting recording from ${voice.name}.`, action: <button onClick={onAdvance} className="w-full py-2 border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-colors">Mark as Received</button> },
    review: { bg: "bg-amber-50", border: "border-amber-200", icon: <Eye className="size-4 text-amber-600" />, title: "Under review", desc: "Listen and approve if quality meets standards.", action: <button onClick={onApprove} className="w-full py-2 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-colors flex items-center justify-center gap-1.5"><CheckCircle2 className="size-3.5" />Approve Voice</button> },
    ready: { bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle2 className="size-4 text-emerald-600" />, title: "Voice approved", desc: `Recording by ${voice.name} is ready.`, action: <button onClick={onReopen} className="w-full py-2 border border-emerald-200 text-emerald-700 text-[12px] font-semibold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"><RotateCcw className="size-3.5" />Reopen</button> },
  };
  const s = stateMap[audioStatus ?? "pending"];
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${s.bg} ${s.border} flex flex-col gap-2`}>
        <div className="flex items-center gap-2">{s.icon}<p className="text-[12px] font-semibold text-zinc-800">{s.title}</p></div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">{s.desc}</p>
        {s.action}
      </div>
      <div className="flex flex-col items-center py-2">
        <div className="relative mb-3">
          <img src={voice.avatarUrl} alt={voice.name} className="size-14 rounded-full object-cover" />
          <button onClick={() => onPlayToggle(voice.id)} className="absolute -bottom-1 -right-1 size-6 rounded-full bg-zinc-900 hover:bg-zinc-700 flex items-center justify-center shadow-md transition-colors">
            {playing === voice.id ? <Pause className="size-2.5 text-white" /> : <Play className="size-2.5 text-white ml-0.5" />}
          </button>
        </div>
        <p className="text-[13px] font-semibold text-zinc-900">{voice.name}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{voice.language} · {voice.gender}</p>
        <div className="flex flex-wrap gap-1 justify-center mt-2">
          {voice.style.map(tag => <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-semibold rounded-full">{tag}</span>)}
        </div>
        <button onClick={onChooseVoice} className="mt-4 w-full py-1.5 border border-zinc-200 text-zinc-500 text-[11px] font-semibold rounded-lg hover:bg-zinc-100 transition-colors">Change Voice</button>
      </div>
    </div>
  );
}
