import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  MapPin,
  Smartphone,
  RotateCcw,
  Upload,
  Building2,
  Volume2,
  ChevronDown,
  Clock,
  Info,
  Share2,
  Bookmark,
  ChevronRight,
  Languages,
  Heart
} from "lucide-react";
import { PremiumPreview } from "./PremiumPreview";

interface AppearanceSettings {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  font: string;
  borderRadius: number;
  playerStyle: "minimal" | "classic" | "modern";
  logoUrl?: string;
}

const defaultSettings: AppearanceSettings = {
  primaryColor: "#18181b",
  backgroundColor: "#ffffff",
  textColor: "#09090b",
  accentColor: "#3b82f6",
  font: "Inter",
  borderRadius: 12,
  playerStyle: "modern",
};

const presetThemes = [
  {
    name: "Default Dark",
    settings: {
      primaryColor: "#18181b",
      backgroundColor: "#ffffff",
      textColor: "#09090b",
      accentColor: "#3b82f6",
    },
  },
  {
    name: "Ocean Blue",
    settings: {
      primaryColor: "#0369a1",
      backgroundColor: "#f0f9ff",
      textColor: "#0c4a6e",
      accentColor: "#0ea5e9",
    },
  },
  {
    name: "Forest Green",
    settings: {
      primaryColor: "#15803d",
      backgroundColor: "#f0fdf4",
      textColor: "#14532d",
      accentColor: "#22c55e",
    },
  },
  {
    name: "Royal Purple",
    settings: {
      primaryColor: "#7e22ce",
      backgroundColor: "#faf5ff",
      textColor: "#581c87",
      accentColor: "#a855f7",
    },
  },
  {
    name: "Sunset Orange",
    settings: {
      primaryColor: "#c2410c",
      backgroundColor: "#fff7ed",
      textColor: "#7c2d12",
      accentColor: "#f97316",
    },
  },
];

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Merriweather",
];

export function AppearanceEditor() {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [expandedSections, setExpandedSections] = useState<{
    colors: boolean;
    typography: boolean;
    presets: boolean;
    logo: boolean;
  }>({
    colors: true,
    typography: false,
    presets: false,
    logo: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const updateSetting = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K]
  ) => {
    setSettings({ ...settings, [key]: value });
  };

  const applyPreset = (presetSettings: Partial<AppearanceSettings>) => {
    setSettings({ ...settings, ...presetSettings });
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Smartphone className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[14px] text-blue-900 mb-1">
              Live Visitor Preview
            </h3>
            <p className="text-[13px] text-blue-700 leading-relaxed">
              Customize how your audio guides appear to visitors. Changes are reflected instantly in the preview below.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="space-y-4">
          {/* Color Palette Section */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <button
              onClick={() => toggleSection('colors')}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="size-4 rounded-full" style={{ backgroundColor: settings.primaryColor }} />
                  <div className="size-4 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                </div>
                <h3 className="text-[15px] font-semibold text-zinc-950">
                  Color Palette
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetToDefaults();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                >
                  <RotateCcw className="size-3" />
                  Reset
                </button>
                <ChevronDown 
                  className={`size-5 text-zinc-400 transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {expandedSections.colors && (
              <div className="px-6 pb-6 space-y-5 border-t border-zinc-100">
                {/* Primary Color */}
                <div className="pt-5">
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting("primaryColor", e.target.value)}
                      className="size-12 rounded-lg border-2 border-zinc-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting("primaryColor", e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => updateSetting("accentColor", e.target.value)}
                      className="size-12 rounded-lg border-2 border-zinc-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => updateSetting("accentColor", e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting("backgroundColor", e.target.value)}
                      className="size-12 rounded-lg border-2 border-zinc-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting("backgroundColor", e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => updateSetting("textColor", e.target.value)}
                      className="size-12 rounded-lg border-2 border-zinc-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.textColor}
                      onChange={(e) => updateSetting("textColor", e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Typography Section */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <button
              onClick={() => toggleSection('typography')}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-[18px] font-semibold text-zinc-900" style={{ fontFamily: settings.font }}>
                  Aa
                </div>
                <h3 className="text-[15px] font-semibold text-zinc-950">
                  Typography
                </h3>
              </div>
              <ChevronDown 
                className={`size-5 text-zinc-400 transition-transform ${expandedSections.typography ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedSections.typography && (
              <div className="px-6 pb-6 space-y-5 border-t border-zinc-100">
                <div className="pt-5">
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.font}
                    onChange={(e) => updateSetting("font", e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-2">
                    Border Radius: {settings.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={settings.borderRadius}
                    onChange={(e) => updateSetting("borderRadius", Number(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                    <span>Sharp (0px)</span>
                    <span>Rounded (24px)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preset Themes Section */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <button
              onClick={() => toggleSection('presets')}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {presetThemes.slice(0, 3).map((theme, idx) => (
                    <div 
                      key={idx}
                      className="size-3 rounded-full" 
                      style={{ backgroundColor: theme.settings.primaryColor }} 
                    />
                  ))}
                </div>
                <h3 className="text-[15px] font-semibold text-zinc-950">
                  Preset Themes
                </h3>
              </div>
              <ChevronDown 
                className={`size-5 text-zinc-400 transition-transform ${expandedSections.presets ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedSections.presets && (
              <div className="px-6 pb-6 border-t border-zinc-100">
                <div className="grid grid-cols-2 gap-3 pt-5">
                  {presetThemes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => applyPreset(theme.settings)}
                      className="group p-4 bg-white border-2 border-zinc-200 rounded-lg hover:border-zinc-900 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="size-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.settings.primaryColor }}
                        />
                        <div
                          className="size-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.settings.accentColor }}
                        />
                      </div>
                      <div className="text-[13px] font-semibold text-zinc-950">
                        {theme.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom Logo Section */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <button
              onClick={() => toggleSection('logo')}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building2 className="size-5 text-zinc-600" />
                <h3 className="text-[15px] font-semibold text-zinc-950">
                  Custom Logo
                </h3>
              </div>
              <ChevronDown 
                className={`size-5 text-zinc-400 transition-transform ${expandedSections.logo ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedSections.logo && (
              <div className="px-6 pb-6 border-t border-zinc-100">
                <div className="pt-5">
                  <label className="block text-[13px] font-semibold text-zinc-700 mb-3">
                    Player Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="size-16 bg-zinc-100 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-300">
                      <Building2 className="size-6 text-zinc-400" />
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-colors">
                      <Upload className="size-4" />
                      Upload Logo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={resetToDefaults}
              className="flex-1 px-5 py-3 text-[14px] font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all"
            >
              Reset to Defaults
            </button>
            <button className="flex-1 px-5 py-3 bg-zinc-900 text-white text-[14px] font-semibold rounded-lg hover:bg-zinc-800 transition-all shadow-sm">
              Save Appearance
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-zinc-700 uppercase tracking-wide">
                Visitor Preview
              </h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg">
                <Smartphone className="size-4 text-zinc-600" />
                <span className="text-[12px] font-semibold text-zinc-700">Mobile</span>
              </div>
            </div>

            {/* iPhone Frame */}
            <div className="mx-auto" style={{ maxWidth: "375px" }}>
              <div className="bg-zinc-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Notch */}
                <div className="bg-zinc-950 h-6 rounded-t-[2.5rem] flex items-center justify-center">
                  <div className="w-32 h-4 bg-zinc-900 rounded-full" />
                </div>

                {/* Screen - Premium Preview */}
                <PremiumPreview settings={settings} />

                {/* Home Indicator */}
                <div className="h-6 flex items-center justify-center">
                  <div className="w-32 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}