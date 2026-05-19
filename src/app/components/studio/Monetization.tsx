import { useState } from "react";
import { Link } from "react-router";
import {
  Download, X, ChevronDown,
  Package, FileDown,
  Globe, RotateCcw, Info, AlertTriangle,
} from "lucide-react";
import { PageShell } from "./PageShell";

type MonTab      = "access" | "log";
type CodeStatus   = "available" | "redeemed" | "expired";
type CodeChannel  = "onsite" | "online";

interface GuideEntry {
  id: string; name: string; access: "free" | "paid"; status: "draft" | "published";
}

interface AccessCode {
  id: string; code: string; guideId: string; guideName: string;
  channel: CodeChannel; status: CodeStatus; issuedAt: string; redeemedAt?: string;
}

const MOCK_GUIDES: GuideEntry[] = [
  { id: "1", name: "Renaissance Masterpieces", access: "free", status: "published" },
  { id: "2", name: "Ancient Egypt Collection",  access: "paid", status: "published" },
  { id: "3", name: "Modern Art Gallery",        access: "free", status: "draft"     },
  { id: "4", name: "Sculpture Garden Tour",     access: "paid", status: "published" },
];

const ACCESS_CODES: AccessCode[] = [
  { id: "c1",  code: "X7K2M", guideId: "2", guideName: "Ancient Egypt Collection", channel: "onsite", status: "redeemed",  issuedAt: "2026-03-28", redeemedAt: "2026-04-01" },
  { id: "c2",  code: "P4N9R", guideId: "2", guideName: "Ancient Egypt Collection", channel: "onsite", status: "redeemed",  issuedAt: "2026-03-28", redeemedAt: "2026-04-02" },
  { id: "c3",  code: "T6H3W", guideId: "2", guideName: "Ancient Egypt Collection", channel: "onsite", status: "available", issuedAt: "2026-03-28" },
  { id: "c4",  code: "B8F2V", guideId: "2", guideName: "Ancient Egypt Collection", channel: "onsite", status: "available", issuedAt: "2026-03-28" },
  { id: "c5",  code: "M5K7N", guideId: "4", guideName: "Sculpture Garden Tour",    channel: "onsite", status: "redeemed",  issuedAt: "2026-03-20", redeemedAt: "2026-03-22" },
  { id: "c6",  code: "R3T9H", guideId: "4", guideName: "Sculpture Garden Tour",    channel: "onsite", status: "available", issuedAt: "2026-03-20" },
  { id: "c7",  code: "W2X8P", guideId: "2", guideName: "Ancient Egypt Collection", channel: "onsite", status: "redeemed",  issuedAt: "2026-03-15", redeemedAt: "2026-03-16" },
  { id: "c8",  code: "F9M4K", guideId: "2", guideName: "Ancient Egypt Collection", channel: "onsite", status: "available", issuedAt: "2026-03-15" },
  { id: "c9",  code: "N7B3T", guideId: "4", guideName: "Sculpture Garden Tour",    channel: "onsite", status: "available", issuedAt: "2026-04-10" },
  { id: "c10", code: "H4V6Z", guideId: "2", guideName: "Ancient Egypt Collection", channel: "online", status: "redeemed",  issuedAt: "2026-04-05", redeemedAt: "2026-04-05" },
  { id: "c11", code: "K2P8Y", guideId: "2", guideName: "Ancient Egypt Collection", channel: "online", status: "redeemed",  issuedAt: "2026-04-06", redeemedAt: "2026-04-07" },
  { id: "c12", code: "G5W3N", guideId: "2", guideName: "Ancient Egypt Collection", channel: "online", status: "available", issuedAt: "2026-04-08" },
  { id: "c13", code: "Y7R4M", guideId: "4", guideName: "Sculpture Garden Tour",    channel: "online", status: "expired",   issuedAt: "2026-02-01" },
];

const WEBHOOK_LOGS = [
  { id: "w1", time: "2026-04-08 14:32", ref: "ORD-8821", guide: "Ancient Egypt Collection", status: 200 },
  { id: "w2", time: "2026-04-07 09:15", ref: "ORD-8812", guide: "Ancient Egypt Collection", status: 200 },
  { id: "w3", time: "2026-04-06 16:44", ref: "ORD-8791", guide: "Ancient Egypt Collection", status: 200 },
  { id: "w4", time: "2026-04-05 11:22", ref: "ORD-8764", guide: "Ancient Egypt Collection", status: 422 },
  { id: "w5", time: "2026-04-05 10:58", ref: "ORD-8763", guide: "Ancient Egypt Collection", status: 200 },
];

