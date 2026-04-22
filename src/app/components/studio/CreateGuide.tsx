import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { AIAssistant } from "./AIAssistant";

export function CreateGuide() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: redirect to editor with new guide
    navigate("/guides/guide-new");
  };

  const handleAIProposal = (proposal: any) => {
    // Apply AI proposal to form
    if (proposal.concept) {
      setFormData({
        title: formData.title || proposal.concept.narrative,
        description: proposal.concept.type + " - " + proposal.concept.narrative,
      });
    }
    // Navigate to editor with full proposal
    navigate("/guides/guide-new", { state: { aiProposal: proposal } });
  };

  const suggestions = [
    "Complete Museum Tour",
    "Highlights - Must-See Masterpieces",
    "Family Tour",
    "Ancient Art - Permanent Collection",
    "Temporary Exhibition",
  ];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to guides
        </Link>
        <h1 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
          Create new guide
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          Start by defining the title and description of your audio guide
        </p>
      </div>

      {/* AI Creation Option */}
      <div className="mb-6">
        <button
          onClick={() => setShowAIAssistant(true)}
          className="w-full p-4 md:p-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="size-10 md:size-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="size-5 md:size-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium mb-1 text-sm md:text-base">Create with AI Assistant</h3>
              <p className="text-xs md:text-sm text-white/90">
                Let AI help you build the entire narrative based on your documents
              </p>
            </div>
            <div className="text-white/80 group-hover:translate-x-1 transition-transform text-xl hidden sm:block">→</div>
          </div>
        </button>
      </div>

      <div className="relative mb-6 md:mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs md:text-sm">
          <span className="px-4 bg-white text-slate-500">or create manually</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Title */}
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <label className="block mb-3">
            <span className="text-sm font-medium text-slate-900 mb-1 block">
              Guide title *
            </span>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Complete Collection Tour"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900"
            />
            <span className="text-xs text-slate-500 mt-2 block">
              Choose a clear, descriptive title for visitors
            </span>
          </label>

          {/* Suggestions */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Suggestions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, title: suggestion })
                  }
                  className="px-3 py-1.5 text-sm bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <label className="block">
            <span className="text-sm font-medium text-slate-900 mb-1 block">
              Short description
            </span>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Briefly describe the content and path of the audio guide..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none text-slate-900"
            />
            <span className="text-xs text-slate-500 mt-2 block">
              This description will help visitors choose the right tour
            </span>
          </label>
        </div>

        {/* Info Box */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="font-medium text-slate-900 mb-3">Next steps</h3>
          <ol className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="size-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-slate-900 font-medium text-xs">
                1
              </span>
              <span>Add Points of Interest (POIs) from the editor</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="size-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-slate-900 font-medium text-xs">
                2
              </span>
              <span>Reorder POIs to create the ideal tour path</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="size-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-slate-900 font-medium text-xs">
                3
              </span>
              <span>Publish the guide by purchasing a voice package</span>
            </li>
          </ol>
        </div>

        {/* Piano Limits */}
        <div className="bg-slate-900 text-white rounded-xl p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="font-medium mb-2">Free Plan</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>✓ Up to 3 guides in draft</li>
                <li>✓ Up to 10 POIs per guide</li>
                <li>✓ Edit and update anytime</li>
              </ul>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light mb-1">2/3</div>
              <div className="text-xs text-slate-400">drafts created</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/guides"
            className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!formData.title.trim()}
            className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create guide
          </button>
        </div>
      </form>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant
          guideName={formData.title || "New Guide"}
          onClose={() => setShowAIAssistant(false)}
          onAccept={handleAIProposal}
          documentsContext={[
            { id: "1", name: "Museum_History.pdf", type: "pdf" },
            { id: "2", name: "Artwork_Catalog.pdf", type: "pdf" },
            { id: "3", name: "Collection_Guide.docx", type: "document" },
          ]}
        />
      )}
    </div>
  );
}