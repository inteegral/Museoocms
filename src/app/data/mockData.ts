// Mock data for UI prototype - no business logic

export const mockMuseum = {
  id: "museum-1",
  name: "Museo Archeologico Nazionale",
  slug: "museo-archeologico",
  logo: "🏛️",
  plan: "free",
  monthlyAccesses: 47,
  accessLimit: 100,
};

export const mockPOIs = [
  {
    id: "poi-1",
    title: "Venere di Milo",
    body: "Benvenuto davanti alla Venere di Milo, una delle sculture più iconiche dell'arte greca antica. Questa statua in marmo risale al periodo ellenistico, circa 130-100 a.C., e rappresenta Afrodite, la dea greca dell'amore e della bellezza...",
    imageUrl: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&q=80",
    orderIndex: 0,
  },
  {
    id: "poi-2",
    title: "Anfora Attica",
    body: "Questa anfora attica a figure nere è un capolavoro della ceramografia greca del VI secolo a.C. Le scene raffigurate mostrano episodi della mitologia greca, con particolare attenzione ai dettagli anatomici e alla composizione narrativa...",
    imageUrl: "https://images.unsplash.com/photo-1582561833988-4b3c1b3a3e7e?w=800&q=80",
    orderIndex: 1,
  },
  {
    id: "poi-3",
    title: "Mosaico Romano",
    body: "Ammira questo straordinario mosaico romano del III secolo d.C., scoperto durante gli scavi del 1987. Le tessere policrome formano scene di vita quotidiana, offrendo una finestra privilegiata sulla società romana...",
    imageUrl: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&q=80",
    orderIndex: 2,
  },
  {
    id: "poi-4",
    title: "Elmo Corinzio",
    body: "Questo elmo di bronzo corinzio risale al V secolo a.C. ed è un esempio perfetto dell'armatura dei guerrieri greci. La forma caratteristica proteggeva interamente il capo, lasciando solo piccole aperture per occhi e bocca...",
    imageUrl: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800&q=80",
    orderIndex: 3,
  },
  {
    id: "poi-5",
    title: "Statua di Apollo",
    body: "La statua di Apollo, dio della musica e della poesia, è un esempio sublime della scultura classica greca. Le proporzioni perfette e l'espressione serena incarnano l'ideale di bellezza dell'antichità...",
    imageUrl: "https://images.unsplash.com/photo-1515169974336-64e1e4dbfe7d?w=800&q=80",
    orderIndex: 4,
  },
];

export const mockGuides = [
  {
    id: "guide-1",
    title: "Tour Completo del Museo",
    description: "Un viaggio attraverso le collezioni permanenti",
    status: "published" as const,
    editorialStatus: "complete" as const,
    poiCount: 8,
    languages: ["it", "en"],
    createdAt: "15 gen 2024",
    thumbnail: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3c2?w=200&h=200&fit=crop",
  },
  {
    id: "guide-2",
    title: "Highlights - Capolavori Imperdibili",
    description: "Le opere più importanti in 30 minuti",
    status: "draft" as const,
    editorialStatus: "under-revision" as const,
    poiCount: 5,
    languages: ["it"],
    createdAt: "20 gen 2024",
    thumbnail: "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=200&h=200&fit=crop",
  },
  {
    id: "guide-3",
    title: "Percorso per Famiglie",
    description: "Arte e storia raccontata ai più piccoli",
    status: "draft" as const,
    editorialStatus: "in-progress" as const,
    poiCount: 6,
    languages: ["it"],
    createdAt: "22 gen 2024",
    thumbnail: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=200&h=200&fit=crop",
  },
];

export const mockDocuments = [
  {
    id: "doc-1",
    filename: "catalogo-collezione-greca.pdf",
    uploadedAt: "2026-03-10",
    size: "2.4 MB",
  },
  {
    id: "doc-2",
    filename: "schede-didattiche-2024.docx",
    uploadedAt: "2026-03-12",
    size: "1.1 MB",
  },
  {
    id: "doc-3",
    filename: "storia-museo.txt",
    uploadedAt: "2026-03-14",
    size: "45 KB",
  },
];

