import { useState } from "react";
import { Check } from "lucide-react";

type Plan = "trial" | "starter" | "pro" | "enterprise";
type FeatureValue = boolean | number | "unlimited";

interface Feature {
  id: string;
  name: string;
  hint?: string;
  type: "toggle" | "limit";
  limitOptions?: (number | "unlimited")[];
  values: Record<Plan, FeatureValue>;
}

interface FeatureCategory {
  label: string;
  features: Feature[];
}

const PLANS: { key: Plan; label: string; price: string; color: string; bg: string }[] = [
  { key: "trial", label: "Trial", price: "€0", color: "text-amber-700", bg: "bg-amber-50" },
  { key: "starter", label: "Starter", price: "€90/mo", color: "text-blue-700", bg: "bg-blue-50" },
  { key: "pro", label: "Pro", price: "€290/mo", color: "text-violet-700", bg: "bg-violet-50" },
  { key: "enterprise", label: "Enterprise", price: "€890/mo", color: "text-zinc-900", bg: "bg-zinc-100" },
];

const INITIAL_CATEGORIES: FeatureCategory[] = [
  {
    label: "Content",
    features: [
      {
        id: "guides_count",
        name: "Audio Guides",
        hint: "Max number of guides",
        type: "limit",
        limitOptions: [1, 3, 10, "unlimited"],
        values: { trial: 1, starter: 3, pro: 10, enterprise: "unlimited" },
      },
      {
        id: "pois",
        name: "Points of Interest",
        type: "toggle",
        values: { trial: true, starter: true, pro: true, enterprise: true },
      },
      {
        id: "map",
        name: "Interactive Map",
        type: "toggle",
        values: { trial: false, starter: true, pro: true, enterprise: true },
      },
      {
        id: "media_library",
        name: "Media Library",
        type: "toggle",
        values: { trial: false, starter: true, pro: true, enterprise: true },
      },
      {
        id: "languages_count",
        name: "Languages per guide",
        hint: "Max number of languages",
        type: "limit",
        limitOptions: [1, 2, 5, "unlimited"],
        values: { trial: 1, starter: 2, pro: 5, enterprise: "unlimited" },
      },
    ],
  },
  {
    label: "AI & Production",
    features: [
      {
        id: "ai_assistant",
        name: "AI Content Assistant",
        hint: "AI script generation",
        type: "toggle",
        values: { trial: false, starter: true, pro: true, enterprise: true },
      },
      {
        id: "ai_translations",
        name: "AI Translations",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
      {
        id: "expert_review",
        name: "Certified Expert Review",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
      {
        id: "voice_talent",
        name: "Voice Talent",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
    ],
  },
  {
    label: "Engagement",
    features: [
      {
        id: "reviews",
        name: "Reviews & Ratings",
        type: "toggle",
        values: { trial: false, starter: true, pro: true, enterprise: true },
      },
      {
        id: "surveys",
        name: "Surveys",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
      {
        id: "gamification",
        name: "Gamification / Hunts",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
    ],
  },
  {
    label: "Growth",
    features: [
      {
        id: "marketing",
        name: "Marketing Tools",
        type: "toggle",
        values: { trial: false, starter: true, pro: true, enterprise: true },
      },
      {
        id: "monetization",
        name: "Paid QR / Monetization",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
      {
        id: "analytics",
        name: "Advanced Analytics",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
      {
        id: "api_access",
        name: "API Access",
        type: "toggle",
        values: { trial: false, starter: false, pro: false, enterprise: true },
      },
    ],
  },
  {
    label: "Platform",
    features: [
      {
        id: "team_members",
        name: "Team Members",
        hint: "Max number of members",
        type: "limit",
        limitOptions: [1, 3, 10, "unlimited"],
        values: { trial: 1, starter: 3, pro: 10, enterprise: "unlimited" },
      },
      {
        id: "custom_branding",
        name: "Custom Branding",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
      {
        id: "custom_domain",
        name: "Custom Domain",
        type: "toggle",
        values: { trial: false, starter: false, pro: false, enterprise: true },
      },
      {
        id: "white_label",
        name: "White Label",
        type: "toggle",
        values: { trial: false, starter: false, pro: false, enterprise: true },
      },
      {
        id: "priority_support",
        name: "Priority Support",
        type: "toggle",
        values: { trial: false, starter: false, pro: true, enterprise: true },
      },
    ],
  },
];

// ── Toggle pill ───────────────────────────────────────────────────────────────

function TogglePill({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        position: "relative", width: 36, height: 20, borderRadius: 10,
        background: active ? "#18181b" : "#e4e4e7",
        border: "none", cursor: "pointer", padding: 0,
        transition: "background 0.2s ease", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: active ? 19 : 3,
        width: 14, height: 14, borderRadius: "50%", background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.18s ease",
      }} />
    </button>
  );
}

// ── Limit cell ────────────────────────────────────────────────────────────────

function LimitCell({
  value,
  options,
  onChange,
}: {
  value: number | "unlimited";
  options: (number | "unlimited")[];
  onChange: (v: number | "unlimited") => void;
}) {
  return (
    <select
      value={String(value)}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "unlimited" ? "unlimited" : Number(v));
      }}
      className="text-[12px] font-semibold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-300 cursor-pointer"
    >
      {options.map((o) => (
        <option key={String(o)} value={String(o)}>
          {o === "unlimited" ? "∞" : o}
        </option>
      ))}
    </select>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function SuperAdminPlans() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [saved, setSaved] = useState(false);

  const updateFeature = (catIdx: number, featIdx: number, plan: Plan, value: FeatureValue) => {
    setCategories((prev) => {
      const next = prev.map((c, ci) =>
        ci !== catIdx ? c : {
          ...c,
          features: c.features.map((f, fi) =>
            fi !== featIdx ? f : { ...f, values: { ...f.values, [plan]: value } }
          ),
        }
      );
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Plans & Features</h1>
          <p className="text-[13px] text-zinc-400 mt-0.5">
            Configure which features are available per plan. Changes apply to all new tenants on that plan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-[12px] text-emerald-600">
              <Check className="size-3.5" strokeWidth={2.5} />
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 text-[13px] font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Matrix */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        {/* Plan header */}
        <div className="grid grid-cols-[1fr_repeat(4,_120px)] border-b border-zinc-100">
          <div className="px-5 py-4" />
          {PLANS.map((plan) => (
            <div key={plan.key} className={`px-4 py-4 text-center border-l border-zinc-100 ${plan.bg}`}>
              <p className={`text-[13px] font-bold ${plan.color}`}>{plan.label}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{plan.price}</p>
            </div>
          ))}
        </div>

        {/* Feature rows by category */}
        {categories.map((cat, catIdx) => (
          <div key={cat.label}>
            {/* Category header */}
            <div className="grid grid-cols-[1fr_repeat(4,_120px)] bg-zinc-50/80 border-b border-zinc-100">
              <div className="px-5 py-2.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{cat.label}</span>
              </div>
              {PLANS.map((p) => <div key={p.key} className="border-l border-zinc-100" />)}
            </div>

            {/* Feature rows */}
            {cat.features.map((feature, featIdx) => (
              <div
                key={feature.id}
                className={`grid grid-cols-[1fr_repeat(4,_120px)] items-center ${
                  featIdx < cat.features.length - 1 ? "border-b border-zinc-50" : ""
                } hover:bg-zinc-50/50 transition-colors`}
              >
                {/* Feature name */}
                <div className="px-5 py-3.5">
                  <p className="text-[13px] font-medium text-zinc-800">{feature.name}</p>
                  {feature.hint && (
                    <p className="text-[11px] text-zinc-400 mt-0.5">{feature.hint}</p>
                  )}
                </div>

                {/* Value cells */}
                {PLANS.map((plan) => {
                  const val = feature.values[plan.key];
                  return (
                    <div key={plan.key} className="px-4 py-3.5 flex items-center justify-center border-l border-zinc-100">
                      {feature.type === "toggle" ? (
                        <TogglePill
                          active={val as boolean}
                          onChange={() => updateFeature(catIdx, featIdx, plan.key, !val)}
                        />
                      ) : (
                        <LimitCell
                          value={val as number | "unlimited"}
                          options={feature.limitOptions!}
                          onChange={(v) => updateFeature(catIdx, featIdx, plan.key, v)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Note */}
      <p className="mt-4 text-[11px] text-zinc-400 text-center">
        Existing tenants are not affected by plan changes until their next renewal or a manual plan update.
      </p>
    </div>
  );
}
