import { useState } from "react";
import { Link } from "react-router";
import { TrendingUp, AlertCircle, CheckCircle2, Clock, ArrowRight, Download } from "lucide-react";
import { tenants, type TenantPlan } from "../../data/superAdminData";

type PaymentStatus = "paid" | "overdue" | "trial" | "canceled";

interface BillingRecord {
  tenantId: string;
  name: string;
  plan: TenantPlan;
  mrr: number;
  nextRenewal: string;
  paymentStatus: PaymentStatus;
  lastInvoice: string;
  overdueDays?: number;
}

const PAYMENT_META: Record<PaymentStatus, { label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string; bg: string }> = {
  paid: { label: "Paid", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  overdue: { label: "Overdue", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  trial: { label: "Trial", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  canceled: { label: "Canceled", icon: AlertCircle, color: "text-zinc-400", bg: "bg-zinc-100" },
};

const PLAN_META: Record<TenantPlan, { label: string; className: string }> = {
  trial: { label: "Trial", className: "text-amber-700 bg-amber-50 border border-amber-200" },
  starter: { label: "Starter", className: "text-blue-700 bg-blue-50 border border-blue-200" },
  pro: { label: "Pro", className: "text-violet-700 bg-violet-50 border border-violet-200" },
  enterprise: { label: "Enterprise", className: "text-zinc-900 bg-zinc-100 border border-zinc-200" },
};

const billingRecords: BillingRecord[] = [
  { tenantId: "t2", name: "Galleria degli Uffizi", plan: "enterprise", mrr: 890, nextRenewal: "Oct 1, 2026", paymentStatus: "paid", lastInvoice: "Apr 1, 2026" },
  { tenantId: "t6", name: "Palazzo Ducale Venezia", plan: "enterprise", mrr: 890, nextRenewal: "May 1, 2026", paymentStatus: "paid", lastInvoice: "Apr 1, 2026" },
  { tenantId: "t1", name: "Museo Nazionale di Roma", plan: "pro", mrr: 290, nextRenewal: "May 10, 2026", paymentStatus: "paid", lastInvoice: "Apr 10, 2026" },
  { tenantId: "t4", name: "Museo Egizio Torino", plan: "pro", mrr: 290, nextRenewal: "Apr 28, 2026", paymentStatus: "overdue", lastInvoice: "Mar 28, 2026", overdueDays: 4 },
  { tenantId: "t3", name: "MAXXI Roma", plan: "starter", mrr: 90, nextRenewal: "May 3, 2026", paymentStatus: "paid", lastInvoice: "Apr 3, 2026" },
  { tenantId: "t5", name: "Pinacoteca di Brera", plan: "trial", mrr: 0, nextRenewal: "May 10, 2026", paymentStatus: "trial", lastInvoice: "—" },
];

export function SuperAdminBilling() {
  const [filter, setFilter] = useState<PaymentStatus | "all">("all");

  const filtered = filter === "all" ? billingRecords : billingRecords.filter((r) => r.paymentStatus === filter);

  const totalMRR = billingRecords.reduce((s, r) => s + r.mrr, 0);
  const arr = totalMRR * 12;
  const overdueCount = billingRecords.filter((r) => r.paymentStatus === "overdue").length;
  const overdueAmount = billingRecords.filter((r) => r.paymentStatus === "overdue").reduce((s, r) => s + r.mrr, 0);
  const activeCount = billingRecords.filter((r) => r.paymentStatus === "paid").length;

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Billing</h1>
          <p className="text-[13px] text-zinc-400 mt-0.5">Subscription status and revenue overview</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 text-zinc-600 text-[13px] font-medium rounded-lg hover:bg-zinc-50 transition-colors">
          <Download className="size-4" strokeWidth={1.5} />
          Export CSV
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "MRR", value: `€${totalMRR.toLocaleString()}`, sub: "monthly recurring", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "ARR", value: `€${(arr / 1000).toFixed(1)}k`, sub: "annualized", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active", value: String(activeCount), sub: "paying subscriptions", icon: CheckCircle2, color: "text-zinc-700", bg: "bg-zinc-100" },
          { label: "Overdue", value: overdueCount > 0 ? `${overdueCount} · €${overdueAmount}` : "0", sub: overdueCount > 0 ? "requires follow-up" : "all clear", icon: AlertCircle, color: overdueCount > 0 ? "text-red-600" : "text-zinc-400", bg: overdueCount > 0 ? "bg-red-50" : "bg-zinc-50" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-zinc-100 rounded-2xl px-5 py-4">
              <div className={`size-7 ${k.bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`size-3.5 ${k.color}`} strokeWidth={1.5} />
              </div>
              <p className="text-[22px] font-semibold text-zinc-900 tracking-tight leading-none">{k.value}</p>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mt-1">{k.label}</p>
              <p className="text-[10px] text-zinc-300 mt-0.5">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4">
        {([
          { key: "all", label: "All" },
          { key: "paid", label: "Paid" },
          { key: "overdue", label: "Overdue" },
          { key: "trial", label: "Trial" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
              filter === tab.key ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className="ml-1.5 text-[10px] opacity-60">
                {billingRecords.filter((r) => tab.key === "all" || r.paymentStatus === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_100px_100px_130px_100px_40px] gap-4 px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
          {["Organization", "Plan", "Amount", "Next Renewal", "Status", ""].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {filtered.map((record, i) => {
          const planMeta = PLAN_META[record.plan];
          const payMeta = PAYMENT_META[record.paymentStatus];
          const PayIcon = payMeta.icon;

          return (
            <div
              key={record.tenantId}
              className={`grid grid-cols-[1fr_100px_100px_130px_100px_40px] gap-4 px-5 py-4 items-center transition-colors hover:bg-zinc-50/60 ${
                i < filtered.length - 1 ? "border-b border-zinc-50" : ""
              } ${record.paymentStatus === "overdue" ? "bg-red-50/30" : ""}`}
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-7 rounded-md bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-600 flex-shrink-0">
                  {record.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-800 truncate">{record.name}</p>
                  {record.overdueDays && (
                    <p className="text-[10px] text-red-500 font-medium">{record.overdueDays} days overdue</p>
                  )}
                </div>
              </div>

              {/* Plan */}
              <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${planMeta.className}`}>
                {planMeta.label}
              </span>

              {/* Amount */}
              <span className="text-[13px] font-semibold text-zinc-800">
                {record.mrr > 0 ? `€${record.mrr}/mo` : "—"}
              </span>

              {/* Next renewal */}
              <span className="text-[12px] text-zinc-500">{record.nextRenewal}</span>

              {/* Status */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${payMeta.bg}`}>
                <PayIcon className={`size-3 ${payMeta.color}`} strokeWidth={2} />
                <span className={`text-[11px] font-semibold ${payMeta.color}`}>{payMeta.label}</span>
              </div>

              {/* Link */}
              <Link to={`/superadmin/tenants/${record.tenantId}`}
                className="p-1 text-zinc-300 hover:text-zinc-600 transition-colors flex justify-end"
              >
                <ArrowRight className="size-4" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-[12px] text-zinc-400">{filtered.length} subscriptions</span>
        <span className="text-[12px] font-semibold text-zinc-700">
          €{filtered.reduce((s, r) => s + r.mrr, 0)}/mo in view
        </span>
      </div>
    </div>
  );
}
