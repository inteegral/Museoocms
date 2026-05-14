import { useState } from "react";
import {
  QrCode, Download, Plus, Check, X, ChevronDown,
  Package, FileDown, Truck, Clock, CheckCircle2,
  Globe, Eye, EyeOff, RotateCcw, Copy, Tag, Info,
} from "lucide-react";
import { PageShell } from "./PageShell";

type MonTab      = "access" | "orders" | "log";
type DeliveryType = "digital" | "physical";
type OrderStatus  = "ready" | "ordered" | "printing" | "shipped" | "delivered";
type CodeStatus   = "available" | "redeemed" | "expired";
type CodeChannel  = "inloco" | "qr" | "online";

interface Order {
  id: string; guideName: string; date: string;
  quantity: number; redeemed: number; label: string;
  delivery: DeliveryType; status: OrderStatus;
}

interface GuideEntry {
  id: string; name: string; access: "free" | "paid";
}

interface AccessCode {
  id: string; code: string; guideId: string; guideName: string;
  channel: CodeChannel; status: CodeStatus; issuedAt: string; redeemedAt?: string;
}

const MOCK_GUIDES: GuideEntry[] = [
  { id: "1", name: "Renaissance Masterpieces", access: "free" },
  { id: "2", name: "Ancient Egypt Collection",  access: "paid" },
  { id: "3", name: "Modern Art Gallery",        access: "free" },
  { id: "4", name: "Sculpture Garden Tour",     access: "paid" },
];

const MOCK_ORDERS: Order[] = [
  { id: "o1", guideName: "Ancient Egypt Collection", date: "2026-03-28", quantity: 1000,  redeemed: 450, label: "Weekend 30 Mar",  delivery: "digital",  status: "ready"     },
  { id: "o2", guideName: "Ancient Egypt Collection", date: "2026-03-15", quantity: 5000,  redeemed: 500, label: "Spring Opening",  delivery: "physical", status: "delivered" },
  { id: "o3", guideName: "Sculpture Garden Tour",    date: "2026-03-20", quantity: 1000,  redeemed: 120, label: "Garden Season",   delivery: "physical", status: "shipped"   },
  { id: "o4", guideName: "Ancient Egypt Collection", date: "2026-02-20", quantity: 10000, redeemed: 800, label: "February Run",    delivery: "physical", status: "delivered" },
  { id: "o5", guideName: "Sculpture Garden Tour",    date: "2026-04-10", quantity: 500,   redeemed:   0, label: "School Groups",   delivery: "digital",  status: "ready"     },
  { id: "o6", guideName: "Ancient Egypt Collection", date: "2026-04-18", quantity: 3000,  redeemed:   0, label: "April Batch",     delivery: "physical", status: "printing"  },
];

const ACCESS_CODES: AccessCode[] = [
  { id: "c1",  code: "X7K2M", guideId: "2", guideName: "Ancient Egypt Collection", channel: "inloco", status: "redeemed",  issuedAt: "2026-03-28", redeemedAt: "2026-04-01" },
  { id: "c2",  code: "P4N9R", guideId: "2", guideName: "Ancient Egypt Collection", channel: "inloco", status: "redeemed",  issuedAt: "2026-03-28", redeemedAt: "2026-04-02" },
  { id: "c3",  code: "T6H3W", guideId: "2", guideName: "Ancient Egypt Collection", channel: "inloco", status: "available", issuedAt: "2026-03-28" },
  { id: "c4",  code: "B8F2V", guideId: "2", guideName: "Ancient Egypt Collection", channel: "inloco", status: "available", issuedAt: "2026-03-28" },
  { id: "c5",  code: "M5K7N", guideId: "4", guideName: "Sculpture Garden Tour",    channel: "inloco", status: "redeemed",  issuedAt: "2026-03-20", redeemedAt: "2026-03-22" },
  { id: "c6",  code: "R3T9H", guideId: "4", guideName: "Sculpture Garden Tour",    channel: "inloco", status: "available", issuedAt: "2026-03-20" },
  { id: "c7",  code: "W2X8P", guideId: "2", guideName: "Ancient Egypt Collection", channel: "qr",     status: "redeemed",  issuedAt: "2026-03-15", redeemedAt: "2026-03-16" },
  { id: "c8",  code: "F9M4K", guideId: "2", guideName: "Ancient Egypt Collection", channel: "qr",     status: "available", issuedAt: "2026-03-15" },
  { id: "c9",  code: "N7B3T", guideId: "4", guideName: "Sculpture Garden Tour",    channel: "qr",     status: "available", issuedAt: "2026-04-10" },
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

function progressPct(redeemed: number, total: number) {
  return total > 0 ? Math.round((redeemed / total) * 100) : 0;
}

const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; dot: string; text: string }> = {
  ready:     { label: "Ready",     dot: "bg-zinc-400",    text: "text-zinc-500"    },
  ordered:   { label: "Ordered",   dot: "bg-sky-400",     text: "text-sky-600"     },
  printing:  { label: "Printing",  dot: "bg-amber-400",   text: "text-amber-600"   },
  shipped:   { label: "Shipped",   dot: "bg-blue-400",    text: "text-blue-600"    },
  delivered: { label: "Delivered", dot: "bg-emerald-400", text: "text-emerald-600" },
};

