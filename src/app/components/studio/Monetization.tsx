import { useState } from "react";
import {
  Smartphone, QrCode, Download, Plus, Check, X, ChevronDown,
  Package, FileDown, Truck, Clock, CheckCircle2,
} from "lucide-react";
import { PageShell } from "./PageShell";

type DeliveryType = "digital" | "physical";
type OrderStatus = "ready" | "ordered" | "printing" | "shipped" | "delivered";

interface Order {
  id: string;
  guideName: string;
  date: string;
  quantity: number;
  redeemed: number;
  label: string;
  delivery: DeliveryType;
  status: OrderStatus;
}

interface GuideEntry {
  id: string;
  name: string;
  access: "free" | "paid";
}

const mockGuides: GuideEntry[] = [
  { id: "1", name: "Renaissance Masterpieces", access: "free" },
  { id: "2", name: "Ancient Egypt Collection",  access: "paid" },
  { id: "3", name: "Modern Art Gallery",        access: "free" },
  { id: "4", name: "Sculpture Garden Tour",     access: "paid" },
];

const mockOrders: Order[] = [
  { id: "o1", guideName: "Ancient Egypt Collection", date: "2026-03-28", quantity: 1000,  redeemed: 450, label: "Weekend 30 Mar",  delivery: "digital",  status: "ready"     },
  { id: "o2", guideName: "Ancient Egypt Collection", date: "2026-03-15", quantity: 5000,  redeemed: 500, label: "Spring Opening",  delivery: "physical", status: "delivered" },
  { id: "o3", guideName: "Sculpture Garden Tour",    date: "2026-03-20", quantity: 1000,  redeemed: 120, label: "Garden Season",   delivery: "physical", status: "shipped"   },
  { id: "o4", guideName: "Ancient Egypt Collection", date: "2026-02-20", quantity: 10000, redeemed: 800, label: "February Run",    delivery: "physical", status: "delivered" },
  { id: "o5", guideName: "Sculpture Garden Tour",    date: "2026-04-10", quantity: 500,   redeemed:   0, label: "School Groups",   delivery: "digital",  status: "ready"     },
  { id: "o6", guideName: "Ancient Egypt Collection", date: "2026-04-18", quantity: 3000,  redeemed:   0, label: "April Batch",     delivery: "physical", status: "printing"  },
];

function progressPct(redeemed: number, total: number) {
  return total > 0 ? Math.round((redeemed / total) * 100) : 0;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; dot: string; text: string; icon: React.ReactNode }> = {
  ready:     { label: "Ready",     dot: "bg-zinc-400",   text: "text-zinc-500",   icon: <FileDown className="size-3.5" /> },
  ordered:   { label: "Ordered",   dot: "bg-sky-400",    text: "text-sky-600",    icon: <Clock className="size-3.5" /> },
  printing:  { label: "Printing",  dot: "bg-amber-400",  text: "text-amber-600",  icon: <Clock className="size-3.5" /> },
  shipped:   { label: "Shipped",   dot: "bg-blue-400",   text: "text-blue-600",   icon: <Truck className="size-3.5" /> },
  delivered: { label: "Delivered", dot: "bg-emerald-400", text: "text-emerald-600", icon: <CheckCircle2 className="size-3.5" /> },
};

