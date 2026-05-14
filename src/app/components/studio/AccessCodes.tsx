import { useState } from "react";
import { Tag, QrCode, Plus, Download, Check, ChevronDown, X, Printer } from "lucide-react";
import { PageShell } from "./PageShell";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function genCode(): string {
  return Array.from({ length: 5 }, () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join("");
}

type CodeStatus = "available" | "redeemed";
type CodeChannel = "inloco" | "qr";

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
  { id: "c1", code: "X7K2M", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "inloco", status: "redeemed",  issuedAt: "2026-03-28", redeemedAt: "2026-04-01" },
  { id: "c2", code: "P4N9R", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "inloco", status: "redeemed",  issuedAt: "2026-03-28", redeemedAt: "2026-04-02" },
  { id: "c3", code: "T6H3W", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "inloco", status: "available", issuedAt: "2026-03-28" },
  { id: "c4", code: "B8F2V", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "inloco", status: "available", issuedAt: "2026-03-28" },
  { id: "c5", code: "M5K7N", guideId: "g2", guideName: "Sculpture Garden Tour",    channel: "inloco", status: "redeemed",  issuedAt: "2026-03-20", redeemedAt: "2026-03-22" },
  { id: "c6", code: "R3T9H", guideId: "g2", guideName: "Sculpture Garden Tour",    channel: "inloco", status: "available", issuedAt: "2026-03-20" },
  { id: "c7", code: "W2X8P", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "qr",     status: "redeemed",  issuedAt: "2026-03-15", redeemedAt: "2026-03-16" },
  { id: "c8", code: "F9M4K", guideId: "g1", guideName: "Ancient Egypt Collection", channel: "qr",     status: "available", issuedAt: "2026-03-15" },
  { id: "c9", code: "N7B3T", guideId: "g2", guideName: "Sculpture Garden Tour",    channel: "qr",     status: "available", issuedAt: "2026-04-10" },
];

const QTY_OPTIONS = [100, 500, 1000, 3000, 5000, 10000];

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

  const [showInloco,  setShowInloco]  = useState(false);
  const [inlocoGuide, setInlocoGuide] = useState(PAID_GUIDES[0].id);
  const [inlocoQty,   setInlocoQty]   = useState(500);

  const [showQr,  setShowQr]  = useState(false);
  const [qrGuide, setQrGuide] = useState(PAID_GUIDES[0].id);
  const [qrQty,   setQrQty]   = useState(500);

  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
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

  const totalAvailable = codes.filter(c => c.status === "available").length;
  const totalRedeemed  = codes.filter(c => c.status === "redeemed").length;
  const inlocoAvail    = codes.filter(c => c.channel === "inloco" && c.status === "available").length;
  const qrAvail        = codes.filter(c => c.channel === "qr"     && c.status === "available").length;

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Access Codes</h1>
          <p className="text-[13px] text-zinc-500">Distribuisci i codici di accesso alle audioguide a pagamento — in biglietteria o come QR personali</p>
        </div>

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
            <span className="text-[22px] font-light text-zinc-900">{PAID_GUIDES.length}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Guide a pagamento</span>
          </div>
        </div>

        {/* Universal QR */}
        <div className="mb-5 bg-white border border-zinc-200 rounded-xl p-5 flex items-center gap-5" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
          <div className="size-14 bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <QrCode className="size-7 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-zinc-900 mb-0.5">QR universale di accesso</p>
            <p className="text-[12px] text-zinc-500 mb-1">Da esporre in sede. Il visitatore lo scansiona, inserisce il suo codice a 5 caratteri e accede all'audioguida.</p>
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

          {/* In-loco */}
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
                      <select value={inlocoGuide} onChange={e => setInlocoGuide(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900">
                        {PAID_GUIDES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Quantità</label>
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

          {/* QR personali */}
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
                      <select value={qrGuide} onChange={e => setQrGuide(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900">
                        {PAID_GUIDES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Quantità</label>
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
                    Genera &amp; scarica ZIP
                  </button>
                  <button onClick={() => setShowQr(false)} className="p-2.5 text-zinc-400 hover:text-zinc-700 transition-colors">
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-zinc-400">
                  ZIP con un PNG per ogni QR, nominato con il codice — es. <span className="font-mono">X7K2M.png</span>
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-zinc-900 text-white text-[13px] font-medium rounded-xl shadow-xl flex items-center gap-2.5 pointer-events-none">
          <Check className="size-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </PageShell>
  );
}