const CODE_STATUS_CFG: Record<CodeStatus, { label: string; dot: string; text: string }> = {
  available: { label: "Available", dot: "bg-emerald-400", text: "text-emerald-700" },
  redeemed:  { label: "Redeemed",  dot: "bg-zinc-400",   text: "text-zinc-500"   },
  expired:   { label: "Expired",   dot: "bg-red-400",    text: "text-red-600"    },
};

const CHANNEL_CFG: Record<CodeChannel, { label: string; text: string; bg: string }> = {
  inloco: { label: "In-loco",  text: "text-sky-700",    bg: "bg-sky-50"    },
  qr:     { label: "QR print", text: "text-violet-700", bg: "bg-violet-50" },
  online: { label: "Online",   text: "text-amber-700",  bg: "bg-amber-50"  },
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

  // Distribution channels
  const [showInloco,  setShowInloco]  = useState(false);
  const [inlocoGuide, setInlocoGuide] = useState("2");
  const [inlocoQty,   setInlocoQty]   = useState(500);
  const [showQr,      setShowQr]      = useState(false);
  const [qrGuide,     setQrGuide]     = useState("2");
  const [qrQty,       setQrQty]       = useState(500);

  // Online / webhook
  const [showApiKey,    setShowApiKey]    = useState(false);
  const [emailEnabled,  setEmailEnabled]  = useState(true);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedApiKey,  setCopiedApiKey]  = useState(false);

  // Orders
  const [orders,      setOrders]      = useState<Order[]>(MOCK_ORDERS);
  const [filterOrder, setFilterOrder] = useState("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderGuide,    setOrderGuide]    = useState<GuideEntry | null>(null);
  const [orderDelivery, setOrderDelivery] = useState<DeliveryType>("digital");
  const [orderFormat,   setOrderFormat]   = useState<"csv" | "json">("csv");
  const [orderQty,      setOrderQty]      = useState(500);

  // Code log
  const [logFilterGuide,   setLogFilterGuide]   = useState("all");
  const [logFilterChannel, setLogFilterChannel] = useState<CodeChannel | "all">("all");
  const [logFilterStatus,  setLogFilterStatus]  = useState<CodeStatus  | "all">("all");

  const paidGuides   = guides.filter(g => g.access === "paid");
  const totalOrdered = paidGuides.reduce((s, g) => s + orders.filter(o => o.guideName === g.name).reduce((a, o) => a + o.quantity, 0), 0);
  const totalRedeemed = ACCESS_CODES.filter(c => c.status === "redeemed").length;
  const totalAvailable = ACCESS_CODES.filter(c => c.status === "available").length;

  function copy(text: string, which: "webhook" | "apikey") {
    navigator.clipboard.writeText(text).catch(() => {});
    if (which === "webhook") { setCopiedWebhook(true); setTimeout(() => setCopiedWebhook(false), 2000); }
    else                     { setCopiedApiKey(true);  setTimeout(() => setCopiedApiKey(false),  2000); }
  }

  function generateBatch(channel: "inloco" | "qr", guideId: string, qty: number) {
    const guide = guides.find(g => g.id === guideId)!;
    const today = new Date().toISOString().split("T")[0];
    const batch = Array.from({ length: Math.min(qty, 100) }, (_, i) => ({
      id: `gen-${Date.now()}-${i}`, code: genCode(), guideId: guide.id,
      guideName: guide.name, channel, status: "available" as CodeStatus, issuedAt: today,
    }));
    downloadCSV(batch, guide.name);
    if (channel === "inloco") setShowInloco(false);
    else setShowQr(false);
  }

  function saveEditAccess() {
    if (!editingAccess) return;
    setGuides(guides.map(g => g.id === editingAccess.id ? { ...g, access: editAccess } : g));
    setEditingAccess(null);
  }

  function handlePlaceOrder() {
    if (!orderGuide) return;
    const newOrder: Order = {
      id: `o${orders.length + 1}`, guideName: orderGuide.name,
      date: new Date().toISOString().split("T")[0], quantity: orderQty, redeemed: 0,
      label: `Order ${orders.length + 1}`, delivery: orderDelivery,
      status: orderDelivery === "digital" ? "ready" : "ordered",
    };
    setOrders([newOrder, ...orders]);
    setShowOrderModal(false);
  }

  const visibleOrders  = filterOrder === "all" ? orders : orders.filter(o => o.guideName === filterOrder);
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
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{totalOrdered.toLocaleString()}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Ordered</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 mb-6 gap-1">
          {([
            { id: "access", label: "Access & Distribution" },
            { id: "orders", label: "Orders"                },
            { id: "log",    label: "Log"                     },
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

            {/* Guide access table */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-3 border-b border-zinc-100 bg-zinc-50 grid grid-cols-[1fr_140px_120px]">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Audio guide</span>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Access</span>
                <span />
              </div>
              <div className="divide-y divide-zinc-100">
                {guides.map(guide => {
                  const isPaid = guide.access === "paid";
                  const avail  = ACCESS_CODES.filter(c => c.guideId === guide.id && c.status === "available").length;
                  return (
                    <div key={guide.id} className="px-6 py-4 grid grid-cols-[1fr_140px_120px] items-center">
                      <div>
                        <p className="text-[13px] font-semibold text-zinc-900 mb-0.5">{guide.name}</p>
                        {isPaid && <p className="text-[11px] text-zinc-400">{avail} codes available</p>}
                      </div>
                      <button onClick={() => { setEditingAccess(guide); setEditAccess(guide.access); }}
                        className="flex items-center gap-3 w-fit hover:opacity-75 transition-opacity">
                        <div className="relative flex-shrink-0 rounded-full transition-colors duration-200"
                          style={{ width: 36, height: 20, backgroundColor: isPaid ? "#a1a1aa" : "#e4e4e7" }}>
                          <span className="absolute rounded-full transition-all duration-200"
                            style={{ width: 14, height: 14, top: 3, left: isPaid ? 19 : 3, backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }} />
                        </div>
                        <span className="text-[12px] font-medium text-zinc-500 w-7">{isPaid ? "Paid" : "Free"}</span>
                      </button>
                      <div className="flex justify-end">
                        {isPaid && (
                          <button onClick={() => { setOrderGuide(guide); setOrderDelivery("digital"); setOrderQty(500); setShowOrderModal(true); }}
                            className="inline-flex items-center gap-1.5 text-zinc-500 text-[12px] font-medium hover:text-zinc-900 transition-colors">
                            <Plus className="size-3.5" />New order
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* In-loco */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-5 flex items-center gap-4">
                <div className="size-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <Tag className="size-4 text-sky-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-zinc-900">In-loco</p>
                  <p className="text-[12px] text-zinc-500">Text codes to distribute at the ticket desk, reception or in brochures</p>
                </div>
                <button onClick={() => { setShowInloco(!showInloco); setShowQr(false); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-white text-[12px] font-medium rounded-lg hover:bg-zinc-800 transition-all">
                  <Plus className="size-3.5" />Generate batch
                </button>
              </div>
              {showInloco && (
                <div className="px-6 pb-5 border-t border-zinc-100">
                  <div className="pt-4 flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Audio guide</label>
                      <div className="relative">
                        <select value={inlocoGuide} onChange={e => setInlocoGuide(e.target.value)}
                          className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900">
                          {paidGuides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Quantity</label>
                      <div className="relative">
                        <select value={inlocoQty} onChange={e => setInlocoQty(parseInt(e.target.value))}
                          className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900">
                          {QTY_OPTIONS.map(n => <option key={n} value={n}>{n.toLocaleString()}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                    <button onClick={() => generateBatch("inloco", inlocoGuide, inlocoQty)}
                      className="px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all whitespace-nowrap">
                      Generate &amp; download CSV
                    </button>
                    <button onClick={() => setShowInloco(false)} className="p-2.5 text-zinc-400 hover:text-zinc-700 transition-colors">
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-400">Alphabet: A–Z and 2–9 · excluding <span className="font-mono">0 O 1 I</span> to avoid visual ambiguity in print</p>
                </div>
              )}
            </div>

            {/* QR personali */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-5 flex items-center gap-4">
                <div className="size-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <QrCode className="size-4 text-violet-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-zinc-900">Personal QR</p>
                  <p className="text-[12px] text-zinc-500">Each code with its own scannable QR — ideal for groups, schools, events</p>
                </div>
                <button onClick={() => { setShowQr(!showQr); setShowInloco(false); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-white text-[12px] font-medium rounded-lg hover:bg-zinc-800 transition-all">
                  <Plus className="size-3.5" />Generate with QR
                </button>
              </div>
              {showQr && (
                <div className="px-6 pb-5 border-t border-zinc-100">
                  <div className="pt-4 flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Audio guide</label>
                      <div className="relative">
                        <select value={qrGuide} onChange={e => setQrGuide(e.target.value)}
                          className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900">
                          {paidGuides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Quantity</label>
                      <div className="relative">
                        <select value={qrQty} onChange={e => setQrQty(parseInt(e.target.value))}
                          className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900">
                          {QTY_OPTIONS.map(n => <option key={n} value={n}>{n.toLocaleString()}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                    <button onClick={() => generateBatch("qr", qrGuide, qrQty)}
                      className="px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all whitespace-nowrap">
                      Generate &amp; download ZIP
                    </button>
                    <button onClick={() => setShowQr(false)} className="p-2.5 text-zinc-400 hover:text-zinc-700 transition-colors">
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-400">ZIP con un PNG per ogni QR, nominato con il codice — es. <span className="font-mono">X7K2M.png</span></p>
                </div>
              )}
            </div>

            {/* Online / webhook */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-5 flex items-center gap-4">
                <div className="size-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Globe className="size-4 text-amber-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-zinc-900">Online purchase</p>
                  <p className="text-[12px] text-zinc-500">Your payment system calls the webhook · Museoo issues and sends the code by email to the visitor</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg flex-shrink-0">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[12px] text-emerald-700 font-medium">Active</span>
                </div>
              </div>
              <div className="px-6 pb-6 border-t border-zinc-100 pt-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Webhook endpoint</label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-[12px] text-zinc-700 truncate select-all">{WEBHOOK_URL}</div>
                    <button onClick={() => copy(WEBHOOK_URL, "webhook")}
                      className="px-3.5 py-2.5 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-all flex items-center gap-1.5 text-[12px] font-medium flex-shrink-0">
                      {copiedWebhook ? <><Check className="size-3.5 text-emerald-500" />Copied</> : <><Copy className="size-3.5" />Copy</>}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">API key</label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-[12px] text-zinc-700 truncate">
                      {showApiKey ? API_KEY : "msk_live_" + "•".repeat(16)}
                    </div>
                    <button onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3 py-2.5 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-all flex-shrink-0">
                      {showApiKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                    <button onClick={() => copy(API_KEY, "apikey")}
                      className="px-3.5 py-2.5 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-all flex items-center gap-1.5 text-[12px] font-medium flex-shrink-0">
                      {copiedApiKey ? <><Check className="size-3.5 text-emerald-500" />Copied</> : <><Copy className="size-3.5" />Copy</>}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3.5 px-4 bg-zinc-50 rounded-xl">
                  <div>
                    <p className="text-[13px] font-semibold text-zinc-900">Automatic email to visitor</p>
                    <p className="text-[12px] text-zinc-500 mt-0.5">Send the code as soon as the webhook is received successfully</p>
                  </div>
                  <button onClick={() => setEmailEnabled(!emailEnabled)}
                    className="relative flex-shrink-0 rounded-full transition-colors duration-200 ml-6"
                    style={{ width: 36, height: 20, backgroundColor: emailEnabled ? "#18181b" : "#e4e4e7" }}>
                    <span className="absolute rounded-full transition-all duration-200"
                      style={{ width: 14, height: 14, top: 3, left: emailEnabled ? 19 : 3, backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Device lock — inline note */}
            <div className="flex items-start gap-2.5 px-1">
              <Info className="size-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-zinc-400 leading-relaxed">
                Paid codes are locked to the visitor's device on first use — non-transferable. Free guides use a universal QR without device lock.
              </p>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 2 — Ordini
        ════════════════════════════════════════ */}
        {tab === "orders" && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-semibold text-zinc-900">Orders</h2>
                  <p className="text-[12px] text-zinc-400 mt-0.5">Digital downloads and pre-printed sticker rolls</p>
                </div>
                <div className="relative">
                  <select value={filterOrder} onChange={e => setFilterOrder(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer">
                    <option value="all">All guides</option>
                    {paidGuides.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-100 grid grid-cols-[1fr_80px_100px_110px_60px] gap-4">
                {["Order", "Qty", "Delivery", "Status", ""].map((h, i) => (
                  <span key={i} className={`text-[10px] font-semibold text-zinc-400 uppercase tracking-widest ${i === 1 ? "text-right" : ""}`}>{h}</span>
                ))}
              </div>

              <div className="divide-y divide-zinc-100">
                {visibleOrders.length === 0 ? (
                  <div className="px-6 py-10 text-center text-[13px] text-zinc-400">No orders</div>
                ) : visibleOrders.map(order => {
                  const pct = progressPct(order.redeemed, order.quantity);
                  const cfg = ORDER_STATUS_CFG[order.status];
                  return (
                    <div key={order.id} className="px-6 py-4 grid grid-cols-[1fr_80px_100px_110px_60px] gap-4 items-center hover:bg-zinc-50/50 transition-colors">
                      <div>
                        <p className="text-[13px] font-semibold text-zinc-900 mb-0.5">{order.label}</p>
                        <p className="text-[11px] text-zinc-400">{order.guideName} · {order.date}</p>
                        {order.redeemed > 0 && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="w-20 h-1 bg-zinc-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${pct === 100 ? "bg-zinc-300" : "bg-zinc-400"}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-zinc-400">{order.redeemed}/{order.quantity}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[13px] font-semibold text-zinc-700 tabular-nums text-right">{order.quantity.toLocaleString()}</span>
                      <div className="flex items-center gap-1.5">
                        {order.delivery === "digital"
                          ? <><FileDown className="size-3.5 text-zinc-400" /><span className="text-[12px] text-zinc-500">Digital</span></>
                          : <><Package className="size-3.5 text-zinc-400" /><span className="text-[12px] text-zinc-500">Physical</span></>
                        }
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className={`text-[12px] font-medium ${cfg.text}`}>{cfg.label}</span>
                      </div>
                      <div className="flex justify-end">
                        {order.delivery === "digital" && order.status === "ready" && (
                          <button className="p-1.5 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-all">
                            <Download className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 3 — Log
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
                    <option value="inloco">In-loco</option>
                    <option value="qr">QR print</option>
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
                className="flex-1 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showOrderModal && orderGuide && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900">New order</h2>
                <p className="text-[12px] text-zinc-400 mt-0.5">{orderGuide.name}</p>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-semibold text-zinc-700 mb-2">Delivery method</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { type: "digital" as DeliveryType, icon: <FileDown className="size-5 text-zinc-400" />, title: "Digital", desc: "Download CSV or JSON immediately" },
                    { type: "physical" as DeliveryType, icon: <Package className="size-5 text-zinc-400" />, title: "Physical", desc: "Pre-printed sticker roll · shipped in 5–7 days" },
                  ]).map(({ type, icon, title, desc }) => (
                    <button key={type} onClick={() => setOrderDelivery(type)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${orderDelivery === type ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white hover:border-zinc-300"}`}>
                      <div className="mb-2">{icon}</div>
                      <p className="text-[13px] font-semibold text-zinc-900">{title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-zinc-700 mb-2">Quantity</label>
                <div className="relative">
                  <select value={orderQty} onChange={e => setOrderQty(parseInt(e.target.value))}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer">
                    {[500, 1000, 3000, 5000, 10000, 50000, 100000].map(n => (
                      <option key={n} value={n}>{n.toLocaleString()} codes</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                </div>
              </div>
              {orderDelivery === "digital" ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-[12px] font-semibold text-zinc-700">Format</label>
                    <div className="flex gap-1 ml-auto">
                      {(["csv", "json"] as const).map(f => (
                        <button key={f} onClick={() => setOrderFormat(f)}
                          className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${orderFormat === f ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}>
                          .{f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 font-mono text-[10px] text-zinc-500 leading-relaxed">
                    code, guide, issued_at, status<br />
                    X7K2M, {orderGuide.name.toLowerCase().replace(/\s+/g, "-")}, {new Date().toISOString().split("T")[0]}, available
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 flex items-start gap-3">
                  <Truck className="size-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    The order will be printed and shipped as a pre-cut sticker roll within 5–7 business days. The tracking number will be sent to the account email.
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-5 border-t border-zinc-100 space-y-3">
              <button onClick={handlePlaceOrder}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-800 transition-all">
                {orderDelivery === "digital"
                  ? <><Download className="size-4" />Generate &amp; download</>
                  : <><Package className="size-4" />Confirm order</>
                }
              </button>
              <button onClick={() => setShowOrderModal(false)} className="w-full py-2 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </PageShell>
  );
}
