import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, FileAudio, MapPin, FileText, Image, BarChart3, Settings, LogOut, Menu, X, Map, Languages, Mic, MessageSquare, Megaphone, DollarSign } from "lucide-react";
import { mockMuseum } from "../../data/mockData";
import { useState } from "react";
import MainLogoVariant from "../../../imports/MainLogoVariant5";

export function StudioLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const coreNavItems = [
    { path: "/studio", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/studio/guides", icon: FileAudio, label: "Audioguide" },
    { path: "/studio/pois", icon: MapPin, label: "POI" },
    { path: "/studio/map", icon: Map, label: "Mappa" },
    { path: "/studio/media", icon: Image, label: "Media" },
  ];

  const localizationNavItems = [
    { path: "/studio/translations", icon: Languages, label: "Translations" },
    { path: "/studio/voice-talent", icon: Mic, label: "Voice Talent" },
  ];

  const marketingNavItems = [
    { path: "/studio/marketing", icon: Megaphone, label: "Marketing" },
    { path: "/studio/monetization", icon: DollarSign, label: "Monetization" },
  ];

  const resourceNavItems = [
    { path: "/studio/reviews", icon: MessageSquare, label: "Reviews" },
    { path: "/studio/analytics", icon: BarChart3, label: "Analytics" },
  ];

  const bottomNavItems = [
    { path: "/studio/documents", icon: FileText, label: "Knowledge Base" },
    { path: "/studio/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/studio") {
      return location.pathname === "/studio";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Desktop Sidebar - More refined */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col border-r border-zinc-200 bg-white">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo - Compact and precise */}
          <div className="px-6 py-5 border-b border-zinc-200">
            <Link to="/studio" className="flex items-center gap-3 mb-4">
              <div className="h-[24px] w-[24px] rounded bg-[#D33333] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-semibold">M</span>
              </div>
              <span className="font-semibold text-[13px] text-zinc-900 tracking-tight">
                {mockMuseum.name}
              </span>
            </Link>
            <p className="text-[11px] text-zinc-500 font-medium tracking-wide uppercase">
              Studio
            </p>
          </div>

          {/* Navigation - Precise and minimal */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {/* Core Section */}
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px]
                    ${
                      active
                        ? "bg-zinc-100 text-zinc-900 font-medium"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }
                  `}
                  style={active ? { borderLeft: '2px solid #D33333', paddingLeft: '10px' } : {}}
                >
                  <Icon className="size-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Separator */}
            <div className="py-2">
              <div className="h-px bg-zinc-200" />
            </div>

            {/* Localization Section */}
            {localizationNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px]
                    ${
                      active
                        ? "bg-zinc-100 text-zinc-900 font-medium"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }
                  `}
                  style={active ? { borderLeft: '2px solid #D33333', paddingLeft: '10px' } : {}}
                >
                  <Icon className="size-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Separator */}
            <div className="py-2">
              <div className="h-px bg-zinc-200" />
            </div>

            {/* Marketing Section */}
            {marketingNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px]
                    ${
                      active
                        ? "bg-zinc-100 text-zinc-900 font-medium"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }
                  `}
                  style={active ? { borderLeft: '2px solid #D33333', paddingLeft: '10px' } : {}}
                >
                  <Icon className="size-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Separator */}
            <div className="py-2">
              <div className="h-px bg-zinc-200" />
            </div>

            {/* Resources Section */}
            {resourceNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px]
                    ${
                      active
                        ? "bg-zinc-100 text-zinc-900 font-medium"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }
                  `}
                  style={active ? { borderLeft: '2px solid #D33333', paddingLeft: '10px' } : {}}
                >
                  <Icon className="size-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="p-3 border-t border-zinc-200 space-y-0.5">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px]
                    ${
                      active
                        ? "bg-zinc-100 text-zinc-900 font-medium"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }
                  `}
                  style={active ? { borderLeft: '2px solid #D33333', paddingLeft: '10px' } : {}}
                >
                  <Icon className="size-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button className="flex items-center gap-3 px-3 py-2 w-full text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-all text-[13px]">
              <LogOut className="size-4" strokeWidth={1.5} />
              <span>Esci</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/studio" className="flex items-center gap-2">
            <div className="h-[20px] w-[20px] rounded bg-[#D33333] flex items-center justify-center">
              <span className="text-white text-[9px] font-semibold">M</span>
            </div>
            <span className="font-semibold text-[13px] text-zinc-900">
              {mockMuseum.name}
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-md"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 bg-white">
            <nav className="px-3 py-3 space-y-0.5">
              {/* Core Section */}
              {coreNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-[13px] font-medium
                      ${
                        active
                          ? "bg-zinc-100 text-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-50"
                      }
                    `}
                    style={active ? { borderLeft: '2px solid #D33333', paddingLeft: '10px' } : {}}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Separator */}
              <div className="py-2">
                <div className="h-px bg-zinc-200" />
              </div>
              
              {/* Localization Section */}
              {localizationNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-[13px] font-medium
                      ${
                        active
                          ? "bg-zinc-100 text-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }
                    `}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Separator */}
              <div className="py-2">
                <div className="h-px bg-zinc-200" />
              </div>
              
              {/* Marketing Section */}
              {marketingNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-[13px] font-medium
                      ${
                        active
                          ? "bg-zinc-100 text-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }
                    `}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Separator */}
              <div className="py-2">
                <div className="h-px bg-zinc-200" />
              </div>
              
              {/* Resources Section */}
              {resourceNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-[13px] font-medium
                      ${
                        active
                          ? "bg-zinc-100 text-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }
                    `}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Separator */}
              <div className="py-2">
                <div className="h-px bg-zinc-200" />
              </div>
              
              {/* Bottom Section */}
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-[13px] font-medium
                      ${
                        active
                          ? "bg-zinc-100 text-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }
                    `}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all text-[14px] font-medium">
                <LogOut className="size-5" />
                <span>Esci</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1
                  ${active ? "text-zinc-900" : "text-zinc-500"}
                `}
              >
                <Icon className={`size-6 ${active ? "fill-zinc-900" : ""}`} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
          {resourceNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1
                  ${active ? "text-zinc-900" : "text-zinc-500"}
                `}
              >
                <Icon className={`size-6 ${active ? "fill-zinc-900" : ""}`} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1
                  ${active ? "text-zinc-900" : "text-zinc-500"}
                `}
              >
                <Icon className={`size-6 ${active ? "fill-zinc-900" : ""}`} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:pl-72 pt-14 pb-20 lg:pt-0 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
}