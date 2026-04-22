import {
  MessageSquare,
  Star,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Trash2,
  Edit,
  Check,
  GripVertical,
  Type,
  CheckSquare,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Headphones,
} from "lucide-react";
import { useState } from "react";
import { PageShell } from "./PageShell";

interface Review {
  id: string;
  guideName: string;
  rating: number;
  comment: string;
  date: string;
  language: string;
}

interface Question {
  id: string;
  type: "text" | "rating" | "multiple_choice";
  question: string;
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  name: string;
  description: string;
  guideName?: string;
  questions: Question[];
  createdAt: string;
  responses: number;
  status: "active" | "draft";
}

const guideConfig: Record<string, { abbr: string; bg: string; text: string }> = {
  "Renaissance Masterpieces":  { abbr: "REN", bg: "bg-indigo-100",  text: "text-indigo-700"  },
  "Ancient Egypt Collection":  { abbr: "EGY", bg: "bg-amber-100",   text: "text-amber-700"   },
  "Modern Art Gallery":        { abbr: "MOD", bg: "bg-violet-100",  text: "text-violet-700"  },
  "Sculpture Garden Tour":     { abbr: "SCU", bg: "bg-emerald-100", text: "text-emerald-700" },
};

function getGuideConfig(name: string) {
  return guideConfig[name] ?? { abbr: name.slice(0, 3).toUpperCase(), bg: "bg-zinc-100", text: "text-zinc-600" };
}

const mockReviews: Review[] = [
  { id: "1",  guideName: "Renaissance Masterpieces",   rating: 5, comment: "Absolutely fantastic tour! The audio quality was crystal clear and the content was incredibly informative. I learned so much about the Renaissance period.", date: "2024-03-28", language: "EN" },
  { id: "2",  guideName: "Ancient Egypt Collection",   rating: 4, comment: "Very interesting! The guide is well structured, though I would have liked more detail on some of the artefacts.", date: "2024-03-27", language: "IT" },
  { id: "3",  guideName: "Modern Art Gallery",         rating: 5, comment: "Loved every minute of it! The voice was engaging and the pacing was perfect. Highly recommend!", date: "2024-03-26", language: "EN" },
  { id: "4",  guideName: "Sculpture Garden Tour",      rating: 3, comment: "Bien mais quelques problèmes techniques. La qualité audio était parfois faible.", date: "2024-03-25", language: "FR" },
  { id: "5",  guideName: "Renaissance Masterpieces",   rating: 5, comment: "Hervorragend! Eine der besten Audioführungen, die ich je erlebt habe.", date: "2024-03-24", language: "DE" },
  { id: "6",  guideName: "Ancient Egypt Collection",   rating: 5, comment: "The narration brought the artefacts to life. I especially loved the section on mummification — deeply researched and beautifully told.", date: "2024-03-23", language: "EN" },
  { id: "7",  guideName: "Modern Art Gallery",         rating: 4, comment: "Ottima guida! Avrei gradito qualche minuto in più sulle opere di Basquiat, ma nel complesso un'esperienza eccellente.", date: "2024-03-22", language: "IT" },
  { id: "8",  guideName: "Sculpture Garden Tour",      rating: 2, comment: "The audio kept cutting out near the east wing. Missed entire sections. Please fix the connectivity issues.", date: "2024-03-21", language: "EN" },
  { id: "9",  guideName: "Renaissance Masterpieces",   rating: 4, comment: "Un tour vraiment captivant. La voix est agréable et le rythme bien dosé. Quelques erreurs mineures de prononciation en français.", date: "2024-03-20", language: "FR" },
  { id: "10", guideName: "Ancient Egypt Collection",   rating: 3, comment: "Interesting content but the audio quality in the sarcophagus room was very poor. Hard to hear over the background noise.", date: "2024-03-19", language: "EN" },
  { id: "11", guideName: "Modern Art Gallery",         rating: 5, comment: "Perfekt! Die Erläuterungen zu Kandinsky waren tiefgründig und leicht verständlich. Würde die Tour jedem empfehlen.", date: "2024-03-18", language: "DE" },
  { id: "12", guideName: "Sculpture Garden Tour",      rating: 4, comment: "Beautiful setting and well-written script. The guide mentioned the restoration works but didn't explain when they'd be complete.", date: "2024-03-17", language: "EN" },
  { id: "13", guideName: "Renaissance Masterpieces",   rating: 5, comment: "One of the best museum audio guides I've ever used. The storytelling approach made every painting feel alive.", date: "2024-03-16", language: "EN" },
  { id: "14", guideName: "Ancient Egypt Collection",   rating: 4, comment: "Muy informativa y bien narrada. Me habría gustado una opción en español — tuve que seguirla en inglés.", date: "2024-03-15", language: "ES" },
  { id: "15", guideName: "Modern Art Gallery",         rating: 3, comment: "The content was fine but the pacing felt rushed. Some works only got 20 seconds of explanation. Needs more depth.", date: "2024-03-14", language: "EN" },
  { id: "16", guideName: "Sculpture Garden Tour",      rating: 5, comment: "Straordinario! La qualità audio era perfetta anche all'aperto. La sezione dedicata a Canova mi ha lasciata senza parole.", date: "2024-03-13", language: "IT" },
  { id: "17", guideName: "Renaissance Masterpieces",   rating: 4, comment: "Great depth of knowledge. My only note is that the Botticelli section felt shorter than others. Otherwise superb.", date: "2024-03-12", language: "EN" },
  { id: "18", guideName: "Ancient Egypt Collection",   rating: 5, comment: "Incroyable travail de recherche. La qualité sonore était impeccable et la voix du narrateur vraiment envoûtante.", date: "2024-03-11", language: "FR" },
  { id: "19", guideName: "Modern Art Gallery",         rating: 2, comment: "The app crashed twice during the tour. Lost my place and had to restart. Very frustrating experience.", date: "2024-03-10", language: "EN" },
  { id: "20", guideName: "Sculpture Garden Tour",      rating: 4, comment: "Sehr angenehme Führung. Die Beschreibungen waren präzise und die Audioqualität gut. Gerne mehr Details zu den Materialien.", date: "2024-03-09", language: "DE" },
];

