import { useState } from "react";
import { Toggle } from "../_layout/Toggle";
import { 
  Building2, 
  Users, 
  CreditCard, 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  Code, 
  Trash2,
  Upload,
  Plus,
  X,
  Crown,
  Check,
  AlertTriangle,
  Palette,
  RotateCcw,
  Smartphone,
  QrCode,
  Download,
  FileText,
  Shield,
  Accessibility
} from "lucide-react";
import { AppearanceEditor } from "./AppearanceEditor";
import { PageShell } from "../_layout/PageShell";

type SettingsTab = "general" | "team" | "billing" | "integrations" | "security" | "notifications" | "privacy" | "accessibility";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "curator" | "viewer";
  avatar?: string;
  status: "active" | "pending";
  joinedAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Maria Rossi",
    email: "maria.rossi@museo.it",
    role: "owner",
    status: "active",
    joinedAt: "Jan 2024",
  },
  {
    id: "2",
    name: "Giuseppe Verdi",
    email: "g.verdi@museo.it",
    role: "admin",
    status: "active",
    joinedAt: "Feb 2024",
  },
  {
    id: "3",
    name: "Laura Bianchi",
    email: "l.bianchi@museo.it",
    role: "curator",
    status: "pending",
    joinedAt: "Mar 2024",
  },
];

