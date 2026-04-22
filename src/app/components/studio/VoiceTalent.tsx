import {
  Mic,
  Play,
  Pause,
  Search,
  Plus,
  X,
  Check,
  Upload,
  ChevronDown,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { PageShell } from "./PageShell";
interface VoiceTalent {
  id: string;
  name: string;
  language: string;
  gender: "male" | "female" | "neutral";
  age: "young" | "adult" | "senior";
  style: string[];
  description: string;
  avatarUrl: string;
}

interface AudioGuide {
  id: string;
  name: string;
  totalPOIs: number;
  status: "draft" | "published";
  currentVoice?: string;
}

const mockVoices: VoiceTalent[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    language: "EN",
    gender: "female",
    age: "adult",
    style: ["Warm", "Professional", "Clear"],
    description: "Perfect for museum tours and art galleries. Clear pronunciation with a warm, engaging tone.",
    avatarUrl: "https://images.unsplash.com/photo-1768853972795-2739a9685567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwc3R1ZGlvfGVufDF8fHx8MTc3NDg3NzIyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "2",
    name: "Marco Rossi",
    language: "IT",
    gender: "male",
    age: "adult",
    style: ["Professional", "Authoritative", "Deep"],
    description: "Ideal for historical narratives and cultural heritage sites. Deep, authoritative voice.",
    avatarUrl: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzQ4NDIwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "3",
    name: "Sofia García",
    language: "ES",
    gender: "female",
    age: "young",
    style: ["Energetic", "Friendly", "Modern"],
    description: "Great for contemporary art and modern exhibitions. Energetic and approachable.",
    avatarUrl: "https://images.unsplash.com/photo-1614436201459-156d322d38c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDgwMjQ0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "4",
    name: "Jean Dupont",
    language: "FR",
    gender: "male",
    age: "senior",
    style: ["Calm", "Sophisticated", "Refined"],
    description: "Perfect for classical art and fine arts museums. Sophisticated and refined tone.",
    avatarUrl: "https://images.unsplash.com/photo-1695266391814-a276948f1775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYW4lMjBlbGVnYW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0ODg3MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "5",
    name: "Emma Watson",
    language: "EN",
    gender: "female",
    age: "young",
    style: ["Friendly", "Conversational", "Bright"],
    description: "Ideal for interactive exhibits and family-friendly tours. Bright and conversational.",
    avatarUrl: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0ODM1ODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "6",
    name: "Klaus Schmidt",
    language: "DE",
    gender: "male",
    age: "adult",
    style: ["Clear", "Precise", "Professional"],
    description: "Excellent for technical and scientific museums. Clear and precise pronunciation.",
    avatarUrl: "https://images.unsplash.com/photo-1649712041612-021cf78bca23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ4ODczNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const mockAudioGuides: AudioGuide[] = [
  {
    id: "1",
    name: "Renaissance Masterpieces",
    totalPOIs: 24,
    status: "published",
    currentVoice: "Sarah Mitchell",
  },
  {
    id: "2",
    name: "Ancient Egypt Collection",
    totalPOIs: 18,
    status: "published",
  },
  {
    id: "3",
    name: "Modern Art Gallery",
    totalPOIs: 32,
    status: "draft",
  },
  {
    id: "4",
    name: "Sculpture Garden Tour",
    totalPOIs: 15,
    status: "draft",
  },
];

export function VoiceTalent() {
  const [voices, setVoices] = useState<VoiceTalent[]>(mockVoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [selectedVoiceForAssignment, setSelectedVoiceForAssignment] = useState<VoiceTalent | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);

  const filteredVoices = voices.filter((voice) => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filterLanguage === "all" || voice.language === filterLanguage;
    const matchesGender = filterGender === "all" || voice.gender === filterGender;
    return matchesSearch && matchesLanguage && matchesGender;
  });

  const togglePlay = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      // In real app: play audio sample
      setTimeout(() => setPlayingVoice(null), 3000); // Auto-stop after 3s
    }
  };

  const handleAssignVoice = () => {
    // In real app: assign voice to selected guides
    console.log("Assigning voice to guides:", selectedGuides);
    setSelectedVoiceForAssignment(null);
    setSelectedGuides([]);
  };

  const toggleGuideSelection = (guideId: string) => {
    setSelectedGuides((prev) =>
      prev.includes(guideId)
        ? prev.filter((id) => id !== guideId)
        : [...prev, guideId]
    );
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Voice Talent</h1>
            <p className="text-[13px] text-zinc-500">{mockVoices.length} voices available</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-all">
            <Upload className="size-4" />
            Upload Custom Voice
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search voices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Languages</option>
                <option value="EN">English</option>
                <option value="IT">Italian</option>
                <option value="ES">Spanish</option>
                <option value="FR">French</option>
                <option value="DE">German</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="neutral">Neutral</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVoices.map((voice) => (
            <div
              key={voice.id}
              className="flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all p-6"
              style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)" }}
            >
              {/* Avatar */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <img src={voice.avatarUrl} alt={voice.name} className="size-28 rounded-full object-cover" />
                  <button
                    onClick={() => togglePlay(voice.id)}
                    className="absolute -bottom-1.5 -right-1.5 size-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-all shadow-lg"
                  >
                    {playingVoice === voice.id ? (
                      <Pause className="size-4 text-white" />
                    ) : (
                      <Play className="size-4 text-white ml-0.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-[15px] font-semibold text-zinc-900 mb-0.5">{voice.name}</h3>
                <p className="text-[12px] text-zinc-400 mb-4">
                  {voice.language} · {voice.gender.charAt(0).toUpperCase() + voice.gender.slice(1)} · {voice.age.charAt(0).toUpperCase() + voice.age.slice(1)}
                </p>

                {/* Style Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                  {voice.style.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[11px] font-semibold rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-[13px] text-zinc-500 leading-relaxed mb-6">{voice.description}</p>

                {/* Action — pushed to bottom */}
                <button
                  onClick={() => setSelectedVoiceForAssignment(voice)}
                  className="mt-auto w-full px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-700 transition-all"
                >
                  Use Voice
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVoices.length === 0 && (
          <div className="text-center py-16">
            <Mic className="size-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">
              No voices found
            </h3>
            <p className="text-[14px] text-zinc-600">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>

      {/* Voice Assignment Modal */}
      {selectedVoiceForAssignment && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-semibold text-zinc-950">
                  {selectedVoiceForAssignment.name}
                </h2>
                <p className="text-[13px] text-zinc-600 mt-1">
                  {selectedVoiceForAssignment.language} · {selectedVoiceForAssignment.gender.charAt(0).toUpperCase() + selectedVoiceForAssignment.gender.slice(1)} Voice
                </p>
              </div>
              <button
                onClick={() => setSelectedVoiceForAssignment(null)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Waveform Player */}
              <div
                className={`h-40 bg-gradient-to-r ${selectedVoiceForAssignment.waveformGradient} rounded-xl relative overflow-hidden mb-6`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => togglePlay(selectedVoiceForAssignment.id)}
                    className="size-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    {playingVoice === selectedVoiceForAssignment.id ? (
                      <Pause className="size-7 text-zinc-900" />
                    ) : (
                      <Play className="size-7 text-zinc-900 ml-1" />
                    )}
                  </button>
                </div>
                {playingVoice === selectedVoiceForAssignment.id && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 px-8">
                    {[...Array(60)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-white/40 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 70 + 20}%`,
                          animationDelay: `${i * 0.03}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                    Language
                  </label>
                  <p className="text-[15px] font-semibold text-zinc-950">
                    {selectedVoiceForAssignment.language}
                  </p>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                    Gender
                  </label>
                  <p className="text-[15px] font-semibold text-zinc-950 capitalize">
                    {selectedVoiceForAssignment.gender}
                  </p>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                    Age Group
                  </label>
                  <p className="text-[15px] font-semibold text-zinc-950 capitalize">
                    {selectedVoiceForAssignment.age}
                  </p>
                </div>
              </div>

              {/* Style Tags */}
              <div className="mb-6">
                <label className="block text-[12px] font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                  Voice Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedVoiceForAssignment.style.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-2 bg-blue-50 text-blue-700 text-[13px] font-semibold rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-[12px] font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                  Description
                </label>
                <p className="text-[14px] text-zinc-700 leading-relaxed">
                  {selectedVoiceForAssignment.description}
                </p>
              </div>

              {/* Audioguide Selection */}
              <div>
                <label className="block text-[12px] font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                  Select Audioguides
                </label>
                <p className="text-[13px] text-zinc-600 mb-4">
                  Choose which audioguides will use this voice talent
                </p>
                <div className="space-y-3">
                  {mockAudioGuides.map((guide) => (
                    <label
                      key={guide.id}
                      className="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGuides.includes(guide.id)}
                        onChange={() => toggleGuideSelection(guide.id)}
                        className="size-5 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-[14px] font-semibold text-zinc-950">
                            {guide.name}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            guide.status === "published"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-zinc-100 text-zinc-500"
                          }`}>
                            <span className={`size-1.5 rounded-full ${guide.status === "published" ? "bg-emerald-400" : "bg-zinc-400"}`} />
                            {guide.status === "published" ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-[13px] text-zinc-600">
                          {guide.totalPOIs} POIs
                          {guide.currentVoice && (
                            <span className="text-zinc-400">
                              {" "}
                              · Current: {guide.currentVoice}
                            </span>
                          )}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedVoiceForAssignment(null);
                  setSelectedGuides([]);
                }}
                className="px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:bg-zinc-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignVoice}
                disabled={selectedGuides.length === 0}
                className="px-6 py-2.5 bg-zinc-900 text-white text-[14px] font-semibold rounded-lg hover:bg-zinc-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="size-4 inline mr-2" />
                Assign to {selectedGuides.length} {selectedGuides.length === 1 ? "Guide" : "Guides"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}