import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Headphones, Users, Eye, StickyNote, AlertTriangle, Check, ExternalLink, Crown, ShieldCheck, PenLine } from "lucide-react";
import { tenants, type TenantPlan, type TenantStatus } from "../../data/superAdminData";

const PLAN_META: Record<TenantPlan, { label: string; className: string }> = {
  trial: { label: "Trial", className: "text-amber-700 bg-amber-50 border border-amber-200" },
  starter: { label: "Starter", className: "text-blue-700 bg-blue-50 border border-blue-200" },
  pro: { label: "Pro", className: "text-violet-700 bg-violet-50 border border-violet-200" },
  enterprise: { label: "Enterprise", className: "text-zinc-900 bg-zinc-100 border border-zinc-200" },
};

const STATUS_META: Record<TenantStatus, { label: string; dot: string; text: string }> = {
  active: { label: "Active", dot: "bg-emerald-400", text: "text-emerald-600" },
  suspended: { label: "Suspended", dot: "bg-red-400", text: "text-red-600" },
  trial: { label: "Trial", dot: "bg-amber-400", text: "text-amber-600" },
};

const ROLE_META = {
  owner: { label: "Owner", icon: Crown, color: "text-zinc-900" },
  admin: { label: "Admin", icon: ShieldCheck, color: "text-blue-600" },
  curator: { label: "Curator", icon: PenLine, color: "text-violet-600" },
  viewer: { label: "Viewer", icon: Eye, color: "text-zinc-400" },
} as const;

type Tab = "overview" | "guides" | "team" | "settings";

