import { useState } from "react";
import { 
  Smartphone, 
  Globe, 
  QrCode, 
  Download, 
  Plus,
  Check,
  X,
  Zap,
  ExternalLink,
  Copy,
} from "lucide-react";

export function Monetization() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [batchSize, setBatchSize] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showLemonSqueezySetup, setShowLemonSqueezySetup] = useState(false);

  // Generate unique QR codes
  const generateQRCodes = (count: number, guideName: string) => {
    const codes = [];
    for (let i = 0; i < count; i++) {
      const uniqueId = `QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const timestamp = new Date().toISOString();
      codes.push({
        qr_code: uniqueId,
        audioguide_id: guideName.toLowerCase().replace(/\s+/g, '-'),
        audioguide_name: guideName,
        created_at: timestamp,
        status: 'available',
        lemonsqueezy_variant_id: `variant_${Math.random().toString(36).substring(2, 9)}`,
        device_locked: false,
        scans: 0,
      });
    }
    return codes;
  };

  // Download CSV
  const downloadCSV = (codes: any[]) => {
    const headers = ['qr_code', 'audioguide_id', 'audioguide_name', 'created_at', 'status', 'lemonsqueezy_variant_id', 'device_locked', 'scans'];
    const csvContent = [
      headers.join(','),
      ...codes.map(code => 
        headers.map(header => code[header]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-codes-${codes[0].audioguide_id}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    const count = customAmount ? parseInt(customAmount) : batchSize;
    const codes = generateQRCodes(count, selectedGuide.name);
    downloadCSV(codes);
    setShowGenerateModal(false);
    setCustomAmount("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight mb-2">
            Monetization
          </h1>
          <p className="text-[15px] text-zinc-600 leading-relaxed">
            Manage free and paid audioguide access with device-locked QR codes
          </p>
        </div>

        <div className="space-y-6">
          {/* Access Control */}
          <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="size-6 text-zinc-900" />
              <div>
                <h2 className="text-[18px] font-semibold text-zinc-950">
                  Access Control & QR Codes
                </h2>
                <p className="text-[13px] text-zinc-600">
                  Choose between free universal access or paid device-locked access
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Globe className="size-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[14px] text-blue-900 mb-1">
                    How It Works
                  </div>
                  <ul className="text-[13px] text-blue-700 space-y-1">
                    <li>• <strong>Free audioguides:</strong> Single QR code accessible to everyone</li>
                    <li>• <strong>Paid audioguides:</strong> Unique QR code per visitor (device-locked)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Audioguides List */}
            <div className="space-y-3">
              {[
                { id: "1", name: "Renaissance Masterpieces", status: "free", qrs: 1 },
                { id: "2", name: "Ancient Egypt Collection", status: "paid", qrs: 45 },
                { id: "3", name: "Modern Art Gallery", status: "free", qrs: 1 },
              ].map((guide) => (
                <div
                  key={guide.id}
                  className="p-5 bg-zinc-50 rounded-lg border border-zinc-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold text-zinc-950 mb-2">
                        {guide.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-semibold border"
                          style={guide.status === "free"
                            ? { backgroundColor: '#FEE2E2', color: '#D33333', borderColor: '#FCA5A5' }
                            : { backgroundColor: '#FEF3C7', color: '#d97706', borderColor: '#FDE68A' }}
                        >
                          {guide.status === "free" ? "🌐 Free Access" : "🔒 Paid Access"}
                        </span>
                        <span className="text-[13px] text-zinc-600">
                          {guide.qrs} QR code{guide.qrs > 1 ? "s" : ""} generated
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {guide.status === "free" ? (
                        <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                          <QrCode className="size-3.5 inline mr-1.5" />
                          Download QR
                        </button>
                      ) : (
                        <button className="px-4 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all" onClick={() => { setShowGenerateModal(true); setSelectedGuide(guide); }}>
                          <Plus className="size-3.5 inline mr-1.5" />
                          Generate Visitor QR
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated QR Codes */}
          <div className="bg-white border border-zinc-200 rounded-xl p-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">
                  Recent Visitor QR Codes
                </h2>
                <p className="text-[13px] text-zinc-600">
                  Device-locked QR codes for paid audioguides
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                <Download className="size-4" />
                Export All
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: "QR-001", guide: "Ancient Egypt Collection", created: "2024-03-28 14:32", status: "active", scans: 1 },
                { id: "QR-002", guide: "Ancient Egypt Collection", created: "2024-03-28 14:15", status: "active", scans: 3 },
                { id: "QR-003", guide: "Ancient Egypt Collection", created: "2024-03-28 13:48", status: "active", scans: 5 },
                { id: "QR-004", guide: "Ancient Egypt Collection", created: "2024-03-27 16:22", status: "expired", scans: 8 },
              ].map((qr) => (
                <div
                  key={qr.id}
                  className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-white rounded-lg flex items-center justify-center border border-zinc-200">
                      <QrCode className="size-6 text-zinc-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-semibold text-zinc-950">{qr.id}</span>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-semibold"
                          style={qr.status === "active"
                            ? { backgroundColor: '#FEE2E2', color: '#D33333' }
                            : { backgroundColor: '#e4e4e7', color: '#71717a' }}
                        >
                          {qr.status}
                        </span>
                      </div>
                      <div className="text-[13px] text-zinc-600">
                        {qr.guide} · {qr.created}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                        Scans
                      </div>
                      <div className="text-[18px] font-bold text-zinc-950">{qr.scans}</div>
                    </div>
                    <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Download className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Info */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
            <h3 className="text-[14px] font-semibold text-zinc-950 mb-3 flex items-center gap-2">
              <Smartphone className="size-4" />
              Device Lock Technology
            </h3>
            <p className="text-[13px] text-zinc-700 leading-relaxed mb-4">
              Each paid QR code is unique and locks to the visitor's device on first scan. 
              The system captures a device fingerprint (browser + screen + user agent) to prevent 
              sharing. If scanned from a different device, access is denied.
            </p>
            <div className="flex items-start gap-2 text-[12px] text-zinc-600">
              <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>QR codes are non-transferable between devices</span>
            </div>
            <div className="flex items-start gap-2 text-[12px] text-zinc-600 mt-2">
              <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Works offline after first load (device fingerprint stored locally)</span>
            </div>
            <div className="flex items-start gap-2 text-[12px] text-zinc-600 mt-2">
              <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Simple to implement, effective for normal use cases</span>
            </div>
          </div>

          {/* LemonSqueezy Integration */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="size-12 bg-white rounded-xl flex items-center justify-center border border-yellow-200">
                <Zap className="size-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-[18px] font-semibold text-zinc-950 mb-1">
                  🍋 E-commerce Integration
                </h2>
                <p className="text-[13px] text-zinc-700 leading-relaxed">
                  Sell audioguide access online with LemonSqueezy — automatic tax handling & digital delivery
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Why LemonSqueezy */}
              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                <h3 className="text-[14px] font-semibold text-zinc-950 mb-3">
                  Why LemonSqueezy?
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-[12px] text-zinc-700">
                    <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Merchant of Record</strong> — handles EU VAT & international tax automatically</span>
                  </div>
                  <div className="flex items-start gap-2 text-[12px] text-zinc-700">
                    <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Digital delivery</strong> — automatic PDF/QR code email after payment</span>
                  </div>
                  <div className="flex items-start gap-2 text-[12px] text-zinc-700">
                    <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Webhooks</strong> — real-time notifications when visitor purchases</span>
                  </div>
                  <div className="flex items-start gap-2 text-[12px] text-zinc-700">
                    <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Zero compliance headache</strong> — perfect for international sales</span>
                  </div>
                </div>
              </div>

              {/* Setup Instructions */}
              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                <h3 className="text-[14px] font-semibold text-zinc-950 mb-3">
                  Quick Setup (5 minutes)
                </h3>
                <ol className="space-y-2 text-[12px] text-zinc-700">
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-900">1.</span>
                    <span>Create product in LemonSqueezy for each paid audioguide</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-900">2.</span>
                    <span>Upload CSV of QR codes as "variant_id" metadata</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-900">3.</span>
                    <span>Configure webhook → on payment, send unique QR via email</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-900">4.</span>
                    <span>Visitor pays → receives PDF → scans at museum → device locked ✅</span>
                  </li>
                </ol>
              </div>

              {/* Webhook Example */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-white">
                    Webhook Handler (Mock Example)
                  </h3>
                  <button className="text-zinc-400 hover:text-white transition-colors">
                    <Copy className="size-3.5" />
                  </button>
                </div>
                <pre className="text-[11px] text-green-400 leading-relaxed overflow-x-auto">
{`// POST /api/lemonsqueezy/webhook
{
  "event": "order_created",
  "data": {
    "order_id": "ord_123abc",
    "customer_email": "visitor@email.com",
    "product_variant_id": "variant_abc123"
  }
}

// 1. Find unused QR code with variant_abc123
// 2. Mark as 'sold' in database
// 3. Generate PDF with QR code
// 4. Send email to visitor@email.com
// 5. Update inventory count`}
                </pre>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-3">
                <a
                  href="https://lemonsqueezy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-zinc-900 text-[13px] font-semibold rounded-lg hover:bg-yellow-400 transition-all"
                >
                  <Zap className="size-4" />
                  Create LemonSqueezy Account
                  <ExternalLink className="size-3.5" />
                </a>
                <button className="px-4 py-3 bg-white border border-yellow-300 text-zinc-900 text-[13px] font-semibold rounded-lg hover:bg-yellow-50 transition-all">
                  View Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate QR Codes Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <div>
                <h2 className="text-[18px] font-semibold text-zinc-950">
                  Generate Visitor QR Codes
                </h2>
                <p className="text-[13px] text-zinc-600 mt-1">
                  {selectedGuide?.name}
                </p>
              </div>
              <button 
                onClick={() => setShowGenerateModal(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Batch Size Options */}
              <div>
                <label className="block text-[13px] font-semibold text-zinc-700 mb-3">
                  How many QR codes?
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[10, 50, 100].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setBatchSize(size);
                        setCustomAmount("");
                      }}
                      className={`px-4 py-3 rounded-lg border-2 text-[14px] font-semibold transition-all ${
                        batchSize === size && !customAmount
                          ? "border-zinc-900 bg-zinc-50 text-zinc-950"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-600 mb-2">
                    Or custom amount:
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 250"
                    min="1"
                    max="10000"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <QrCode className="size-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-blue-900 leading-relaxed">
                      Each QR code is <strong>unique</strong> and will be <strong>device-locked</strong> on first scan. 
                      CSV file will include LemonSqueezy variant IDs for e-commerce integration.
                    </p>
                  </div>
                </div>
              </div>

              {/* CSV Preview */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wide mb-2">
                  CSV Preview:
                </div>
                <div className="font-mono text-[10px] text-zinc-700 leading-relaxed">
                  qr_code,audioguide_id,created_at,status,variant_id<br/>
                  QR-ABC123,ancient-egypt,2024-03-30...,available,...<br/>
                  QR-XYZ789,ancient-egypt,2024-03-30...,available,...
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 p-6 border-t border-zinc-200 bg-zinc-50">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[14px] font-semibold rounded-lg hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!customAmount && !batchSize}
                className="flex-1 px-4 py-2.5 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="size-4" />
                Generate & Download CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lemon Squeezy Setup Modal */}
      {showLemonSqueezySetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-semibold text-zinc-950">
                Lemon Squeezy Setup
              </h2>
              <button className="text-zinc-500 hover:text-zinc-700" onClick={() => setShowLemonSqueezySetup(false)}>
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-zinc-500" />
                <span className="text-[13px] text-zinc-600">Set up Lemon Squeezy for {selectedGuide?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-700"
                  placeholder="Enter custom amount"
                />
                <button className="px-4 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all" onClick={handleGenerate}>
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}