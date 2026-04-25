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
    title: "Venus de Milo",
    body: "Welcome to the Venus de Milo, one of the most iconic sculptures of ancient Greek art. This marble statue dates from the Hellenistic period, around 130–100 BC, and represents Aphrodite, the Greek goddess of love and beauty...",
    imageUrl: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&q=80",
    orderIndex: 0,
  },
  {
    id: "poi-2",
    title: "Attic Amphora",
    body: "This black-figure Attic amphora is a masterpiece of Greek pottery from the 6th century BC. The depicted scenes illustrate episodes from Greek mythology, with particular attention to anatomical detail and narrative composition...",
    imageUrl: "https://images.unsplash.com/photo-1582561833988-4b3c1b3a3e7e?w=800&q=80",
    orderIndex: 1,
  },
  {
    id: "poi-3",
    title: "Roman Mosaic",
    body: "Admire this extraordinary Roman mosaic from the 3rd century AD, discovered during the 1987 excavations. The polychrome tesserae form scenes of everyday life, offering a privileged window into Roman society...",
    imageUrl: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&q=80",
    orderIndex: 2,
  },
  {
    id: "poi-4",
    title: "Corinthian Helmet",
    body: "This Corinthian bronze helmet dates from the 5th century BC and is a perfect example of Greek warrior armour. Its distinctive shape fully protected the head, leaving only small openings for the eyes and mouth...",
    imageUrl: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800&q=80",
    orderIndex: 3,
  },
  {
    id: "poi-5",
    title: "Apollo Statue",
    body: "The statue of Apollo, god of music and poetry, is a sublime example of classical Greek sculpture. Its perfect proportions and serene expression embody the ancient ideal of beauty...",
    imageUrl: "https://images.unsplash.com/photo-1515169974336-64e1e4dbfe7d?w=800&q=80",
    orderIndex: 4,
  },
];

