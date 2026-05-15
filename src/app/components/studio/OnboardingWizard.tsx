import { useState } from "react";
import { Check, ChevronRight, Headphones, MapPin, Users, ArrowRight } from "lucide-react";

const LANGUAGES = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch",  flag: "🇩🇪" },
  { code: "es", label: "Español",  flag: "🇪🇸" },
];

interface OnboardingWizardProps {
  onComplete: (data: { museumName: string; language: string }) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [museumName, setMuseumName] = useState("");
  const [language, setLanguage] = useState("it");

  const canAdvance = step === 0 ? true : step === 1 ? museumName.trim().length > 0 : true;

  const advance = () => {
    if (step < 2) setStep(s => s + 1);
    else onComplete({ museumName: museumName.trim(), language });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Progress bar */}
        <div className="h-1 bg-zinc-100">
          <div
            className="h-full bg-zinc-900 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>

        <div className="px-8 py-10">

          {/* Step 0 — Welcome */}
          {step === 0 && (
            <div className="text-center space-y-5">
              <div className="size-14 rounded-2xl bg-[#D33333] flex items-center justify-center mx-auto shadow-lg shadow-red-200">
                <span className="text-white text-[22px] font-bold">M</span>
              </div>
              <div>
                <h1 className="text-[24px] font-semibold text-zinc-900 tracking-tight mb-2">Welcome to Museoo</h1>
                <p className="text-[14px] text-zinc-500 leading-relaxed max-w-sm mx-auto">
                  Your platform to create, manage, and publish immersive audio guides for your museum.
                  Let's get you set up in 2 minutes.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Headphones, label: "Audio Guides",     desc: "Create narrated tours" },
                  { icon: MapPin,     label: "Points of Interest", desc: "Map every stop" },
                  { icon: Users,      label: "Team",              desc: "Collaborate together" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="p-3 bg-zinc-50 rounded-xl text-center">
                    <Icon className="size-5 text-zinc-400 mx-auto mb-1.5" strokeWidth={1.5} />
                    <p className="text-[11px] font-semibold text-zinc-700">{label}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Museum setup */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Step 1 of 2</p>
                <h2 className="text-[22px] font-semibold text-zinc-900 tracking-tight mb-1">Tell us about your museum</h2>
                <p className="text-[13px] text-zinc-400">This will appear throughout your workspace.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-600 mb-2">Museum name *</label>
                  <input
                    type="text"
                    autoFocus
                    value={museumName}
                    onChange={e => setMuseumName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && canAdvance && advance()}
                    placeholder="e.g. Museo Nazionale Romano"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-[15px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-600 mb-2">Primary content language</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-[13px] font-medium transition-all ${
                          language === lang.code
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — All set */}
          {step === 2 && (
            <div className="text-center space-y-5">
              <div className="size-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                <Check className="size-7 text-emerald-500" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[22px] font-semibold text-zinc-900 tracking-tight mb-2">
                  You're all set{museumName ? `, ${museumName.split(" ")[0]}` : ""}!
                </h2>
                <p className="text-[13px] text-zinc-500 leading-relaxed max-w-sm mx-auto">
                  Your workspace is ready. Here's what we suggest doing first:
                </p>
              </div>
              <div className="space-y-2 text-left">
                {[
                  { n: "1", text: "Create your first audio guide",    sub: "Set the title, languages and cover image" },
                  { n: "2", text: "Add your first point of interest", sub: "Write the script and map the location" },
                  { n: "3", text: "Invite a collaborator",            sub: "Delegate script writing to your team" },
                ].map(({ n, text, sub }) => (
                  <div key={n} className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl">
                    <span className="size-5 rounded-full bg-zinc-200 text-zinc-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-800">{text}</p>
                      <p className="text-[11px] text-zinc-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className={`rounded-full transition-all ${i === step ? "w-4 h-1.5 bg-zinc-900" : "w-1.5 h-1.5 bg-zinc-200"}`} />
              ))}
            </div>
            <button
              onClick={advance}
              disabled={!canAdvance}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {step === 2 ? (
                <>Open my workspace <ArrowRight className="size-4" /></>
              ) : (
                <>Continue <ChevronRight className="size-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
