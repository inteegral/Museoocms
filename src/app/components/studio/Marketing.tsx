import { useState } from "react";
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
  ChevronDown,
  BarChart3,
  Link as LinkIcon,
  Code,
  Palette,
  Image as ImageIcon,
} from "lucide-react";

interface LandingPage {
  id: string;
  title: string;
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

const mockLandingPages: LandingPage[] = [
  {
    id: "1",
    title: "Renaissance Masterpieces",
    guideName: "Renaissance Masterpieces",
    url: "museodarte.app/renaissance",
    status: "published",
    views: 1234,
    scans: 456,
    thumbnail: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Ancient Egypt Collection",
    guideName: "Ancient Egypt Collection",
    url: "museodarte.app/egypt",
    status: "published",
    views: 892,
    scans: 267,
    thumbnail: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400",
    createdAt: "2024-03-10",
  },
  {
    id: "3",
    title: "Modern Art Gallery",
    guideName: "Modern Art Gallery",
    url: "museodarte.app/modern-art",
    status: "draft",
    views: 0,
    scans: 0,
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
    createdAt: "2024-03-28",
  },
];

const mockQRCodes: QRCodeItem[] = [
  {
    id: "1",
    name: "Renaissance - Main QR",
    guideName: "Renaissance Masterpieces",
    targetType: "guide",
    scans: 456,
    style: "branded",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    name: "Egypt - Entrance",
    guideName: "Ancient Egypt Collection",
    targetType: "landing",
    scans: 267,
    style: "standard",
    createdAt: "2024-03-10",
  },
  {
    id: "3",
    name: "POI - Botticelli Venus",
    guideName: "Renaissance Masterpieces",
    targetType: "poi",
    scans: 89,
    style: "rounded",
    createdAt: "2024-03-20",
  },
];

const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Renaissance Poster A3",
    type: "poster-a3",
    guideName: "Renaissance Masterpieces",
    format: "PDF",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    name: "Egypt Flyer A5",
    type: "flyer",
    guideName: "Ancient Egypt Collection",
    format: "PDF",
    createdAt: "2024-03-12",
  },
  {
    id: "3",
    name: "Museum Entrance Banner",
    type: "banner",
    guideName: "Renaissance Masterpieces",
    format: "PDF",
    createdAt: "2024-03-08",
  },
];