const WEBHOOK_URL = "https://api.museoo.com/webhooks/issue-code";
const API_KEY     = "msk_live_8f2k9x4p7q3n1m6v5r8t2w9y";
const QTY_OPTIONS = [100, 500, 1000, 3000, 5000, 10000];
const ALPHABET    = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function genCode() {
  return Array.from({ length: 5 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
}

const CODE_STATUS_CFG: Record<CodeStatus, { label: string; dot: string; text: string }> = {
  available: { label: "Available", dot: "bg-emerald-400", text: "text-emerald-700" },
  redeemed:  { label: "Redeemed",  dot: "bg-zinc-400",   text: "text-zinc-500"   },
  expired:   { label: "Expired",   dot: "bg-red-400",    text: "text-red-600"    },
};

const CHANNEL_CFG: Record<CodeChannel, { label: string; text: string; bg: string }> = {
  onsite: { label: "On site", text: "text-sky-700",   bg: "bg-sky-50"   },
  online: { label: "Online",  text: "text-amber-700", bg: "bg-amber-50" },
};

function downloadCSV(codes: { code: string; guideName: string; channel: string; issuedAt: string; status: string }[], guideName: string) {
  const slug = guideName.toLowerCase().replace(/\s+/g, "-");
  const date = new Date().toISOString().split("T")[0];
  const header = "code,guide,channel,issued_at,status";
  const rows = codes.map(c => `${c.code},${c.guideName},${c.channel},${c.issuedAt},${c.status}`);
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `access-codes-${slug}-${date}.csv`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(a.href);
}

export function Monetization() {
  const [tab, setTab] = useState<MonTab>("access");

  // Guide access
  const [guides, setGuides] = useState<GuideEntry[]>(MOCK_GUIDES);
  const [editingAccess, setEditingAccess] = useState<GuideEntry | null>(null);
  const [editAccess,    setEditAccess]    = useState<"free" | "paid">("free");
  const [confirmAccessChange, setConfirmAccessChange] = useState<{ guide: GuideEntry; newAccess: "free" | "paid" } | null>(null);

  // Distribution settings per guide
  const [settingsGuide, setSettingsGuide] = useState<GuideEntry | null>(null);
  const [guideDistribution, setGuideDistribution] = useState<Record<string, "online" | "physical">>({ "2": "physical", "4": "online" });
  const [physicalQty,    setPhysicalQty]    = useState<Record<string, number>>({});
  const [physicalFormat, setPhysicalFormat] = useState<Record<string, "csv" | "json">>({});

  // Code log
  const [logFilterGuide,   setLogFilterGuide]   = useState("all");
  const [logFilterChannel, setLogFilterChannel] = useState<CodeChannel | "all">("all");
  const [logFilterStatus,  setLogFilterStatus]  = useState<CodeStatus  | "all">("all");

  const paidGuides    = guides.filter(g => g.access === "paid");
  const totalRedeemed = ACCESS_CODES.filter(c => c.status === "redeemed").length;
  const totalAvailable = ACCESS_CODES.filter(c => c.status === "available").length;

  function generatePhysicalBatch(guideId: string) {
    const guide = guides.find(g => g.id === guideId)!;
    const qty = physicalQty[guideId] ?? 500;
    const today = new Date().toISOString().split("T")[0];
    const batch = Array.from({ length: Math.min(qty, 100) }, (_, i) => ({
      id: `gen-${Date.now()}-${i}`, code: genCode(), guideId: guide.id,
      guideName: guide.name, channel: "onsite" as CodeChannel, status: "available" as CodeStatus, issuedAt: today,
    }));
    downloadCSV(batch, guide.name);
  }

  function saveEditAccess() {
    if (!editingAccess) return;
    if (editAccess !== editingAccess.access && editingAccess.status === "published") {
      setConfirmAccessChange({ guide: editingAccess, newAccess: editAccess });
      setEditingAccess(null);
    } else {
      setGuides(guides.map(g => g.id === editingAccess.id ? { ...g, access: editAccess } : g));
      setEditingAccess(null);
    }
  }

  function applyAccessChange() {
    if (!confirmAccessChange) return;
    setGuides(guides.map(g => g.id === confirmAccessChange.guide.id ? { ...g, access: confirmAccessChange.newAccess } : g));
    setConfirmAccessChange(null);
  }

  const filteredCodes  = ACCESS_CODES.filter(c => {
    if (logFilterGuide   !== "all" && c.guideId  !== logFilterGuide)   return false;
    if (logFilterChannel !== "all" && c.channel  !== logFilterChannel) return false;
    if (logFilterStatus  !== "all" && c.status   !== logFilterStatus)  return false;
    return true;
  });

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Monetization</h1>
          <p className="text-[13px] text-zinc-500">Manage access and code distribution for paid audio guides</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mb-6 px-0.5">
          <div>
            <span className="text-[22px] font-light text-zinc-900">{paidGuides.length}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Paid guides</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-emerald-600">{totalAvailable}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Available</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{totalRedeemed}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Redeemed</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 mb-6 gap-1">
          {([
            { id: "access", label: "Access & Distribution" },
            { id: "log",    label: "Log"                   },
          ] as { id: MonTab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════
            TAB 1 — Accesso & Distribuzione
        ════════════════════════════════════════ */}
        {tab === "access" && (
          <div className="space-y-4">

            {/* Guide access + distribution settings */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-3 border-b border-zinc-100 bg-zinc-50 grid grid-cols-[1fr_160px_100px]">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Audio guide</span>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Access</span>
                <span />
              </div>
              <div className="divide-y divide-zinc-100">
                {guides.map(guide => {
                  const isPaid = guide.access === "paid";
                  const distrib = guideDistribution[guide.id];
                  return (
                    <div key={guide.id} className="px-6 py-4 grid grid-cols-[1fr_160px_100px] items-center">
                      <div>
                        <p className="text-[13px] font-semibold text-zinc-900">{guide.name}</p>
                        {isPaid && distrib && (
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {distrib === "online" ? "Online sales · monthly billing" : "On-site distribution · prepaid codes"}
                          </p>
                        )}
                      </div>
                      <button onClick={() => { setEditingAccess(guide); setEditAccess(guide.access); }}
                        className="flex items-center gap-3 w-fit hover:opacity-75 transition-opacity">
                        <div className="relative flex-shrink-0 rounded-full transition-colors duration-200"
                          style={{ width: 36, height: 20, backgroundColor: isPaid ? "#18181b" : "#e4e4e7" }}>
                          <span className="absolute rounded-full transition-all duration-200"
                            style={{ width: 14, height: 14, top: 3, left: isPaid ? 19 : 3, backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }} />
                        </div>
                        <span className="text-[12px] font-medium text-zinc-500 w-7">{isPaid ? "Paid" : "Free"}</span>
                      </button>
                      <div className="flex justify-end">
                        {isPaid && (
                          <button
                            onClick={() => setSettingsGuide(guide)}
                            className="text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                          >
                            Settings →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-2 px-1">
              <Info className="size-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-zinc-400 leading-relaxed">
                Paid codes are locked to the visitor's device on first use — non-transferable. Free guides use a universal QR without device lock.
              </p>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 2 — Log
        ════════════════════════════════════════ */}
        {tab === "log" && (
          <div className="space-y-5">

            {/* Webhook log */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-semibold text-zinc-900">Webhook log</h2>
                  <p className="text-[12px] text-zinc-400 mt-0.5">Latest events received from the online endpoint</p>
                </div>
                <button className="flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors">
                  <RotateCcw className="size-3.5" />Refresh
                </button>
              </div>
              <div className="divide-y divide-zinc-100">
                {WEBHOOK_LOGS.map(log => (
                  <div key={log.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-zinc-50/50 transition-colors">
                    <span className={`size-1.5 rounded-full flex-shrink-0 ${log.status === 200 ? "bg-emerald-400" : "bg-red-400"}`} />
                    <span className={`text-[12px] font-semibold w-8 flex-shrink-0 ${log.status === 200 ? "text-emerald-600" : "text-red-600"}`}>{log.status}</span>
                    <span className="text-[12px] font-mono text-zinc-400 w-36 flex-shrink-0">{log.time}</span>
                    <span className="text-[12px] font-mono font-semibold text-zinc-700 w-24 flex-shrink-0">{log.ref}</span>
                    <span className="text-[12px] text-zinc-400 flex-1 truncate">{log.guide}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code log */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
                <h2 className="text-[14px] font-semibold text-zinc-900 flex-1">Code log</h2>
                <div className="relative">
                  <select value={logFilterGuide} onChange={e => setLogFilterGuide(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer">
                    <option value="all">All guides</option>
                    {paidGuides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={logFilterChannel} onChange={e => setLogFilterChannel(e.target.value as CodeChannel | "all")}
                    className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer">
                    <option value="all">All channels</option>
                    <option value="onsite">On site</option>
                    <option value="online">Online</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={logFilterStatus} onChange={e => setLogFilterStatus(e.target.value as CodeStatus | "all")}
                    className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer">
                    <option value="all">All statuses</option>
                    <option value="available">Available</option>
                    <option value="redeemed">Redeemed</option>
                    <option value="expired">Expired</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div className="px-6 py-2 bg-zinc-50 border-b border-zinc-100 grid grid-cols-[120px_1fr_90px_90px_110px_90px] gap-4">
                {["Code", "Audio guide", "Channel", "Issued", "Status", "Redeemed"].map(h => (
                  <span key={h} className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{h}</span>
                ))}
              </div>

              <div className="divide-y divide-zinc-100">
                {filteredCodes.length === 0 ? (
                  <div className="px-6 py-12 text-center text-[13px] text-zinc-400">No codes found</div>
                ) : filteredCodes.map(c => {
                  const s  = CODE_STATUS_CFG[c.status];
                  const ch = CHANNEL_CFG[c.channel];
                  return (
                    <div key={c.id} className="px-6 py-3.5 grid grid-cols-[120px_1fr_90px_90px_110px_90px] gap-4 items-center hover:bg-zinc-50/60 transition-colors">
                      <span className="font-mono text-[13px] font-semibold text-zinc-900 tracking-[0.18em]">{c.code}</span>
                      <span className="text-[12px] text-zinc-600 truncate">{c.guideName}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold w-fit ${ch.text} ${ch.bg}`}>{ch.label}</span>
                      <span className="text-[12px] text-zinc-500">{c.issuedAt}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                        <span className={`text-[12px] font-medium ${s.text}`}>{s.label}</span>
                      </div>
                      <span className="text-[12px] text-zinc-400">{c.redeemedAt ?? "—"}</span>
                    </div>
                  );
                })}
              </div>

              {filteredCodes.length > 0 && (
                <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50">
                  <span className="text-[11px] text-zinc-400">{filteredCodes.length} codes</span>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Distribution Settings Modal */}
      {settingsGuide && (() => {
        const guide = settingsGuide;
        const distrib = guideDistribution[guide.id];
        return (
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
                <div>
                  <h2 className="text-[15px] font-semibold text-zinc-900">Distribution settings</h2>
                  <p className="text-[12px] text-zinc-400 mt-0.5">{guide.name}</p>
                </div>
                <button onClick={() => setSettingsGuide(null)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">How do visitors get access?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Online */}
                    <button
                      onClick={() => setGuideDistribution(prev => ({ ...prev, [guide.id]: "online" }))}
                      className={`text-left p-5 rounded-xl border-2 transition-all ${distrib === "online" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="size-9 rounded-lg bg-sky-50 flex items-center justify-center">
                          <Globe className="size-4 text-sky-600" strokeWidth={1.5} />
                        </div>
                        <div className={`size-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${distrib === "online" ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"}`}>
                          {distrib === "online" && <span className="size-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[13px] font-semibold text-zinc-900 mb-1">Online sales</p>
                      <p className="text-[12px] text-zinc-500 leading-relaxed">Your payment system triggers code issuance via webhook. Billed monthly on actual accesses.</p>
                    </button>

                    {/* Physical */}
                    <button
                      onClick={() => setGuideDistribution(prev => ({ ...prev, [guide.id]: "physical" }))}
                      className={`text-left p-5 rounded-xl border-2 transition-all ${distrib === "physical" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="size-9 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Package className="size-4 text-amber-600" strokeWidth={1.5} />
                        </div>
                        <div className={`size-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${distrib === "physical" ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"}`}>
                          {distrib === "physical" && <span className="size-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[13px] font-semibold text-zinc-900 mb-1">On-site distribution</p>
                      <p className="text-[12px] text-zinc-500 leading-relaxed">Generate a prepaid batch of codes. Download as CSV or JSON and hand them out on site.</p>
                    </button>
                  </div>
                </div>

                {/* Online: webhook callout */}
                {distrib === "online" && (
                  <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-4 flex items-start gap-3">
                    <Globe className="size-4 text-sky-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="text-[13px] font-semibold text-sky-900 mb-0.5">Webhook not configured yet</p>
                      <p className="text-[12px] text-sky-700 leading-relaxed mb-2">
                        Connect your payment system to automatically issue access codes on purchase.
                      </p>
                      <Link
                        to="/connectors?highlight=webhook"
                        onClick={() => setSettingsGuide(null)}
                        className="inline-block text-[12px] font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900 transition-colors"
                      >
                        Configure webhook in Connectors →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Physical: batch generator */}
                {distrib === "physical" && (
                  <div className="border border-zinc-200 rounded-xl p-4 space-y-4">
                    <p className="text-[12px] font-semibold text-zinc-700">Generate a code batch</p>
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Quantity</label>
                        <div className="relative">
                          <select value={physicalQty[guide.id] ?? 500} onChange={e => setPhysicalQty(prev => ({ ...prev, [guide.id]: parseInt(e.target.value) }))}
                            className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900">
                            {QTY_OPTIONS.map(n => <option key={n} value={n}>{n.toLocaleString()}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Format</label>
                        <div className="flex rounded-lg border border-zinc-200 overflow-hidden">
                          {(["csv", "json"] as const).map(f => (
                            <button key={f} onClick={() => setPhysicalFormat(prev => ({ ...prev, [guide.id]: f }))}
                              className={`px-4 py-2.5 text-[12px] font-semibold transition-all ${(physicalFormat[guide.id] ?? "csv") === f ? "bg-zinc-900 text-white" : "bg-white text-zinc-500 hover:bg-zinc-50"}`}>
                              .{f}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { generatePhysicalBatch(guide.id); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all">
                      <FileDown className="size-4" />
                      Generate & download
                    </button>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50">
                <button onClick={() => setSettingsGuide(null)}
                  className="w-full py-2.5 text-[13px] font-semibold text-zinc-700 hover:text-zinc-900 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Access Modal */}
      {editingAccess && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900">Access type</h2>
                <p className="text-[12px] text-zinc-400 mt-0.5">{editingAccess.name}</p>
              </div>
              <button onClick={() => setEditingAccess(null)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {(["free", "paid"] as const).map(type => (
                  <button key={type} onClick={() => setEditAccess(type)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      editAccess === type
                        ? type === "free" ? "border-emerald-400 bg-emerald-50" : "border-amber-400 bg-amber-50"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}>
                    <div className={`size-2 rounded-full mb-2 ${type === "free" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <p className="text-[13px] font-semibold text-zinc-900 capitalize">{type}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                      {type === "free" ? "Universal QR · free access" : "Unique code per visitor · device-locked"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-6 py-5 border-t border-zinc-200 bg-zinc-50">
              <button onClick={() => setEditingAccess(null)}
                className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                Cancel
              </button>
              <button onClick={saveEditAccess}
                className="flex-1 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Change Confirmation */}
      {confirmAccessChange && (
        <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="size-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="size-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-zinc-900 mb-1">Change access on published guide</p>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">
                    <span className="font-medium text-zinc-700">{confirmAccessChange.guide.name}</span> is currently live.
                    Switching to <span className="font-semibold">{confirmAccessChange.newAccess}</span> will take effect immediately for all visitors.
                  </p>
                </div>
              </div>

              {confirmAccessChange.newAccess === "paid" ? (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 text-[12px] text-amber-800 leading-relaxed">
                  Visitors using the current universal QR will lose access. Unique codes will be required.
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-[12px] text-blue-800 leading-relaxed">
                  The guide will become freely accessible to anyone with the universal QR. Existing paid codes will stop being required.
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAccessChange(null)}
                  className="flex-1 py-2.5 border border-zinc-200 text-[13px] font-semibold text-zinc-700 rounded-xl hover:bg-zinc-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={applyAccessChange}
                  className="flex-1 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
                >
                  Yes, change it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </PageShell>
  );
}