const roleConfig = {
  owner: { label: "Owner", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  admin: { label: "Admin", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  curator: { label: "Curator", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  viewer: { label: "Viewer", color: "text-zinc-500", bg: "bg-zinc-50", border: "border-zinc-200" },
};

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "curator" | "viewer">("curator");

  // Museum data
  const [museumName, setMuseumName] = useState("City Museum of Art");
  const [museumAddress, setMuseumAddress] = useState("1 Museum Square, Milan, 20100");
  const [museumDescription, setMuseumDescription] = useState("A museum dedicated to contemporary and Renaissance art");
  const [museumWebsite, setMuseumWebsite] = useState("https://www.citymuseumofart.it");

  // Account data
  const [userName, setUserName] = useState("Maria Rossi");
  const [userEmail, setUserEmail] = useState("maria.rossi@museo.it");
  const [notifications, setNotifications] = useState({
    email: true,
    analytics: true,
    updates: false,
  });

  // Privacy settings
  const [dpoName, setDpoName] = useState("");
  const [dpoEmail, setDpoEmail] = useState("");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");
  const [cookiePolicyUrl, setCookiePolicyUrl] = useState("");
  const [cookieBannerEnabled, setCookieBannerEnabled] = useState(true);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);
  const [granularConsent, setGranularConsent] = useState(false);
  const [euDataResidency, setEuDataResidency] = useState(true);
  const [breachContactEmail, setBreachContactEmail] = useState("");
  const [dataSubjectEmail, setDataSubjectEmail] = useState("");
  const [retentionLogs, setRetentionLogs] = useState("90");
  const [retentionAnalytics, setRetentionAnalytics] = useState("365");
  const [retentionSurveys, setRetentionSurveys] = useState("180");
  const [retentionReviews, setRetentionReviews] = useState("730");
  const [legalBasis, setLegalBasis] = useState<"legitimate" | "consent" | "both">("legitimate");

  // Accessibility settings
  const [wcagLevel, setWcagLevel] = useState<"A" | "AA" | "AAA">("AA");
  const [enforceAltText, setEnforceAltText] = useState(true);
  const [requireTranscripts, setRequireTranscripts] = useState(false);
  const [contrastChecking, setContrastChecking] = useState(true);
  const [warnAriaLabels, setWarnAriaLabels] = useState(true);
  const [defaultFontSize, setDefaultFontSize] = useState<"S" | "M" | "L">("M");
  const [highContrastOption, setHighContrastOption] = useState(true);
  const [reducedMotionOption, setReducedMotionOption] = useState(true);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [screenReaderOptimization, setScreenReaderOptimization] = useState(false);
  const [autoTranscripts, setAutoTranscripts] = useState(false);
  const [a11yStatementLastUpdated, setA11yStatementLastUpdated] = useState("2025-06-28");
  const [a11yKnownLimitations, setA11yKnownLimitations] = useState("");
  const [a11yFeedbackEmail, setA11yFeedbackEmail] = useState("");

  // Billing data
  const currentPlan = "free";
  const usage = {
    guides: 3,
    guidesLimit: 5,
    pois: 25,
    poisLimit: 50,
    credits: 450,
    creditsLimit: 1000,
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "€0",
      period: "/month",
      features: [
        "5 Audio Guides",
        "50 POIs",
        "1,000 AI Credits",
        "Basic Analytics",
        "Community Support",
      ],
    },
    {
      id: "pro",
      name: "Professional",
      price: "€49",
      period: "/month",
      features: [
        "Unlimited Audio Guides",
        "Unlimited POIs",
        "10,000 AI Credits/month",
        "Advanced Analytics",
        "Priority Support",
        "Custom Branding",
        "API Access",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Everything in Professional",
        "Unlimited AI Credits",
        "Dedicated Account Manager",
        "SLA Guarantee",
        "On-premise Option",
        "Custom Integrations",
      ],
    },
  ];

  const tabs = [
    { id: "general", label: "General Settings", icon: Building2 },
    { id: "team", label: "Team", icon: Users },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
    { id: "integrations", label: "API & Integrations", icon: Code },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
  ];

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-[15px] text-zinc-600 leading-relaxed">
            Manage your museum profile, team members, and subscription
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-[14px] font-medium
                      ${
                        activeTab === tab.id
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }
                    `}
                  >
                    <Icon className="size-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-8">
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-6">
                    Museum Information
                  </h2>

                  <div className="space-y-6">
                    {/* Museum Logo */}
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-3">
                        Museum Logo
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="size-20 bg-zinc-100 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-300">
                          <Building2 className="size-8 text-zinc-400" />
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-colors">
                          <Upload className="size-4" />
                          Upload Logo
                        </button>
                      </div>
                    </div>

                    {/* Museum Name */}
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Museum Name
                      </label>
                      <input
                        type="text"
                        value={museumName}
                        onChange={(e) => setMuseumName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                        placeholder="Your museum name"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={museumAddress}
                        onChange={(e) => setMuseumAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                        placeholder="Street address, City, Postal Code"
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={museumWebsite}
                        onChange={(e) => setMuseumWebsite(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Description
                      </label>
                      <textarea
                        value={museumDescription}
                        onChange={(e) => setMuseumDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
                        placeholder="Brief description of your museum..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-200">
                    <button className="px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all">
                      Cancel
                    </button>
                    <button className="px-5 py-2.5 bg-[#D33333] text-white text-[14px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all shadow-sm">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Team Management */}
            {activeTab === "team" && (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">
                        Team Members
                      </h2>
                      <p className="text-[13px] text-zinc-600">
                        Manage who has access to your museum workspace
                      </p>
                    </div>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all shadow-sm"
                    >
                      <Plus className="size-4" />
                      Invite Member
                    </button>
                  </div>

                  <div className="space-y-3">
                    {mockTeamMembers.map((member) => {
                      const roleStyle = roleConfig[member.role];
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-4 p-5 bg-zinc-50 rounded-lg border border-zinc-200"
                        >
                          <div className="size-12 bg-zinc-200 rounded-full flex items-center justify-center">
                            <User className="size-6 text-zinc-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[15px] text-zinc-950">
                                {member.name}
                              </h3>
                              {member.status === "pending" && (
                                <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded uppercase font-semibold tracking-wide">
                                  Pending
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] text-zinc-600">{member.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border ${roleStyle.border} ${roleStyle.bg} text-[12px] font-semibold ${roleStyle.color}`}>
                              {roleStyle.label}
                            </span>
                            {member.role !== "owner" && (
                              <button className="text-zinc-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded">
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Roles Info */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                  <h3 className="text-[14px] font-semibold text-zinc-950 mb-4 uppercase tracking-wide">
                    Role Permissions
                  </h3>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex gap-3">
                      <div className="font-semibold text-purple-700 min-w-[80px]">Owner</div>
                      <div className="text-zinc-600">Full access including billing and team management</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-semibold text-blue-700 min-w-[80px]">Admin</div>
                      <div className="text-zinc-600">Can manage guides, POIs, and invite team members</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-semibold text-violet-700 min-w-[80px]">Curator</div>
                      <div className="text-zinc-600">Can edit only the guides assigned to them</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-semibold text-zinc-500 min-w-[80px]">Viewer</div>
                      <div className="text-zinc-600">Read-only access to all content</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing */}
            {activeTab === "billing" && (
              <div className="space-y-8">
                {/* Current Plan */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-6">
                    Current Plan
                  </h2>

                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-[28px] font-light text-zinc-950 mb-1">Free Plan</div>
                      <div className="text-[13px] text-zinc-600">Perfect for getting started</div>
                    </div>
                    <button className="px-4 py-2 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">
                      Upgrade Plan
                    </button>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-semibold text-zinc-700">Audio Guides</span>
                        <span className="text-[13px] font-semibold text-zinc-900">
                          {usage.guides} / {usage.guidesLimit}
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-900 rounded-full transition-all"
                          style={{ width: `${(usage.guides / usage.guidesLimit) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-semibold text-zinc-700">Points of Interest</span>
                        <span className="text-[13px] font-semibold text-zinc-900">
                          {usage.pois} / {usage.poisLimit}
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-900 rounded-full transition-all"
                          style={{ width: `${(usage.pois / usage.poisLimit) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-semibold text-zinc-700">AI Credits</span>
                        <span className="text-[13px] font-semibold text-zinc-900">
                          {usage.credits} / {usage.creditsLimit}
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-900 rounded-full transition-all"
                          style={{ width: `${(usage.credits / usage.creditsLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Available Plans */}
                <div>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-6">
                    Available Plans
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative bg-white rounded-xl p-6 border-2 transition-all ${
                          plan.popular
                            ? "border-zinc-900 shadow-lg"
                            : "border-zinc-200"
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#D33333] text-white text-[11px] font-medium rounded-full uppercase tracking-wide">
                              <Crown className="size-3" />
                              Popular
                            </div>
                          </div>
                        )}

                        <div className="mb-6">
                          <div className="text-[14px] font-semibold text-zinc-600 uppercase tracking-wide mb-2">
                            {plan.name}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <div className="text-[40px] font-light text-zinc-950">{plan.price}</div>
                            {plan.period && <div className="text-[14px] text-zinc-600">{plan.period}</div>}
                          </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[13px] text-zinc-700">
                              <Check className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          className={`w-full py-2.5 text-[13px] font-semibold rounded-lg transition-all ${
                            plan.id === currentPlan
                              ? "bg-zinc-100 text-zinc-500 cursor-default"
                              : plan.popular
                              ? "bg-[#D33333] text-white hover:bg-[#b82c2c] shadow-sm"
                              : "bg-white border-2 border-zinc-200 text-zinc-900 hover:border-zinc-900"
                          }`}
                          disabled={plan.id === currentPlan}
                        >
                          {plan.id === currentPlan ? "Current Plan" : plan.id === "enterprise" ? "Contact Sales" : "Upgrade"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* API & Integrations */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-2">
                    API Access
                  </h2>
                  <p className="text-[13px] text-zinc-600 mb-6">
                    Integrate your audio guides with external systems
                  </p>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="size-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-[14px] text-amber-900 mb-1">
                          Professional Plan Required
                        </div>
                        <div className="text-[13px] text-amber-700">
                          API access is available on Professional and Enterprise plans only
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 opacity-50 pointer-events-none">
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        API Key
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value="sk_test_xxxxxxxxxxxxxxxxxxxxx"
                          readOnly
                          className="flex-1 px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 font-mono"
                        />
                        <button className="px-4 py-3 bg-zinc-100 text-zinc-700 text-[13px] font-semibold rounded-lg">
                          Reveal
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://your-domain.com/webhook"
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                  <h3 className="text-[14px] font-semibold text-zinc-950 mb-3 uppercase tracking-wide">
                    Documentation
                  </h3>
                  <p className="text-[13px] text-zinc-600 mb-4">
                    Learn how to integrate our API into your applications
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-100 transition-colors">
                    <Code className="size-4" />
                    View API Docs
                  </button>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-6">
                    Personal Information
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-200">
                    <button className="px-5 py-2.5 bg-[#D33333] text-white text-[14px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all shadow-sm">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-6">
                    Change Password
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8 pt-6 border-t border-zinc-200">
                    <button className="px-5 py-2.5 bg-[#D33333] text-white text-[14px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all shadow-sm">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {[
                      { id: "email", label: "Email Notifications", description: "Receive updates via email" },
                      { id: "analytics", label: "Analytics Reports", description: "Weekly analytics digest" },
                      { id: "updates", label: "Product Updates", description: "News about new features" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-4 border-b border-zinc-200 last:border-0">
                        <div>
                          <div className="font-semibold text-[14px] text-zinc-950 mb-1">
                            {item.label}
                          </div>
                          <div className="text-[13px] text-zinc-600">
                            {item.description}
                          </div>
                        </div>
                        <Toggle
                          checked={!!notifications[item.id as keyof typeof notifications]}
                          onChange={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                {/* Data Controller & DPO */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">Data Controller & DPO</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">Required identification under GDPR Art. 13–14</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">DPO Name</label>
                      <input type="text" value={dpoName} onChange={(e) => setDpoName(e.target.value)} placeholder="Optional — required if Art. 37 applies" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">DPO Email</label>
                      <input type="email" value={dpoEmail} onChange={(e) => setDpoEmail(e.target.value)} placeholder="dpo@museum.it" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-3">Legal Basis for Processing</label>
                      <div className="flex gap-3">
                        {(["legitimate", "consent", "both"] as const).map((basis) => (
                          <button
                            key={basis}
                            onClick={() => setLegalBasis(basis)}
                            className={`flex-1 py-2.5 text-[13px] font-medium rounded-lg border transition-all ${legalBasis === basis ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"}`}
                          >
                            {basis === "legitimate" ? "Legitimate Interest" : basis === "consent" ? "Consent" : "Both"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Retention */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">Data Retention</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">GDPR Art. 5(1)(e) — storage limitation principle</p>
                  <div className="space-y-4">
                    {[
                      { label: "Access Logs", value: retentionLogs, setter: setRetentionLogs, options: [["30","30 days"],["90","90 days"],["180","6 months"],["365","1 year"]] },
                      { label: "Analytics Data", value: retentionAnalytics, setter: setRetentionAnalytics, options: [["180","6 months"],["365","1 year"],["730","2 years"],["0","Indefinite"]] },
                      { label: "Survey Responses", value: retentionSurveys, setter: setRetentionSurveys, options: [["90","90 days"],["180","6 months"],["365","1 year"],["730","2 years"]] },
                      { label: "Reviews", value: retentionReviews, setter: setRetentionReviews, options: [["365","1 year"],["730","2 years"],["0","Indefinite"]] },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-2">
                        <span className="text-[14px] font-medium text-zinc-900">{row.label}</span>
                        <select
                          value={row.value}
                          onChange={(e) => row.setter(e.target.value)}
                          className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        >
                          {row.options.map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consent Management */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">Consent Management</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">ePrivacy Directive & Garante italiano cookie guidelines</p>
                  <div className="space-y-0 mb-6">
                    {[
                      { label: "Cookie / Tracking Banner", desc: "Show consent banner to visitors before any non-essential tracking", value: cookieBannerEnabled, setter: setCookieBannerEnabled },
                      { label: "Analytics Opt-in Required", desc: "Visitors must explicitly consent before analytics data is collected", value: analyticsOptIn, setter: setAnalyticsOptIn },
                      { label: "Granular Consent Categories", desc: "Allow visitors to accept/reject individual cookie categories separately", value: granularConsent, setter: setGranularConsent },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0">
                        <div>
                          <div className="font-semibold text-[14px] text-zinc-950 mb-0.5">{item.label}</div>
                          <div className="text-[12px] text-zinc-500">{item.desc}</div>
                        </div>
                        <Toggle checked={item.value} onChange={() => item.setter(!item.value)} className="ml-6" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">Privacy Policy URL</label>
                      <input type="url" value={privacyPolicyUrl} onChange={(e) => setPrivacyPolicyUrl(e.target.value)} placeholder="https://museum.it/privacy" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">Cookie Policy URL</label>
                      <input type="url" value={cookiePolicyUrl} onChange={(e) => setCookiePolicyUrl(e.target.value)} placeholder="https://museum.it/cookies" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                    </div>
                  </div>
                </div>

                {/* Visitor Rights */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">Visitor Rights</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">GDPR Art. 15–22 — access, erasure, portability, objection</p>
                  <div className="mb-5">
                    <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">Data Subject Requests Contact Email</label>
                    <input type="email" value={dataSubjectEmail} onChange={(e) => setDataSubjectEmail(e.target.value)} placeholder="privacy@museum.it" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[13px] text-blue-800">Under GDPR Art. 12, you must respond to verified data subject requests <strong>within 30 days</strong>. Ensure this address is actively monitored.</p>
                    </div>
                  </div>
                </div>

                {/* International Data Transfers */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">International Data Transfers</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">GDPR Chapter V — transfers outside the EU/EEA</p>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-semibold text-[14px] text-zinc-950 mb-0.5">All data processed within the EU/EEA</div>
                      <div className="text-[12px] text-zinc-500">Infrastructure, storage, and processing remain in EU/EEA data centres</div>
                    </div>
                    <Toggle checked={euDataResidency} onChange={() => setEuDataResidency(!euDataResidency)} className="ml-6" />
                  </div>
                  {!euDataResidency && (
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[13px] text-amber-800">Transfers outside the EU/EEA require a valid transfer mechanism: adequacy decision, Standard Contractual Clauses (SCCs), or binding corporate rules (GDPR Art. 44–49).</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Breach Notification */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">Breach Notification</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">GDPR Art. 33 — notification to supervisory authority</p>
                  <div className="mb-5">
                    <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">Security / DPO Contact Email</label>
                    <input type="email" value={breachContactEmail} onChange={(e) => setBreachContactEmail(e.target.value)} placeholder="security@museum.it" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[13px] text-red-800">In the event of a personal data breach, you must notify the <strong>Garante per la protezione dei dati personali</strong> within <strong>72 hours</strong> of becoming aware (GDPR Art. 33).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility Settings */}
            {activeTab === "accessibility" && (
              <div className="space-y-6">
                {/* Conformance Target */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-[18px] font-semibold text-zinc-950">Conformance Target</h2>
                    <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${wcagLevel === "AAA" ? "bg-emerald-100 text-emerald-700" : wcagLevel === "AA" ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"}`}>
                      WCAG 2.1 Level {wcagLevel}
                    </span>
                  </div>
                  <p className="text-[13px] text-zinc-500 mb-6">European Accessibility Act (Dir. 2019/882/EU) requires Level AA from 28 June 2025</p>
                  <div className="inline-flex bg-zinc-100 rounded-lg p-1 gap-1 mb-5">
                    {(["A", "AA", "AAA"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setWcagLevel(level)}
                        className={`px-6 py-2 text-[13px] font-semibold rounded-md transition-all ${wcagLevel === level ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600 hover:text-zinc-900"}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  {wcagLevel === "A" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[13px] text-amber-800">Level A alone does not meet EAA requirements (effective 28 June 2025). Upgrade to Level AA to ensure legal compliance for digital services open to the public.</p>
                      </div>
                    </div>
                  )}
                  {wcagLevel === "AAA" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <Check className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[13px] text-emerald-800">Level AAA exceeds EAA requirements. Note: full AAA conformance may not be achievable for all content types.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Requirements */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">Content Requirements</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">Accessibility checks enforced before content is published</p>
                  <div className="space-y-0">
                    {[
                      { label: "Require alt text on all images", desc: "WCAG 1.1.1 — non-text content must have a text alternative", value: enforceAltText, setter: setEnforceAltText },
                      { label: "Require transcripts before publish", desc: "WCAG 1.2.1 — audio-only content needs a text transcript", value: requireTranscripts, setter: setRequireTranscripts },
                      { label: "Automatic contrast ratio check", desc: "WCAG 1.4.3 — minimum 4.5:1 ratio for normal text", value: contrastChecking, setter: setContrastChecking },
                      { label: "Warn on missing ARIA labels", desc: "WCAG 4.1.2 — interactive elements must have accessible names", value: warnAriaLabels, setter: setWarnAriaLabels },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0">
                        <div>
                          <div className="font-semibold text-[14px] text-zinc-950 mb-0.5">{item.label}</div>
                          <div className="text-[12px] text-zinc-500">{item.desc}</div>
                        </div>
                        <Toggle checked={item.value} onChange={() => item.setter(!item.value)} className="ml-6" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visitor App Experience */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">Visitor App Experience</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">Default accessibility options offered to visitors (they can override)</p>
                  <div className="mb-6">
                    <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-3">Default Font Size</label>
                    <div className="inline-flex bg-zinc-100 rounded-lg p-1 gap-1">
                      {(["S", "M", "L"] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setDefaultFontSize(size)}
                          className={`px-6 py-2 text-[13px] font-semibold rounded-md transition-all ${defaultFontSize === size ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600 hover:text-zinc-900"}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-0">
                    {[
                      { label: "High Contrast Mode", desc: "Offer high-contrast theme option to visitors", value: highContrastOption, setter: setHighContrastOption },
                      { label: "Reduced Motion", desc: "Respect prefers-reduced-motion; offer toggle in visitor app", value: reducedMotionOption, setter: setReducedMotionOption },
                      { label: "Dyslexia-friendly Font", desc: "Offer OpenDyslexic font as an option (aids readability per WCAG 1.4.8)", value: dyslexiaFont, setter: setDyslexiaFont },
                      { label: "Screen Reader Optimisation", desc: "Enhanced ARIA markup and focus management for assistive technology", value: screenReaderOptimization, setter: setScreenReaderOptimization },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0">
                        <div>
                          <div className="font-semibold text-[14px] text-zinc-950 mb-0.5">{item.label}</div>
                          <div className="text-[12px] text-zinc-500">{item.desc}</div>
                        </div>
                        <Toggle checked={item.value} onChange={() => item.setter(!item.value)} className="ml-6" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audio Transcripts */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-6">Audio Transcripts</h2>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-semibold text-[14px] text-zinc-950 mb-0.5">Auto-generate transcripts for new POIs</div>
                      <div className="text-[12px] text-zinc-500">WCAG 1.2.1 — all audio content must have a text transcript</div>
                    </div>
                    <Toggle checked={autoTranscripts} onChange={() => setAutoTranscripts(!autoTranscripts)} className="ml-6" />
                  </div>
                  <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                    <p className="text-[13px] text-zinc-600">Transcripts also improve SEO, support hearing-impaired visitors, and are required under WCAG 2.1 SC 1.2.1 for audio-only content.</p>
                  </div>
                </div>

                {/* Accessibility Statement */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                  <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">Accessibility Statement</h2>
                  <p className="text-[13px] text-zinc-500 mb-6">Mandatory for public sector bodies (Dir. 2016/2102 & Legge Stanca L. 4/2004); recommended for all under the EAA</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">Statement Last Updated</label>
                      <input type="date" value={a11yStatementLastUpdated} onChange={(e) => setA11yStatementLastUpdated(e.target.value)} className="px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">Known Limitations</label>
                      <textarea value={a11yKnownLimitations} onChange={(e) => setA11yKnownLimitations(e.target.value)} rows={3} placeholder="List any known accessibility issues and planned remediation timelines…" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">Feedback / Complaint Email</label>
                      <input type="email" value={a11yFeedbackEmail} onChange={(e) => setA11yFeedbackEmail(e.target.value)} placeholder="accessibility@museum.it" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                      <p className="text-[12px] text-zinc-500 mt-1.5">Mandatory for public bodies under Dir. 2016/2102 Art. 7(1)(b) — must be publicly accessible</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all shadow-sm">
                      <FileText className="size-4" />
                      Generate Statement
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        {activeTab === "security" && (
          <div className="mt-12 max-w-4xl ml-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="size-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-semibold text-red-900 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-[13px] text-red-700 mb-4 leading-relaxed">
                    Once you delete your account, there is no going back. All your guides, POIs, and data will be permanently deleted.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-[13px] font-semibold rounded-lg hover:bg-red-700 transition-all">
                    <Trash2 className="size-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-zinc-950">Invite Team Member</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@museum.it"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                >
                  <option value="curator">Curator</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-zinc-200 flex items-center justify-end gap-3 bg-zinc-50">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:bg-zinc-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 bg-[#D33333] text-white text-[14px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all shadow-sm">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}