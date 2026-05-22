import { ShieldCheck, X } from "lucide-react";

export interface CertifiedReviewer {
  id: string;
  name: string;
  badge: string;
  languages: string[];
  specialty: string;
  avatarUrl: string;
  turnaround: string;
}

export const certifiedReviewers: CertifiedReviewer[] = [
  { id: "cr1", name: "Prof. Elena Conti", badge: "Art History PhD", languages: ["IT", "FR", "ES"], specialty: "Renaissance & Baroque", avatarUrl: "https://images.unsplash.com/photo-1614436201459-156d322d38c6?w=200&h=200&fit=crop&crop=face", turnaround: "24h" },
  { id: "cr2", name: "Dr. Carlos Mendez", badge: "Museum Curator", languages: ["ES", "FR"], specialty: "Classical Antiquity", avatarUrl: "https://images.unsplash.com/photo-1695266391814-a276948f1775?w=200&h=200&fit=crop&crop=face", turnaround: "48h" },
  { id: "cr3", name: "Marie-Claire Dumont", badge: "Certified Translator", languages: ["FR", "IT"], specialty: "Modern & Contemporary", avatarUrl: "https://images.unsplash.com/photo-1768853972795-2739a9685567?w=200&h=200&fit=crop&crop=face", turnaround: "24h" },
];

function ReviewerRow({ r, onSelect, highlight }: { r: CertifiedReviewer; onSelect: (r: CertifiedReviewer) => void; highlight?: boolean }) {
  return (
    <button
      onClick={() => onSelect(r)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left hover:shadow-sm ${
        highlight ? "border-teal-200 bg-teal-50/40 hover:bg-teal-50" : "border-zinc-200 bg-white hover:bg-zinc-50"
      }`}
    >
      <img src={r.avatarUrl} alt={r.name} className="size-10 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[13px] font-semibold text-zinc-900">{r.name}</span>
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-teal-100 text-teal-700 text-[9px] font-bold rounded-full">
            <ShieldCheck className="size-2.5" />{r.badge}
          </span>
        </div>
        <p className="text-[11px] text-zinc-500">{r.specialty} · {r.languages.join(", ")}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase">Turnaround</p>
        <p className="text-[12px] font-semibold text-zinc-700">{r.turnaround}</p>
      </div>
    </button>
  );
}

export function ReviewerPicker({ lang, onSelect, onClose }: {
  lang: string;
  onSelect: (r: CertifiedReviewer) => void;
  onClose: () => void;
}) {
  const compatible = certifiedReviewers.filter(r => r.languages.includes(lang));
  const rest = certifiedReviewers.filter(r => !r.languages.includes(lang));

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-teal-600" />
          <span className="text-[13px] font-semibold text-zinc-800">Request Expert Review</span>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
          <X className="size-4" />
        </button>
      </div>
      <div className="p-3 space-y-2">
        {compatible.length > 0 && (
          <>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1 mb-1">Recommended for {lang}</p>
            {compatible.map(r => <ReviewerRow key={r.id} r={r} onSelect={onSelect} highlight />)}
          </>
        )}
        {rest.length > 0 && (
          <>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1 mt-3 mb-1">Other reviewers</p>
            {rest.map(r => <ReviewerRow key={r.id} r={r} onSelect={onSelect} />)}
          </>
        )}
      </div>
      <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100">
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          The reviewer will receive the text by email and return corrections directly in the platform. The curator has the final word.
        </p>
      </div>
    </div>
  );
}