export const mockGuides = [
  {
    id: "guide-1",
    title: "Complete Museum Tour",
    description: "A journey through the permanent collections",
    status: "published" as const,
    editorialStatus: "complete" as const,
    poiCount: 8,
    languages: ["it", "en"],
    createdAt: "15 gen 2024",
    thumbnail: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&q=80",
  },
  {
    id: "guide-2",
    title: "Highlights - Must-See Masterpieces",
    description: "The most important works in 30 minutes",
    status: "draft" as const,
    editorialStatus: "under-revision" as const,
    poiCount: 5,
    languages: ["it"],
    createdAt: "20 gen 2024",
    thumbnail: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&q=80",
  },
  {
    id: "guide-3",
    title: "Family Tour",
    description: "Art and history told for young visitors",
    status: "draft" as const,
    editorialStatus: "in-progress" as const,
    poiCount: 6,
    languages: ["it"],
    createdAt: "22 gen 2024",
    thumbnail: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800&q=80",
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
  totalVisitors: 320,
  takeUpRate: 14.7,
  previousPeriodAccesses: 38,
  avgRating: 4.3,
  totalReviews: 47,
  codesOrdered: 20500,
  codesRedeemed: 1450,
  accessesByGuide: [
    { name: "Complete Tour", accesses: 32 },
    { name: "Highlights", accesses: 15 },
  ],
  accessesByLanguage: [
    { name: "Italian", value: 28, percentage: 45 },
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
  accessTrend: [
    { date: "1 Mar",  "Complete Tour": 2,  "Highlights": 0,  "Family Tour": 0  },
    { date: "3 Mar",  "Complete Tour": 4,  "Highlights": 0,  "Family Tour": 0  },
    { date: "5 Mar",  "Complete Tour": 5,  "Highlights": 1,  "Family Tour": 0  },
    { date: "7 Mar",  "Complete Tour": 6,  "Highlights": 2,  "Family Tour": 0  },
    { date: "9 Mar",  "Complete Tour": 7,  "Highlights": 3,  "Family Tour": 1  },
    { date: "11 Mar", "Complete Tour": 9,  "Highlights": 4,  "Family Tour": 1  },
    { date: "13 Mar", "Complete Tour": 11, "Highlights": 5,  "Family Tour": 1  },
    { date: "15 Mar", "Complete Tour": 13, "Highlights": 6,  "Family Tour": 2  },
    { date: "17 Mar", "Complete Tour": 15, "Highlights": 7,  "Family Tour": 2  },
    { date: "19 Mar", "Complete Tour": 18, "Highlights": 8,  "Family Tour": 2  },
    { date: "21 Mar", "Complete Tour": 20, "Highlights": 9,  "Family Tour": 3  },
    { date: "23 Mar", "Complete Tour": 22, "Highlights": 10, "Family Tour": 4  },
    { date: "25 Mar", "Complete Tour": 24, "Highlights": 11, "Family Tour": 4  },
    { date: "27 Mar", "Complete Tour": 26, "Highlights": 12, "Family Tour": 4  },
    { date: "29 Mar", "Complete Tour": 29, "Highlights": 13, "Family Tour": 3  },
    { date: "Today",  "Complete Tour": 32, "Highlights": 15, "Family Tour": 0  },
  ],
  // Top POI per ascolti
  topPOIs: [
    { name: "Venus de Milo", plays: 42, avgTime: "2m 30s" },
    { name: "Attic Amphora", plays: 38, avgTime: "1m 45s" },
    { name: "Roman Mosaic", plays: 35, avgTime: "2m 10s" },
    { name: "Corinthian Helmet", plays: 31, avgTime: "1m 30s" },
    { name: "Apollo Statue", plays: 28, avgTime: "2m 00s" },
  ],
  // Device breakdown
  deviceBreakdown: [
    { device: "iOS", percentage: 62, count: 29 },
    { device: "Android", percentage: 38, count: 18 },
  ],
  audioGuidesPerformance: [
    { metric: "Plays", "Etruscan Treasures": 95, "Painted Tombs": 60, "Tarquinia Necropolis": 45, "Warriors of Vulci": 38 },
    { metric: "Completion", "Etruscan Treasures": 78, "Painted Tombs": 85, "Tarquinia Necropolis": 70, "Warriors of Vulci": 82 },
    { metric: "Engagement", "Etruscan Treasures": 82, "Painted Tombs": 90, "Tarquinia Necropolis": 65, "Warriors of Vulci": 75 },
    { metric: "Rating", "Etruscan Treasures": 88, "Painted Tombs": 92, "Tarquinia Necropolis": 80, "Warriors of Vulci": 85 },
    { metric: "Shares", "Etruscan Treasures": 70, "Painted Tombs": 55, "Tarquinia Necropolis": 40, "Warriors of Vulci": 50 },
  ],
  topPOIsRadar: [
    { metric: "Plays",     "Venus": 100, "Amphora": 90, "Apollo": 72, "Athena": 68, "Bacchus": 60, "Mosaic": 83, "Helmet": 74, "Sphinx": 66, "Scarab": 58, "Papyrus": 50, "Forum": 78, "Fresco": 65, "Coins": 55, "Arch": 70, "Column": 62 },
    { metric: "Time",      "Venus": 85,  "Amphora": 60, "Apollo": 70, "Athena": 62, "Bacchus": 55, "Mosaic": 75, "Helmet": 50, "Sphinx": 68, "Scarab": 48, "Papyrus": 42, "Forum": 68, "Fresco": 58, "Coins": 45, "Arch": 72, "Column": 55 },
    { metric: "Retention", "Venus": 92,  "Amphora": 88, "Apollo": 80, "Athena": 78, "Bacchus": 72, "Mosaic": 85, "Helmet": 80, "Sphinx": 76, "Scarab": 70, "Papyrus": 65, "Forum": 82, "Fresco": 72, "Coins": 65, "Arch": 80, "Column": 68 },
    { metric: "Rewind",    "Venus": 65,  "Amphora": 55, "Apollo": 50, "Athena": 48, "Bacchus": 42, "Mosaic": 60, "Helmet": 45, "Sphinx": 52, "Scarab": 40, "Papyrus": 35, "Forum": 58, "Fresco": 42, "Coins": 38, "Arch": 55, "Column": 44 },
    { metric: "Share",     "Venus": 75,  "Amphora": 60, "Apollo": 55, "Athena": 52, "Bacchus": 45, "Mosaic": 70, "Helmet": 50, "Sphinx": 62, "Scarab": 44, "Papyrus": 38, "Forum": 68, "Fresco": 48, "Coins": 40, "Arch": 62, "Column": 50 },
  ],
};

export const mockPacks = [
  {
    type: "voice_10",
    name: "Voice 10",
    description: "Voice generation for 1 language, up to 10 POIs",
    price: "€19",
    maxPois: 10,
  },
  {
    type: "voice_20",
    name: "Voice 20",
    description: "Voice generation for 1 language, up to 20 POIs",
    price: "€29",
    maxPois: 20,
  },
  {
    type: "lang_10",
    name: "+ Language 10",
    description: "Translation + TTS for 1 additional language, up to 10 POIs",
    price: "€15",
    maxPois: 10,
  },
  {
    type: "lang_20",
    name: "+ Language 20",
    description: "Translation + TTS for 1 additional language, up to 20 POIs",
    price: "€22",
    maxPois: 20,
  },
];

export const mockSurveys = [
  { id: "1", name: "Post-Visit Experience Survey" },
  { id: "2", name: "Audio Quality Feedback" },
];

export const languages = [
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];