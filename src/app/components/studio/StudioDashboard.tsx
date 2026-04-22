import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FileAudio,
  MapPin,
  FileText,
  BarChart3,
  Plus,
  ExternalLink,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Smartphone,
} from "lucide-react";
import { mockMuseum, mockGuides, mockAnalytics } from "../../data/mockData";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import MainLogoVariant from "../../../imports/MainLogoVariant5";
import { PageShell } from "./PageShell";

const editorialStatusConfig = {
  "in-progress": { label: "In Progress", color: "text-blue-600", bgColor: "bg-blue-100" },
  "under-revision": { label: "Under Revision", color: "text-orange-600", bgColor: "bg-orange-100" },
  "complete": { label: "Complete", color: "text-green-600", bgColor: "bg-green-100" },
};

// Warm tones — one per guide, used in trend + guide performance
const GUIDE_COLOR: Record<string, string> = {
  "guide-1": "#D33333",  // red   — Complete Tour
  "guide-2": "#ea580c",  // orange — Highlights
  "guide-3": "#f59e0b",  // amber  — Family Tour
};

// Cool tones — one per rank position, clearly distinct from guide palette
const POI_COLOR = ["#6366f1", "#0ea5e9", "#10b981", "#8b5cf6", "#06b6d4"]; // indigo, sky, emerald, violet, cyan

const TREND_SERIES = [
  { id: "guide-1", key: "Complete Tour" },
  { id: "guide-2", key: "Highlights"    },
  { id: "guide-3", key: "Family Tour"   },
].map(s => ({ ...s, color: GUIDE_COLOR[s.id] }));

const GUIDE_PERF_SERIES = [
  { key: "Etruscan Treasures",   guideId: "guide-1" },
  { key: "Painted Tombs",        guideId: "guide-2" },
  { key: "Warriors of Vulci",    guideId: "guide-3" },
  { key: "Tarquinia Necropolis", guideId: null       },
].map(s => ({ ...s, color: s.guideId ? GUIDE_COLOR[s.guideId] : "#a1a1aa" }));

// Top POIs per guide — colors assigned by rank position, not identity
// Top 5 POIs per guide — always 5 entries
const POI_BY_GUIDE: Record<string, { key: string; rank: number }[]> = {
  "all":     [{ key: "Venus", rank: 1 }, { key: "Mosaic", rank: 2 }, { key: "Forum", rank: 3 }, { key: "Amphora", rank: 4 }, { key: "Helmet", rank: 5 }],
  "guide-1": [{ key: "Venus", rank: 1 }, { key: "Amphora", rank: 2 }, { key: "Apollo", rank: 3 }, { key: "Athena", rank: 4 }, { key: "Bacchus", rank: 5 }],
  "guide-2": [{ key: "Mosaic", rank: 1 }, { key: "Helmet", rank: 2 }, { key: "Sphinx", rank: 3 }, { key: "Scarab", rank: 4 }, { key: "Papyrus", rank: 5 }],
  "guide-3": [{ key: "Forum", rank: 1 }, { key: "Arch", rank: 2 }, { key: "Fresco", rank: 3 }, { key: "Column", rank: 4 }, { key: "Coins", rank: 5 }],
};

// Per-guide mock overrides (prototype only — real data would come from API)
const guideStats: Record<string, { accesses: number; visitors: number; takeUpRate: number; poiCount: number }> = {
  "guide-1": { accesses: 32, visitors: 180, takeUpRate: 17.8, poiCount: 8 },
  "guide-2": { accesses: 15, visitors: 120, takeUpRate: 12.5, poiCount: 5 },
  "guide-3": { accesses:  0, visitors:   0, takeUpRate:  0.0, poiCount: 6 },
};

