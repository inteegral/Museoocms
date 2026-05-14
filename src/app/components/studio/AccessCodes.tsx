import { useState } from "react";
import {
  Tag, QrCode, Globe, Plus, Download, Copy, Check,
  ChevronDown, X, Eye, EyeOff, RotateCcw, Printer,
} from "lucide-react";
import { PageShell } from "./PageShell";

// Alphabet without ambiguous chars: no 0, O, 1, I
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function genCode(): string {
  return Array.from({ length: 5 }, () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join("");
}

type CodeStatus = "available" | "redeemed" | "expired";
type CodeChannel = "inloco" | "qr" | "online";

interface AccessCode {
  id: string;
  code: string;
  guideId: string;
  guideName: string;
  channel: CodeChannel;
  status: CodeStatus;
  issuedAt: string;
  redeemedAt?: string;
}

interface PaidGuide {
  id: string;
  name: string;
}

const PAID_GUIDES: PaidGuide[] = [
  { id: "g1", name: "Ancient Egypt Collection" },
  { id: "g2", name: "Sculpture Garden Tour" },
];

const INITIAL_CODES: AccessCode[] = [
  { id: "c1",  code: "X7K2M", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "inloco", status: "redeemed",  issuedAt: "2026-03-28", redeemedAt: "2026-04-01" },
  { id: "c2",  code: "P4N9R", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "inloco", status: "redeemed",  issuedAt: "2026-03-28", redeemedAt: "2026-04-02" },
  { id: "c3",  code: "T6H3W", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "inloco", status: "available", issuedAt: "2026-03-28" },
  { id: "c4",  code: "B8F2V", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "inloco", status: "available", issuedAt: "2026-03-28" },
  { id: "c5",  code: "M5K7N", guideId: "g2", guideName: "Sculpture Garden Tour",    channel: "inloco", status: "redeemed",  issuedAt: "2026-03-20", redeemedAt: "2026-03-22" },
  { id: "c6",  code: "R3T9H", guideId: "g2", guideName: "Sculpture Garden Tour",    channel: "inloco", status: "available", issuedAt: "2026-03-20" },
  { id: "c7",  code: "W2X8P", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "qr",     status: "redeemed",  issuedAt: "2026-03-15", redeemedAt: "2026-03-16" },
  { id: "c8",  code: "F9M4K", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "qr",     status: "available", issuedAt: "2026-03-15" },
  { id: "c9",  code: "N7B3T", guideId: "g2", guideName: "Sculpture Garden Tour",    channel: "qr",     status: "available", issuedAt: "2026-04-10" },
  { id: "c10", code: "H4V6Z", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "online", status: "redeemed",  issuedAt: "2026-04-05", redeemedAt: "2026-04-05" },
  { id: "c11", code: "K2P8Y", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "online", status: "redeemed",  issuedAt: "2026-04-06", redeemedAt: "2026-04-07" },
  { id: "c12", code: "G5W3N", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "online", status: "available", issuedAt: "2026-04-08" },
  { id: "c13", code: "Y7R4M", guideId: "g2", guideName: "Sculpture Garden Tour",    channel: "online", status: "expired",   issuedAt: "2026-02-01" },
];

const WEBHOOK_LOGS = [
  { id: "w1", time: "2026-04-08 14:32", ref: "ORD-8821", guide: "Ancient Egypt Collection", status: 200 },
  { id: "w2", time: "2026-04-07 09:15", ref: "ORD-8812", guide: "Ancient Egypt Collection", status: 200 },
  { id: "w3", time: "2026-04-06 16:44", ref: "ORD-8791", guide: "Ancient Egypt Collection", status: 200 },
  { id: "w4", time: "2026-04-05 11:22", ref: "ORD-8764", guide: "Ancient Egypt Collection", status: 422 },
  { id: "w5", time: "2026-04-05 10:58", ref: "ORD-8763", guide: "Ancient Egypt Collection", status: 200 },
];

const STATUS_CFG: Record<CodeStatus, { label: string; dot: string; text: string }> = {
  available: { label: "Available", dot: "bg-emerald-400", text: "text-emerald-700" },
  redeemed:  { label: "Redeemed",  dot: "bg-zinc-400",   text: "text-zinc-500"   },
  expired:   { label: "Expired",   dot: "bg-red-400",    text: "text-red-600"    },
};

const CHANNEL_CFG: Record<CodeChannel, { label: string; text: string; bg: string }> = {
  inloco: { label: "In-loco",  text: "text-sky-700",    bg: "bg-sky-50"    },
  qr:     { label: "QR print", text: "text-violet-700", bg: "bg-violet-50" },
  online: { label: "Online",   text: "text-amber-700",  bg: "bg-amber-50"  },
};

const QTY_OPTIONS = [100, 500, 1000, 3000, 5000, 10000];
const WEBHOOK_URL = "https://api.museoo.com/webhooks/issue-code";
const API_KEY     = "msk_live_8f2k9x4p7q3n1m6v5r8t2w9y";

function downloadCSV(codes: AccessCode[], guideName: string) {
  const slug = guideName.toLowerCase().replace(/\s+/g, "-");
  const date = new Date().toISOString().split("T")[0];
  const header = "code,guide,channel,issued_at,status";
  const rows = codes.map(c => `${c.code},${c.guideName},${c.channel},${c.issuedAt},${c.status}`);
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `access-codes-${slug}-${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

export function AccessCodes() {
  const [codes, setCodes] = useState<AccessCode[]>(INITIAL_CODES);

  // Filters
  const [filterGuide,   setFilterGuide]   = useState("all");
  const [filterChannel, setFilterChannel] = useState<CodeChannel | "all">("all");
  const [filterStatus,  setFilterStatus]  = useState<CodeStatus  | "all">("all");

  // In-loco generate panel
  const [showInloco,  setShowInloco]  = useState(false);
  const [inlocoGuide, setInlocoGuide] = useState(PAID_GUIDES[0].id);
  const [inlocoQty,   setInlocoQty]   = useState(500);

  // QR generate panel
  const [showQr,  setShowQr]  = useState(false);
  const [qrGuide, setQrGuide] = useState(PAID_GUIDES[0].id);
  const [qrQty,   setQrQty]   = useState(500);

  // Online / webhook
  const [showApiKey,     setShowApiKey]     = useState(false);
  const [emailEnabled,   setEmailEnabled]   = useState(true);
  const [copiedWebhook,  setCopiedWebhook]  = useState(false);
  const [copiedApiKey,   setCopiedApiKey]   = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function copy(text: string, which: "webhook" | "apikey") {
    navigator.clipboard.writeText(text).catch(() => {});
    if (which === "webhook") {
      setCopiedWebhook(true); setTimeout(() => setCopiedWebhook(false), 2000);
    } else {
      setCopiedApiKey(true);  setTimeout(() => setCopiedApiKey(false),  2000);
    }
  }

  function generateBatch(channel: CodeChannel, guideId: string, qty: number) {
    const guide = PAID_GUIDES.find(g => g.id === guideId)!;
    const today = new Date().toISOString().split("T")[0];
    const batch: AccessCode[] = Array.from({ length: Math.min(qty, 100) }, (_, i) => ({
      id:        `gen-${Date.now()}-${i}`,
      code:      genCode(),
      guideId:   guide.id,
      guideName: guide.name,
      channel,
      status:    "available" as CodeStatus,
      issuedAt:  today,
    }));
    setCodes(prev => [...batch, ...prev]);
    downloadCSV(batch, guide.name);
    showToast(`${qty.toLocaleString()} codici generati — ${guide.name}`);
    if (channel === "inloco") setShowInloco(false);
    else setShowQr(false);
  }

  const filtered = codes.filter(c => {
    if (filterGuide   !== "all" && c.guideId  !== filterGuide)   return false;
    if (filterChannel !== "all" && c.channel  !== filterChannel) return false;
    if (filterStatus  !== "all" && c.status   !== filterStatus)  return false;
    return true;
  });

  const totalAvailable = codes.filter(c => c.status === "available").length;
  const totalRedeemed  = codes.filter(c => c.status === "redeemed").length;
  const totalExpired   = codes.filter(c => c.status === "expired").length;

  const inlocoAvail = codes.filter(c => c.channel === "inloco" && c.status === "available").length;
  const qrAvail     = codes.filter(c => c.channel === "qr"     && c.status === "available").length;
  const onlineAvail = codes.filter(c => c.channel === "online" && c.status === "available").length;

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Access Codes</h1>
          <p className="text-[13px] text-zinc-500">Gestisci l'accesso alle audioguide a pagamento — codici in-loco, QR personali, vendita online</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mb-8 px-0.5">
          <div>
            <span className="text-[22px] font-light text-emerald-600">{totalAvailable}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Disponibili</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{totalRedeemed}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Riscattati</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-500">{totalExpired}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Scaduti</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{PAID_GUIDES.length}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Guide a pagamento</span>
          </div>
        </div>

        {/* Universal QR card */}
        <div className="mb-5 bg-white border border-zinc-200 rounded-xl p-5 flex items-center gap-5" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
          <div className="size-14 bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <QrCode className="size-7 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-zinc-900 mb-0.5">QR universale di accesso</p>
            <p className="text-[12px] text-zinc-500 mb-1">Da esporre in sede. Il visitatore lo scansiona, inserisce il suo codice personale a 5 caratteri e accede all'audioguida.</p>
            <p className="text-[11px] text-zinc-400 font-mono">museoo.com/enter/museo-archeologico</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-medium rounded-lg hover:bg-zinc-50 transition-all">
              <Download className="size-3.5" />Scarica QR
            </button>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-white text-[12px] font-medium rounded-lg hover:bg-zinc-800 transition-all">
              <Printer className="size-3.5" />Kit stampa
            </button>
          </div>
        </div>

        <div className="space-y-4">

          {/* ── In-loco ── */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="size-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                <Tag className="size-4 text-sky-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-zinc-900">In-loco</p>
                <p className="text-[12px] text-zinc-500">Codici testuali da distribuire in biglietteria, al desk o nelle brochure</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="text-[15px] font-semibold text-zinc-900">{inlocoAvail}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">disponibili</p>
                </div>
                <button
                  onClick={() => { setShowInloco(!showInloco); setShowQr(false); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-white text-[12px] font-medium rounded-lg hover:bg-zinc-800 transition-all"
                >
                  <Plus className="size-3.5" />Genera batch
                </button>
              </div>
            </div>

            {showInloco && (
              <div className="px-6 pb-5 border-t border-zinc-100">
                <div className="pt-4 flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Audio guide</label>
                    <div className="relative">
                      <select
                        value={inlocoGuide}
                        onChange={e => setInlocoGuide(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      >
                        {PAID_GUIDES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Quantità</label>
                    <div className="relative">
                      <select
                        value={inlocoQty}
                        onChange={e => setInlocoQty(parseInt(e.target.value))}
                        className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      >
                        {QTY_OPTIONS.map(n => <option key={n} value={n}>{n.toLocaleString()}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  <button
                    onClick={() => generateBatch("inloco", inlocoGuide, inlocoQty)}
                    className="px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all whitespace-nowrap"
                  >
                    Genera &amp; scarica CSV
                  </button>
                  <button onClick={() => setShowInloco(false)} className="p-2.5 text-zinc-400 hover:text-zinc-700 transition-colors">
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-zinc-400">
                  Alfabeto: A–Z e 2–9 · esclusi <span className="font-mono">0 O 1 I</span> per evitare ambiguità visiva su stampa
                </p>
              </div>
            )}
          </div>

          {/* ── QR personali ── */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="size-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                <QrCode className="size-4 text-violet-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-zinc-900">QR personali</p>
                <p className="text-[12px] text-zinc-500">Ogni codice include il suo QR scannerizzabile — ideale per gruppi, scolaresche, eventi</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="text-[15px] font-semibold text-zinc-900">{qrAvail}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">disponibili</p>
                </div>
                <button
                  onClick={() => { setShowQr(!showQr); setShowInloco(false); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-white text-[12px] font-medium rounded-lg hover:bg-zinc-800 transition-all"
                >
                  <Plus className="size-3.5" />Genera con QR
                </button>
              </div>
            </div>

            {showQr && (
              <div className="px-6 pb-5 border-t border-zinc-100">
                <div className="pt-4 flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Audio guide</label>
                    <div className="relative">
                      <select
                        value={qrGuide}
                        onChange={e => setQrGuide(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      >
                        {PAID_GUIDES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Quantità</label>
                    <div className="relative">
                      <select
                        value={qrQty}
                        onChange={e => setQrQty(parseInt(e.target.value))}
                        className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      >
                        {QTY_OPTIONS.map(n => <option key={n} value={n}>{n.toLocaleString()}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  <button
                    onClick={() => generateBatch("qr", qrGuide, qrQty)}
                    className="px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all whitespace-nowrap"
                  >
                    Genera &amp; scarica ZIP
                  </button>
                  <button onClick={() => setShowQr(false)} className="p-2.5 text-zinc-400 hover:text-zinc-700 transition-colors">
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-zinc-400">
                  Il pacchetto ZIP contiene un PNG per ogni QR, nominato con il codice — es. <span className="font-mono">X7K2M.png</span>
                </p>
              </div>
            )}
          </div>

          {/* ── Acquisto online ── */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="size-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Globe className="size-4 text-amber-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-zinc-900">Acquisto online</p>
                <p className="text-[12px] text-zinc-500">Il tuo sistema di pagamento chiama il webhook · Museoo emette il codice e lo invia via email al visitatore</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[15px] font-semibold text-zinc-900">{onlineAvail}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">disponibili</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[12px] text-emerald-700 font-medium">Attivo</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 border-t border-zinc-100 pt-5 space-y-4">

              {/* Webhook URL */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Webhook endpoint</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-[12px] text-zinc-700 truncate select-all">
                    {WEBHOOK_URL}
                  </div>
                  <button
                    onClick={() => copy(WEBHOOK_URL, "webhook")}
                    className="px-3.5 py-2.5 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-all flex items-center gap-1.5 text-[12px] font-medium flex-shrink-0"
                  >
                    {copiedWebhook
                      ? <><Check className="size-3.5 text-emerald-500" />Copiato</>
                      : <><Copy className="size-3.5" />Copia</>
                    }
                  </button>
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">API key</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-[12px] text-zinc-700 truncate">
                    {showApiKey ? API_KEY : "msk_live_" + "•".repeat(16)}
                  </div>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="px-3 py-2.5 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-all flex-shrink-0"
                    title={showApiKey ? "Nascondi" : "Mostra"}
                  >
                    {showApiKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                  <button
                    onClick={() => copy(API_KEY, "apikey")}
                    className="px-3.5 py-2.5 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-all flex items-center gap-1.5 text-[12px] font-medium flex-shrink-0"
                  >
                    {copiedApiKey
                      ? <><Check className="size-3.5 text-emerald-500" />Copiato</>
                      : <><Copy className="size-3.5" />Copia</>
                    }
                  </button>
                </div>
              </div>

              {/* Email toggle */}
              <div className="flex items-center justify-between py-3.5 px-4 bg-zinc-50 rounded-xl">
                <div>
                  <p className="text-[13px] font-semibold text-zinc-900">Email automatica al visitatore</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">Invia il codice via email non appena il webhook viene ricevuto correttamente</p>
                </div>
                <button
                  onClick={() => setEmailEnabled(!emailEnabled)}
                  className="relative flex-shrink-0 rounded-full transition-colors duration-200 ml-6"
                  style={{ width: 36, height: 20, backgroundColor: emailEnabled ? "#18181b" : "#e4e4e7" }}
                >
                  <span
                    className="absolute rounded-full transition-all duration-200"
                    style={{ width: 14, height: 14, top: 3, left: emailEnabled ? 19 : 3, backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }}
                  />
                </button>
              </div>

              {/* Webhook log */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-semibold text-zinc-700">Ultimi eventi webhook</p>
                  <button className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors">
                    <RotateCcw className="size-3" />Aggiorna
                  </button>
                </div>
                <div className="space-y-1.5">
                  {WEBHOOK_LOGS.map(log => (
                    <div key={log.id} className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 rounded-lg">
                      <span className={`size-1.5 rounded-full flex-shrink-0 ${log.status === 200 ? "bg-emerald-400" : "bg-red-400"}`} />
                      <span className={`text-[11px] font-semibold w-8 flex-shrink-0 ${log.status === 200 ? "text-emerald-600" : "text-red-600"}`}>{log.status}</span>
                      <span className="text-[11px] font-mono text-zinc-400 w-36 flex-shrink-0">{log.time}</span>
                      <span className="text-[11px] font-mono font-semibold text-zinc-700 w-24 flex-shrink-0">{log.ref}</span>
                      <span className="text-[11px] text-zinc-400 flex-1 truncate">{log.guide}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── Code log table ── */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
              <h2 className="text-[14px] font-semibold text-zinc-900 flex-1">Log codici</h2>
              <div className="relative">
                <select
                  value={filterGuide}
                  onChange={e => setFilterGuide(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                >
                  <option value="all">Tutte le guide</option>
                  {PAID_GUIDES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterChannel}
                  onChange={e => setFilterChannel(e.target.value as CodeChannel | "all")}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                >
                  <option value="all">Tutti i canali</option>
                  <option value="inloco">In-loco</option>
                  <option value="qr">QR print</option>
                  <option value="online">Online</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as CodeStatus | "all")}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                >
                  <option value="all">Tutti gli stati</option>
                  <option value="available">Available</option>
                  <option value="redeemed">Redeemed</option>
                  <option value="expired">Expired</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            <div className="px-6 py-2 bg-zinc-50 border-b border-zinc-100 grid grid-cols-[120px_1fr_90px_90px_110px_90px] gap-4">
              {["Codice", "Audio guide", "Canale", "Emesso", "Stato", "Riscattato"].map(h => (
                <span key={h} className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{h}</span>
              ))}
            </div>

            <div className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <div className="px-6 py-12 text-center text-[13px] text-zinc-400">Nessun codice trovato</div>
              ) : filtered.map(c => {
                const s = STATUS_CFG[c.status];
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

            {filtered.length > 0 && (
              <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50">
                <span className="text-[11px] text-zinc-400">{filtered.length} codici</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-zinc-900 text-white text-[13px] font-medium rounded-xl shadow-xl flex items-center gap-2.5 pointer-events-none">
          <Check className="size-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </PageShell>
  );
}
