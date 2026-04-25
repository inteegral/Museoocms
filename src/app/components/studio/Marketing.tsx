import {
  Globe,
  QrCode,
  FileText,
  Share2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Copy,
  ExternalLink,
  Check,
  X,
  Code,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { PageShell } from "./PageShell";
import { GuidePreviewModal } from "./GuidePreviewModal";
import { LandingPagePreviewModal } from "./LandingPagePreviewModal";
import { RedemptionPagePreviewModal } from "./RedemptionPagePreviewModal";
import { RedemptionPageEditModal } from "./RedemptionPageEditModal";

interface LandingPage {
  id: string;
  guideName: string;
  url: string;
  status: "published" | "draft";
  views: number;
  scans: number;
  thumbnail: string;
  createdAt: string;
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

const mockLandingPages: LandingPage[] = [
  { id: "1", guideName: "Renaissance Masterpieces", url: "museodarte.app/renaissance", status: "published", views: 1234, scans: 456, thumbnail: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400", createdAt: "2024-03-15" },
  { id: "2", guideName: "Ancient Egypt Collection",  url: "museodarte.app/egypt",       status: "published", views: 892,  scans: 267, thumbnail: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400", createdAt: "2024-03-10" },
  { id: "3", guideName: "Modern Art Gallery",        url: "museodarte.app/modern-art",  status: "draft",     views: 0,    scans: 0,   thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400", createdAt: "2024-03-28" },
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
  { key: "landing",      label: "Landing Page",  Icon: Globe    },
  { key: "qr",           label: "QR Code",       Icon: QrCode   },
  { key: "assets",       label: "Print Assets",  Icon: FileText },
  { key: "distribution", label: "Distribution",  Icon: Share2   },
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
  const [landingPages, setLandingPages] = useState<LandingPage[]>(mockLandingPages);
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>(mockQRCodes);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [showCreateLanding, setShowCreateLanding] = useState(false);
  const [showCreateQR, setShowCreateQR] = useState(false);
  const [showCreateAsset, setShowCreateAsset] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [previewGuide, setPreviewGuide] = useState<string | null>(null);
  const [previewLandingPage, setPreviewLandingPage] = useState<LandingPage | null>(null);
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

  const filteredLanding = selectedGuide === "all" ? landingPages : landingPages.filter(p => p.guideName === selectedGuide);
  const filteredQR      = selectedGuide === "all" ? qrCodes      : qrCodes.filter(q => q.guideName === selectedGuide);
  const filteredAssets  = selectedGuide === "all" ? assets        : assets.filter(a => a.guideName === selectedGuide);
  const isPaid          = selectedGuide !== "all" && getAccess(selectedGuide) === "paid";
  const redemptionSlug  = selectedGuide !== "all" ? selectedGuide.toLowerCase().replace(/ /g, "-") : "";
  const redemptionUrl   = `museodarte.app/${redemptionSlug}`;

  const guideMarketing = (name: string) => {
    const lp  = landingPages.find(p => p.guideName === name);
    const qrs = qrCodes.filter(q => q.guideName === name);
    const ast = assets.filter(a => a.guideName === name);
    return { lp, qrs, ast };
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
                onClick={() => { setSelectedGuide(name); if (name !== "all") setActiveTool("landing"); }}
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
              const { lp, qrs, ast } = guideMarketing(name);
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

                  {/* Landing Page */}
                  <div className="px-4 py-4 flex items-center">
                    {lp ? (
                      <StatusPill variant={lp.status === "published" ? "live" : "draft"}>
                        {lp.status === "published" ? "Live" : "Draft"}
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
                    {(qrs.length > 0 || lp?.status === "published") ? (
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

            {/* LANDING PAGE */}
            {activeTool === "landing" && (
              <>
                {isPaid ? (
                  /* ── PAID: Redemption page card ── */
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-[13px] text-zinc-500">1 redemption page</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)" }}>
                        <div className="relative h-40 bg-zinc-100">
                          <img
                            src={mockLandingPages.find(p => p.guideName === selectedGuide)?.thumbnail ?? "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400"}
                            alt={selectedGuide}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500 text-white">
                            Paid access
                          </span>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-1.5 mb-4">
                            <span className="text-[12px] text-zinc-500 truncate">{redemptionUrl}</span>
                            <button onClick={() => handleCopy(redemptionUrl, "redemption-base")} className="text-zinc-400 hover:text-zinc-700 transition-colors flex-shrink-0">
                              {copiedText === "redemption-base" ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                            </button>
                          </div>
                          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-zinc-100">
                            <div>
                              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Redeemed</p>
                              <p className="text-[18px] font-light text-zinc-900">{filteredQR.reduce((s, q) => s + q.scans, 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Page visits</p>
                              <p className="text-[18px] font-light text-zinc-900">{filteredLanding.reduce((s, p) => s + p.views, 0).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setShowRedemptionPreview(true)} className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                              <Eye className="size-3.5 inline mr-1.5" />Preview
                            </button>
                            <button onClick={() => setShowRedemptionEdit(true)} className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                              <Edit className="size-3.5 inline mr-1.5" />Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ── FREE: Landing page builder ── */
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-[13px] text-zinc-500">{filteredLanding.length} {filteredLanding.length === 1 ? "page" : "pages"}</p>
                      <button onClick={() => setShowCreateLanding(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
                        <Plus className="size-4" />Create Landing Page
                      </button>
                    </div>
                    {filteredLanding.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4"><Globe className="size-6 text-zinc-400" /></div>
                        <p className="text-[14px] font-semibold text-zinc-900 mb-1">No landing page yet</p>
                        <p className="text-[13px] text-zinc-500 mb-6">Create a landing page to promote this guide</p>
                        <button onClick={() => setShowCreateLanding(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
                          <Plus className="size-4" />Create Landing Page
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredLanding.map((page) => (
                          <div key={page.id} className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)" }}>
                            <div className="relative h-40 bg-zinc-100">
                              <img src={page.thumbnail} alt={page.guideName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                              <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${page.status === "published" ? "bg-emerald-500 text-white" : "bg-zinc-700/80 text-white"}`}>
                                {page.status === "published" && <span className="size-1.5 rounded-full bg-white animate-pulse" />}
                                {page.status === "published" ? "Live" : "Draft"}
                              </span>
                            </div>
                            <div className="p-5">
                              <div className="flex items-center gap-1.5 mb-4">
                                <span className="text-[12px] text-zinc-500 truncate">{page.url}</span>
                                <button onClick={() => handleCopy(page.url, `url-${page.id}`)} className="text-zinc-400 hover:text-zinc-700 transition-colors flex-shrink-0">
                                  {copiedText === `url-${page.id}` ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                                </button>
                              </div>
                              <div className="flex items-center gap-6 mb-4 pb-4 border-b border-zinc-100">
                                <div>
                                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Views</p>
                                  <p className="text-[18px] font-light text-zinc-900">{page.views.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Scans</p>
                                  <p className="text-[18px] font-light text-zinc-900">{page.scans.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setPreviewLandingPage(page)} className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                                  <Eye className="size-3.5 inline mr-1.5" />Preview
                                </button>
                                <button className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                                  <Edit className="size-3.5 inline mr-1.5" />Edit
                                </button>
                                <button className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-200 text-[12px] rounded-lg transition-all">
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

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
                      <a href="/monetization" className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all flex-shrink-0">
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
                        <button onClick={() => setShowCreateQR(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
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
                          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
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
                              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
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
                  <button onClick={() => setShowCreateAsset(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
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
                    <button onClick={() => setShowCreateAsset(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
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
                          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
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

            {/* DISTRIBUTION */}
            {activeTool === "distribution" && (
              <div className="space-y-8">

                {/* Embed Widgets */}
                <div>
                  <h2 className="text-[14px] font-semibold text-zinc-900 mb-1">Embed Widgets</h2>
                  <p className="text-[12px] text-zinc-400 mb-4">Paste on the museum website — no app required</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {isPaid ? (
                      /* Paid widgets */
                      <>
                        {[
                          {
                            icon: ExternalLink,
                            title: "Buy Access Button",
                            desc: '"Buy access" button that opens the purchase flow',
                            code: `<a href="https://${redemptionUrl}/buy" class="museoo-btn" data-guide="${redemptionSlug}">Get audio guide</a>\n<script src="https://museoo.app/widget.js"></script>`,
                            copyKey: "embed-buy",
                          },
                          {
                            icon: Code,
                            title: "Code Input Widget",
                            desc: "Embeddable code redemption form — ideal on the purchase confirmation page",
                            code: `<div id="museoo-redeem" data-guide="${redemptionSlug}"></div>\n<script src="https://museoo.app/redeem.js"></script>`,
                            copyKey: "embed-redeem",
                          },
                        ].map(({ icon: Icon, title, desc, code, copyKey }) => (
                          <div key={copyKey} className="p-5 bg-white border border-zinc-200 rounded-xl" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                            <div className="flex items-center gap-2.5 mb-2">
                              <Icon className="size-4 text-zinc-400" strokeWidth={1.5} />
                              <h3 className="text-[13px] font-semibold text-zinc-900">{title}</h3>
                            </div>
                            <p className="text-[12px] text-zinc-500 mb-3">{desc}</p>
                            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg mb-3 font-mono text-[11px] text-zinc-600 overflow-x-auto whitespace-pre">{code}</div>
                            <button onClick={() => handleCopy(code, copyKey)} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
                              {copiedText === copyKey ? <><Check className="size-3.5" />Copiato!</> : <><Copy className="size-3.5" />Copia codice</>}
                            </button>
                          </div>
                        ))}
                      </>
                    ) : (
                      /* Free widgets */
                      <div className="p-5 bg-white border border-zinc-200 rounded-xl" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <QrCode className="size-4 text-zinc-400" strokeWidth={1.5} />
                          <h3 className="text-[13px] font-semibold text-zinc-900">QR Widget</h3>
                        </div>
                        <p className="text-[12px] text-zinc-500 mb-3">Display a QR code lightbox on your homepage</p>
                        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg mb-3 font-mono text-[11px] text-zinc-600 overflow-x-auto whitespace-pre">{`<div id="museoo-qr" data-guide="${redemptionSlug}"></div>\n<script src="https://museoo.app/widget.js"></script>`}</div>
                        <button onClick={() => handleCopy(`<div id="museoo-qr" data-guide="${redemptionSlug}"></div>\n<script src="https://museoo.app/widget.js"></script>`, "embed-qr")} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
                          {copiedText === "embed-qr" ? <><Check className="size-3.5" />Copied!</> : <><Copy className="size-3.5" />Copy Code</>}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Smart Link */}
                <div>
                  <h2 className="text-[14px] font-semibold text-zinc-900 mb-1">Smart Link</h2>
                  <p className="text-[12px] text-zinc-400 mb-4">
                    {isPaid ? "Redemption page URL — include in confirmation emails and digital tickets" : "Direct link to the guide — use in emails, social, newsletters"}
                  </p>
                  <div className="p-5 bg-white border border-zinc-200 rounded-xl" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                    <div className="space-y-2">
                      {isPaid ? (
                        <>
                          {[
                            { label: "Base",    value: `https://${redemptionUrl}`,             key: "paid-base" },
                            { label: "With code", value: `https://${redemptionUrl}?code=XXXXX`, key: "paid-code" },
                          ].map(({ label, value, key }) => (
                            <div key={key} className="flex items-center gap-3">
                              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest w-20 flex-shrink-0">{label}</span>
                              <code className={`flex-1 px-3 py-2 border rounded text-[11px] overflow-x-auto font-mono ${key === "paid-code" ? "bg-amber-50 border-amber-200 text-amber-700 font-semibold" : "bg-zinc-50 border-zinc-200 text-zinc-600"}`}>{value}</code>
                              <button onClick={() => handleCopy(value, key)} className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all flex-shrink-0">
                                {copiedText === key ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5 text-zinc-500" />}
                              </button>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {[
                            { label: "Long",  value: `https://museoo.app/guide/${redemptionSlug}`, key: "long" },
                            { label: "Short", value: `https://audio.guide/${getAbbr(selectedGuide).toLowerCase()}`, key: "short" },
                          ].map(({ label, value, key }) => (
                            <div key={key} className="flex items-center gap-3">
                              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest w-10">{label}</span>
                              <code className={`flex-1 px-3 py-2 border rounded text-[11px] overflow-x-auto font-mono ${key === "short" ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold" : "bg-zinc-50 border-zinc-200 text-zinc-600"}`}>{value}</code>
                              {key === "short" && (
                                <button onClick={() => handleCopy(value, "short")} className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all">
                                  {copiedText === "short" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5 text-zinc-500" />}
                                </button>
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Channel Performance */}
                <div>
                  <h2 className="text-[14px] font-semibold text-zinc-900 mb-4">Channel Performance</h2>
                  <div className="flex items-center gap-6 mb-5 px-0.5">
                    {(isPaid
                      ? [
                          { label: "Codes redeemed", value: filteredQR.reduce((s, q) => s + q.scans, 0).toLocaleString() },
                          { label: "Redemption page", value: filteredLanding.reduce((s, p) => s + p.views, 0).toLocaleString() },
                        ]
                      : [
                          { label: "QR Scans",   value: filteredQR.reduce((s, q) => s + q.scans, 0).toLocaleString() },
                          { label: "Page Views", value: filteredLanding.reduce((s, p) => s + p.views, 0).toLocaleString() },
                        ]
                    ).map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-[22px] font-light text-zinc-900">{value}</span>
                        <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Modals */}
      {previewGuide && (
        <GuidePreviewModal guideName={previewGuide} onClose={() => setPreviewGuide(null)} />
      )}
      {previewLandingPage && (
        <LandingPagePreviewModal page={previewLandingPage} onClose={() => setPreviewLandingPage(null)} />
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

      {showCreateLanding && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-zinc-900">Create Landing Page</h2>
              <button onClick={() => setShowCreateLanding(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors"><X className="size-5" /></button>
            </div>
            <p className="text-[14px] text-zinc-500 mb-6">Landing page builder coming soon…</p>
            <button onClick={() => setShowCreateLanding(false)} className="w-full px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">Close</button>
          </div>
        </div>
      )}
      {showCreateQR && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-zinc-900">Generate QR Code</h2>
              <button onClick={() => setShowCreateQR(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors"><X className="size-5" /></button>
            </div>
            <p className="text-[14px] text-zinc-500 mb-6">QR generator coming soon…</p>
            <button onClick={() => setShowCreateQR(false)} className="w-full px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">Close</button>
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
            <button onClick={() => setShowCreateAsset(false)} className="w-full px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">Close</button>
          </div>
        </div>
      )}

    </PageShell>
  );
}