export function StudioDashboard() {
  const [trendRange, setTrendRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");
  const [audioGuideRange, setAudioGuideRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");
  const [poiRange, setPoiRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");
  const [selectedGuideId, setSelectedGuideId] = useState<string>("all");
  const navigate = useNavigate();

  const { totalAccesses, limit, totalVisitors, takeUpRate, previousPeriodAccesses } = mockAnalytics;
  const usagePercentage = (totalAccesses / limit) * 100;
  const accessGrowth = ((totalAccesses - previousPeriodAccesses) / previousPeriodAccesses) * 100;

  const selectedGuide = selectedGuideId === "all" ? null : mockGuides.find(g => g.id === selectedGuideId) ?? null;
  const activeStats = selectedGuide && guideStats[selectedGuide.id]
    ? guideStats[selectedGuide.id]
    : { accesses: totalAccesses, visitors: totalVisitors, takeUpRate, poiCount: mockGuides.reduce((a, g) => a + g.poiCount, 0) };

  const visibleGuides = selectedGuide ? [selectedGuide] : mockGuides;

  const editorialStats = {
    inProgress:     visibleGuides.filter((g) => g.editorialStatus === "in-progress").length,
    underRevision:  visibleGuides.filter((g) => g.editorialStatus === "under-revision").length,
    readyToPublish: visibleGuides.filter((g) => g.editorialStatus === "complete" && g.status === "draft").length,
  };

  return (
    <PageShell>
      {/* Fixed Logo Top Right */}
      <div className="fixed top-6 right-6 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <MainLogoVariant className="h-[32px] w-auto" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header - Compact */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1
              className="text-[24px] leading-tight tracking-tight text-zinc-900 mb-1"
              style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              Dashboard
            </h1>
            <p className="text-[13px] text-zinc-600">
              {mockMuseum.name}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              className="group relative size-9 rounded-lg border border-[#D33333] bg-white flex items-center justify-center transition-all hover:bg-red-50"
              title="New Guide"
            >
              <MapPin className="size-4 text-[#D33333] transition-colors" strokeWidth={1.5} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                New Guide
              </span>
            </button>
            <button
              onClick={() => navigate("/pois?new=true")}
              className="group relative size-9 rounded-lg border border-[#D33333] bg-white flex items-center justify-center transition-all hover:bg-red-50"
              title="Add POI"
            >
              <Plus className="size-4 text-[#D33333] transition-colors" strokeWidth={1.5} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Add POI
              </span>
            </button>
          </div>
        </div>

        {/* Guide selector */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setSelectedGuideId("all")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
              selectedGuideId === "all"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            All guides
          </button>
          {mockGuides.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGuideId(g.id)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                selectedGuideId === g.id
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              {g.title}
            </button>
          ))}
        </div>

        {/* Top Row: Quick Stats + Take-up Rate */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
            <div className="text-[20px] font-semibold text-zinc-900 mb-1 tracking-tight">
              {selectedGuide ? 1 : mockGuides.length}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Audioguide
            </div>
          </div>

          <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
            <div className="text-[20px] font-semibold text-zinc-900 mb-1 tracking-tight">
              {activeStats.poiCount}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Total POIs
            </div>
          </div>

          <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
            <div className="text-[20px] font-semibold text-zinc-900 mb-1 tracking-tight">
              {activeStats.accesses}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Accesses
            </div>
          </div>

          {/* Take-up Rate - highlighted */}
          <div className="col-span-2 bg-zinc-50 rounded-lg border border-zinc-200 p-4" style={{ borderColor: '#D33333', borderWidth: '1px' }}>
            <div className="flex items-start justify-between mb-1">
              <div className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
                Take-up Rate
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="size-3" strokeWidth={2} />
                <span className="text-[9px] font-semibold">+2.3%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-[24px] font-semibold tracking-tight" style={{ color: '#D33333' }}>
                {activeStats.takeUpRate}%
              </div>
              <div className="text-[10px] text-zinc-500">
                {activeStats.accesses}/{activeStats.visitors} visitors
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Analytics + Right Sidebar */}
        <div className="grid lg:grid-cols-[1fr,380px] gap-4">
          {/* LEFT: Analytics Charts */}
          <div className="space-y-4">
            {/* Analytics Charts - Three in a Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Trend Accessi - Multi-line */}
              {(() => {
                const visibleSeries = selectedGuideId === "all"
                  ? TREND_SERIES
                  : TREND_SERIES.filter(s => s.id === selectedGuideId);
                return (
                  <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Access Trend</h3>
                        <p className="text-[10px] text-zinc-500">Per guide · over time</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {(["7D", "30D", "90D", "1Y"] as const).map((range) => (
                          <button
                            key={range}
                            onClick={() => setTrendRange(range)}
                            className={`px-2 py-0.5 text-[9px] font-medium rounded transition-all ${
                              trendRange === range
                                ? "bg-[#D33333] text-white"
                                : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400"
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={mockAnalytics.accessTrend}>
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#71717a' }} tickLine={false} axisLine={{ stroke: '#e4e4e7' }} />
                        <YAxis tick={{ fontSize: 9, fill: '#71717a' }} tickLine={false} axisLine={false} width={25} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '6px', fontSize: '10px', padding: '6px 10px', color: '#fff' }}
                          labelStyle={{ color: '#a1a1aa', marginBottom: '2px' }}
                        />
                        {visibleSeries.map(s => (
                          <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} dot={false} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                      {visibleSeries.map(s => (
                        <div key={s.key} className="flex items-center gap-1.5">
                          <div className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-[9px] text-zinc-600">{s.key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Radar: Guide Performance */}
              {(() => {
                const visibleGuideSeries = selectedGuideId === "all"
                  ? GUIDE_PERF_SERIES
                  : GUIDE_PERF_SERIES.filter(s => s.guideId === selectedGuideId);
                return (
                  <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Guide Performance</h3>
                        <p className="text-[10px] text-zinc-500">Top 5 metrics</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {(["7D", "30D", "90D", "1Y"] as const).map((range) => (
                          <button key={range} onClick={() => setAudioGuideRange(range)}
                            className={`px-2 py-0.5 text-[9px] font-medium rounded transition-all ${audioGuideRange === range ? "bg-[#D33333] text-white" : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400"}`}>
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={mockAnalytics.audioGuidesPerformance}>
                        <PolarGrid stroke="#e4e4e7" strokeWidth={0.5} />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#71717a' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8, fill: '#a1a1aa' }} axisLine={false} />
                        {visibleGuideSeries.map(s => (
                          <Radar key={s.key} name={s.key} dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={0.05} strokeWidth={2.5} />
                        ))}
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '6px', fontSize: '10px', padding: '6px 10px', color: '#fff' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                      {visibleGuideSeries.map(s => (
                        <div key={s.key} className="flex items-center gap-1.5">
                          <div className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-[9px] text-zinc-600">{s.key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Radar: Top POI */}
              {(() => {
                const visiblePOISeries = (POI_BY_GUIDE[selectedGuideId] ?? POI_BY_GUIDE["all"])
                  .map((p, i) => ({ ...p, color: POI_COLOR[i % POI_COLOR.length] }));
                return (
                  <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Top Listened POIs</h3>
                        <p className="text-[10px] text-zinc-500">Top 5 metrics</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {(["7D", "30D", "90D", "1Y"] as const).map((range) => (
                          <button key={range} onClick={() => setPoiRange(range)}
                            className={`px-2 py-0.5 text-[9px] font-medium rounded transition-all ${poiRange === range ? "bg-[#D33333] text-white" : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400"}`}>
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={mockAnalytics.topPOIsRadar}>
                        <PolarGrid stroke="#e4e4e7" strokeWidth={0.5} />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#71717a' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8, fill: '#a1a1aa' }} axisLine={false} />
                        {visiblePOISeries.map(s => (
                          <Radar key={s.key} name={s.key} dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={0.05} strokeWidth={2.5} />
                        ))}
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '6px', fontSize: '10px', padding: '6px 10px', color: '#fff' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                      {visiblePOISeries.map(s => (
                        <div key={s.key} className="flex items-center gap-1.5">
                          <div className="size-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: s.color }}>
                            <span className="text-[8px] text-white font-semibold">{s.rank}</span>
                          </div>
                          <span className="text-[9px] text-zinc-600">{s.key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Row: Top POI + Lingue + Device */}
            <div className="grid grid-cols-2 gap-4">
              {/* Top POI - Half width */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                <div className="mb-3">
                  <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Top POI</h3>
                  <p className="text-[10px] text-zinc-500">Most listened</p>
                </div>
                <div className="space-y-2">
                  {(POI_BY_GUIDE[selectedGuideId] ?? POI_BY_GUIDE["all"]).map((poi, index) => (
                    <div key={poi.name} className="flex items-center gap-2">
                      <div
                        className="size-5 rounded flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                        style={{ backgroundColor: POI_COLOR[index], color: '#fff' }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-zinc-900 truncate">
                          {poi.key}
                        </div>
                      </div>
                      <div className="text-[12px] font-semibold text-zinc-900 tabular-nums">
                        {poi.rank}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lingue + Device stacked */}
              <div className="space-y-4">
                {/* Lingue - Compact */}
                <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                  <div className="mb-3">
                    <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Languages</h3>
                  </div>
                  <div className="space-y-2">
                    {mockAnalytics.accessesByLanguage.map((lang) => (
                      <div key={lang.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-zinc-900">{lang.name}</span>
                          <span className="text-[10px] font-semibold text-zinc-600 tabular-nums">
                            {lang.percentage}%
                          </span>
                        </div>
                        <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${lang.percentage}%`,
                              backgroundColor: lang.name === 'Italian' ? '#D33333' : '#71717a',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              {/* Device - Compact */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                  <div className="mb-3">
                    <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Devices</h3>
                  </div>
                  <div className="space-y-2">
                    {mockAnalytics.deviceBreakdown.map((item) => {
                      return (
                        <div key={item.device} className="flex items-center gap-2">
                          <Smartphone className="size-3.5 text-zinc-600 flex-shrink-0" strokeWidth={1.5} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[11px] font-medium text-zinc-900">{item.device}</span>
                              <span className="text-[10px] font-semibold text-zinc-600 tabular-nums">
                                {item.percentage}%
                              </span>
                            </div>
                            <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${item.percentage}%`,
                                  backgroundColor: item.device === 'iOS' ? '#D33333' : '#71717a',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar - Editorial Pipeline + Recent */}
          <div className="space-y-4">
            {/* Editorial Pipeline - Compact */}
            <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
              <h3 className="text-[12px] font-semibold text-zinc-900 mb-3">Editorial Pipeline</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border border-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="size-1 rounded-full" style={{ backgroundColor: '#D33333' }} />
                    <span className="text-[11px] font-medium text-zinc-900">In Progress</span>
                  </div>
                  <span className="text-[16px] font-semibold text-zinc-900">{editorialStats.inProgress}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="size-1 rounded-full bg-orange-500" />
                    <span className="text-[11px] font-medium text-zinc-900">Under Revision</span>
                  </div>
                  <span className="text-[16px] font-semibold text-zinc-900">{editorialStats.underRevision}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="size-1 rounded-full bg-green-500" />
                    <span className="text-[11px] font-medium text-zinc-900">Ready</span>
                  </div>
                  <span className="text-[16px] font-semibold text-zinc-900">{editorialStats.readyToPublish}</span>
                </div>
              </div>
            </div>

            {/* Recent Guides - Compact */}
            <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[12px] font-semibold text-zinc-900">Recent</h3>
                <Link to="/guides" className="text-[10px] text-zinc-600 hover:text-zinc-900 uppercase tracking-wide font-medium">
                  All →
                </Link>
              </div>
              <div className="space-y-2">
                {visibleGuides.slice(0, 3).map((guide) => (
                  <Link
                    key={guide.id}
                    to={`/guides/${guide.id}`}
                    className="block p-2 bg-white rounded border border-zinc-200 hover:border-zinc-900 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-[11px] font-semibold text-zinc-900 truncate flex-1">
                        {guide.title}
                      </div>
                      <div
                        className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 font-semibold"
                        style={guide.status === "published" ? { backgroundColor: '#D33333', color: '#fff' } : { backgroundColor: '#e4e4e7', color: '#71717a' }}
                      >
                        {guide.status === "published" ? "Live" : "Draft"}
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {guide.poiCount} POI · {guide.languages.length} languages
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
}