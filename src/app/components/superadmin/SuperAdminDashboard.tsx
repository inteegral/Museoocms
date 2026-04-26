import { Link } from "react-router";
import { Building2, Headphones, Users, TrendingUp, ArrowRight, Sparkles, BookOpen, UserCheck } from "lucide-react";
import { platformStats, recentActivity, tenants } from "../../data/superAdminData";

const PLAN_COLORS = {
  trial: "text-amber-600 bg-amber-50 border-amber-200",
  starter: "text-blue-600 bg-blue-50 border-blue-200",
  pro: "text-violet-600 bg-violet-50 border-violet-200",
  enterprise: "text-zinc-900 bg-zinc-100 border-zinc-200",
};

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  new_tenant: Building2,
  guide_published: Headphones,
  invite_accepted: UserCheck,
};

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function SuperAdminDashboard() {
  const planDist = [
    { plan: "enterprise", count: tenants.filter((t) => t.plan === "enterprise").length },
    { plan: "pro", count: tenants.filter((t) => t.plan === "pro").length },
    { plan: "starter", count: tenants.filter((t) => t.plan === "starter").length },
    { plan: "trial", count: tenants.filter((t) => t.plan === "trial").length },
  ] as const;

  const kpis = [
    {
      label: "Organizations",
      value: platformStats.totalOrganizations,
      sub: `${platformStats.activeOrganizations} active · ${platformStats.trialOrganizations} trial`,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Guides",
      value: platformStats.totalGuides,
      sub: `${platformStats.publishedGuides} published`,
      icon: Headphones,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Visitors (30d)",
      value: fmt(platformStats.totalVisitorsLastMonth),
      sub: "across all organizations",
      icon: Users,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "MRR",
      value: `€${fmt(platformStats.mrr)}`,
      sub: `+${platformStats.mrrGrowth}% vs last month`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Platform Overview</h1>
        <p className="text-[13px] text-zinc-400 mt-0.5">All organizations · real-time snapshot</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-zinc-100 rounded-2xl px-5 py-5">
              <div className={`size-8 ${k.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`size-4 ${k.color}`} strokeWidth={1.5} />
              </div>
              <p className="text-[26px] font-semibold text-zinc-900 tracking-tight leading-none">{k.value}</p>
              <p className="text-[11px] text-zinc-400 mt-1 font-medium">{k.label}</p>
              <p className="text-[10px] text-zinc-300 mt-0.5">{k.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-50">
            <h2 className="text-[13px] font-semibold text-zinc-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-zinc-50">
            {recentActivity.map((event) => {
              const Icon = ACTIVITY_ICONS[event.type] ?? Sparkles;
              return (
                <div key={event.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="size-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="size-3.5 text-zinc-500" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-zinc-700 leading-snug">{event.text}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{event.time}</p>
                  </div>
                  {event.tenantId && (
                    <Link to={`/superadmin/tenants/${event.tenantId}`}
                      className="text-zinc-300 hover:text-zinc-600 transition-colors flex-shrink-0 mt-1"
                    >
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan distribution + quick links */}
        <div className="space-y-4">
          {/* Plan distribution */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5">
            <h2 className="text-[13px] font-semibold text-zinc-900 mb-4">Plan Distribution</h2>
            <div className="space-y-2.5">
              {planDist.map(({ plan, count }) => {
                const pct = Math.round((count / platformStats.totalOrganizations) * 100);
                const colors = {
                  enterprise: { bar: "bg-zinc-900", label: "Enterprise" },
                  pro: { bar: "bg-violet-500", label: "Pro" },
                  starter: { bar: "bg-blue-400", label: "Starter" },
                  trial: { bar: "bg-amber-400", label: "Trial" },
                };
                const c = colors[plan];
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-zinc-600">{c.label}</span>
                      <span className="text-[11px] text-zinc-400">{count}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attention */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5">
            <h2 className="text-[13px] font-semibold text-zinc-900 mb-3">Needs Attention</h2>
            <div className="space-y-2">
              {tenants.filter((t) => t.notes).map((t) => (
                <Link key={t.id} to={`/superadmin/tenants/${t.id}`}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="size-6 rounded-md bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-600 flex-shrink-0 mt-0.5">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-zinc-800 truncate">{t.name}</p>
                    <p className="text-[10px] text-zinc-400 line-clamp-1 italic">{t.notes}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
