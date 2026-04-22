import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, ArrowRight, ArrowLeft, User, BookOpen, Wand2 } from "lucide-react";

const ROLES = {
  Curator: {
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700",
    description: "You create and manage audio guides — writing narration scripts, organizing POIs, and approving content before translation.",
    cta: "Go to Dashboard",
    path: "/",
  },
  Translator: {
    icon: Wand2,
    color: "bg-purple-100 text-purple-700",
    description: "You translate narration scripts into your assigned languages, review AI-generated translations, and ensure cultural accuracy.",
    cta: "Go to Translations",
    path: "/translations",
  },
  "Voice Manager": {
    icon: User,
    color: "bg-orange-100 text-orange-700",
    description: "You assign voice talent to each language, review audio recordings, and validate pronunciation of difficult terms.",
    cta: "Go to Voice Talent",
    path: "/voice-talent",
  },
  Reviewer: {
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700",
    description: "You review and approve content at each stage of the workflow — from narration scripts to translated texts.",
    cta: "Go to Dashboard",
    path: "/",
  },
};


const MOCK_INVITE = {
  museum: "Museo Archeologico Nazionale",
  role: "Translator" as keyof typeof ROLES,
  invitedBy: "Marco Rossi",
};

export function UserOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ firstName: "", lastName: "" });

  const role = ROLES[MOCK_INVITE.role];
  const RoleIcon = role.icon;

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#D33333] flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold">M</span>
          </div>
          <span className="font-semibold text-sm text-zinc-900">Museoo</span>
        </div>
        <span className="text-xs text-zinc-400">Step {step + 1} of 4</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Step indicators */}
          <div className="flex items-center gap-1.5 mb-8 justify-center">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  i < step ? "bg-[#D33333] text-white" :
                  i === step ? "bg-zinc-900 text-white" :
                  "bg-zinc-200 text-zinc-400"
                }`}>
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < 3 && <div className={`w-8 h-px ${i < step ? "bg-[#D33333]" : "bg-zinc-200"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">

            {/* Step 0: Accept Invite */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">You've been invited</h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    <span className="font-medium text-zinc-700">{MOCK_INVITE.invitedBy}</span> invited you to join their team on Museoo.
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D33333]/10 flex items-center justify-center text-lg">🏛️</div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-900">{MOCK_INVITE.museum}</p>
                      <p className="text-xs text-zinc-500">Museum workspace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-200">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${role.color}`}>
                      {MOCK_INVITE.role}
                    </div>
                    <span className="text-xs text-zinc-400">Your assigned role</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Your profile</h2>
                  <p className="text-sm text-zinc-500 mt-1">This is how your teammates will see you.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">First name</label>
                    <input
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors"
                      placeholder="Sophie"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Last name</label>
                    <input
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors"
                      placeholder="Dubois"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Role Intro */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Your role: {MOCK_INVITE.role}</h2>
                  <p className="text-sm text-zinc-500 mt-1">Here's what you'll be doing on Museoo.</p>
                </div>
                <div className={`rounded-xl p-5 ${role.color.split(" ")[0]} bg-opacity-20`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${role.color}`}>
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">{role.description}</p>
                </div>
                <div className="space-y-2.5">
                  {MOCK_INVITE.role === "Translator" && (
                    <>
                      <FeatureRow label="Review and edit AI-generated translations" />
                      <FeatureRow label="Side-by-side source and target text view" />
                      <FeatureRow label="Leave comments and flag issues" />
                      <FeatureRow label="Submit translations for curator review" />
                    </>
                  )}
                  {MOCK_INVITE.role === "Curator" && (
                    <>
                      <FeatureRow label="Create and manage audio guides" />
                      <FeatureRow label="Write and approve narration scripts" />
                      <FeatureRow label="Manage POI order and structure" />
                      <FeatureRow label="Trigger translations and publishing" />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Done */}
            {step === 3 && (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Welcome, {profile.firstName || "there"}!</h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    You're now part of <span className="font-medium text-zinc-700">{MOCK_INVITE.museum}</span> as a <span className="font-medium text-zinc-700">{MOCK_INVITE.role}</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-100">
              {step > 0 && step < 3 ? (
                <button onClick={back} className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  onClick={next}
                  className="flex items-center gap-2 bg-zinc-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  {step === 0 ? "Accept invitation" : "Continue"} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate(role.path)}
                  className="flex items-center gap-2 bg-[#D33333] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#b52b2b] transition-colors"
                >
                  {role.cta} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-zinc-700">
      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      {label}
    </div>
  );
}