export const mockAnalytics = {
  totalAccesses: 47,
  limit: 100,
  totalVisitors: 320, // Visitatori totali museo questo mese
  takeUpRate: 14.7, // 47/320 = 14.7% take-up rate
  previousPeriodAccesses: 38, // Mese precedente per confronto
  accessesByGuide: [
    { name: "Tour Completo", accesses: 32 },
    { name: "Highlights", accesses: 15 },
  ],
  accessesByLanguage: [
    { name: "Italiano", value: 28, percentage: 45 },
    { name: "English", value: 19, percentage: 30 },
    { name: "Español", value: 8, percentage: 13 },
    { name: "日本語", value: 7, percentage: 12 },
  ],
  recentAccesses: [
    { date: "2026-03-30", count: 8 },
    { date: "2026-03-29", count: 12 },
    { date: "2026-03-28", count: 6 },
    { date: "2026-03-27", count: 9 },
    { date: "2026-03-26", count: 12 },
  ],
  // Trend ultimi 30 giorni
  accessTrend: [
    { date: "1 Mar", accessi: 2 },
    { date: "3 Mar", accessi: 4 },
    { date: "5 Mar", accessi: 6 },
    { date: "7 Mar", accessi: 8 },
    { date: "9 Mar", accessi: 11 },
    { date: "11 Mar", accessi: 14 },
    { date: "13 Mar", accessi: 17 },
    { date: "15 Mar", accessi: 21 },
    { date: "17 Mar", accessi: 24 },
    { date: "19 Mar", accessi: 28 },
    { date: "21 Mar", accessi: 32 },
    { date: "23 Mar", accessi: 36 },
    { date: "25 Mar", accessi: 39 },
    { date: "27 Mar", accessi: 42 },
    { date: "29 Mar", accessi: 45 },
    { date: "Oggi", accessi: 47 },
  ],
  // Top POI per ascolti
  topPOIs: [
    { name: "Venere di Milo", ascolti: 42, tempoMedio: "2m 30s" },
    { name: "Anfora Attica", ascolti: 38, tempoMedio: "1m 45s" },
    { name: "Mosaico Romano", ascolti: 35, tempoMedio: "2m 10s" },
    { name: "Elmo Corinzio", ascolti: 31, tempoMedio: "1m 30s" },
    { name: "Statua Apollo", ascolti: 28, tempoMedio: "2m 00s" },
  ],
  // Device breakdown
  deviceBreakdown: [
    { device: "iOS", percentage: 62, count: 29 },
    { device: "Android", percentage: 38, count: 18 },
  ],
  // Radar: Audioguide Performance (valori normalizzati 0-100)
  audioGuidesPerformance: [
    { metric: "Ascolti", "Tesori degli Etruschi": 95, "Tombe Dipinte": 60, "Necropoli di Tarquinia": 45, "I Guerrieri di Vulci": 38 },
    { metric: "Completamento", "Tesori degli Etruschi": 78, "Tombe Dipinte": 85, "Necropoli di Tarquinia": 70, "I Guerrieri di Vulci": 82 },
    { metric: "Engagement", "Tesori degli Etruschi": 82, "Tombe Dipinte": 90, "Necropoli di Tarquinia": 65, "I Guerrieri di Vulci": 75 },
    { metric: "Rating", "Tesori degli Etruschi": 88, "Tombe Dipinte": 92, "Necropoli di Tarquinia": 80, "I Guerrieri di Vulci": 85 },
    { metric: "Condivisioni", "Tesori degli Etruschi": 70, "Tombe Dipinte": 55, "Necropoli di Tarquinia": 40, "I Guerrieri di Vulci": 50 },
  ],
  // Radar: Top POI (valori normalizzati 0-100)
  topPOIsRadar: [
    { metric: "Ascolti", "Venere": 100, "Anfora": 90, "Mosaico": 83, "Elmo": 74 },
    { metric: "Tempo", "Venere": 85, "Anfora": 60, "Mosaico": 75, "Elmo": 50 },
    { metric: "Retention", "Venere": 92, "Anfora": 88, "Mosaico": 85, "Elmo": 80 },
    { metric: "Rewind", "Venere": 65, "Anfora": 55, "Mosaico": 60, "Elmo": 45 },
    { metric: "Share", "Venere": 75, "Anfora": 60, "Mosaico": 70, "Elmo": 50 },
  ],
};

export const mockPacks = [
  {
    type: "voice_10",
    name: "Voice 10",
    description: "Generazione vocale per 1 lingua, fino a 10 POI",
    price: "€19",
    maxPois: 10,
  },
  {
    type: "voice_20",
    name: "Voice 20",
    description: "Generazione vocale per 1 lingua, fino a 20 POI",
    price: "€29",
    maxPois: 20,
  },
  {
    type: "lang_10",
    name: "+ Language 10",
    description: "Traduzione + TTS per 1 lingua aggiuntiva, fino a 10 POI",
    price: "€15",
    maxPois: 10,
  },
  {
    type: "lang_20",
    name: "+ Language 20",
    description: "Traduzione + TTS per 1 lingua aggiuntiva, fino a 20 POI",
    price: "€22",
    maxPois: 20,
  },
];

export const languages = [
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];