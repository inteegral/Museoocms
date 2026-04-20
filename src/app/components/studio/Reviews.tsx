import { useState } from "react";
import {
  MessageSquare,
  Star,
  Search,
  Filter,
  ChevronDown,
  Plus,
  X,
  Trash2,
  Edit,
  Check,
  GripVertical,
  Type,
  ListOrdered,
  CheckSquare,
} from "lucide-react";

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
  options?: string[]; // For multiple choice
}

interface Survey {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  createdAt: string;
  responses: number;
  status: "active" | "draft";
}

const mockReviews: Review[] = [
  {
    id: "1",
    guideName: "Renaissance Masterpieces",
    rating: 5,
    comment: "Absolutely fantastic tour! The audio quality was crystal clear and the content was incredibly informative. I learned so much about the Renaissance period.",
    date: "2024-03-28",
    language: "EN",
  },
  {
    id: "2",
    guideName: "Ancient Egypt Collection",
    rating: 4,
    comment: "Molto interessante! La guida è ben strutturata, anche se avrei gradito più dettagli su alcuni reperti.",
    date: "2024-03-27",
    language: "IT",
  },
  {
    id: "3",
    guideName: "Modern Art Gallery",
    rating: 5,
    comment: "Loved every minute of it! The voice was engaging and the pacing was perfect. Highly recommend!",
    date: "2024-03-26",
    language: "EN",
  },
  {
    id: "4",
    guideName: "Sculpture Garden Tour",
    rating: 3,
    comment: "Bien mais quelques problèmes techniques. La qualité audio était parfois faible.",
    date: "2024-03-25",
    language: "FR",
  },
  {
    id: "5",
    guideName: "Renaissance Masterpieces",
    rating: 5,
    comment: "Hervorragend! Eine der besten Audioführungen, die ich je erlebt habe.",
    date: "2024-03-24",
    language: "DE",
  },
];

const mockSurveys: Survey[] = [
  {
    id: "1",
    name: "Post-Visit Experience Survey",
    description: "Collect feedback about the overall visitor experience",
    questions: [
      {
        id: "q1",
        type: "rating",
        question: "How would you rate your overall experience?",
        required: true,
      },
      {
        id: "q2",
        type: "text",
        question: "What did you enjoy most about your visit?",
        required: true,
      },
      {
        id: "q3",
        type: "multiple_choice",
        question: "How did you hear about us?",
        required: false,
        options: ["Social Media", "Friend/Family", "Website", "Tourist Guide", "Other"],
      },
    ],
    createdAt: "2024-03-20",
    responses: 156,
    status: "active",
  },
  {
    id: "2",
    name: "Audio Quality Feedback",
    description: "Evaluate the audio guide technical quality",
    questions: [
      {
        id: "q1",
        type: "rating",
        question: "Rate the audio quality",
        required: true,
      },
      {
        id: "q2",
        type: "rating",
        question: "Rate the voice clarity",
        required: true,
      },
      {
        id: "q3",
        type: "text",
        question: "Any technical issues encountered?",
        required: false,
      },
    ],
    createdAt: "2024-03-15",
    responses: 89,
    status: "active",
  },
];

