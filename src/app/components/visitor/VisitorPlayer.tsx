import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { Play, Pause, ChevronDown, ChevronUp, Globe, ArrowLeft } from "lucide-react";
import { mockMuseum, mockPOIs, languages } from "../../data/mockData";
import MainLogoVariant from "../../../imports/MainLogoVariant5";

export function VisitorPlayer() {
  const { museumSlug, guideId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("it");
  const [currentPOIIndex, setCurrentPOIIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock data
  const guide = {
    title: "Tour Completo - Collezione Greca",
    museum: mockMuseum,
    pois: mockPOIs.slice(0, 5),
    availableLanguages: ["it", "en"],
  };

  const selectedLang = languages.find((l) => l.code === selectedLanguage);
  const currentPOI = currentPOIIndex !== null ? guide.pois[currentPOIIndex] : null;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectPOI = (index: number) => {
    setCurrentPOIIndex(index);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleBack = () => {
    setCurrentPOIIndex(null);
    setIsPlaying(false);
  };

  // Simulate progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-white pb-safe">
      {currentPOIIndex === null ? (
        // Guide Overview
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white border-b border-zinc-200 sticky top-0 z-10">
            <div className="p-6">
              <div className="mb-6">
                <MainLogoVariant className="h-[36px] w-auto mb-4" />
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wide mb-1.5 font-medium">
                    {guide.museum.name}
                  </div>
                  <h1
                    className="text-[20px] text-zinc-900 tracking-tight leading-tight"
                    style={{ fontWeight: 600 }}
                  >
                    {guide.title}
                  </h1>
                </div>
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-all border border-zinc-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="size-4 text-zinc-600" strokeWidth={1.5} />
                    <span className="text-lg">{selectedLang?.flag}</span>
                    <span className="text-zinc-900 text-[13px] font-semibold">{selectedLang?.name}</span>
                  </div>
                  <ChevronDown
                    className={`size-4 text-zinc-600 transition-transform ${
                      showLanguageSelector ? "rotate-180" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                </button>

                {showLanguageSelector && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-zinc-200 shadow-lg overflow-hidden z-20">
                    {guide.availableLanguages.map((code) => {
                      const lang = languages.find((l) => l.code === code);
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            setSelectedLanguage(code);
                            setShowLanguageSelector(false);
                          }}
                          className={`
                            w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-zinc-50 transition-colors
                            ${code === selectedLanguage ? "bg-zinc-50" : ""}
                          `}
                        >
                          <span className="text-base">{lang?.flag}</span>
                          <span className="text-zinc-900 text-[13px] font-medium">{lang?.name}</span>
                          {code === selectedLanguage && (
                            <span className="ml-auto text-zinc-600 text-[12px]">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* POI List */}
          <div className="p-6 space-y-3">
            <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-4">
              {guide.pois.length} fermate
            </h2>
            {guide.pois.map((poi, index) => (
              <button
                key={poi.id}
                onClick={() => handleSelectPOI(index)}
                className="group w-full flex items-center gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:shadow-md transition-all active:scale-[0.99]"
                style={{
                  ['--hover-border-color' as string]: '#D33333',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#D33333'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
              >
                <div
                  className="size-10 text-white rounded-md flex items-center justify-center text-[14px] font-semibold flex-shrink-0"
                  style={{ backgroundColor: '#D33333' }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-[14px] font-semibold text-zinc-900 mb-0.5 truncate tracking-tight">
                    {poi.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500">~90 sec</p>
                </div>
                <div
                  className="size-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(211, 51, 51, 0.1)' }}
                >
                  <Play className="size-3.5 ml-0.5" strokeWidth={2} style={{ color: '#D33333' }} />
                </div>
              </button>
            ))}
          </div>

          {/* Footer Info */}
          <div className="p-6 text-center border-t border-zinc-200">
            <div className="flex justify-center mb-3">
              <MainLogoVariant className="h-[24px] w-auto opacity-20" />
            </div>
            <p className="text-[11px] text-zinc-400">Tocca una fermata per iniziare</p>
          </div>
        </div>
      ) : (
        // Player View
        <div className="h-screen flex flex-col bg-slate-900 text-white">
          {/* Back Button */}
          <div className="p-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-5" />
              <span>Tutte le fermate</span>
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 relative">
            <img
              src={currentPOI?.imageUrl}
              alt={currentPOI?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

            {/* POI Number */}
            <div className="absolute top-6 left-6 size-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-medium text-lg">
              {currentPOIIndex + 1}
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-medium mb-1">{currentPOI?.title}</h2>
              <p className="text-slate-400">
                Fermata {currentPOIIndex + 1} di {guide.pois.length}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{Math.floor((progress / 100) * 90)}s</span>
                <span>90s</span>
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="w-full h-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-6 fill-current" />
                  <span className="font-medium">Pausa</span>
                </>
              ) : (
                <>
                  <Play className="size-6 fill-current" />
                  <span className="font-medium">Riproduci</span>
                </>
              )}
            </button>

            {/* Transcript */}
            <div className="border-t border-white/10 pt-6">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <span className="text-sm font-medium">Trascrizione</span>
                {showTranscript ? (
                  <ChevronUp className="size-5 text-slate-400" />
                ) : (
                  <ChevronDown className="size-5 text-slate-400" />
                )}
              </button>

              {showTranscript && (
                <div className="text-sm text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                  {currentPOI?.body}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (currentPOIIndex > 0) {
                    handleSelectPOI(currentPOIIndex - 1);
                  }
                }}
                disabled={currentPOIIndex === 0}
                className="flex-1 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Precedente
              </button>
              <button
                onClick={() => {
                  if (currentPOIIndex < guide.pois.length - 1) {
                    handleSelectPOI(currentPOIIndex + 1);
                  }
                }}
                disabled={currentPOIIndex === guide.pois.length - 1}
                className="flex-1 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Successiva →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element for future implementation */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
