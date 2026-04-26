import { useState } from "react";
import { Link } from "react-router";
import { Search, ArrowRight, Circle } from "lucide-react";
import { tenants, type TenantPlan, type TenantStatus } from "../../data/superAdminData";

const PLAN_META: Record<TenantPlan, { label: string; className: string }> = {
  trial: { label: "Trial", className: "text-amber-700 bg-amber-50 border border-amber-200" },
  starter: { label: "Starter", className: "text-blue-700 bg-blue-50 border border-blue-200" },
  pro: { label: "Pro", className: "text-violet-700 bg-violet-50 border border-violet-200" },
  enterprise: { label: "Enterprise", className: "text-zinc-900 bg-zinc-100 border border-zinc-200" },
};

const STATUS_META: Record<TenantStatus, { label: string; dot: string }> = {
  active: { label: "Active", dot: "bg-emerald-400" },
  suspended: { label: "Suspended", dot: "bg-red-400" },
  trial: { label: "Trial", dot: "bg-amber-400" },
};

export function SuperAdminTenants() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<TenantPlan | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TenantStatus | "all">("all");

  const filtered = tenants.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || t.plan === planFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const totalMRR = filtered.reduce((s, t) => s + t.mrr, 0);

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Organizations</h1>
          <p className="text-[13px] text-zinc-400 mt-0.5">{tenants.length} tenants · €{filtered.reduce((s, t) => s + t.mrr, 0)} MRR in view</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 bg-white flex-1 min-w-[200px] max-w-xs focus-within:ring-2 focus-within:ring-zinc-200 transition-all">
          <Search className="size-4 text-zinc-300 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search organizations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[13px] text-zinc-800 bg-transparent border-none focus:outline-none placeholder:text-zinc-300"
          />
        </div>

        {/* Plan filter */}
        <div className="flex items-center gap-1">
          {(["all", "enterprise", "pro", "starter", "trial"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                planFilter === p ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {p === "all" ? "All plans" : PLAN_META[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_100px_80px_64px_64px_120px_80px] gap-4 px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
          {["Organization", "Plan", "Status", "Guides", "Team", "Last Active", "MRR"].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {filtered.map((tenant, i) => {
          const planMeta = PLAN_META[tenant.plan];
          const statusMeta = STATUS_META[tenant.status];

          return (
            <div
              key={tenant.id}
              className={`grid grid-cols-[1fr_100px_80px_64px_64px_120px_80px] gap-4 px-5 py-4 items-center transition-colors hover:bg-zinc-50/60 ${
                i < filtered.length - 1 ? "border-b border-zinc-50" : ""
              }`}
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 flex-shrink-0">
                  {tenant.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-900 truncate">{tenant.name}</p>
                  <p className="text-[11px] text-zinc-400">{tenant.city}</p>
                </div>
              </div>

              {/* Plan */}
              <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${planMeta.className}`}>
                {planMeta.label}
              </span>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <span className={`size-1.5 rounded-full ${statusMeta.dot} flex-shrink-0`} />
                <span className="text-[12px] text-zinc-500">{statusMeta.label}</span>
              </div>

              {/* Guides */}
              <span className="text-[13px] font-medium text-zinc-700">{tenant.guidesCount}</span>

              {/* Team */}
              <span className="text-[13px] font-medium text-zinc-700">{tenant.membersCount}</span>

              {/* Last active */}
              <span className="text-[12px] text-zinc-400">{tenant.lastActiveAt}</span>

              {/* MRR + action */}
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-zinc-800">
                  {tenant.mrr > 0 ? `€${tenant.mrr}` : "—"}
                </span>
                <Link
                  to={`/superadmin/tenants/${tenant.id}`}
                  className="ml-auto p-1 text-zinc-300 hover:text-zinc-600 transition-colors"
                >
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[13px] text-zinc-400">No organizations match your filters</p>
          </div>
        )}
      </div>

      {/* Footer summary */}
      {filtered.length > 0 && (
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="text-[12px] text-zinc-400">{filtered.length} organizations</span>
          <span className="text-[12px] font-semibold text-zinc-700">€{totalMRR} MRR</span>
        </div>
      )}
    </div>
  );
}
