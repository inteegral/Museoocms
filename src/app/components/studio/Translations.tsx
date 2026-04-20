import { useState } from "react";
import {
  Languages,
  Globe,
  Plus,
  Check,
  AlertTriangle,
  X,
  ChevronDown,
  Search,
  Filter,
  Sparkles,
  Clock,
  Eye,
  Save,
  Trash2,
  Download,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface Guide {
  id: string;
  name: string;
  totalPOIs: number;
  sourceLanguage: string;
  targetLanguages: {
    code: string;
    status: "approved" | "pending"; // approved = verde, pending = arancione
    poiStats: {
      draft: number;
      underReview: number;
      approved: number;
    };
  }[];
}

interface POI {
  id: string;
  name: string;
  status: "draft" | "under-review" | "approved";
  sourceText: string;
  targetText: string;
}

interface TranslationEditorData {
  poiName: string;
  guideName: string;
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  targetText: string;
  status: "draft" | "under-review" | "approved";
}

const availableLanguages: Language[] = [
  { code: "EN", name: "English", nativeName: "English" },
  { code: "IT", name: "Italian", nativeName: "Italiano" },
  { code: "ES", name: "Spanish", nativeName: "Español" },
  { code: "FR", name: "French", nativeName: "Français" },
  { code: "DE", name: "German", nativeName: "Deutsch" },
  { code: "PT", name: "Portuguese", nativeName: "Português" },
  { code: "RU", name: "Russian", nativeName: "Русский" },
  { code: "ZH", name: "Chinese", nativeName: "中文" },
  { code: "JA", name: "Japanese", nativeName: "日本語" },
];

const mockGuides: Guide[] = [
  {
    id: "1",
    name: "Renaissance Tour",
    totalPOIs: 15,
    sourceLanguage: "EN",
    targetLanguages: [
      {
        code: "IT",
        status: "approved",
        poiStats: { draft: 0, underReview: 0, approved: 15 },
      },
      {
        code: "ES",
        status: "pending",
        poiStats: { draft: 10, underReview: 3, approved: 2 },
      },
      {
        code: "FR",
        status: "pending",
        poiStats: { draft: 15, underReview: 0, approved: 0 },
      },
    ],
  },
  {
    id: "2",
    name: "Modern Art Collection",
    totalPOIs: 8,
    sourceLanguage: "EN",
    targetLanguages: [
      {
        code: "IT",
        status: "approved",
        poiStats: { draft: 0, underReview: 0, approved: 8 },
      },
      {
        code: "ES",
        status: "approved",
        poiStats: { draft: 0, underReview: 0, approved: 8 },
      },
      {
        code: "FR",
        status: "approved",
        poiStats: { draft: 0, underReview: 0, approved: 8 },
      },
    ],
  },
  {
    id: "3",
    name: "Ancient Sculptures",
    totalPOIs: 12,
    sourceLanguage: "EN",
    targetLanguages: [
      {
        code: "IT",
        status: "pending",
        poiStats: { draft: 5, underReview: 5, approved: 2 },
      },
      {
        code: "ES",
        status: "pending",
        poiStats: { draft: 12, underReview: 0, approved: 0 },
      },
    ],
  },
];

const guideImages: { [key: string]: string } = {
  "1": "https://images.unsplash.com/photo-1761334859641-139cffff4a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5haXNzYW5jZSUyMGFydCUyMG11c2V1bSUyMGhhbGx8ZW58MXx8fHwxNzc0ODg2NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "2": "https://images.unsplash.com/photo-1759803534574-8e703d9914c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBnYWxsZXJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0ODAyNTk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "3": "https://images.unsplash.com/photo-1558707426-05574ae8aeae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwc2N1bHB0dXJlJTIwbXVzZXVtfGVufDF8fHx8MTc3NDg1MTQxOXww&ixlib=rb-4.1.0&q=80&w=1080",
};

const mockPOIs: POI[] = [
  {
    id: "1",
    name: "Renaissance Hall",
    status: "draft",
    sourceText: "This magnificent hall showcases the finest examples of Renaissance art...",
    targetText: "Esta magnífica sala presenta los mejores ejemplos del arte renacentista...",
  },
  {
    id: "2",
    name: "Leonardo's Workshop",
    status: "under-review",
    sourceText: "Step into the recreated workshop of Leonardo da Vinci...",
    targetText: "Entra en el taller recreado de Leonardo da Vinci...",
  },
  {
    id: "3",
    name: "The Last Supper Room",
    status: "approved",
    sourceText: "This room houses a faithful reproduction of The Last Supper...",
    targetText: "Esta sala alberga una reproducción fiel de La Última Cena...",
  },
  {
    id: "4",
    name: "Michelangelo's Sculptures",
    status: "draft",
    sourceText: "Marvel at the mastery of Michelangelo's sculptural works...",
    targetText: "",
  },
  {
    id: "5",
    name: "Raphael Gallery",
    status: "draft",
    sourceText: "Explore the harmonious compositions of Raphael...",
    targetText: "",
  },
];

export function Translations() {
  const [guides, setGuides] = useState<Guide[]>(mockGuides);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [pois, setPois] = useState<POI[]>(mockPOIs);
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false);
  const [showTranslationEditor, setShowTranslationEditor] = useState(false);
  const [editorData, setEditorData] = useState<TranslationEditorData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [guideToAddLanguage, setGuideToAddLanguage] = useState<Guide | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [languageToRemove, setLanguageToRemove] = useState<{ guide: Guide; langCode: string } | null>(null);

  const openPOIList = (guide: Guide, langCode: string) => {
    setSelectedGuide(guide);
    setSelectedLanguage(langCode);
  };

  const backToGuideList = () => {
    setSelectedGuide(null);
    setSelectedLanguage(null);
  };

  const openTranslationEditor = (poi: POI) => {
    if (!selectedGuide || !selectedLanguage) return;

    setEditorData({
      poiName: poi.name,
      guideName: selectedGuide.name,
      sourceLang: selectedGuide.sourceLanguage,
      targetLang: selectedLanguage,
      sourceText: poi.sourceText,
      targetText: poi.targetText,
      status: poi.status,
    });
    setShowTranslationEditor(true);
  };

  const getLanguageName = (code: string) => {
    return availableLanguages.find((l) => l.code === code)?.nativeName || code;
  };

  const getStatusColor = (status: "draft" | "under-review" | "approved") => {
    switch (status) {
      case "approved":
        return "text-zinc-900";
      case "under-review":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "draft":
        return "bg-zinc-50 border-zinc-200 text-zinc-700";
    }
  };

  const getStatusIcon = (status: "draft" | "under-review" | "approved") => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="size-4" style={{ color: '#D33333' }} />;
      case "under-review":
        return <Eye className="size-4 text-orange-600" />;
      case "draft":
        return <Sparkles className="size-4 text-zinc-600" />;
    }
  };

  const getStatusBadge = (status: "draft" | "under-review" | "approved") => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded" style={{ backgroundColor: '#FEE2E2', color: '#D33333' }}>
            <CheckCircle2 className="size-3" />
            Approved
          </span>
        );
      case "under-review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-[11px] font-semibold rounded">
            <Eye className="size-3" />
            Under Review
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-50 text-zinc-700 text-[11px] font-semibold rounded">
            <Sparkles className="size-3" />
            Draft
          </span>
        );
    }
  };

  const addLanguageToGuide = (guide: Guide, langCode: string) => {
    setGuides(
      guides.map((g) =>
        g.id === guide.id
          ? {
              ...g,
              targetLanguages: [
                ...g.targetLanguages,
                {
                  code: langCode,
                  status: "pending",
                  poiStats: { draft: 0, underReview: 0, approved: 0 },
                },
              ],
            }
          : g
      )
    );
    setShowAddLanguageModal(false);
    setGuideToAddLanguage(null);
  };

  const confirmRemoveLanguage = (guide: Guide, langCode: string) => {
    setLanguageToRemove({ guide, langCode });
    setShowRemoveConfirm(true);
  };

  const removeLanguageFromGuide = () => {
    if (!languageToRemove) return;
    
    setGuides(
      guides.map((g) =>
        g.id === languageToRemove.guide.id
          ? {
              ...g,
              targetLanguages: g.targetLanguages.filter((tl) => tl.code !== languageToRemove.langCode),
            }
          : g
      )
    );
    setShowRemoveConfirm(false);
    setLanguageToRemove(null);
  };

  // VIEW 1: Guide List
  if (!selectedGuide || !selectedLanguage) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1800px] mx-auto p-6 md:p-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight mb-2">
                  Translations
                </h1>
                <p className="text-[15px] text-zinc-600 leading-relaxed">
                  Manage multilingual content for your audioguides
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Guide Cards */}
          <div className="space-y-8">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex">
                  {/* Guide Image */}
                  <div className="w-64 h-64 flex-shrink-0 overflow-hidden bg-zinc-100">
                    <img
                      src={guideImages[guide.id]}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-[20px] font-semibold text-zinc-950 mb-2">
                          {guide.name}
                        </h3>
                        <p className="text-[14px] text-zinc-600">
                          {guide.totalPOIs} POIs · {guide.targetLanguages.length} target languages
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setGuideToAddLanguage(guide);
                          setShowAddLanguageModal(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all"
                      >
                        <Plus className="size-4" />
                        Add Language
                      </button>
                    </div>

                    {/* Language Pills */}
                    <div className="flex flex-wrap gap-4">
                      {/* Source Language */}
                      <div className="inline-flex items-center gap-2 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <div className="size-8 bg-white rounded-lg flex items-center justify-center border border-blue-300">
                          <span className="text-[11px] font-bold text-blue-700">
                            {guide.sourceLanguage}
                          </span>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-blue-900">
                            {getLanguageName(guide.sourceLanguage)}
                          </div>
                          <div className="text-[11px] text-blue-600">Source</div>
                        </div>
                      </div>

                      {/* Target Languages */}
                      {guide.targetLanguages.map((lang) => (
                        <div
                          key={lang.code}
                          className="group relative inline-flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all"
                          style={lang.status === "approved"
                            ? { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }
                            : { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}
                        >
                          <button
                            onClick={() => openPOIList(guide, lang.code)}
                            className="flex items-center gap-2 flex-1"
                          >
                            <div
                              className="size-8 bg-white rounded-lg flex items-center justify-center border"
                              style={lang.status === "approved"
                                ? { borderColor: '#FCA5A5' }
                                : { borderColor: '#FDE68A' }}
                            >
                              <span
                                className="text-[11px] font-bold"
                                style={{ color: lang.status === "approved" ? "#D33333" : "#d97706" }}
                              >
                                {lang.code}
                              </span>
                            </div>
                            <div className="text-left">
                              <div
                                className="text-[13px] font-semibold"
                                style={{ color: lang.status === "approved" ? "#991b1b" : "#92400e" }}
                              >
                                {getLanguageName(lang.code)}
                              </div>
                              <div
                                className="text-[11px]"
                                style={{ color: lang.status === "approved" ? "#D33333" : "#d97706" }}
                              >
                                {lang.poiStats.approved}/{guide.totalPOIs} approved
                              </div>
                            </div>
                            <div className="ml-2">
                              {lang.status === "approved" ? (
                                <CheckCircle2 className="size-5" style={{ color: '#D33333' }} />
                              ) : (
                                <Clock className="size-5 text-amber-600" />
                              )}
                            </div>
                          </button>
                          
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmRemoveLanguage(guide, lang.code);
                            }}
                            className="absolute -top-2 -right-2 size-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Language Modal */}
        {showAddLanguageModal && guideToAddLanguage && (
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-zinc-950">
                  Add Language to {guideToAddLanguage.name}
                </h2>
                <button
                  onClick={() => {
                    setShowAddLanguageModal(false);
                    setGuideToAddLanguage(null);
                  }}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-3">
                  {availableLanguages
                    .filter(
                      (lang) =>
                        lang.code !== guideToAddLanguage.sourceLanguage &&
                        !guideToAddLanguage.targetLanguages.some((tl) => tl.code === lang.code)
                    )
                    .map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => addLanguageToGuide(guideToAddLanguage, lang.code)}
                        className="flex items-center gap-3 p-4 bg-white border-2 border-zinc-200 rounded-lg hover:border-zinc-900 transition-all text-left"
                      >
                        <div className="size-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                          <span className="text-[13px] font-bold text-zinc-700">{lang.code}</span>
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-zinc-950">
                            {lang.nativeName}
                          </div>
                          <div className="text-[12px] text-zinc-500">{lang.name}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remove Language Confirm Modal */}
        {showRemoveConfirm && languageToRemove && (
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-zinc-950">
                  Remove Language from {languageToRemove.guide.name}
                </h2>
                <button
                  onClick={() => {
                    setShowRemoveConfirm(false);
                    setLanguageToRemove(null);
                  }}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="text-[14px] text-zinc-700">
                  Are you sure you want to remove {getLanguageName(languageToRemove.langCode)} from {languageToRemove.guide.name}?
                </div>
              </div>

              <div className="px-6 py-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowRemoveConfirm(false);
                      setLanguageToRemove(null);
                    }}
                    className="px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:bg-zinc-200 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={removeLanguageFromGuide}
                    className="px-5 py-2.5 bg-red-600 text-white text-[14px] font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm"
                  >
                    <Trash2 className="size-4 inline mr-1" />
                    Remove Language
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // VIEW 2: POI List for selected language
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={backToGuideList}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-zinc-600 hover:text-zinc-900 mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Guides
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight mb-2">
                {selectedGuide.name} → {getLanguageName(selectedLanguage)}
              </h1>
              <p className="text-[15px] text-zinc-600 leading-relaxed">
                {selectedGuide.totalPOIs} POIs · Translating from {selectedGuide.sourceLanguage} to {selectedLanguage}
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all shadow-sm">
              <Sparkles className="size-4" />
              AI Translate All POIs
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', borderWidth: '1px', borderColor: '#FCA5A5' }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="size-5" style={{ color: '#D33333' }} />
              <span className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: '#991b1b' }}>
                Approved
              </span>
            </div>
            <div className="text-[28px] font-bold" style={{ color: '#7f1d1d' }}>
              {pois.filter((p) => p.status === "approved").length}
            </div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="size-5 text-orange-600" />
              <span className="text-[13px] font-semibold text-orange-900 uppercase tracking-wide">
                Under Review
              </span>
            </div>
            <div className="text-[28px] font-bold text-orange-950">
              {pois.filter((p) => p.status === "under-review").length}
            </div>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-5 text-zinc-600" />
              <span className="text-[13px] font-semibold text-zinc-900 uppercase tracking-wide">
                Draft (AI)
              </span>
            </div>
            <div className="text-[28px] font-bold text-zinc-950">
              {pois.filter((p) => p.status === "draft").length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search POIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="under-review">Under Review</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* POI List */}
        <div className="space-y-3">
          {pois
            .filter(
              (poi) =>
                poi.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (filterStatus === "all" || poi.status === filterStatus)
            )
            .map((poi) => (
              <div
                key={poi.id}
                onClick={() => openTranslationEditor(poi)}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${getStatusColor(
                  poi.status
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(poi.status)}
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold text-zinc-950 mb-1">
                        {poi.name}
                      </h3>
                      <p className="text-[13px] text-zinc-600 line-clamp-1">
                        {poi.sourceText}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(poi.status)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Translation Editor Modal */}
      {showTranslationEditor && editorData && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-semibold text-zinc-950">
                  {editorData.poiName}
                </h2>
                <p className="text-[13px] text-zinc-600 mt-1">
                  {editorData.guideName} · {editorData.sourceLang} → {editorData.targetLang}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(editorData.status)}
                <button
                  onClick={() => setShowTranslationEditor(false)}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Source */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                      {editorData.sourceLang} (Source)
                    </label>
                    <span className="text-[12px] text-zinc-500">
                      {editorData.sourceText.length} characters
                    </span>
                  </div>
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-[14px] text-zinc-900 leading-relaxed min-h-[300px]">
                    {editorData.sourceText}
                  </div>
                </div>

                {/* Target */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                      {editorData.targetLang} (Target)
                    </label>
                    <span className="text-[12px] text-zinc-500">
                      {editorData.targetText.length} characters
                    </span>
                  </div>
                  <textarea
                    value={editorData.targetText}
                    onChange={(e) =>
                      setEditorData({ ...editorData, targetText: e.target.value })
                    }
                    placeholder={`Translation in ${editorData.targetLang}...`}
                    className="w-full p-4 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 leading-relaxed min-h-[300px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* AI Suggestion */}
              {editorData.status === "draft" && !editorData.targetText && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-blue-900 mb-1">
                        AI Translation Available
                      </h4>
                      <p className="text-[13px] text-blue-700 mb-3">
                        Get an instant translation using AI. You can review and edit it before publishing.
                      </p>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all">
                        <Sparkles className="size-4" />
                        Generate AI Translation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {editorData.status !== "approved" && (
                  <button className="text-[13px] font-semibold text-red-600 hover:text-red-700">
                    <Trash2 className="size-4 inline mr-1" />
                    Delete Translation
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTranslationEditor(false)}
                  className="px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:bg-zinc-200 rounded-lg transition-all"
                >
                  Cancel
                </button>
                {editorData.status === "draft" && (
                  <button className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[14px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                    <Eye className="size-4 inline mr-1" />
                    Submit for Review
                  </button>
                )}
                {editorData.status === "under-review" && (
                  <button className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[14px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                    <Save className="size-4 inline mr-1" />
                    Save Changes
                  </button>
                )}
                <button className="px-5 py-2.5 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all shadow-sm">
                  <CheckCircle2 className="size-4 inline mr-1" />
                  Approve Translation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}