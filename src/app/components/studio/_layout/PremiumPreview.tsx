import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  MapPin,
  Volume2,
  ChevronDown,
  Clock,
  Share2,
  Bookmark,
  ChevronRight,
  Languages,
  Heart,
  X,
  MoreHorizontal
} from "lucide-react";

interface PreviewProps {
  settings: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    font: string;
    borderRadius: number;
  };
}

export function PremiumPreview({ settings }: PreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [volume, setVolume] = useState(80);

  // Gallery images
  const galleryImages = [
    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3c2?w=800",
    "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=800",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800",
  ];

  return (
    <div
      className="rounded-[1.75rem] overflow-hidden relative"
      style={{
        backgroundColor: settings.backgroundColor,
        fontFamily: settings.font,
        color: settings.textColor,
      }}
    >
      <div className="relative h-[667px] overflow-y-auto scrollbar-hide">
        {/* Hero Section with Glassmorphism */}
        <div className="relative h-[400px]">
          {/* Background Image */}
          <img
            src={galleryImages[0]}
            alt="Museum Hall"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"
          />

          {/* Top Bar - Glassmorphism */}
          <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-2 flex items-center justify-between">
            <button className="p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/20">
              <X className="size-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/20"
              >
                <Heart 
                  className={`size-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                />
              </button>
              <button className="p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/20">
                <Share2 className="size-5 text-white" />
              </button>
            </div>
          </div>

          {/* Bottom Info - Glassmorphism */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i < 3 ? 'w-6' : 'w-2'
                    }`}
                    style={{
                      backgroundColor: i < 3 ? settings.accentColor : 'rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </div>
              <span className="text-white/90 text-[11px] font-medium ml-auto">
                3 / 12
              </span>
            </div>

            {/* Title Card */}
            <div className="bg-black/30 backdrop-blur-2xl border border-white/20 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="size-4 text-white/80" />
                    <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
                      Renaissance Wing
                    </span>
                  </div>
                  <h1 className="text-white text-[22px] font-bold leading-tight mb-2">
                    The Birth of Venus
                  </h1>
                  <div className="flex items-center gap-3 text-white/70 text-[12px]">
                    <div className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      <span>3:05</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Languages className="size-3.5" />
                      <span>IT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ backgroundColor: settings.backgroundColor }}>
          {/* Audio Player - Floating Style */}
          <div className="px-6 -mt-8 relative z-10 mb-6">
            <div
              className="shadow-2xl overflow-hidden"
              style={{
                backgroundColor: settings.backgroundColor,
                borderRadius: `${settings.borderRadius + 8}px`,
                border: `1px solid ${settings.primaryColor}10`,
              }}
            >
              {/* Waveform Visualization */}
              <div className="px-6 pt-6 pb-3">
                <div className="flex items-center justify-center gap-0.5 h-12 mb-3">
                  {[...Array(40)].map((_, i) => {
                    const height = Math.sin(i * 0.5) * 30 + 20;
                    const isPast = (i / 40) * 100 < progress;
                    return (
                      <div
                        key={i}
                        className="w-1 rounded-full transition-all duration-300"
                        style={{
                          height: `${height}%`,
                          backgroundColor: isPast ? settings.accentColor : settings.primaryColor + '30',
                          opacity: isPlaying && isPast ? 0.8 : 0.4,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Time & Progress */}
                <div className="flex items-center justify-between text-[11px] font-medium mb-4" style={{ color: settings.textColor, opacity: 0.6 }}>
                  <span>1:23</span>
                  <span>3:05</span>
                </div>

                {/* Seek Bar */}
                <div 
                  className="h-1 rounded-full overflow-hidden cursor-pointer mb-6"
                  style={{ backgroundColor: settings.primaryColor + '15' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: settings.accentColor,
                    }}
                  />
                </div>
              </div>

              {/* Player Controls */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between gap-4">
                  {/* Volume */}
                  <button 
                    className="p-3 rounded-full transition-all hover:scale-105"
                    style={{
                      backgroundColor: settings.primaryColor + '10',
                      color: settings.primaryColor,
                    }}
                  >
                    <Volume2 className="size-4" />
                  </button>

                  {/* Main Controls */}
                  <div className="flex items-center gap-5">
                    <button
                      className="p-2.5 rounded-full transition-all hover:scale-105"
                      style={{
                        backgroundColor: settings.primaryColor + '10',
                        color: settings.primaryColor,
                      }}
                    >
                      <SkipBack className="size-5" fill="currentColor" />
                    </button>

                    {/* Play/Pause - Hero Button */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="relative p-5 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                      style={{
                        backgroundColor: settings.primaryColor,
                        color: settings.backgroundColor,
                      }}
                    >
                      {/* Pulsing ring when playing */}
                      {isPlaying && (
                        <div
                          className="absolute inset-0 rounded-full animate-ping opacity-30"
                          style={{ backgroundColor: settings.primaryColor }}
                        />
                      )}
                      {isPlaying ? (
                        <Pause className="size-7" fill="currentColor" />
                      ) : (
                        <Play className="size-7 ml-0.5" fill="currentColor" />
                      )}
                    </button>

                    <button
                      className="p-2.5 rounded-full transition-all hover:scale-105"
                      style={{
                        backgroundColor: settings.primaryColor + '10',
                        color: settings.primaryColor,
                      }}
                    >
                      <SkipForward className="size-5" fill="currentColor" />
                    </button>
                  </div>

                  {/* More Options */}
                  <button 
                    className="p-3 rounded-full transition-all hover:scale-105"
                    style={{
                      backgroundColor: settings.primaryColor + '10',
                      color: settings.primaryColor,
                    }}
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="px-6 mb-6">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full flex items-center justify-between py-4 border-b transition-colors"
              style={{ 
                borderColor: settings.primaryColor + '15',
                color: settings.textColor,
              }}
            >
              <span className="font-semibold text-[15px]">Description</span>
              <ChevronDown 
                className={`size-5 transition-transform ${showTranscript ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {showTranscript && (
              <div className="py-4 text-[14px] leading-relaxed" style={{ color: settings.textColor, opacity: 0.8 }}>
                Discover Botticelli's masterpiece, painted in the 1480s. This iconic work depicts the goddess Venus emerging from the sea as a fully grown woman, arriving at the shore on a giant scallop shell.
                <br /><br />
                The painting represents the birth of love and spiritual beauty as a driving force of life. Notice the intricate details in the flowing hair and the delicate rendering of the fabric.
              </div>
            )}
          </div>

          {/* Image Gallery */}
          <div className="px-6 mb-6">
            <h3 className="font-semibold text-[15px] mb-4" style={{ color: settings.textColor }}>
              Gallery
            </h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-32 h-32 overflow-hidden"
                  style={{
                    borderRadius: `${settings.borderRadius}px`,
                    border: `2px solid ${settings.primaryColor}15`,
                  }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Key Facts */}
          <div className="px-6 mb-6">
            <h3 className="font-semibold text-[15px] mb-4" style={{ color: settings.textColor }}>
              Key Facts
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Artist', value: 'Sandro Botticelli' },
                { label: 'Year', value: '1484-1486' },
                { label: 'Medium', value: 'Tempera on canvas' },
                { label: 'Dimensions', value: '172.5 cm × 278.9 cm' },
              ].map((fact, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                  style={{ borderColor: settings.primaryColor + '10' }}
                >
                  <span className="text-[13px] font-medium" style={{ color: settings.textColor, opacity: 0.6 }}>
                    {fact.label}
                  </span>
                  <span className="text-[14px] font-semibold" style={{ color: settings.textColor }}>
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Stop Preview */}
          <div className="px-6 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[15px]" style={{ color: settings.textColor }}>
                Next Stop
              </h3>
              <button className="text-[13px] font-semibold" style={{ color: settings.accentColor }}>
                View All
              </button>
            </div>

            <div
              className="overflow-hidden shadow-lg transition-all hover:shadow-xl"
              style={{
                borderRadius: `${settings.borderRadius}px`,
                border: `1px solid ${settings.primaryColor}10`,
                backgroundColor: settings.backgroundColor,
              }}
            >
              <div className="relative h-32">
                <img
                  src="https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=800"
                  alt="Next Stop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div 
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold mb-1.5"
                    style={{
                      backgroundColor: settings.accentColor + '20',
                      color: settings.accentColor,
                    }}
                  >
                    <MapPin className="size-3" />
                    STOP 4
                  </div>
                  <h4 className="text-white font-semibold text-[15px]">
                    Sistine Chapel
                  </h4>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px]" style={{ color: settings.textColor, opacity: 0.6 }}>
                  <Clock className="size-3.5" />
                  <span>4:30</span>
                  <span className="mx-1">•</span>
                  <Languages className="size-3.5" />
                  <span>IT, EN</span>
                </div>
                <ChevronRight className="size-4" style={{ color: settings.accentColor }} />
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="sticky bottom-0 p-6 pt-4 border-t" style={{ 
            backgroundColor: settings.backgroundColor,
            borderColor: settings.primaryColor + '15',
          }}>
            <button
              className="w-full py-4 font-semibold text-[15px] shadow-lg transition-all hover:shadow-xl active:scale-98"
              style={{
                backgroundColor: settings.accentColor,
                color: '#ffffff',
                borderRadius: `${settings.borderRadius}px`,
              }}
            >
              View on Interactive Map
            </button>
          </div>
        </div>
      </div>

      {/* CSS for scrollbar hide */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
