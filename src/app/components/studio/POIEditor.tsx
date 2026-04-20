import { useState } from "react";
import { X, Save, Trash2, MapPin, Sparkles, ChevronDown } from "lucide-react";
import { mockGuides } from "../../data/mockData";

type POIStatus = "idea" | "in-progress" | "under-revision" | "complete";

interface POI {
  id: string;
  title: string;
  description: string;
  status: POIStatus;
  category: string;
  imageUrl?: string;
  audioScript?: string;
  updatedAt: string;
  isGeolocated?: boolean;
  assignedToGuides?: string[];
}

interface POIEditorProps {
  poi: POI;
  onClose: () => void;
  onSave: (updatedPOI: POI) => void;
  onDelete: (poiId: string) => void;
  onDevelopWithAI?: () => void;
}

const statusConfig = {
  idea: { 
    label: "Idea", 
    color: "text-zinc-500", 
    bg: "bg-zinc-50", 
    border: "border-zinc-200",
    dot: "bg-zinc-400"
  },
  "in-progress": { 
    label: "In Progress", 
    color: "text-zinc-900", 
    bg: "bg-zinc-100", 
    border: "border-zinc-300",
    dot: "bg-zinc-900"
  },
  "under-revision": { 
    label: "Under Revision", 
    color: "text-amber-700", 
    bg: "bg-amber-50", 
    border: "border-amber-200",
    dot: "bg-amber-500"
  },
  complete: { 
    label: "Complete", 
    color: "text-emerald-700", 
    bg: "bg-emerald-50", 
    border: "border-emerald-200",
    dot: "bg-emerald-500"
  },
};

export function POIEditor({ poi, onClose, onSave, onDelete, onDevelopWithAI }: POIEditorProps) {
  const [formData, setFormData] = useState(poi);
  const [activeTab, setActiveTab] = useState<"details" | "content" | "location">("details");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const assignedGuides = formData.assignedToGuides
    ? mockGuides.filter((g) => formData.assignedToGuides!.includes(g.id))
    : [];

  const handleSave = () => {
    onSave(formData);
  };

  const handleStatusChange = (newStatus: POIStatus) => {
    setFormData({ ...formData, status: newStatus });
    setShowStatusDropdown(false);
  };

  const currentStatus = statusConfig[formData.status];

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-200 flex items-start justify-between flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-3">
              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${currentStatus.border} ${currentStatus.bg} hover:shadow-sm transition-all`}
                >
                  <div className={`size-2 rounded-full ${currentStatus.dot}`} />
                  <span className={`text-[13px] font-semibold ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                  <ChevronDown className={`size-4 ${currentStatus.color} transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showStatusDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                    <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-lg border border-zinc-200 shadow-xl z-20 py-1">
                      {(Object.keys(statusConfig) as POIStatus[]).map((status) => {
                        const config = statusConfig[status];
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-50 transition-colors"
                          >
                            <div className={`size-2 rounded-full ${config.dot}`} />
                            <span className={`text-[13px] font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {formData.isGeolocated && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <MapPin className="size-3.5 text-emerald-600" />
                  <span className="text-[13px] font-semibold text-emerald-700">Mapped</span>
                </div>
              )}
            </div>

            <h2 className="text-[24px] font-semibold text-zinc-950 tracking-tight leading-tight">
              {formData.title || "New Point of Interest"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-lg"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-8 border-b border-zinc-200 flex gap-6 flex-shrink-0">
          {[
            { id: "details", label: "Details" },
            { id: "content", label: "Content" },
            { id: "location", label: "Location" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 pt-2 text-[14px] font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            {activeTab === "details" && (
              <div className="space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    placeholder="Enter POI title..."
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
                    placeholder="Describe this point of interest..."
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    placeholder="e.g., Art, Architecture, Sculpture..."
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    placeholder="https://..."
                  />
                  {formData.imageUrl && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-zinc-200">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Assigned Guides */}
                {assignedGuides.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                      Assigned to Guides
                    </label>
                    <div className="space-y-2">
                      {assignedGuides.map((guide) => (
                        <div
                          key={guide.id}
                          className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200"
                        >
                          <img
                            src={guide.thumbnail}
                            alt={guide.title}
                            className="size-10 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-[14px] text-zinc-900">
                              {guide.title}
                            </div>
                            <div className="text-[12px] text-zinc-500">
                              {guide.language}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "content" && (
              <div className="space-y-8">
                {/* Audio Script */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                    Audio Script
                  </label>
                  <textarea
                    value={formData.audioScript || ""}
                    onChange={(e) => setFormData({ ...formData, audioScript: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none font-mono leading-relaxed"
                    placeholder="Write your audio narration script here..."
                  />
                  <div className="flex items-center justify-between text-[12px] text-zinc-500">
                    <span>{formData.audioScript?.length || 0} characters</span>
                    <span>≈ {Math.ceil((formData.audioScript?.length || 0) / 150)} minutes reading time</span>
                  </div>
                </div>

                {/* AI Development */}
                {onDevelopWithAI && formData.status === "idea" && (
                  <div className="p-6 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-white rounded-lg border border-zinc-200">
                        <Sparkles className="size-6 text-zinc-900" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[15px] text-zinc-900 mb-1">
                          AI-Powered Content Development
                        </h3>
                        <p className="text-[13px] text-zinc-600 leading-relaxed mb-4">
                          Let AI help you develop engaging audio scripts based on your museum's context and style.
                        </p>
                        <button
                          onClick={onDevelopWithAI}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all shadow-sm"
                        >
                          <Sparkles className="size-4" />
                          Develop with AI
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-8">
                {/* Geolocation Toggle */}
                <div className="flex items-start gap-4 p-6 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex-shrink-0 p-3 bg-white rounded-lg border border-zinc-200">
                    <MapPin className="size-6 text-zinc-900" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[15px] text-zinc-900">
                        Geolocation
                      </h3>
                      <button
                        onClick={() =>
                          setFormData({ ...formData, isGeolocated: !formData.isGeolocated })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.isGeolocated ? "bg-zinc-900" : "bg-zinc-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.isGeolocated ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-[13px] text-zinc-600 leading-relaxed">
                      Enable to allow visitors to trigger this POI automatically when they reach the location.
                    </p>
                  </div>
                </div>

                {formData.isGeolocated && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="size-12 text-zinc-400 mx-auto mb-2" />
                        <p className="text-[13px] text-zinc-500">Map integration placeholder</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-zinc-200 flex items-center justify-between flex-shrink-0 bg-zinc-50">
          <button
            onClick={() => onDelete(formData.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-[14px] font-semibold rounded-lg transition-all"
          >
            <Trash2 className="size-4" />
            Delete
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:bg-zinc-200 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[14px] font-semibold rounded-lg hover:bg-zinc-800 transition-all shadow-sm"
            >
              <Save className="size-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