export function SuperAdminTenantDetail() {
  const { id } = useParams();
  const tenant = tenants.find((t) => t.id === id);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [notes, setNotes] = useState(tenant?.notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [status, setStatus] = useState<TenantStatus>(tenant?.status ?? "active");

  if (!tenant) {
    return (
      <div className="px-8 py-10">
        <Link to="/superadmin/tenants" className="text-[13px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 mb-6">
          <ArrowLeft className="size-4" /> Back to Organizations
        </Link>
        <p className="text-zinc-400">Organization not found.</p>
      </div>
    );
  }

  const planMeta = PLAN_META[tenant.plan];
  const statusMeta = STATUS_META[status];
  const publishedGuides = tenant.guides.filter((g) => g.status === "published").length;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "guides", label: `Guides (${tenant.guides.length})` },
    { key: "team", label: `Team (${tenant.members.length})` },
    { key: "settings", label: "Settings" },
  ];

  const handleSaveNotes = () => {
    tenant.notes = notes;
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        to="/superadmin/tenants"
        className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Organizations
      </Link>

      {/* Header card */}
      <div className="bg-white border border-zinc-100 rounded-2xl px-6 py-5 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-zinc-100 flex items-center justify-center text-[13px] font-bold text-zinc-700 flex-shrink-0">
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[20px] font-semibold text-zinc-900 tracking-tight">{tenant.name}</h1>
                <span className={`inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${planMeta.className}`}>
                  {planMeta.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`size-1.5 rounded-full ${statusMeta.dot}`} />
                  <span className={`text-[12px] font-medium ${statusMeta.text}`}>{statusMeta.label}</span>
                </div>
              </div>
              <p className="text-[13px] text-zinc-400 mt-0.5">{tenant.city}, {tenant.country} · since {tenant.createdAt}</p>
            </div>
          </div>

          {/* Impersonate */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white text-[13px] font-semibold rounded-lg transition-colors flex-shrink-0"
          >
            <ExternalLink className="size-4" strokeWidth={1.5} />
            Impersonate
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
              activeTab === tab.key ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Guides", value: tenant.guidesCount, sub: `${publishedGuides} published` },
              { label: "Team members", value: tenant.membersCount, sub: "active accounts" },
              { label: "Visitors (30d)", value: tenant.visitorsLastMonth.toLocaleString(), sub: "unique visitors" },
            ].map((k) => (
              <div key={k.label} className="bg-white border border-zinc-100 rounded-xl px-5 py-4">
                <p className="text-[26px] font-semibold text-zinc-900 tracking-tight">{k.value}</p>
                <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{k.label}</p>
                <p className="text-[10px] text-zinc-300 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* MRR + last active */}
          <div className="bg-white border border-zinc-100 rounded-xl px-5 py-4 flex items-center gap-8">
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-0.5">MRR</p>
              <p className="text-[20px] font-semibold text-zinc-900">{tenant.mrr > 0 ? `€${tenant.mrr}` : "—"}</p>
            </div>
            <div className="w-px h-8 bg-zinc-100" />
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-0.5">Last Active</p>
              <p className="text-[13px] font-medium text-zinc-700">{tenant.lastActiveAt}</p>
            </div>
            <div className="w-px h-8 bg-zinc-100" />
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-0.5">Slug</p>
              <p className="text-[13px] font-mono text-zinc-500">{tenant.slug}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "guides" && (
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          {tenant.guides.length === 0 ? (
            <div className="py-16 text-center">
              <Headphones className="size-8 text-zinc-200 mx-auto mb-3" strokeWidth={1} />
              <p className="text-[13px] text-zinc-400">No guides yet</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {tenant.guides.map((guide) => (
                <div key={guide.id} className="flex items-center gap-4 px-5 py-4">
                  <div className={`size-2 rounded-full flex-shrink-0 ${guide.status === "published" ? "bg-emerald-400" : "bg-zinc-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-800">{guide.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {guide.pois} POIs · {guide.languages.map((l) => l.toUpperCase()).join(", ")}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    guide.status === "published" ? "text-emerald-700 bg-emerald-50" : "text-zinc-500 bg-zinc-100"
                  }`}>
                    {guide.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "team" && (
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="divide-y divide-zinc-50">
            {tenant.members.map((member) => {
              const roleMeta = ROLE_META[member.role];
              const RoleIcon = roleMeta.icon;
              return (
                <div key={member.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="size-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                    {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-800">{member.name}</p>
                    <p className="text-[11px] text-zinc-400">{member.email}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 ${roleMeta.color}`}>
                    <RoleIcon className="size-3.5" strokeWidth={1.5} />
                    <span className="text-[12px] font-medium">{roleMeta.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-4">
          {/* Plan */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-3">Plan</p>
            <div className="flex items-center gap-3 flex-wrap">
              {(["trial", "starter", "pro", "enterprise"] as TenantPlan[]).map((p) => {
                const meta = PLAN_META[p];
                const active = tenant.plan === p;
                return (
                  <button key={p}
                    className={`px-4 py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                      active ? `${meta.className} ring-2 ring-offset-1 ring-zinc-300` : "border-zinc-200 text-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    {meta.label}
                    {active && <Check className="inline size-3 ml-1.5" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-3">Account Status</p>
            <div className="flex items-center gap-3">
              {(["active", "trial", "suspended"] as TenantStatus[]).map((s) => {
                const meta = STATUS_META[s];
                const active = status === s;
                return (
                  <button key={s}
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                      active ? "border-zinc-300 bg-zinc-50 text-zinc-900 ring-2 ring-offset-1 ring-zinc-200" : "border-zinc-200 text-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    <span className={`size-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Internal notes */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <StickyNote className="size-3.5 text-zinc-400" strokeWidth={1.5} />
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Internal Notes</p>
            </div>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setNotesSaved(false); }}
              rows={3}
              placeholder="Follow-up reminders, contract notes, special requests…"
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none placeholder:text-zinc-300"
            />
            <div className="flex items-center justify-end gap-3 mt-2">
              {notesSaved && (
                <span className="flex items-center gap-1.5 text-[12px] text-emerald-600">
                  <Check className="size-3.5" strokeWidth={2.5} />Saved
                </span>
              )}
              <button onClick={handleSaveNotes}
                className="px-4 py-2 text-[13px] font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Save notes
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border border-red-100 rounded-2xl p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <AlertTriangle className="size-3.5 text-red-400" strokeWidth={1.5} />
              <p className="text-[11px] font-semibold text-red-400 uppercase tracking-wide">Danger Zone</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-zinc-800">Suspend organization</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">All studio access is immediately revoked.</p>
              </div>
              <button
                onClick={() => setStatus("suspended")}
                disabled={status === "suspended"}
                className="px-4 py-2 text-[13px] font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
