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
  const poisListRef = useRef<HTMLDivElement>(null);

  const scrollToPOIs = () => {
    poisListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

          {/* Hero */}
          <div
            className="relative flex flex-col justify-between min-h-[100svh] px-6 pt-10 pb-10 overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            }}
          >
            {/* Top: logo + museo */}
            <div>
              <MainLogoVariant className="h-[28px] w-auto opacity-80 invert mb-8" />
              <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium mb-2">
                {guide.museum.name}
              </p>
            </div>

            {/* Center: titolo + stats */}
            <div className="flex-1 flex flex-col justify-center py-10">
              <h1 className="text-[36px] font-bold text-white leading-tight tracking-tight mb-6">
                {guide.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-[12px] text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                  {guide.pois.length} stops
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                  ~{Math.round(guide.pois.length * 2.5)} min
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                  {selectedLang?.flag} {selectedLang?.name}
                </span>
              </div>
            </div>

            {/* Bottom: language selector + CTA */}
            <div className="space-y-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="size-4 text-white/50" strokeWidth={1.5} />
                    <span className="text-base">{selectedLang?.flag}</span>
                    <span className="text-white text-[13px] font-medium">{selectedLang?.name}</span>
                  </div>
                  <ChevronDown
                    className={`size-4 text-white/40 transition-transform ${showLanguageSelector ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
                {showLanguageSelector && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-zinc-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden z-20">
                    {guide.availableLanguages.map((code) => {
                      const lang = languages.find((l) => l.code === code);
                      return (
                        <button
                          key={code}
                          onClick={() => { setSelectedLanguage(code); setShowLanguageSelector(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-3 hover:bg-white/5 transition-colors ${code === selectedLanguage ? "bg-white/5" : ""}`}
                        >
                          <span className="text-base">{lang?.flag}</span>
                          <span className="text-white text-[13px] font-medium">{lang?.name}</span>
                          {code === selectedLanguage && <span className="ml-auto text-white/40 text-[12px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CTA button */}
              <button
                onClick={scrollToPOIs}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[15px] font-semibold transition-all active:scale-[0.98]"
                style={{ backgroundColor: '#D33333', color: 'white' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b92b2b')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D33333')}
              >
                Start the Tour
                <ChevronDown className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* POI List */}
          <div ref={poisListRef} className="p-6 space-y-3 scroll-mt-0">
            <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-4">
              {guide.pois.length} stops
            </h2>
            {guide.pois.map((poi, index) => (
              <button
                key={poi.id}
                onClick={() => handleSelectPOI(index)}
                className="group w-full flex items-center gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:shadow-md transition-all active:scale-[0.99]"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#D33333')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
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
            <p className="text-[11px] text-zinc-400">Tap a stop to begin</p>
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
