import { TrendingUp, Users, Globe, AlertCircle } from "lucide-react";
import { PageShell } from "./PageShell";
import { mockAnalytics, mockMuseum } from "../../data/mockData";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function Analytics() {
  const usagePercentage = (mockAnalytics.totalAccesses / mockAnalytics.limit) * 100;
  const isNearLimit = usagePercentage >= 80;

  return (
    <PageShell><div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-600">
          Monitora l'utilizzo delle tue audioguide
        </p>
      </div>

      {/* Alert Banner */}
      {isNearLimit && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="size-6 text-orange-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-900 mb-1">
                Limite quasi raggiunto
              </h3>
              <p className="text-sm text-orange-800 mb-3">
                Hai utilizzato {mockAnalytics.totalAccesses} dei {mockAnalytics.limit} accessi 
                inclusi nel piano gratuito. Considera un upgrade per evitare interruzioni.
              </p>
              <button className="px-4 py-2 bg-orange-900 text-white rounded-lg hover:bg-orange-800 transition-colors text-sm">
                Upgrade piano
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users className="size-6 text-slate-700" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Accessi totali</div>
              <div className="text-2xl font-light text-slate-900">
                {mockAnalytics.totalAccesses}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Utilizzo mensile</span>
              <span className="text-slate-900">{usagePercentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${usagePercentage}%`,
                  backgroundColor: isNearLimit ? '#f97316' : '#D33333'
                }}
              />
            </div>
            <div className="text-xs text-slate-500">
              {mockAnalytics.limit - mockAnalytics.totalAccesses} accessi rimanenti
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="size-6 text-slate-700" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Media giornaliera</div>
              <div className="text-2xl font-light text-slate-900">
                {(mockAnalytics.totalAccesses / 30).toFixed(1)}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Accessi al giorno negli ultimi 30 giorni
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Globe className="size-6 text-slate-700" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Lingue attive</div>
              <div className="text-2xl font-light text-slate-900">
                {mockAnalytics.accessesByLanguage.length}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Numero di lingue utilizzate dai visitatori
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Accesses by Guide */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-6">
            Accessi per Audioguida
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockAnalytics.accessesByGuide}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
              <YAxis tick={{ fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="accesses" fill="#D33333" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accesses by Language */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-6">
            Distribuzione per Lingua
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAnalytics.accessesByLanguage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockAnalytics.accessesByLanguage.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#D33333" : "#71717a"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-6">
          Attività Recente
        </h3>
        <div className="space-y-3">
          {mockAnalytics.recentAccesses.map((access, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Users className="size-5 text-slate-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{access.date}</div>
                  <div className="text-sm text-slate-600">
                    {access.count} accessi
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {new Date(access.date).toLocaleDateString("it-IT", {
                  weekday: "short",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Info */}
      <div className="mt-8 bg-slate-50 rounded-xl p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="font-medium text-slate-900 mb-2">Piano Corrente: Gratuito</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>✓ Fino a 100 accessi al mese</li>
              <li>✓ Reset mensile automatico</li>
              <li>✓ Analytics di base</li>
            </ul>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600 mb-2">Prossimo reset</div>
            <div className="text-lg font-medium text-slate-900">1 Aprile 2026</div>
          </div>
        </div>
      </div>
    </div></PageShell>
  );
}
