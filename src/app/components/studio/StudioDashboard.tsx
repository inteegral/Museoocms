import { useState } from "react";
import { Link } from "react-router";
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

const editorialStatusConfig = {
  "in-progress": { label: "In Progress", color: "text-blue-600", bgColor: "bg-blue-100" },
  "under-revision": { label: "Under Revision", color: "text-orange-600", bgColor: "bg-orange-100" },
  "complete": { label: "Complete", color: "text-green-600", bgColor: "bg-green-100" },
};

export function StudioDashboard() {
  const [trendRange, setTrendRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");
  const [audioGuideRange, setAudioGuideRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");
  const [poiRange, setPoiRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");

  const { totalAccesses, limit, totalVisitors, takeUpRate, previousPeriodAccesses } = mockAnalytics;
  const usagePercentage = (totalAccesses / limit) * 100;
  const accessGrowth = ((totalAccesses - previousPeriodAccesses) / previousPeriodAccesses) * 100;

  const editorialStats = {
    inProgress: mockGuides.filter((g) => g.editorialStatus === "in-progress").length,
    underRevision: mockGuides.filter((g) => g.editorialStatus === "under-revision").length,
    readyToPublish: mockGuides.filter(
      (g) => g.editorialStatus === "complete" && g.status === "draft"
    ).length,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Logo Top Right */}
      <div className="fixed top-6 right-6 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <MainLogoVariant className="h-[32px] w-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
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
              title="Nuova Audioguida"
            >
              <MapPin className="size-4 text-[#D33333] transition-colors" strokeWidth={1.5} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Nuova Audioguida
              </span>
            </button>
            <button
              className="group relative size-9 rounded-lg border border-[#D33333] bg-white flex items-center justify-center transition-all hover:bg-red-50"
              title="Aggiungi POI"
            >
              <Plus className="size-4 text-[#D33333] transition-colors" strokeWidth={1.5} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Aggiungi POI
              </span>
            </button>
          </div>
        </div>

        {/* Top Row: Quick Stats + Take-up Rate */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
            <div className="text-[20px] font-semibold text-zinc-900 mb-1 tracking-tight">
              {mockGuides.length}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Audioguide
            </div>
          </div>

          <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
            <div className="text-[20px] font-semibold text-zinc-900 mb-1 tracking-tight">
              {mockGuides.reduce((acc, g) => acc + g.poiCount, 0)}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              POI Totali
            </div>
          </div>

          <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
            <div className="text-[20px] font-semibold text-zinc-900 mb-1 tracking-tight">
              {totalAccesses}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
              Accessi
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
                {takeUpRate}%
              </div>
              <div className="text-[10px] text-zinc-500">
                {totalAccesses}/{totalVisitors} visitatori
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
              {/* Trend Accessi - Area Chart */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Trend Accessi</h3>
                    <p className="text-[10px] text-zinc-500">Andamento temporale</p>
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
                  <AreaChart data={mockAnalytics.accessTrend}>
                    <defs>
                      <linearGradient id="colorAccessi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D33333" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#D33333" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9, fill: '#71717a' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e4e4e7' }}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: '#71717a' }}
                      tickLine={false}
                      axisLine={false}
                      width={25}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '10px',
                        padding: '6px 10px',
                        color: '#fff',
                      }}
                      labelStyle={{ color: '#a1a1aa', marginBottom: '2px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="accessi"
                      stroke="#D33333"
                      strokeWidth={2}
                      fill="url(#colorAccessi)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Radar: Performance Audioguide */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Performance Audioguide</h3>
                    <p className="text-[10px] text-zinc-500">Top 5 metriche</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {(["7D", "30D", "90D", "1Y"] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setAudioGuideRange(range)}
                        className={`px-2 py-0.5 text-[9px] font-medium rounded transition-all ${
                          audioGuideRange === range
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
                  <RadarChart data={mockAnalytics.audioGuidesPerformance}>
                    <PolarGrid stroke="#e4e4e7" strokeWidth={0.5} />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fontSize: 9, fill: '#71717a' }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 8, fill: '#a1a1aa' }}
                      axisLine={false}
                    />
                    <Radar
                      name="I Guerrieri di Vulci"
                      dataKey="I Guerrieri di Vulci"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.05}
                      strokeWidth={2.5}
                    />
                    <Radar
                      name="Necropoli di Tarquinia"
                      dataKey="Necropoli di Tarquinia"
                      stroke="#eab308"
                      fill="#eab308"
                      fillOpacity={0.05}
                      strokeWidth={2.5}
                    />
                    <Radar
                      name="Tombe Dipinte"
                      dataKey="Tombe Dipinte"
                      stroke="#ea580c"
                      fill="#ea580c"
                      fillOpacity={0.05}
                      strokeWidth={2.5}
                    />
                    <Radar
                      name="Tesori degli Etruschi"
                      dataKey="Tesori degli Etruschi"
                      stroke="#D33333"
                      fill="#D33333"
                      fillOpacity={0.05}
                      strokeWidth={2.5}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '10px',
                        padding: '6px 10px',
                        color: '#fff',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-[#D33333]" />
                    <span className="text-[9px] text-zinc-600">Tesori degli Etruschi</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-[#ea580c]" />
                    <span className="text-[9px] text-zinc-600">Tombe Dipinte</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-[#eab308]" />
                    <span className="text-[9px] text-zinc-600">Necropoli di Tarquinia</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-[#22c55e]" />
                    <span className="text-[9px] text-zinc-600">I Guerrieri di Vulci</span>
                  </div>
                </div>
              </div>

              {/* Radar: Top POI */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Top POI Ascoltati</h3>
                    <p className="text-[10px] text-zinc-500">Top 5 metriche</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {(["7D", "30D", "90D", "1Y"] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setPoiRange(range)}
                        className={`px-2 py-0.5 text-[9px] font-medium rounded transition-all ${
                          poiRange === range
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
                  <RadarChart data={mockAnalytics.topPOIsRadar}>
                    <PolarGrid stroke="#e4e4e7" strokeWidth={0.5} />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fontSize: 9, fill: '#71717a' }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 8, fill: '#a1a1aa' }}
                      axisLine={false}
                    />
                    <Radar
                      name="Elmo"
                      dataKey="Elmo"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.05}
                      strokeWidth={2.5}
                    />
                    <Radar
                      name="Mosaico"
                      dataKey="Mosaico"
                      stroke="#eab308"
                      fill="#eab308"
                      fillOpacity={0.05}
                      strokeWidth={2.5}
                    />
                    <Radar
                      name="Anfora"
                      dataKey="Anfora"
                      stroke="#ea580c"
                      fill="#ea580c"
                      fillOpacity={0.05}
                      strokeWidth={2.5}
                    />
                    <Radar
                      name="Venere"
                      dataKey="Venere"
                      stroke="#D33333"
                      fill="#D33333"
                      fillOpacity={0.05}
                      strokeWidth={2.5}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '10px',
                        padding: '6px 10px',
                        color: '#fff',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <div className="size-3.5 rounded-full bg-[#D33333] flex items-center justify-center">
                        <span className="text-[8px] text-white font-semibold">1</span>
                      </div>
                      <span className="text-[9px] text-zinc-600">Venere</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <div className="size-3.5 rounded-full bg-[#ea580c] flex items-center justify-center">
                        <span className="text-[8px] text-white font-semibold">2</span>
                      </div>
                      <span className="text-[9px] text-zinc-600">Anfora</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <div className="size-3.5 rounded-full bg-[#eab308] flex items-center justify-center">
                        <span className="text-[8px] text-white font-semibold">3</span>
                      </div>
                      <span className="text-[9px] text-zinc-600">Mosaico</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <div className="size-3.5 rounded-full bg-[#22c55e] flex items-center justify-center">
                        <span className="text-[8px] text-white font-semibold">4</span>
                      </div>
                      <span className="text-[9px] text-zinc-600">Elmo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Top POI + Lingue + Device */}
            <div className="grid grid-cols-2 gap-4">
              {/* Top POI - Half width */}
              <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
                <div className="mb-3">
                  <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Top POI</h3>
                  <p className="text-[10px] text-zinc-500">I più ascoltati</p>
                </div>
                <div className="space-y-2">
                  {mockAnalytics.topPOIs.slice(0, 4).map((poi, index) => (
                    <div key={poi.name} className="flex items-center gap-2">
                      <div
                        className="size-5 rounded flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                        style={{
                          backgroundColor: index === 0 ? '#D33333' : '#e4e4e7',
                          color: index === 0 ? '#fff' : '#71717a',
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-zinc-900 truncate">
                          {poi.name}
                        </div>
                      </div>
                      <div className="text-[12px] font-semibold text-zinc-900 tabular-nums">
                        {poi.ascolti}
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
                    <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Lingue</h3>
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
                              backgroundColor: lang.name === 'Italiano' ? '#D33333' : '#71717a',
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
                    <h3 className="text-[12px] font-semibold text-zinc-900 mb-0.5">Dispositivi</h3>
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
              <h3 className="text-[12px] font-semibold text-zinc-900 mb-3">Pipeline Editoriale</h3>
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
                <h3 className="text-[12px] font-semibold text-zinc-900">Recenti</h3>
                <Link to="/studio/guides" className="text-[10px] text-zinc-600 hover:text-zinc-900 uppercase tracking-wide font-medium">
                  Tutte →
                </Link>
              </div>
              <div className="space-y-2">
                {mockGuides.slice(0, 2).map((guide) => (
                  <Link
                    key={guide.id}
                    to={`/studio/guides/${guide.id}`}
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
                      {guide.poiCount} POI · {guide.languages.length} lingue
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}