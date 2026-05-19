import {
  QrCode,
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Copy,
  ExternalLink,
  Check,
  X,
  ChevronRight,
  LayoutTemplate,
} from "lucide-react";

import { useState } from "react";
import { PageShell } from "./PageShell";
import { GuidePreviewModal } from "./GuidePreviewModal";
import { RedemptionPagePreviewModal } from "./RedemptionPagePreviewModal";
import { RedemptionPageEditModal } from "./RedemptionPageEditModal";

interface Widget {
  id: string;
  guideName: string;
  status: "active" | "inactive";
  impressions: number;
  clicks: number;
  thumbnail: string;
}

interface QRCodeItem {
  id: string;
  name: string;
  guideName: string;
  targetType: "guide" | "poi" | "landing";
  scans: number;
  style: "standard" | "branded" | "rounded";
  createdAt: string;
}

interface Asset {
  id: string;
  name: string;
  type: "poster-a4" | "poster-a3" | "flyer" | "banner" | "tentcard" | "mapinsert" | "plaque";
  guideName: string;
  format: string;
  createdAt: string;
}

const guideConfig: Record<string, { abbr: string; access: "free" | "paid" }> = {
  "Renaissance Masterpieces":  { abbr: "REN", access: "free" },
  "Ancient Egypt Collection":  { abbr: "EGY", access: "paid" },
  "Modern Art Gallery":        { abbr: "MOD", access: "free" },
  "Sculpture Garden Tour":     { abbr: "SCU", access: "paid" },
};

function getAbbr(name: string) {
  return guideConfig[name]?.abbr ?? name.slice(0, 3).toUpperCase();
}

function getAccess(name: string): "free" | "paid" {
  return guideConfig[name]?.access ?? "free";
}

const allGuideNames = [
  "Renaissance Masterpieces",
  "Ancient Egypt Collection",
  "Modern Art Gallery",
  "Sculpture Garden Tour",
];

