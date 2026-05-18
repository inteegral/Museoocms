import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import MainLogoVariant from "../../../imports/MainLogoVariant5";

const INSTITUTION_TYPES = [
  { id: "art",         label: "Art Museum"       },
  { id: "archaeology", label: "Archaeological"   },
  { id: "science",     label: "Science Museum"   },
  { id: "history",     label: "History Museum"   },
  { id: "natural",     label: "Natural History"  },
  { id: "other",       label: "Other"            },
];

const LANGUAGES = [
  { code: "it", label: "Italiano",   flag: "🇮🇹" },
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "ja", label: "日本語",      flag: "🇯🇵" },
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "ar", label: "العربية",    flag: "🇸🇦" },
];

const ROLES = ["Curator", "Translator", "Voice Manager", "Reviewer"];

const TAGLINES = [
  "Create audio guides\nthat move people.",
  "Tell your museum's\nstory in every room.",
  "Every artwork\nhas a voice.",
  "Multilingual guides,\nbuilt for your visitors.",
  "Your team,\nall in one place.",
];

// Steps: 0=Welcome 1=Museum name 2=Institution type 3=Language 4=Team
const TOTAL_STEPS = 5;

interface OnboardingWizardProps {
  onComplete: () => void;
}

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [museumName, setMuseumName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [language, setLanguage] = useState("");
  const [invites, setInvites] = useState([{ email: "", role: "Curator" }]);
  const [phase, setPhase] = useState<"wizard" | "loading" | "done">("wizard");
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  const canAdvance = () => {
    if (step === 1) return museumName.trim().length > 0;
    if (step === 2) return institutionType !== "";
    if (step === 3) return language !== "";
    return true;
  };

  const advance = () => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1);
    else setPhase("loading");
  };

  useEffect(() => {
    if (phase === "loading") {
      const t1 = setTimeout(() => setOffset(0), 50);
      const t2 = setTimeout(() => setPhase("done"), 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (phase === "done") {
      const t = setTimeout(() => onComplete(), 1400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const addInvite = () => setInvites(prev => [...prev, { email: "", role: "Curator" }]);
  const removeInvite = (i: number) => setInvites(prev => prev.filter((_, j) => j !== i));
  const updateInvite = (i: number, field: string, value: string) =>
    setInvites(prev => prev.map((inv, j) => j === i ? { ...inv, [field]: value } : inv));

  if (phase !== "wizard") {
    return (
      <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center gap-8">
        <MainLogoVariant className="h-[24px] w-[130px] relative" style={{ "--fill-0": "white" } as React.CSSProperties} />
        <div className="relative size-[88px]">
          <svg className="size-full -rotate-90" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={RADIUS} fill="none" stroke="#3f1010" strokeWidth="4" />
            <circle
              cx="44" cy="44" r={RADIUS}
              fill="none"
              stroke="#D33333"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.6s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-2.5 rounded-full bg-[#D33333]" />
          </div>
        </div>

        <div className="text-center space-y-2">
          {phase === "loading" ? (
            <>
              <p className="text-white text-[18px] font-semibold tracking-tight">Setting up your workspace…</p>
              <p className="text-zinc-500 text-[13px]">Just a moment.</p>
            </>
          ) : (
            <>
              <p className="text-white text-[18px] font-semibold tracking-tight">All set.</p>
              <p className="text-zinc-400 text-[13px]">Let's create your first audio guide.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex" style={{ minHeight: 500 }}>

        {/* ── Left panel ─────────────────────────────── */}
        <div className="w-[280px] flex-shrink-0 bg-zinc-50 flex flex-col px-8 py-10 relative overflow-hidden border-r border-zinc-100">

          {/* Statue — bottom decorative */}
          <img
            src="https://www.figma.com/api/mcp/asset/ccc45acc-492e-4789-854b-e5212cbde8e6"
            alt=""
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] opacity-20 pointer-events-none select-none"
          />

          {/* Logo */}
          <div className="relative">
            <MainLogoVariant className="h-[22px] w-[119px] relative" />
          </div>

          {/* Brand tagline */}
          <div className="flex-1 flex items-end pb-12 relative">
            <p
              className="text-[38px] leading-[1.1] tracking-[-0.5px] text-right w-full"
              style={{
                color: "#D33333",
                fontFamily: "'Fraunces', serif",
                fontWeight: 100,
                fontVariationSettings: "'SOFT' 0, 'WONK' 1",
              }}
            >
              Storytelling for evolving Museums
            </p>
          </div>

          {/* Step dots */}
          <div className="flex gap-1.5 relative">
            {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i + 1 === step  ? "w-4 h-1.5 bg-zinc-900" :
                  i + 1 < step   ? "w-1.5 h-1.5 bg-zinc-400" :
                                   "w-1.5 h-1.5 bg-zinc-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Right panel ────────────────────────────── */}
        <div className="flex-1 flex flex-col px-10 py-10">
          <div className="flex-1">

            {/* Step 0 — Welcome */}
            {step === 0 && (
              <div className="h-full flex flex-col justify-center space-y-4">
                <h1 className="text-[28px] font-semibold text-zinc-900 tracking-tight">Welcome to Museoo</h1>
                <p className="text-[15px] text-zinc-500 leading-relaxed max-w-sm">
                  Your platform to create and publish immersive audio guides for your museum.
                </p>
                <p className="text-[13px] text-zinc-400">Takes about 2 minutes to set up.</p>
              </div>
            )}

            {/* Step 1 — Museum name */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[22px] font-semibold text-zinc-900 tracking-tight mb-1">What's your museum called?</h2>
                  <p className="text-[13px] text-zinc-400">This will appear throughout your workspace.</p>
                </div>
                <input
                  type="text"
                  autoFocus
                  value={museumName}
                  onChange={e => setMuseumName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && canAdvance() && advance()}
                  placeholder="e.g. Museo Nazionale Romano"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-[15px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>
            )}

            {/* Step 2 — Institution type */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[22px] font-semibold text-zinc-900 tracking-tight mb-1">What kind of institution?</h2>
                  <p className="text-[13px] text-zinc-400">Helps us tailor suggestions for your content.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {INSTITUTION_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setInstitutionType(t.id)}
                      className={`px-4 py-3 rounded-xl border text-left text-[13px] font-medium transition-all ${
                        institutionType === t.id
                          ? "border-zinc-900 bg-[#D33333] text-white"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Primary language */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[22px] font-semibold text-zinc-900 tracking-tight mb-1">Primary content language</h2>
                  <p className="text-[13px] text-zinc-400">The language your scripts will be written in.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-[13px] font-medium transition-all ${
                        language === lang.code
                          ? "border-zinc-900 bg-[#D33333] text-white"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 — Invite team */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[22px] font-semibold text-zinc-900 tracking-tight mb-1">Invite your team</h2>
                  <p className="text-[13px] text-zinc-400">Add collaborators now, or skip and do it later from Settings.</p>
                </div>
                <div className="space-y-2">
                  {invites.map((inv, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-zinc-400 transition-colors"
                        placeholder="colleague@museum.it"
                        value={inv.email}
                        onChange={e => updateInvite(i, "email", e.target.value)}
                      />
                      <select
                        className="border border-zinc-200 rounded-lg px-2 py-2 text-[13px] outline-none bg-white focus:border-zinc-400 transition-colors"
                        value={inv.role}
                        onChange={e => updateInvite(i, "role", e.target.value)}
                      >
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                      </select>
                      {invites.length > 1 && (
                        <button onClick={() => removeInvite(i)} className="text-zinc-300 hover:text-zinc-500 transition-colors flex-shrink-0">
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addInvite}
                  className="flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  <Plus className="size-3.5" /> Add another
                </button>
              </div>
            )}

          </div>

          {/* ── CTA bar ───────────────────────────────── */}
          <div className="flex items-center justify-between pt-8 mt-4 border-t border-zinc-100">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {step === 4 && (
                <button
                  onClick={onComplete}
                  className="text-[13px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Skip for now
                </button>
              )}
              <button
                onClick={advance}
                disabled={!canAdvance()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {step === 0 ? "Get started" : step === 4 ? "Send invites" : "Continue"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
