import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2, Users, CheckCircle2,
  ArrowRight, ArrowLeft, Plus, X,
} from "lucide-react";

const STEPS = [
  { id: 0, label: "Account", icon: Building2 },
  { id: 1, label: "Museum",  icon: Building2 },
  { id: 2, label: "Team",    icon: Users },
  { id: 3, label: "Done",    icon: CheckCircle2 },
];

const TOTAL = STEPS.length - 1; // last step is Done, not a "real" step

const INSTITUTION_TYPES = [
  "Archaeological Museum", "Art Museum", "Science Museum",
  "History Museum", "Natural History Museum", "Other",
];

const ROLES = ["Curator", "Translator", "Voice Manager", "Reviewer"];

export function TenantOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [account, setAccount] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [museum, setMuseum]   = useState({ name: "", slug: "", country: "", type: "" });
  const [invites, setInvites] = useState([{ email: "", role: "Curator" }]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const addInvite    = () => setInvites((prev) => [...prev, { email: "", role: "Curator" }]);
  const removeInvite = (i: number) => setInvites((prev) => prev.filter((_, idx) => idx !== i));
  const updateInvite = (i: number, field: string, value: string) =>
    setInvites((prev) => prev.map((inv, idx) => (idx === i ? { ...inv, [field]: value } : inv)));

  const slugify = (val: string) =>
    val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const isDone = step === STEPS.length - 1;

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
        {!isDone && (
          <span className="text-xs text-zinc-400">Step {step + 1} of {TOTAL}</span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Step indicators */}
          <div className="flex items-center gap-1.5 mb-8 justify-center">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  i < step  ? "bg-[#D33333] text-white" :
                  i === step ? "bg-zinc-900 text-white" :
                  "bg-zinc-200 text-zinc-400"
                }`}>
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px ${i < step ? "bg-[#D33333]" : "bg-zinc-200"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">

            {/* Step 0: Account */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Create your account</h2>
                  <p className="text-sm text-zinc-500 mt-1">You'll be the admin of your museum workspace.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" value={account.firstName} onChange={(v) => setAccount({ ...account, firstName: v })} placeholder="Marco" />
                  <Field label="Last name" value={account.lastName} onChange={(v) => setAccount({ ...account, lastName: v })} placeholder="Rossi" />
                </div>
                <Field label="Work email" type="email" value={account.email} onChange={(v) => setAccount({ ...account, email: v })} placeholder="marco@museo.it" />
                <Field label="Password" type="password" value={account.password} onChange={(v) => setAccount({ ...account, password: v })} placeholder="Min. 8 characters" />
              </div>
            )}

            {/* Step 1: Museum */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Set up your museum</h2>
                  <p className="text-sm text-zinc-500 mt-1">This information appears in your public audio guides.</p>
                </div>
                <Field
                  label="Museum name"
                  value={museum.name}
                  onChange={(v) => setMuseum({ ...museum, name: v, slug: slugify(v) })}
                  placeholder="Museo Archeologico Nazionale"
                />
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">Public URL</label>
                  <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                    <span className="px-3 text-xs text-zinc-400 border-r border-zinc-200 py-2.5 whitespace-nowrap">museoo.app/</span>
                    <input
                      className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                      value={museum.slug}
                      onChange={(e) => setMuseum({ ...museum, slug: slugify(e.target.value) })}
                      placeholder="museo-archeologico"
                    />
                  </div>
                </div>
                <Field label="Country" value={museum.country} onChange={(v) => setMuseum({ ...museum, country: v })} placeholder="Italy" />
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">Institution type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {INSTITUTION_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setMuseum({ ...museum, type: t })}
                        className={`text-xs px-3 py-2 rounded-lg border transition-all text-left ${
                          museum.type === t
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Team */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Invite your team</h2>
                  <p className="text-sm text-zinc-500 mt-1">You can skip this and invite people later from Settings.</p>
                </div>
                <div className="space-y-2.5">
                  {invites.map((inv, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400"
                        placeholder="colleague@museo.it"
                        value={inv.email}
                        onChange={(e) => updateInvite(i, "email", e.target.value)}
                      />
                      <select
                        className="border border-zinc-200 rounded-lg px-2 py-2 text-sm outline-none bg-white focus:border-zinc-400"
                        value={inv.role}
                        onChange={(e) => updateInvite(i, "role", e.target.value)}
                      >
                        {ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                      {invites.length > 1 && (
                        <button onClick={() => removeInvite(i)} className="text-zinc-400 hover:text-zinc-600">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addInvite}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add another
                </button>
              </div>
            )}

            {/* Step 3: Done */}
            {step === 3 && (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">You're all set!</h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    <span className="font-medium text-zinc-700">{museum.name || "Your museum"}</span> is ready. Create your first audio guide to get started.
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4 text-left space-y-2 text-sm">
                  <Row label="Museum" value={museum.name || "—"} />
                  <Row label="URL" value={`museoo.app/${museum.slug || "—"}`} accent />
                  <Row label="Type" value={museum.type || "—"} />
                  {invites.filter(i => i.email).length > 0 && (
                    <Row label="Invites sent" value={String(invites.filter(i => i.email).length)} />
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-100">
              {/* Back button — always visible except step 0 and Done */}
              {step > 0 && !isDone ? (
                <button
                  onClick={back}
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {/* Forward buttons */}
              {step < 2 && (
                <button
                  onClick={next}
                  className="flex items-center gap-2 bg-zinc-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {step === 2 && (
                <div className="flex items-center gap-3">
                  <button onClick={next} className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
                    Skip
                  </button>
                  <button
                    onClick={next}
                    className="flex items-center gap-2 bg-zinc-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Send invites <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              {isDone && (
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 bg-[#D33333] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#b52b2b] transition-colors"
                >
                  Create first audio guide <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-700 mb-1.5">{label}</label>
      <input
        type={type}
        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{label}</span>
      <span className={`font-medium ${accent ? "text-[#D33333]" : "text-zinc-900"}`}>{value}</span>
    </div>
  );
}