export function Marketing() {
  const [activeTab, setActiveTab] = useState<"landing" | "qr" | "assets" | "distribution">("landing");
  const [landingPages, setLandingPages] = useState<LandingPage[]>(mockLandingPages);
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>(mockQRCodes);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [showCreateLanding, setShowCreateLanding] = useState(false);
  const [showCreateQR, setShowCreateQR] = useState(false);
  const [showCreateAsset, setShowCreateAsset] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "poster-a4": "Poster A4",
      "poster-a3": "Poster A3",
      flyer: "Flyer A5",
      banner: "Banner 100x200cm",
      tentcard: "Tent Card",
      mapinsert: "Map Insert",
      plaque: "POI Plaque",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight mb-2">
                Marketing
              </h1>
              <p className="text-[15px] text-zinc-600 leading-relaxed">
                Promote and distribute your audioguides
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-zinc-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("landing")}
              className={`px-4 py-3 text-[14px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "landing"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Globe className="size-4 inline mr-2" />
              Landing Pages
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`px-4 py-3 text-[14px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "qr"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <QrCode className="size-4 inline mr-2" />
              QR Codes
            </button>
            <button
              onClick={() => setActiveTab("assets")}
              className={`px-4 py-3 text-[14px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "assets"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <FileText className="size-4 inline mr-2" />
              Print Assets
            </button>
            <button
              onClick={() => setActiveTab("distribution")}
              className={`px-4 py-3 text-[14px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "distribution"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Share2 className="size-4 inline mr-2" />
              Distribution
            </button>
          </div>
        </div>

        {/* LANDING PAGES TAB */}
        {activeTab === "landing" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-zinc-950">Landing Pages</h2>
              <button
                onClick={() => setShowCreateLanding(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all shadow-sm"
              >
                <Plus className="size-4" />
                Create Landing Page
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landingPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)" }}
                >
                  <div className="aspect-video bg-zinc-100 relative">
                    <img
                      src={page.thumbnail}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-3 right-3 px-2 py-1 text-[11px] font-semibold rounded text-white"
                      style={{ backgroundColor: page.status === "published" ? "#D33333" : "#d97706" }}
                    >
                      {page.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[16px] font-semibold text-zinc-950 mb-1">
                      {page.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[13px] text-zinc-600">{page.url}</span>
                      <button
                        onClick={() => handleCopy(page.url, `url-${page.id}`)}
                        className="text-zinc-400 hover:text-zinc-900 transition-colors"
                      >
                        {copiedText === `url-${page.id}` ? (
                          <Check className="size-3.5 text-green-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-zinc-200">
                      <div>
                        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                          Views
                        </p>
                        <p className="text-[18px] font-bold text-zinc-950">{page.views}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                          Scans
                        </p>
                        <p className="text-[18px] font-bold text-zinc-950">{page.scans}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                        <Eye className="size-3.5 inline mr-1.5" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                        <Edit className="size-3.5 inline mr-1.5" />
                        Edit
                      </button>
                      <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {landingPages.length === 0 && (
              <div className="text-center py-16">
                <Globe className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">
                  No landing pages yet
                </h3>
                <p className="text-[14px] text-zinc-600 mb-6">
                  Create your first landing page to promote audioguides
                </p>
                <button
                  onClick={() => setShowCreateLanding(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all"
                >
                  <Plus className="size-4" />
                  Create Landing Page
                </button>
              </div>
            )}
          </>
        )}

        {/* QR CODES TAB */}
        {activeTab === "qr" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-zinc-950">QR Codes</h2>
              <button
                onClick={() => setShowCreateQR(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all shadow-sm"
              >
                <Plus className="size-4" />
                Generate QR Code
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrCodes.map((qr) => (
                <div
                  key={qr.id}
                  className="p-6 bg-white border border-zinc-200 rounded-xl hover:shadow-lg transition-all"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-[16px] font-semibold text-zinc-950 mb-1">{qr.name}</h3>
                      <p className="text-[13px] text-zinc-600 mb-2">{qr.guideName}</p>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 text-[11px] font-semibold rounded ${
                            qr.targetType === "guide"
                              ? "bg-blue-50 text-blue-700"
                              : qr.targetType === "landing"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {qr.targetType === "guide"
                            ? "Full Guide"
                            : qr.targetType === "landing"
                            ? "Landing Page"
                            : "POI"}
                        </span>
                        <span className="px-2 py-1 bg-zinc-100 text-zinc-700 text-[11px] font-semibold rounded capitalize">
                          {qr.style}
                        </span>
                      </div>
                    </div>
                    <div className="size-20 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
                      <QrCode className="size-12 text-zinc-400" />
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b border-zinc-200">
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                      Total Scans
                    </p>
                    <p className="text-[24px] font-bold text-zinc-950">{qr.scans}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all">
                      <Download className="size-3.5 inline mr-1.5" />
                      Download
                    </button>
                    <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Edit className="size-3.5" />
                    </button>
                    <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {qrCodes.length === 0 && (
              <div className="text-center py-16">
                <QrCode className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">No QR codes yet</h3>
                <p className="text-[14px] text-zinc-600 mb-6">
                  Generate your first QR code for physical distribution
                </p>
                <button
                  onClick={() => setShowCreateQR(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all"
                >
                  <Plus className="size-4" />
                  Generate QR Code
                </button>
              </div>
            )}
          </>
        )}

        {/* ASSETS TAB */}
        {activeTab === "assets" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-zinc-950">Print Assets</h2>
              <button
                onClick={() => setShowCreateAsset(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all shadow-sm"
              >
                <Plus className="size-4" />
                Create Asset
              </button>
            </div>

            {/* Asset Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              {[
                { type: "poster-a4", label: "Poster A4", icon: FileText },
                { type: "poster-a3", label: "Poster A3", icon: FileText },
                { type: "flyer", label: "Flyer A5", icon: FileText },
                { type: "banner", label: "Banner", icon: ImageIcon },
                { type: "tentcard", label: "Tent Card", icon: FileText },
                { type: "mapinsert", label: "Map Insert", icon: FileText },
                { type: "plaque", label: "POI Plaque", icon: FileText },
              ].map((category) => (
                <button
                  key={category.type}
                  className="p-4 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all text-center"
                >
                  <category.icon className="size-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-[12px] font-semibold text-zinc-700">{category.label}</p>
                </button>
              ))}
            </div>

            {/* Assets List */}
            <div className="space-y-3">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-5 bg-white border border-zinc-200 rounded-xl hover:shadow-lg transition-all flex items-center justify-between"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)" }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-12 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="size-6 text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-zinc-950 mb-1">
                        {asset.name}
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[13px] text-zinc-600">{asset.guideName}</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded">
                          {getAssetTypeLabel(asset.type)}
                        </span>
                        <span className="px-2 py-1 bg-zinc-100 text-zinc-700 text-[11px] font-semibold rounded">
                          {asset.format}
                        </span>
                        <span className="text-[12px] text-zinc-500">{asset.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-3 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all">
                      <Download className="size-3.5 inline mr-1.5" />
                      Download
                    </button>
                    <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Edit className="size-3.5" />
                    </button>
                    <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {assets.length === 0 && (
              <div className="text-center py-16">
                <FileText className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">No assets yet</h3>
                <p className="text-[14px] text-zinc-600 mb-6">
                  Create print-ready materials for museum distribution
                </p>
                <button
                  onClick={() => setShowCreateAsset(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all"
                >
                  <Plus className="size-4" />
                  Create Asset
                </button>
              </div>
            )}
          </>
        )}

        {/* DISTRIBUTION TAB */}
        {activeTab === "distribution" && (
          <div className="space-y-8">
            {/* Embed Widgets */}
            <div>
              <h2 className="text-[20px] font-semibold text-zinc-950 mb-4">Embed Widgets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-zinc-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Code className="size-5 text-blue-600" />
                    <h3 className="text-[16px] font-semibold text-zinc-950">Audio Player</h3>
                  </div>
                  <p className="text-[13px] text-zinc-600 mb-4">
                    Embed an audio player widget on your museum website
                  </p>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg mb-3 font-mono text-[11px] text-zinc-700 overflow-x-auto">
                    &lt;iframe src="https://audio.guide/embed/..."&gt;&lt;/iframe&gt;
                  </div>
                  <button
                    onClick={() =>
                      handleCopy('<iframe src="https://audio.guide/embed/...">', "embed-player")
                    }
                    className="w-full px-3 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all"
                  >
                    {copiedText === "embed-player" ? (
                      <>
                        <Check className="size-3.5 inline mr-1.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 inline mr-1.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="p-6 bg-white border border-zinc-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <QrCode className="size-5 text-purple-600" />
                    <h3 className="text-[16px] font-semibold text-zinc-950">QR Widget</h3>
                  </div>
                  <p className="text-[13px] text-zinc-600 mb-4">
                    Display a QR code lightbox on your homepage
                  </p>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg mb-3 font-mono text-[11px] text-zinc-700 overflow-x-auto">
                    &lt;script src="https://audio.guide/widget.js"&gt;&lt;/script&gt;
                  </div>
                  <button
                    onClick={() =>
                      handleCopy('<script src="https://audio.guide/widget.js">', "embed-qr")
                    }
                    className="w-full px-3 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all"
                  >
                    {copiedText === "embed-qr" ? (
                      <>
                        <Check className="size-3.5 inline mr-1.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 inline mr-1.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Links */}
            <div>
              <h2 className="text-[20px] font-semibold text-zinc-950 mb-4">Smart Links</h2>
              <div className="space-y-3">
                {[
                  {
                    name: "Renaissance Masterpieces",
                    long: "https://audioguides.app/museo-arte/renaissance-masterpieces-2024",
                    short: "https://audio.guide/ren",
                  },
                  {
                    name: "Ancient Egypt Collection",
                    long: "https://audioguides.app/museo-arte/ancient-egypt-collection-2024",
                    short: "https://audio.guide/egypt",
                  },
                ].map((link, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white border border-zinc-200 rounded-xl"
                    style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)" }}
                  >
                    <h3 className="text-[15px] font-semibold text-zinc-950 mb-3">{link.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide w-16">
                          Long
                        </span>
                        <code className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-[12px] text-zinc-700 overflow-x-auto">
                          {link.long}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide w-16">
                          Short
                        </span>
                        <code className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-[12px] text-blue-700 font-semibold overflow-x-auto">
                          {link.short}
                        </code>
                        <button
                          onClick={() => handleCopy(link.short, `short-${index}`)}
                          className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all"
                        >
                          {copiedText === `short-${index}` ? (
                            <Check className="size-3.5 text-green-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution Analytics */}
            <div>
              <h2 className="text-[20px] font-semibold text-zinc-950 mb-4">
                Distribution Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                  { label: "QR Scans", value: "1,234", percent: "45%", color: "blue" },
                  { label: "Website Embed", value: "892", percent: "32%", color: "purple" },
                  { label: "Direct Links", value: "456", percent: "17%", color: "green" },
                  { label: "Email", value: "178", percent: "6%", color: "amber" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-6 bg-white border border-zinc-200 rounded-xl"
                    style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className={`size-4 text-${stat.color}-600`} />
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-[28px] font-bold text-zinc-950 mb-1">{stat.value}</p>
                    <p className="text-[13px] text-zinc-600">{stat.percent} of total</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white border border-zinc-200 rounded-xl">
                <h3 className="text-[16px] font-semibold text-zinc-950 mb-4">
                  Channel Performance
                </h3>
                <div className="space-y-3">
                  {[
                    { channel: "QR - Museum Entrance", scans: 456, trend: "+12%" },
                    { channel: "Landing Page - Renaissance", views: 1234, trend: "+8%" },
                    { channel: "Instagram Bio Link", clicks: 89, trend: "+24%" },
                    { channel: "Email Newsletter", clicks: 178, trend: "+5%" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-[14px] font-semibold text-zinc-950">
                          {item.channel}
                        </p>
                        <p className="text-[12px] text-zinc-600">
                          {item.scans
                            ? `${item.scans} scans`
                            : item.views
                            ? `${item.views} views`
                            : `${item.clicks} clicks`}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-[12px] font-semibold rounded">
                        {item.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Landing Page Modal (placeholder) */}
      {showCreateLanding && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-zinc-950">Create Landing Page</h2>
              <button
                onClick={() => setShowCreateLanding(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="text-[14px] text-zinc-600 mb-6">
              Landing page builder coming soon...
            </p>
            <button
              onClick={() => setShowCreateLanding(false)}
              className="w-full px-4 py-2.5 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create QR Modal (placeholder) */}
      {showCreateQR && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-zinc-950">Generate QR Code</h2>
              <button
                onClick={() => setShowCreateQR(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="text-[14px] text-zinc-600 mb-6">QR generator coming soon...</p>
            <button
              onClick={() => setShowCreateQR(false)}
              className="w-full px-4 py-2.5 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Asset Modal (placeholder) */}
      {showCreateAsset && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-zinc-950">Create Print Asset</h2>
              <button
                onClick={() => setShowCreateAsset(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="text-[14px] text-zinc-600 mb-6">Asset builder coming soon...</p>
            <button
              onClick={() => setShowCreateAsset(false)}
              className="w-full px-4 py-2.5 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