export function Reviews() {
  const [activeTab, setActiveTab] = useState<"reviews" | "surveys">("reviews");
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterGuide, setFilterGuide] = useState("all");
  const [showCreateSurvey, setShowCreateSurvey] = useState(false);
  const [newSurvey, setNewSurvey] = useState<Partial<Survey>>({
    name: "",
    description: "",
    questions: [],
    status: "draft",
  });
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);
    const matchesGuide = filterGuide === "all" || review.guideName === filterGuide;
    return matchesSearch && matchesRating && matchesGuide;
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
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
      setNewSurvey({
        ...newSurvey,
        questions: [...(newSurvey.questions || []), question],
      });
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
      setNewSurvey({ name: "", description: "", questions: [], status: "draft" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight mb-2">
                Reviews & Surveys
              </h1>
              <p className="text-[15px] text-zinc-600 leading-relaxed">
                Collect and analyze visitor feedback
              </p>
            </div>
            {activeTab === "surveys" && (
              <button
                onClick={() => setShowCreateSurvey(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all shadow-sm"
              >
                <Plus className="size-4" />
                Create Survey
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-3 text-[14px] font-semibold border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("surveys")}
              className={`px-4 py-3 text-[14px] font-semibold border-b-2 transition-colors ${
                activeTab === "surveys"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Surveys ({surveys.length})
            </button>
          </div>
        </div>

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white border border-zinc-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="size-5 text-amber-500 fill-amber-500" />
                  <span className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide">
                    Average Rating
                  </span>
                </div>
                <p className="text-[32px] font-bold text-zinc-950">{averageRating}</p>
                <p className="text-[13px] text-zinc-600">Based on {reviews.length} reviews</p>
              </div>

              <div className="p-6 bg-white border border-zinc-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="size-5 text-blue-500" />
                  <span className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide">
                    Total Reviews
                  </span>
                </div>
                <p className="text-[32px] font-bold text-zinc-950">{reviews.length}</p>
                <p className="text-[13px] text-zinc-600">This month</p>
              </div>

              <div className="p-6 bg-white border border-zinc-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="size-5 text-green-500 fill-green-500" />
                  <span className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide">
                    5-Star Reviews
                  </span>
                </div>
                <p className="text-[32px] font-bold text-zinc-950">
                  {reviews.filter((r) => r.rating === 5).length}
                </p>
                <p className="text-[13px] text-zinc-600">
                  {((reviews.filter((r) => r.rating === 5).length / reviews.length) * 100).toFixed(0)}% of total
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={filterGuide}
                    onChange={(e) => setFilterGuide(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Guides</option>
                    <option value="Renaissance Masterpieces">Renaissance Masterpieces</option>
                    <option value="Ancient Egypt Collection">Ancient Egypt Collection</option>
                    <option value="Modern Art Gallery">Modern Art Gallery</option>
                    <option value="Sculpture Garden Tour">Sculpture Garden Tour</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 bg-white border border-zinc-200 rounded-xl hover:shadow-lg transition-all"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[16px] font-semibold text-zinc-950 mb-1">
                        {review.guideName}
                      </h3>
                      <p className="text-[13px] text-zinc-600">
                        {review.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="px-2 py-1 bg-zinc-100 text-zinc-900 text-[11px] font-semibold rounded">
                        {review.language}
                      </span>
                    </div>
                  </div>
                  <p className="text-[14px] text-zinc-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">No reviews found</h3>
                <p className="text-[14px] text-zinc-600">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </>
        )}

        {/* SURVEYS TAB */}
        {activeTab === "surveys" && (
          <>
            {/* Surveys Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  className="p-6 bg-white border border-zinc-200 rounded-xl hover:shadow-lg transition-all"
                  style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[18px] font-semibold text-zinc-950">
                          {survey.name}
                        </h3>
                        <span
                          className="px-2 py-1 text-[11px] font-semibold rounded"
                          style={survey.status === "active"
                            ? { backgroundColor: '#FEE2E2', color: '#D33333' }
                            : { backgroundColor: '#FEF3C7', color: '#d97706' }}
                        >
                          {survey.status === "active" ? "Active" : "Draft"}
                        </span>
                      </div>
                      <p className="text-[13px] text-zinc-600 mb-4">{survey.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-zinc-200">
                    <div>
                      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                        Questions
                      </p>
                      <p className="text-[16px] font-bold text-zinc-950">
                        {survey.questions.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                        Responses
                      </p>
                      <p className="text-[16px] font-bold text-zinc-950">{survey.responses}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                        Created
                      </p>
                      <p className="text-[13px] text-zinc-700">{survey.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Edit className="size-3.5 inline mr-1.5" />
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all">
                      View Results
                    </button>
                    <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {surveys.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare className="size-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">
                  No surveys created yet
                </h3>
                <p className="text-[14px] text-zinc-600 mb-6">
                  Create your first survey to start collecting feedback
                </p>
                <button
                  onClick={() => setShowCreateSurvey(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all"
                >
                  <Plus className="size-4" />
                  Create Survey
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
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-zinc-950">Create Survey</h2>
              <button
                onClick={() => {
                  setShowCreateSurvey(false);
                  setNewSurvey({ name: "", description: "", questions: [], status: "draft" });
                  setEditingQuestion(null);
                }}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Survey Info */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-zinc-900 mb-2">
                  Survey Name *
                </label>
                <input
                  type="text"
                  value={newSurvey.name}
                  onChange={(e) => setNewSurvey({ ...newSurvey, name: e.target.value })}
                  placeholder="e.g., Post-Visit Experience Survey"
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-zinc-900 mb-2">
                  Description
                </label>
                <textarea
                  value={newSurvey.description}
                  onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                  placeholder="Describe the purpose of this survey..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                />
              </div>

              {/* Questions List */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-zinc-900 mb-3">
                  Questions ({newSurvey.questions?.length || 0})
                </label>

                {newSurvey.questions && newSurvey.questions.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {newSurvey.questions.map((q, index) => (
                      <div
                        key={q.id}
                        className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <GripVertical className="size-4 text-zinc-400 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[12px] font-semibold text-zinc-500">
                                  Q{index + 1}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                                    q.type === "rating"
                                      ? "bg-blue-50 text-blue-700"
                                      : q.type === "text"
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-green-50 text-green-700"
                                  }`}
                                >
                                  {q.type === "rating"
                                    ? "Rating"
                                    : q.type === "text"
                                    ? "Text"
                                    : "Multiple Choice"}
                                </span>
                                {q.required && (
                                  <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[11px] font-semibold rounded">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-[14px] text-zinc-900">{q.question}</p>
                              {q.options && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {q.options.map((opt, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-white border border-zinc-200 text-zinc-700 text-[12px] rounded"
                                    >
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setNewSurvey({
                                ...newSurvey,
                                questions: newSurvey.questions?.filter((_, i) => i !== index),
                              });
                            }}
                            className="text-zinc-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Question Form */}
                {editingQuestion ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="mb-3">
                      <label className="block text-[12px] font-semibold text-zinc-900 mb-2">
                        Question Type
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditingQuestion({ ...editingQuestion, type: "rating" })
                          }
                          className={`flex-1 px-3 py-2 text-[13px] font-semibold rounded-lg transition-all ${
                            editingQuestion.type === "rating"
                              ? "text-white"
                              : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                          }`}
                          style={editingQuestion.type === "rating" ? { backgroundColor: '#D33333' } : {}}
                        >
                          <Star className="size-3.5 inline mr-1.5" />
                          Rating
                        </button>
                        <button
                          onClick={() => setEditingQuestion({ ...editingQuestion, type: "text" })}
                          className={`flex-1 px-3 py-2 text-[13px] font-semibold rounded-lg transition-all ${
                            editingQuestion.type === "text"
                              ? "text-white"
                              : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                          }`}
                          style={editingQuestion.type === "text" ? { backgroundColor: '#D33333' } : {}}
                        >
                          <Type className="size-3.5 inline mr-1.5" />
                          Text
                        </button>
                        <button
                          onClick={() =>
                            setEditingQuestion({
                              ...editingQuestion,
                              type: "multiple_choice",
                              options: ["Option 1", "Option 2"],
                            })
                          }
                          className={`flex-1 px-3 py-2 text-[13px] font-semibold rounded-lg transition-all ${
                            editingQuestion.type === "multiple_choice"
                              ? "text-white"
                              : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                          }`}
                          style={editingQuestion.type === "multiple_choice" ? { backgroundColor: '#D33333' } : {}}
                        >
                          <CheckSquare className="size-3.5 inline mr-1.5" />
                          Multiple
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-[12px] font-semibold text-zinc-900 mb-2">
                        Question
                      </label>
                      <input
                        type="text"
                        value={editingQuestion.question || ""}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, question: e.target.value })
                        }
                        placeholder="Enter your question..."
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                    </div>

                    {editingQuestion.type === "multiple_choice" && (
                      <div className="mb-3">
                        <label className="block text-[12px] font-semibold text-zinc-900 mb-2">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editingQuestion.options?.join(", ") || ""}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              options: e.target.value.split(",").map((s) => s.trim()),
                            })
                          }
                          placeholder="Option 1, Option 2, Option 3"
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        checked={editingQuestion.required || false}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, required: e.target.checked })
                        }
                        className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900"
                      />
                      <span className="text-[13px] text-zinc-700">Required question</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={addQuestionToSurvey}
                        className="flex-1 px-3 py-2 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all"
                      >
                        <Check className="size-3.5 inline mr-1.5" />
                        Add Question
                      </button>
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingQuestion({ type: "rating", question: "", required: false })}
                    className="w-full px-4 py-3 bg-white border-2 border-dashed border-zinc-300 text-zinc-600 text-[14px] font-semibold rounded-lg hover:border-zinc-400 hover:bg-zinc-50 transition-all"
                  >
                    <Plus className="size-4 inline mr-2" />
                    Add Question
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-zinc-900 mb-2">
                  Status
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewSurvey({ ...newSurvey, status: "draft" })}
                    className={`flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all ${
                      newSurvey.status === "draft"
                        ? "text-white"
                        : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    }`}
                    style={newSurvey.status === "draft" ? { backgroundColor: '#D33333' } : {}}
                  >
                    Draft
                  </button>
                  <button
                    onClick={() => setNewSurvey({ ...newSurvey, status: "active" })}
                    className={`flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all ${
                      newSurvey.status === "active"
                        ? "text-white"
                        : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    }`}
                    style={newSurvey.status === "active" ? { backgroundColor: '#D33333' } : {}}
                  >
                    Active
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowCreateSurvey(false);
                  setNewSurvey({ name: "", description: "", questions: [], status: "draft" });
                  setEditingQuestion(null);
                }}
                className="px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:bg-zinc-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createSurvey}
                disabled={!newSurvey.name || !newSurvey.questions || newSurvey.questions.length === 0}
                className="px-6 py-2.5 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Survey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}