function generateQRCodes(count: number, guide: GuideEntry) {
  return Array.from({ length: count }, () => ({
    qr_code: `QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    audioguide_id: guide.name.toLowerCase().replace(/\s+/g, "-"),
    audioguide_name: guide.name,
    created_at: new Date().toISOString(),
    status: "available",
  }));
}

function downloadFile(codes: ReturnType<typeof generateQRCodes>, guide: GuideEntry, format: "csv" | "json") {
  const slug = guide.name.toLowerCase().replace(/\s+/g, "-");
  const date = new Date().toISOString().split("T")[0];
  let content: string;
  let mime: string;
  let ext: string;
  if (format === "json") {
    content = JSON.stringify(codes, null, 2);
    mime = "application/json";
    ext = "json";
  } else {
    const headers = ["qr_code", "audioguide_id", "audioguide_name", "created_at", "status"] as const;
    content = [headers.join(","), ...codes.map(c => headers.map(h => c[h]).join(","))].join("\n");
    mime = "text/csv";
    ext = "csv";
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qr-order-${slug}-${date}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function Monetization() {
  const [guides, setGuides] = useState<GuideEntry[]>(mockGuides);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filterGuide, setFilterGuide] = useState<string>("all");

  // New order modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderGuide, setOrderGuide] = useState<GuideEntry | null>(null);
  const [orderDelivery, setOrderDelivery] = useState<DeliveryType>("digital");
  const [orderFormat, setOrderFormat] = useState<"csv" | "json">("csv");
  const [orderQty, setOrderQty] = useState<number>(500);

  // Edit access modal
  const [editingAccess, setEditingAccess] = useState<GuideEntry | null>(null);
  const [editAccess, setEditAccess] = useState<"free" | "paid">("free");

  const paidGuides = guides.filter(g => g.access === "paid");

  const openOrderModal = (guide: GuideEntry) => {
    setOrderGuide(guide);
    setOrderDelivery("digital");
    setOrderQty(500);
    setShowOrderModal(true);
  };

  const openEditAccess = (guide: GuideEntry) => {
    setEditingAccess(guide);
    setEditAccess(guide.access);
  };

  const saveEditAccess = () => {
    if (!editingAccess) return;
    setGuides(guides.map(g => g.id === editingAccess.id ? { ...g, access: editAccess } : g));
    setEditingAccess(null);
  };

  const handlePlaceOrder = () => {
    if (!orderGuide) return;
    const count = orderQty;
    if (orderDelivery === "digital") {
      const codes = generateQRCodes(count, orderGuide);
      downloadFile(codes, orderGuide, orderFormat);
    }
    const newOrder: Order = {
      id: `o${orders.length + 1}`,
      guideName: orderGuide.name,
      date: new Date().toISOString().split("T")[0],
      quantity: count,
      redeemed: 0,
      label: `Order ${orders.length + 1}`,
      delivery: orderDelivery,
      status: orderDelivery === "digital" ? "ready" : "ordered",
    };
    setOrders([newOrder, ...orders]);
    setShowOrderModal(false);
  };

  const visibleOrders = filterGuide === "all" ? orders : orders.filter(o => o.guideName === filterGuide);
  const totalCodes   = paidGuides.reduce((s, g) => s + orders.filter(o => o.guideName === g.name).reduce((a, o) => a + o.quantity, 0), 0);
  const totalRedeemed = paidGuides.reduce((s, g) => s + orders.filter(o => o.guideName === g.name).reduce((a, o) => a + o.redeemed, 0), 0);

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Monetization</h1>
          <p className="text-[13px] text-zinc-500">Manage free and paid access · order and distribute visitor QR codes</p>
        </div>

        {/* Inline stats */}
        <div className="flex items-center gap-8 mb-8 px-0.5">
          <div>
            <span className="text-[22px] font-light text-zinc-900">{paidGuides.length}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Paid Guides</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{totalCodes.toLocaleString()}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Codes Ordered</span>
          </div>
          <div className="w-px h-5 bg-zinc-200" />
          <div>
            <span className="text-[22px] font-light text-zinc-900">{totalRedeemed.toLocaleString()}</span>
            <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Redeemed</span>
          </div>
        </div>

        <div className="space-y-5">

          {/* Guide access table */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
            <div className="px-6 py-3 border-b border-zinc-100 bg-zinc-50 grid grid-cols-[1fr_140px_120px] items-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Audio Guide</span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Access</span>
              <span />
            </div>
            <div className="divide-y divide-zinc-100">
              {guides.map((guide) => {
                const gOrders = orders.filter(o => o.guideName === guide.name);
                const genTotal = gOrders.reduce((s, o) => s + o.quantity, 0);
                const redTotal = gOrders.reduce((s, o) => s + o.redeemed, 0);
                const isPaid = guide.access === "paid";
                return (
                  <div key={guide.id} className="px-6 py-4 grid grid-cols-[1fr_140px_120px] items-center">
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-900 mb-0.5">{guide.name}</p>
                      {isPaid && (
                        <p className="text-[11px] text-zinc-400">{genTotal} ordered · {redTotal} redeemed</p>
                      )}
                    </div>
                    <button
                      onClick={() => openEditAccess(guide)}
                      className="flex items-center gap-3 w-fit hover:opacity-75 transition-opacity"
                    >
                      <div
                        className="relative flex-shrink-0 rounded-full transition-colors duration-200"
                        style={{ width: 36, height: 20, backgroundColor: isPaid ? "#a1a1aa" : "#e4e4e7" }}
                      >
                        <span
                          className="absolute rounded-full transition-all duration-200"
                          style={{ width: 14, height: 14, top: 3, left: isPaid ? 19 : 3, backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }}
                        />
                      </div>
                      <span className="text-[12px] font-medium text-zinc-500 w-7">
                        {isPaid ? "Paid" : "Free"}
                      </span>
                    </button>
                    <div className="flex justify-end">
                      {!isPaid ? (
                        <button className="inline-flex items-center gap-1.5 text-zinc-400 text-[12px] font-medium hover:text-zinc-700 transition-colors">
                          <QrCode className="size-3.5" /><span>Download QR</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openOrderModal(guide)}
                          className="inline-flex items-center gap-1.5 text-zinc-500 text-[12px] font-medium hover:text-zinc-900 transition-colors"
                        >
                          <Plus className="size-3.5" /><span>New Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-semibold text-zinc-900">Orders</h2>
                <p className="text-[12px] text-zinc-400 mt-0.5">Digital downloads and physical sticker rolls</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={filterGuide}
                    onChange={(e) => setFilterGuide(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                  >
                    <option value="all">All guides</option>
                    {paidGuides.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-100 grid grid-cols-[1fr_80px_100px_100px_80px] gap-4 items-center">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Order</span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest text-right">Qty</span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Delivery</span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Status</span>
              <span />
            </div>

            <div className="divide-y divide-zinc-100">
              {visibleOrders.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-[13px] text-zinc-400">No orders found</p>
                </div>
              ) : visibleOrders.map((order) => {
                const pct = progressPct(order.redeemed, order.quantity);
                const cfg = STATUS_CONFIG[order.status];
                return (
                  <div key={order.id} className="px-6 py-4 grid grid-cols-[1fr_80px_100px_100px_80px] gap-4 items-center hover:bg-zinc-50/50 transition-colors">
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-900 mb-0.5">{order.label}</p>
                      <p className="text-[11px] text-zinc-400">{order.guideName} · {order.date}</p>
                      {order.redeemed > 0 && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="w-20 h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct === 100 ? "bg-zinc-300" : "bg-zinc-400"}`}
                              style={{ width: `${pct}%` }}
                            />
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

          {/* Device lock info */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="size-4 text-zinc-400" strokeWidth={1.5} />
              <h3 className="text-[13px] font-semibold text-zinc-700">Device Lock</h3>
            </div>
            <div className="space-y-2">
              {[
                "Each paid QR locks to the visitor's device on first scan — non-transferable",
                "Works offline after first load (fingerprint stored locally)",
                "Free guides use a single universal QR — no locking",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2 text-[12px] text-zinc-500">
                  <Check className="size-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* New Order Modal */}
      {showOrderModal && orderGuide && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900">New Order</h2>
                <p className="text-[12px] text-zinc-400 mt-0.5">{orderGuide.name}</p>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Delivery type */}
              <div>
                <label className="block text-[12px] font-semibold text-zinc-700 mb-2">Delivery method</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { type: "digital" as DeliveryType, icon: <FileDown className="size-5 text-zinc-400" />, title: "Digital", desc: "Download CSV or JSON immediately" },
                    { type: "physical" as DeliveryType, icon: <Package className="size-5 text-zinc-400" />, title: "Physical", desc: "Pre-printed sticker roll · shipped in 5–7 days" },
                  ]).map(({ type, icon, title, desc }) => (
                    <button
                      key={type}
                      onClick={() => setOrderDelivery(type)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        orderDelivery === type ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="mb-2">{icon}</div>
                      <p className="text-[13px] font-semibold text-zinc-900">{title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[12px] font-semibold text-zinc-700 mb-2">Quantity</label>
                <div className="relative">
                  <select
                    value={orderQty}
                    onChange={(e) => setOrderQty(parseInt(e.target.value))}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                  >
                    {[500, 1000, 3000, 5000, 10000, 50000, 100000].map((n) => (
                      <option key={n} value={n}>{n.toLocaleString()} codes</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Contextual panel */}
              {orderDelivery === "digital" ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-[12px] font-semibold text-zinc-700">Format</label>
                    <div className="flex gap-1 ml-auto">
                      {(["csv", "json"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setOrderFormat(f)}
                          className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                            orderFormat === f ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                          }`}
                        >
                          .{f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 font-mono text-[10px] text-zinc-500 leading-relaxed">
                    qr_code, audioguide_id, created_at, status<br />
                    QR-ABC123, {orderGuide.name.toLowerCase().replace(/\s+/g, "-")}, {new Date().toISOString().split("T")[0]}, available<br />
                    QR-XYZ789, …
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 flex items-start gap-3">
                  <Truck className="size-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] font-semibold text-zinc-700 mb-1">Fulfillment process</p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Your order will be printed and shipped as a pre-cut sticker roll within 5–7 business days. A tracking number will be sent to your account email.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-zinc-100 space-y-3">
              <button
                onClick={handlePlaceOrder}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-800 transition-all"
              >
                {orderDelivery === "digital"
                  ? <><Download className="size-4" />Generate & Download</>
                  : <><Package className="size-4" />Place Order</>
                }
              </button>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-full py-2 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Access Modal */}
      {editingAccess && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900">Access Type</h2>
                <p className="text-[12px] text-zinc-400 mt-0.5">{editingAccess.name}</p>
              </div>
              <button onClick={() => setEditingAccess(null)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {(["free", "paid"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setEditAccess(type)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      editAccess === type
                        ? type === "free" ? "border-emerald-400 bg-emerald-50" : "border-amber-400 bg-amber-50"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <div className={`size-2 rounded-full mb-2 ${type === "free" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <p className="text-[13px] font-semibold text-zinc-900 capitalize">{type}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                      {type === "free" ? "Universal QR · no payment" : "Unique QR per visitor · device-locked"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-6 py-5 border-t border-zinc-200 bg-zinc-50">
              <button onClick={() => setEditingAccess(null)} className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                Cancel
              </button>
              <button onClick={saveEditAccess} className="flex-1 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </PageShell>
  );
}