const mockWidgets: Widget[] = [
  { id: "1", guideName: "Renaissance Masterpieces", status: "active",   impressions: 1234, clicks: 456, thumbnail: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400" },
  { id: "2", guideName: "Ancient Egypt Collection",  status: "active",   impressions: 892,  clicks: 267, thumbnail: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400" },
  { id: "3", guideName: "Modern Art Gallery",        status: "inactive", impressions: 0,    clicks: 0,   thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400" },
];

const mockQRCodes: QRCodeItem[] = [
  { id: "1", name: "Renaissance - Main QR",  guideName: "Renaissance Masterpieces", targetType: "guide",   scans: 456, style: "branded",   createdAt: "2024-03-15" },
  { id: "2", name: "Egypt - Entrance",        guideName: "Ancient Egypt Collection",  targetType: "landing", scans: 267, style: "standard",  createdAt: "2024-03-10" },
  { id: "3", name: "POI - Botticelli Venus",  guideName: "Renaissance Masterpieces", targetType: "poi",     scans: 89,  style: "rounded",   createdAt: "2024-03-20" },
];

const mockAssets: Asset[] = [
  { id: "1", name: "Renaissance Poster A3",    type: "poster-a3", guideName: "Renaissance Masterpieces", format: "PDF", createdAt: "2024-03-15" },
  { id: "2", name: "Egypt Flyer A5",           type: "flyer",     guideName: "Ancient Egypt Collection",  format: "PDF", createdAt: "2024-03-12" },
  { id: "3", name: "Museum Entrance Banner",   type: "banner",    guideName: "Renaissance Masterpieces", format: "PDF", createdAt: "2024-03-08" },
];

const TOOLS = [
  { key: "widget", label: "Embed Widget", Icon: LayoutTemplate },
  { key: "qr",     label: "QR Code",     Icon: QrCode         },
  { key: "assets", label: "Print Assets", Icon: FileText       },
] as const;

type ToolKey = typeof TOOLS[number]["key"];

function StatusPill({ children, variant }: { children: React.ReactNode; variant: "live" | "draft" | "none" | "count" }) {
  const styles = {
    live:  "bg-emerald-50 text-emerald-700",
    draft: "bg-zinc-100 text-zinc-500",
    none:  "text-zinc-300",
    count: "bg-zinc-100 text-zinc-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${styles[variant]}`}>
      {variant === "live" && <span className="size-1.5 rounded-full bg-emerald-400" />}
      {children}
    </span>
  );
}

export function Marketing() {
  const [selectedGuide, setSelectedGuide] = useState<string>("all");
  const [activeTool, setActiveTool] = useState<ToolKey>("landing");
  const [widgets, setWidgets] = useState<Widget[]>(mockWidgets);
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>(mockQRCodes);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [showCreateQR, setShowCreateQR] = useState(false);
  const [showCreateAsset, setShowCreateAsset] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [widgetStyle, setWidgetStyle] = useState<"compact" | "showcase" | "button">("compact");
  const [previewGuide, setPreviewGuide] = useState<string | null>(null);
  const [showRedemptionPreview, setShowRedemptionPreview] = useState(false);
  const [showRedemptionEdit, setShowRedemptionEdit] = useState(false);
  const [redemptionContent, setRedemptionContent] = useState({ title: selectedGuide, description: "Enter the code from your ticket to access the audio guide.", buttonText: "Access guide →" });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "poster-a4": "Poster A4", "poster-a3": "Poster A3",
      flyer: "Flyer A5", banner: "Banner", tentcard: "Tent Card",
      mapinsert: "Map Insert", plaque: "POI Plaque",
    };
    return labels[type] || type;
  };

  const filteredWidgets = selectedGuide === "all" ? widgets : widgets.filter(w => w.guideName === selectedGuide);
  const filteredQR      = selectedGuide === "all" ? qrCodes : qrCodes.filter(q => q.guideName === selectedGuide);
  const filteredAssets  = selectedGuide === "all" ? assets  : assets.filter(a => a.guideName === selectedGuide);
  const isPaid          = selectedGuide !== "all" && getAccess(selectedGuide) === "paid";
  const redemptionSlug  = selectedGuide !== "all" ? selectedGuide.toLowerCase().replace(/ /g, "-") : "";
  const redemptionUrl   = `museodarte.app/${redemptionSlug}`;
  const guideWidget     = selectedGuide !== "all" ? widgets.find(w => w.guideName === selectedGuide) : undefined;

  const guideMarketing = (name: string) => {
    const widget = widgets.find(w => w.guideName === name);
    const qrs    = qrCodes.filter(q => q.guideName === name);
    const ast    = assets.filter(a => a.guideName === name);
    return { widget, qrs, ast };
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Marketing</h1>
          <p className="text-[13px] text-zinc-500">Promote and distribute your audio guides</p>
        </div>

        {/* Guide selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[{ name: "all", label: "All guides" }, ...allGuideNames.map(n => ({ name: n, label: getAbbr(n) }))].map(({ name, label }) => {
            const selected = selectedGuide === name;
            return (
              <button
                key={name}
                onClick={() => { setSelectedGuide(name); if (name !== "all") setActiveTool("widget"); }}
                className={`px-3.5 py-2 rounded-lg border text-[12px] font-semibold transition-all ${
                  selected ? "bg-zinc-900 border-zinc-900 text-white" : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW MODE — all guides */}
        {selectedGuide === "all" && (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-0 border-b border-zinc-100 bg-zinc-50">
              <div className="px-5 py-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Audio Guide</div>
              {TOOLS.map(({ key, label, Icon }) => (
                <div key={key} className="px-4 py-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Icon className="size-3 text-zinc-400" strokeWidth={1.5} />
                  {label}
                </div>
              ))}
            </div>

            {/* Guide rows */}
            {allGuideNames.map((name, i) => {
              const { widget, qrs, ast } = guideMarketing(name);
              const isLast = i === allGuideNames.length - 1;
              return (
                <div
                  key={name}
                  onClick={() => setSelectedGuide(name)}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-0 hover:bg-zinc-50/70 cursor-pointer transition-colors group ${!isLast ? "border-b border-zinc-100" : ""}`}
                >
                  {/* Guide name */}
                  <div className="px-5 py-4 flex items-center gap-3">
                    <span className="size-7 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{getAbbr(name)}</span>
                    <span className="text-[13px] font-medium text-zinc-800 truncate">{name}</span>
                    <div className="flex items-center gap-1.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewGuide(name); }}
                        className="size-6 flex items-center justify-center rounded-md hover:bg-zinc-200 transition-colors"
                        title="Preview visitor experience"
                      >
                        <Eye className="size-3.5 text-zinc-500" />
                      </button>
                      <ChevronRight className="size-3.5 text-zinc-300" />
                    </div>
                  </div>

                  {/* Widget */}
                  <div className="px-4 py-4 flex items-center">
                    {widget ? (
                      <StatusPill variant={widget.status === "active" ? "live" : "draft"}>
                        {widget.status === "active" ? "Embedded" : "Inactive"}
                      </StatusPill>
                    ) : (
                      <span className="text-[12px] text-zinc-300">—</span>
                    )}
                  </div>

                  {/* QR Codes */}
                  <div className="px-4 py-4 flex items-center">
                    {getAccess(name) === "paid" ? (
                      <StatusPill variant="count">Unique / paid</StatusPill>
                    ) : qrs.length > 0 ? (
                      <StatusPill variant="count">{qrs.length} {qrs.length === 1 ? "code" : "codes"}</StatusPill>
                    ) : (
                      <span className="text-[12px] text-zinc-300">—</span>
                    )}
                  </div>

                  {/* Print Assets */}
                  <div className="px-4 py-4 flex items-center">
                    {ast.length > 0 ? (
                      <StatusPill variant="count">{ast.length} {ast.length === 1 ? "asset" : "assets"}</StatusPill>
                    ) : (
                      <span className="text-[12px] text-zinc-300">—</span>
                    )}
                  </div>

                  {/* Distribution */}
                  <div className="px-4 py-4 flex items-center">
                    {(qrs.length > 0 || widget?.status === "active") ? (
                      <StatusPill variant="live">Active</StatusPill>
                    ) : (
                      <span className="text-[12px] text-zinc-300">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DETAIL MODE — specific guide */}
        {selectedGuide !== "all" && (
          <>
            {/* Guide label + actions */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900">{selectedGuide}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewGuide(selectedGuide)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}
                >
                  <Eye className="size-3.5" />
                  Preview
                </button>
                <button onClick={() => setSelectedGuide("all")} className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors">
                  <X className="size-3.5" />Clear
                </button>
              </div>
            </div>

            {/* Tool tabs */}
            <div className="flex gap-1 border-b border-zinc-200 mb-6">
              {TOOLS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTool(key)}
                  className={`flex items-center gap-2 px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTool === key ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  <Icon className="size-3.5" strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>

            {/* EMBED WIDGET */}
            {activeTool === "widget" && (() => {
              const mode = isPaid ? "redeem" : "free";
              const snippet = `<div\n  id="museoo-widget"\n  data-guide="${redemptionSlug}"\n  data-mode="${mode}"\n  data-style="${widgetStyle}"\n></div>\n<script src="https://museoo.app/widget.js"></script>`;
              const thumbnail = guideWidget?.thumbnail ?? "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400";

              const STYLES = [
                { id: "compact"  as const, label: "Compact",  desc: "Small card — sidebar or inline" },
                { id: "showcase" as const, label: "Showcase", desc: "Rich card — like a promo block"  },
                { id: "button"   as const, label: "Button",   desc: "CTA only — minimal footprint"   },
              ];

              return (
                <div className="space-y-6">

                  {/* Stats row */}
                  {guideWidget?.status === "active" && (
                    <div className="flex items-center gap-8 px-0.5">
                      <div>
                        <span className="text-[22px] font-light text-zinc-900">{guideWidget.impressions.toLocaleString()}</span>
                        <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Impressions</span>
                      </div>
                      <div className="w-px h-5 bg-zinc-200" />
                      <div>
                        <span className="text-[22px] font-light text-zinc-900">{guideWidget.clicks.toLocaleString()}</span>
                        <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{isPaid ? "Code entries" : "Clicks"}</span>
                      </div>
                      <div className="w-px h-5 bg-zinc-200" />
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-400" />Embedded
                      </span>
                    </div>
                  )}

                  {/* Style picker */}
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Style</p>
                    <div className="flex gap-2">
                      {STYLES.map(({ id, label, desc }) => (
                        <button key={id} onClick={() => setWidgetStyle(id)}
                          className={`flex-1 py-2.5 px-3 rounded-lg border text-left transition-all ${widgetStyle === id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white hover:border-zinc-300"}`}>
                          <p className={`text-[12px] font-semibold ${widgetStyle === id ? "text-zinc-900" : "text-zinc-500"}`}>{label}</p>
                          <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">{desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Two-column layout: preview + code */}
                  <div className="grid grid-cols-[1fr_1.2fr] gap-6 items-start">

                    {/* Left: Widget visual preview */}
                    <div>
                      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Preview</p>
                      <div className="bg-zinc-100 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">

                        {/* ── COMPACT ── */}
                        {widgetStyle === "compact" && (
                          <div className="w-60 bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-200/60">
                            <div className="relative h-28">
                              <img src={thumbnail} alt={selectedGuide} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-2.5 left-3 right-3">
                                <p className="text-white text-[11px] font-bold leading-tight truncate">{selectedGuide}</p>
                                {isPaid && <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-semibold rounded">Paid</span>}
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="flex items-center gap-1 mb-2.5">
                                <span className="text-[11px]">🇮🇹</span><span className="text-[11px]">🇬🇧</span>
                                <span className="ml-auto text-[10px] text-zinc-400">~45 min</span>
                              </div>
                              {isPaid ? (
                                <div className="flex gap-1.5">
                                  <div className="flex-1 h-7 bg-zinc-100 border border-zinc-200 rounded-md flex items-center px-2">
                                    <span className="text-[10px] text-zinc-400">Enter code…</span>
                                  </div>
                                  <div className="size-7 bg-[#D33333] rounded-md flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-[11px] font-bold">→</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-7 bg-[#D33333] rounded-md flex items-center justify-center">
                                  <span className="text-white text-[11px] font-semibold">Listen now →</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ── SHOWCASE ── */}
                        {widgetStyle === "showcase" && (
                          <div className="w-72 bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-200/60">
                            {/* Tall thumbnail */}
                            <div className="relative h-44">
                              <img src={thumbnail} alt={selectedGuide} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              {isPaid && (
                                <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wide">Paid access</span>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white text-[14px] font-bold leading-tight">{selectedGuide}</p>
                                <p className="text-white/70 text-[10px] mt-0.5">Museo Nazionale · Audio Guide</p>
                              </div>
                            </div>
                            {/* Body */}
                            <div className="p-4">
                              <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
                                Discover the collection through a guided audio experience available in multiple languages.
                              </p>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-1">
                                  <span className="text-[12px]">🇮🇹</span><span className="text-[12px]">🇬🇧</span>
                                </div>
                                <span className="text-zinc-300">·</span>
                                <span className="text-[11px] text-zinc-400">~45 min</span>
                                <span className="text-zinc-300">·</span>
                                <span className="text-[11px] text-zinc-400">{(guideWidget?.impressions ?? 1234).toLocaleString()} visitors</span>
                              </div>
                              {/* Stats row */}
                              <div className="flex gap-4 mb-4 pb-4 border-b border-zinc-100">
                                <div>
                                  <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">{isPaid ? "Redeemed" : "Plays"}</p>
                                  <p className="text-[16px] font-light text-zinc-900">{(guideWidget?.clicks ?? 456).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Rating</p>
                                  <p className="text-[16px] font-light text-zinc-900">4.8 ★</p>
                                </div>
                              </div>
                              {isPaid ? (
                                <div className="flex gap-2">
                                  <div className="flex-1 h-8 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center px-3">
                                    <span className="text-[11px] text-zinc-400">Enter your code…</span>
                                  </div>
                                  <div className="size-8 bg-[#D33333] rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-[13px] font-bold">→</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <div className="flex-1 h-8 bg-[#D33333] rounded-lg flex items-center justify-center">
                                    <span className="text-white text-[12px] font-semibold">Listen now →</span>
                                  </div>
                                  <div className="size-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                                    <QrCode className="size-4 text-zinc-500" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ── BUTTON ── */}
                        {widgetStyle === "button" && (
                          <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3 px-5 py-3 bg-[#D33333] text-white rounded-xl shadow-lg">
                              <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-[14px]">🎧</span>
                              </div>
                              <div>
                                <p className="text-[11px] text-white/70 leading-none mb-0.5">Audio guide</p>
                                <p className="text-[13px] font-semibold leading-none">{selectedGuide}</p>
                              </div>
                              <span className="ml-2 text-white/80 text-[14px]">→</span>
                            </div>
                            <p className="text-[10px] text-zinc-400">🇮🇹 🇬🇧  ·  ~45 min  ·  Free</p>
                          </div>
                        )}

                      </div>
                      <p className="text-[11px] text-zinc-400 text-center mt-2">Paste this widget on any page of your website</p>
                    </div>

                    {/* Right: Embed snippet + instructions */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Embed code</p>
                        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
                          <div className="p-4 bg-zinc-950 rounded-t-xl">
                            <pre className="font-mono text-[11px] text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre">{snippet}</pre>
                          </div>
                          <div className="px-4 py-3 flex items-center justify-between">
                            <span className="text-[11px] text-zinc-400">Paste inside your website's &lt;body&gt;</span>
                            <button onClick={() => handleCopy(snippet, "widget-snippet")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">
                              {copiedText === "widget-snippet"
                                ? <><Check className="size-3.5" />Copied!</>
                                : <><Copy className="size-3.5" />Copy code</>
                              }
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                        <p className="text-[12px] font-semibold text-zinc-700">How to install</p>
                        {[
                          "Paste the snippet inside the <body> of the page where you want the widget to appear",
                          isPaid
                            ? "Visitors enter their access code directly in the widget — no redirect needed"
                            : "Visitors click 'Listen now' and are taken to the audio guide player",
                          "The widget adapts automatically to your page's width",
                        ].map((step, i) => (
                          <div key={i} className="flex gap-2.5">
                            <span className="size-4 rounded-full bg-zinc-200 text-zinc-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            <p className="text-[12px] text-zinc-500 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* QR CODES */}
            {activeTool === "qr" && (() => {
              if (isPaid) {
                return (
                  <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                    <div className="px-6 py-5 border-b border-zinc-100 flex items-start gap-3">
                      <div className="size-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <QrCode className="size-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-zinc-900 mb-0.5">Paid Access — Unique QR codes</p>
                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                          This guide uses device-locked QR codes. Each visitor receives a unique code — there is no universal QR here.
                        </p>
                      </div>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                      <p className="text-[13px] text-zinc-500">Batch generation and tracking are managed in Monetization.</p>
                      <a href="/monetization" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all flex-shrink-0">
                        <ExternalLink className="size-3.5" />Go to Monetization
                      </a>
                    </div>
                  </div>
                );
              }

              const guideQR = filteredQR.find(q => q.targetType === "guide");
              const poiQRs  = filteredQR.filter(q => q.targetType === "poi");

              return (
                <div className="space-y-4">

                  {/* Guide QR — single universal */}
                  <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50">
                      <div>
                        <h3 className="text-[13px] font-semibold text-zinc-900">Guide QR</h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">One universal code pointing to the full guide</p>
                      </div>
                      {!guideQR && (
                        <button onClick={() => setShowCreateQR(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">
                          <Plus className="size-3.5" />Generate
                        </button>
                      )}
                    </div>

                    {guideQR ? (
                      <div className="flex items-center gap-5 px-5 py-4">
                        <div className="size-14 bg-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <QrCode className="size-8 text-zinc-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-zinc-900 mb-0.5">{guideQR.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-zinc-400 capitalize">{guideQR.style} style</span>
                            <span className="text-zinc-200">·</span>
                            <span className="text-[11px] text-zinc-400">{guideQR.scans} scans</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">
                            <Download className="size-3.5" />Download
                          </button>
                          <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-all">
                            <Edit className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="px-5 py-8 text-center">
                        <QrCode className="size-6 text-zinc-300 mx-auto mb-2" />
                        <p className="text-[12px] text-zinc-400">No guide QR yet — generate one to use in print materials</p>
                      </div>
                    )}
                  </div>

                  {/* POI QRs — one per artwork */}
                  <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50">
                      <div>
                        <h3 className="text-[13px] font-semibold text-zinc-900">POI QR Codes</h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Place next to individual artworks — visitors access that POI directly</p>
                      </div>
                      <button onClick={() => setShowCreateQR(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                        <Plus className="size-3.5" />Add POI QR
                      </button>
                    </div>

                    {poiQRs.length === 0 ? (
                      <div className="px-5 py-8 text-center">
                        <p className="text-[12px] text-zinc-400">No POI QR codes yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-100">
                        {poiQRs.map((qr) => (
                          <div key={qr.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-50/50 transition-colors">
                            <div className="size-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <QrCode className="size-4 text-zinc-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-zinc-800 truncate">{qr.name}</p>
                              <p className="text-[11px] text-zinc-400">{qr.scans} scans · {qr.style}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D33333] text-white text-[11px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">
                                <Download className="size-3" />Download
                              </button>
                              <button className="px-2.5 py-1.5 bg-white border border-zinc-200 text-zinc-500 hover:text-red-500 hover:border-red-200 rounded-lg transition-all">
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

            {/* PRINT ASSETS */}
            {activeTool === "assets" && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[13px] text-zinc-500">{filteredAssets.length} {filteredAssets.length === 1 ? "asset" : "assets"}</p>
                  <button onClick={() => setShowCreateAsset(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all">
                    <Plus className="size-4" />Create Asset
                  </button>
                </div>
                <div className="grid grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                  {[
                    { type: "poster-a4", label: "Poster A4" }, { type: "poster-a3", label: "Poster A3" },
                    { type: "flyer", label: "Flyer A5" }, { type: "banner", label: "Banner" },
                    { type: "tentcard", label: "Tent Card" }, { type: "mapinsert", label: "Map Insert" },
                    { type: "plaque", label: "POI Plaque" },
                  ].map(({ type, label }) => (
                    <button key={type} className="p-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all text-center">
                      <FileText className="size-5 text-zinc-400 mx-auto mb-1.5" />
                      <p className="text-[11px] font-semibold text-zinc-600">{label}</p>
                    </button>
                  ))}
                </div>
                {filteredAssets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="size-6 text-zinc-400" /></div>
                    <p className="text-[14px] font-semibold text-zinc-900 mb-1">No print assets yet</p>
                    <p className="text-[13px] text-zinc-500 mb-6">Create print-ready materials for this guide</p>
                    <button onClick={() => setShowCreateAsset(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all">
                      <Plus className="size-4" />Create Asset
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center gap-4 px-5 py-4 bg-white border border-zinc-200 rounded-xl hover:shadow-sm hover:border-zinc-300 transition-all" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                        <div className="size-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="size-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-zinc-900 truncate mb-0.5">{asset.name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-semibold rounded-full">{getAssetTypeLabel(asset.type)}</span>
                            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-semibold rounded-full">{asset.format}</span>
                            <span className="text-[11px] text-zinc-400">{asset.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#D33333] text-white text-[12px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">
                            <Download className="size-3.5" />Download
                          </button>
                          <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-lg transition-all"><Edit className="size-3.5" /></button>
                          <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-200 rounded-lg transition-all"><Trash2 className="size-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </>
        )}

      </div>

      {/* Modals */}
      {previewGuide && (
        <GuidePreviewModal guideName={previewGuide} onClose={() => setPreviewGuide(null)} />
      )}
      {showRedemptionPreview && (
        <RedemptionPagePreviewModal
          guideName={selectedGuide}
          redemptionUrl={redemptionUrl}
          thumbnail={mockLandingPages.find(p => p.guideName === selectedGuide)?.thumbnail ?? "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400"}
          content={redemptionContent}
          onClose={() => setShowRedemptionPreview(false)}
        />
      )}
      {showRedemptionEdit && (
        <RedemptionPageEditModal
          guideName={selectedGuide}
          initial={redemptionContent}
          onSave={setRedemptionContent}
          onClose={() => setShowRedemptionEdit(false)}
        />
      )}

      {showCreateQR && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-zinc-900">Generate QR Code</h2>
              <button onClick={() => setShowCreateQR(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors"><X className="size-5" /></button>
            </div>
            <p className="text-[14px] text-zinc-500 mb-6">QR generator coming soon…</p>
            <button onClick={() => setShowCreateQR(false)} className="w-full px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">Close</button>
          </div>
        </div>
      )}
      {showCreateAsset && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-zinc-900">Create Print Asset</h2>
              <button onClick={() => setShowCreateAsset(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors"><X className="size-5" /></button>
            </div>
            <p className="text-[14px] text-zinc-500 mb-6">Asset builder coming soon…</p>
            <button onClick={() => setShowCreateAsset(false)} className="w-full px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all">Close</button>
          </div>
        </div>
      )}

    </PageShell>
  );
}