const mockSurveys: Survey[] = [
  {
    id: "1",
    name: "Post-Visit Experience Survey",
    description: "Collect feedback about the overall visitor experience",
    questions: [
      { id: "q1", type: "rating", question: "How would you rate your overall experience?", required: true },
      { id: "q2", type: "text", question: "What did you enjoy most about your visit?", required: true },
      { id: "q3", type: "multiple_choice", question: "How did you hear about us?", required: false, options: ["Social Media", "Friend/Family", "Website", "Tourist Guide", "Other"] },
    ],
    guideName: "Renaissance Masterpieces",
    createdAt: "2024-03-20",
    responses: 156,
    status: "active",
  },
  {
    id: "2",
    name: "Audio Quality Feedback",
    description: "Evaluate the audio guide technical quality",
    questions: [
      { id: "q1", type: "rating", question: "Rate the audio quality", required: true },
      { id: "q2", type: "rating", question: "Rate the voice clarity", required: true },
      { id: "q3", type: "text", question: "Any technical issues encountered?", required: false },
    ],
    createdAt: "2024-03-15",
    responses: 89,
    status: "active",
  },
];

export function Reviews() {
  const [activeTab, setActiveTab] = useState<"reviews" | "surveys">("reviews");
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterGuide, setFilterGuide] = useState("all");
  const [filterLang, setFilterLang] = useState("all");
  const [showCreateSurvey, setShowCreateSurvey] = useState(false);
  const [newSurvey, setNewSurvey] = useState<Partial<Survey>>({ name: "", description: "", guideName: "", questions: [], status: "draft" });
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);
    const matchesGuide = filterGuide === "all" || review.guideName === filterGuide;
    const matchesLang = filterLang === "all" || review.language === filterLang;
    return matchesSearch && matchesRating && matchesGuide && matchesLang;
  });

  const availableLanguages = Array.from(new Set(reviews.map((r) => r.language))).sort();

  const guideNames = Array.from(new Set(reviews.map((r) => r.guideName)));
  const guideStats = guideNames.map((name) => {
    const gr = reviews.filter((r) => r.guideName === name);
    return {
      name,
      avg: (gr.reduce((s, r) => s + r.rating, 0) / gr.length).toFixed(1),
      count: gr.length,
    };
  });

  const activeReviews = filterGuide === "all" ? reviews : reviews.filter((r) => r.guideName === filterGuide);
  const averageRating =
    activeReviews.length > 0
      ? (activeReviews.reduce((s, r) => s + r.rating, 0) / activeReviews.length).toFixed(1)
      : "0.0";

  const addQuestionToSurvey = () => {
    if (editingQuestion && editingQuestion.question && editingQuestion.type) {
      const question: Question = {
        id: `q${(newSurvey.questions?.length || 0) + 1}`,
        type: editingQuestion.type,
        question: editingQuestion.question,
        required: editingQuestion.required || false,
        options: editingQuestion.options,
      };
      setNewSurvey({ ...newSurvey, questions: [...(newSurvey.questions || []), question] });
      setEditingQuestion(null);
    }
  };

  const createSurvey = () => {
    if (newSurvey.name && newSurvey.questions && newSurvey.questions.length > 0) {
      const survey: Survey = {
        id: `s${surveys.length + 1}`,
        name: newSurvey.name,
        description: newSurvey.description || "",
        questions: newSurvey.questions,
        createdAt: new Date().toISOString().split("T")[0],
        responses: 0,
        status: newSurvey.status as "active" | "draft",
      };
      setSurveys([...surveys, survey]);
      setShowCreateSurvey(false);
      setNewSurvey({ name: "", description: "", guideName: "", questions: [], status: "draft" });
    }
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Reviews & Surveys</h1>
              <p className="text-[13px] text-zinc-500">
                {reviews.length} reviews · {(parseFloat(averageRating))} avg rating
              </p>
            </div>
            {activeTab === "surveys" && (
              <button
                onClick={() => setShowCreateSurvey(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all"
              >
                <Plus className="size-4" />
                Create Survey
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                activeTab === "reviews" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Reviews
              <span className={`ml-1.5 text-[11px] ${activeTab === "reviews" ? "text-zinc-400" : "text-zinc-300"}`}>{reviews.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("surveys")}
              className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                activeTab === "surveys" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Surveys
              <span className={`ml-1.5 text-[11px] ${activeTab === "surveys" ? "text-zinc-400" : "text-zinc-300"}`}>{surveys.length}</span>
            </button>
          </div>
        </div>

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <>
            {/* Guide filter */}
            <div className="flex flex-wrap gap-2 mb-7">
              {[
                { name: "all", label: "All guides", avg: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1), count: reviews.length },
                ...guideStats.map((g) => ({ name: g.name, label: getGuideConfig(g.name).abbr, avg: g.avg, count: g.count })),
              ].map(({ name, label, avg, count }) => {
                const selected = filterGuide === name;
                return (
                  <button
                    key={name}
                    onClick={() => setFilterGuide(name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-[12px] transition-all ${
                      selected
                        ? "bg-zinc-900 border-zinc-900 text-white"
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                    }`}
                  >
                    <span className="font-semibold">{label}</span>
                    <span className={`${selected ? "text-zinc-400" : "text-zinc-400"}`}>·</span>
                    <span className={`tabular-nums ${selected ? "text-zinc-300" : "text-zinc-400"}`}>★ {avg}</span>
                    <span className={`tabular-nums ${selected ? "text-zinc-500" : "text-zinc-300"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Active guide label */}
            {filterGuide !== "all" && (
              <div className="flex items-center justify-between mb-3">
                <p className="text-[14px] font-semibold text-zinc-900">{filterGuide}</p>
                <button
                  onClick={() => setFilterGuide("all")}
                  className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  <X className="size-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            )}

            {/* Reactive stats */}
            <div className="flex items-center gap-6 mb-8 px-0.5">
              <div>
                <span className="text-[22px] font-light text-zinc-900">{averageRating}</span>
                <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Avg Rating</span>
              </div>
              <div className="w-px h-5 bg-zinc-200" />
              <div>
                <span className="text-[22px] font-light text-zinc-900">{activeReviews.length}</span>
                <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Reviews</span>
              </div>
              <div className="w-px h-5 bg-zinc-200" />
              <div>
                <span className="text-[22px] font-light text-zinc-900">{activeReviews.filter((r) => r.rating === 5).length}</span>
                <span className="ml-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Five-Star</span>
              </div>
            </div>

            {/* Insights Panel */}
            {(() => {
              const strengths = [
                { label: "Audio quality", count: 8 },
                { label: "Voice clarity", count: 6 },
                { label: "Content depth", count: 5 },
                { label: "Pacing", count: 4 },
                { label: "Informative", count: 3 },
              ];
              const painPoints = [
                { label: "More artefact detail", count: 2 },
                { label: "Audio issues", count: 2 },
                { label: "Language coverage", count: 1 },
                { label: "Technical glitches", count: 1 },
              ];
              return (
                <div className="mb-6 bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)" }}>
                  <button
                    onClick={() => setInsightsOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="size-3.5 text-zinc-400" strokeWidth={1.5} />
                      <span className="text-[13px] font-semibold text-zinc-800">Insights</span>
                      <span className="text-[12px] text-zinc-400">· {reviews.length} reviews</span>
                    </div>
                    {insightsOpen
                      ? <ChevronUp className="size-4 text-zinc-400" />
                      : <ChevronDown className="size-4 text-zinc-400" />}
                  </button>

                  {insightsOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100 border-t border-zinc-100">
                      {/* Strengths */}
                      <div className="px-6 py-5 border-l-[3px] border-l-emerald-400">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-5">What visitors love</p>
                        <div className="space-y-4">
                          {strengths.map(({ label, count }) => (
                            <div key={label} className="flex items-baseline justify-between gap-4">
                              <span className="text-[13px] text-zinc-700 leading-none">{label}</span>
                              <span className="text-[15px] font-light text-zinc-400 tabular-nums leading-none flex-shrink-0">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pain Points */}
                      <div className="px-6 py-5 border-l-[3px] border-l-amber-400">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-5">Areas to improve</p>
                        <div className="space-y-4">
                          {painPoints.map(({ label, count }) => (
                            <div key={label} className="flex items-baseline justify-between gap-4">
                              <span className="text-[13px] text-zinc-700 leading-none">{label}</span>
                              <span className="text-[15px] font-light text-zinc-400 tabular-nums leading-none flex-shrink-0">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Filters */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[13px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer">
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Language pills */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mr-1">Lang</span>
                {["all", ...availableLanguages].map((lang) => {
                  const selected = filterLang === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => setFilterLang(lang)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        selected
                          ? "bg-zinc-900 text-white"
                          : "bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800"
                      }`}
                    >
                      {lang === "all" ? "All" : lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            <div className="bg-white border border-zinc-200 rounded-xl px-5 divide-y-0" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
              {filteredReviews.map((review) => (
                <div key={review.id} className="py-5 border-b border-zinc-100 last:border-0">
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`size-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"}`} />
                        ))}
                      </div>
                      <span className="text-[12px] font-medium text-zinc-700">{review.guideName}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-zinc-400">{review.date}</span>
                      <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-semibold rounded">{review.language}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-zinc-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-16">
                <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="size-6 text-zinc-400" />
                </div>
                <p className="text-[14px] font-semibold text-zinc-900 mb-1">No reviews found</p>
                <p className="text-[13px] text-zinc-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </>
        )}

        {/* SURVEYS TAB */}
        {activeTab === "surveys" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {surveys.map((survey) => (
                <div key={survey.id} className="p-5 bg-white border border-zinc-200 rounded-xl hover:shadow-sm hover:border-zinc-300 transition-all" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[14px] font-semibold text-zinc-900 truncate">{survey.name}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                          survey.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-zinc-100 text-zinc-500"
                        }`}>
                          <span className={`size-1.5 rounded-full ${survey.status === "active" ? "bg-emerald-400" : "bg-zinc-400"}`} />
                          {survey.status === "active" ? "Active" : "Draft"}
                        </span>
                      </div>
                      <p className="text-[12px] text-zinc-500 leading-relaxed">{survey.description}</p>
                      {survey.guideName && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Headphones className="size-3 text-zinc-400" strokeWidth={1.5} />
                          <span className="text-[11px] text-zinc-500 font-medium">{survey.guideName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-4 pb-4 border-b border-zinc-100">
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Questions</p>
                      <p className="text-[16px] font-semibold text-zinc-900">{survey.questions.length}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Responses</p>
                      <p className="text-[16px] font-semibold text-zinc-900">{survey.responses}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Created</p>
                      <p className="text-[12px] text-zinc-600">{survey.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Edit className="size-3.5 inline mr-1.5" />Edit
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
                      View Results
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-200 rounded-lg transition-all">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {surveys.length === 0 && (
              <div className="text-center py-16">
                <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="size-6 text-zinc-400" />
                </div>
                <p className="text-[14px] font-semibold text-zinc-900 mb-1">No surveys created yet</p>
                <p className="text-[13px] text-zinc-500 mb-6">Create your first survey to start collecting feedback</p>
                <button onClick={() => setShowCreateSurvey(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
                  <Plus className="size-4" />Create Survey
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* Create Survey Modal */}
      {showCreateSurvey && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-zinc-900">Create Survey</h2>
              <button
                onClick={() => { setShowCreateSurvey(false); setNewSurvey({ name: "", description: "", questions: [], status: "draft" }); setEditingQuestion(null); }}
                className="text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-zinc-700 mb-2">Survey Name *</label>
                <input
                  type="text"
                  value={newSurvey.name}
                  onChange={(e) => setNewSurvey({ ...newSurvey, name: e.target.value })}
                  placeholder="e.g., Post-Visit Experience Survey"
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-zinc-700 mb-2">Description</label>
                <textarea
                  value={newSurvey.description}
                  onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                  placeholder="Describe the purpose of this survey..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                />
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-zinc-700 mb-1.5">Audio Guide <span className="text-zinc-400 font-normal">— optional</span></label>
                <p className="text-[12px] text-zinc-400 mb-2">Associate this survey with a specific guide, or leave empty for a general survey.</p>
                <div className="relative">
                  <select
                    value={newSurvey.guideName}
                    onChange={(e) => setNewSurvey({ ...newSurvey, guideName: e.target.value })}
                    className="w-full appearance-none pl-4 pr-8 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                  >
                    <option value="">No specific guide (general survey)</option>
                    {guideNames.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-zinc-700 mb-3">
                  Questions <span className="text-zinc-400 font-normal">({newSurvey.questions?.length || 0})</span>
                </label>

                {newSurvey.questions && newSurvey.questions.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {newSurvey.questions.map((q, index) => (
                      <div key={q.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2.5 flex-1">
                            <GripVertical className="size-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[11px] font-semibold text-zinc-400">Q{index + 1}</span>
                                <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                                  q.type === "rating" ? "bg-blue-50 text-blue-600" :
                                  q.type === "text" ? "bg-violet-50 text-violet-600" :
                                  "bg-emerald-50 text-emerald-600"
                                }`}>
                                  {q.type === "rating" ? "Rating" : q.type === "text" ? "Text" : "Multiple Choice"}
                                </span>
                                {q.required && <span className="px-1.5 py-0.5 bg-zinc-200 text-zinc-600 text-[10px] font-semibold rounded-full">Required</span>}
                              </div>
                              <p className="text-[13px] text-zinc-900">{q.question}</p>
                              {q.options && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {q.options.map((opt, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-600 text-[11px] rounded">{opt}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => setNewSurvey({ ...newSurvey, questions: newSurvey.questions?.filter((_, i) => i !== index) })}
                            className="text-zinc-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {editingQuestion ? (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div className="mb-3">
                      <label className="block text-[12px] font-semibold text-zinc-700 mb-2">Question Type</label>
                      <div className="flex gap-2">
                        {([
                          { type: "rating", label: "Rating", icon: Star },
                          { type: "text", label: "Text", icon: Type },
                          { type: "multiple_choice", label: "Multiple", icon: CheckSquare },
                        ] as const).map(({ type, label, icon: Icon }) => (
                          <button
                            key={type}
                            onClick={() => setEditingQuestion({ ...editingQuestion, type, ...(type === "multiple_choice" ? { options: ["Option 1", "Option 2"] } : {}) })}
                            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border transition-all ${
                              editingQuestion.type === type
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                            }`}
                          >
                            <Icon className="size-3.5" />{label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-[12px] font-semibold text-zinc-700 mb-2">Question</label>
                      <input
                        type="text"
                        value={editingQuestion.question || ""}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                        placeholder="Enter your question..."
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                    </div>

                    {editingQuestion.type === "multiple_choice" && (
                      <div className="mb-3">
                        <label className="block text-[12px] font-semibold text-zinc-700 mb-2">Options (comma-separated)</label>
                        <input
                          type="text"
                          value={editingQuestion.options?.join(", ") || ""}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, options: e.target.value.split(",").map((s) => s.trim()) })}
                          placeholder="Option 1, Option 2, Option 3"
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        checked={editingQuestion.required || false}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, required: e.target.checked })}
                        className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900"
                      />
                      <span className="text-[13px] text-zinc-600">Required question</span>
                    </label>

                    <div className="flex gap-2">
                      <button onClick={addQuestionToSurvey} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-700 transition-all">
                        <Check className="size-3.5" />Add Question
                      </button>
                      <button onClick={() => setEditingQuestion(null)} className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingQuestion({ type: "rating", question: "", required: false })}
                    className="w-full px-4 py-3 bg-white border-2 border-dashed border-zinc-200 text-zinc-500 text-[13px] font-semibold rounded-lg hover:border-zinc-400 hover:bg-zinc-50 transition-all"
                  >
                    <Plus className="size-4 inline mr-2" />Add Question
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-zinc-700 mb-2">Status</label>
                <div className="flex gap-2">
                  {(["draft", "active"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewSurvey({ ...newSurvey, status: s })}
                      className={`flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg border transition-all ${
                        newSurvey.status === s
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <button
                onClick={() => { setShowCreateSurvey(false); setNewSurvey({ name: "", description: "", questions: [], status: "draft" }); setEditingQuestion(null); }}
                className="px-5 py-2.5 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createSurvey}
                disabled={!newSurvey.name || !newSurvey.questions || newSurvey.questions.length === 0}
                className="px-6 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Survey
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
