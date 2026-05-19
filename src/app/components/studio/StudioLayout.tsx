import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Headphones, MapPin, Map,
  Megaphone, DollarSign, MessageSquare,
  Trophy, ClipboardList, Settings, LogOut, Menu, X, ChevronDown, ChevronRight, ChevronLeft, Smartphone, Users, CalendarDays, Zap, BookOpen,
} from "lucide-react";
import { mockMuseum } from "../../data/mockData";
import { teamMembers, CURRENT_USER_ID } from "../../data/teamData";
import { useState, useEffect } from "react";
import { OnboardingWizard } from "./OnboardingWizard";
import MainLogoVariant from "../../../imports/MainLogoVariant5";
import { GuidePreviewModal } from "./GuidePreviewModal";
import { AIAssistantDrawer } from "./AIAssistantDrawer";

const currentUser = teamMembers.find((m) => m.id === CURRENT_USER_ID)!;

type Badge =
  | { type: "count"; value: number }
  | { type: "dot"; color: string };

type NavChild = {
  path: string;
  label: string;
  badge?: Badge;
};

type NavItem = {
  key: string;
  path?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  children?: NavChild[];
  badge?: Badge;
  highlight?: boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
  spacerBefore?: boolean;
};

const navSections: NavSection[] = [
  {
    label: "Content",
    items: [
      { key: "guides", path: "/guides", icon: Headphones, label: "Audio Guides" },
      { key: "pois", path: "/pois", icon: MapPin, label: "Points of Interest" },
      { key: "map", path: "/map", icon: Map, label: "Map" },
    ],
  },
  {
    label: "Engagement",
    spacerBefore: true,
    items: [
      { key: "surveys", path: "/surveys", icon: ClipboardList, label: "Surveys" },
      { key: "challenge", path: "/challenge", icon: Trophy, label: "Gamification" },
    ],
  },
  {
    label: "Growth",
    spacerBefore: true,
    items: [
      { key: "events", path: "/events", icon: CalendarDays, label: "Events" },
      { key: "marketing", path: "/marketing", icon: Megaphone, label: "Marketing" },
      { key: "monetization", path: "/monetization", icon: DollarSign, label: "Monetization" },
      { key: "connectors", path: "/connectors", icon: Zap, label: "Connectors" },
    ],
  },
  {
    label: "Insights",
    spacerBefore: true,
    items: [
      { key: "dashboard", path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { key: "reviews", path: "/reviews", icon: MessageSquare, label: "Reviews", badge: { type: "dot", color: "#22c55e" } },
    ],
  },
];

const bottomItems = [
  { path: "/documents", icon: BookOpen, label: "Knowledge Base" },
  { path: "/team", icon: Users, label: "Team" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

function BadgeEl({ badge }: { badge: Badge }) {
  if (badge.type === "count") {
    return (
      <span className="ml-auto text-[10px] font-semibold bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none min-w-[18px] text-center">
        {badge.value}
      </span>
    );
  }
  return (
    <span
      className="ml-auto size-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: badge.color }}
    />
  );
}

function SidebarNav({ onNavigate, collapsed }: { onNavigate?: () => void; collapsed?: boolean }) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const open = new Set<string>();
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const anyChildActive = item.children.some((c) =>
            c.path === "/" ? location.pathname === "/" : location.pathname.startsWith(c.path)
          );
          if (anyChildActive) open.add(item.key);
        }
      });
    });
    return open;
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  if (collapsed) {
    return (
      <nav className="flex-1 px-2 py-3 overflow-y-auto flex flex-col gap-0.5">
        {navSections.map((section) =>
          section.items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path!);
            return (
              <Link
                key={item.key}
                to={item.path!}
                onClick={onNavigate}
                title={item.label}
                className={`relative flex items-center justify-center p-2.5 rounded-lg transition-all group ${
                  active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <Icon className="size-[18px]" strokeWidth={active ? 2 : 1.5} />
                {item.badge && item.badge.type === "dot" && (
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })
        )}
      </nav>
    );
  }

  return (
    <nav className="flex-1 px-2 py-3 overflow-y-auto">
      {navSections.map((section, si) => (
        <div key={section.label} className={si > 0 ? (section.spacerBefore ? "mt-7" : "mt-4") : ""}>
          <p className="px-2 mb-1 text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
            {section.label}
          </p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isOpen = openGroups.has(item.key);

              if (item.children) {
                const anyChildActive = item.children.some((c) => isActive(c.path));
                return (
                  <div key={item.key}>
                    <button
                      onClick={() => toggleGroup(item.key)}
                      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                        anyChildActive ? "text-zinc-900 font-medium" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                      }`}
                    >
                      <Icon className="size-4 flex-shrink-0" strokeWidth={1.5} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && <BadgeEl badge={item.badge} />}
                      {isOpen
                        ? <ChevronDown className="size-3.5 text-zinc-400 flex-shrink-0" />
                        : <ChevronRight className="size-3.5 text-zinc-400 flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="ml-6 mt-0.5 space-y-0.5 border-l border-zinc-100 pl-3">
                        {item.children.map((child) => {
                          const active = isActive(child.path);
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={onNavigate}
                              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] transition-colors ${
                                active ? "bg-zinc-900 text-white font-medium" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                              }`}
                            >
                              <span className="flex-1">{child.label}</span>
                              {child.badge && <BadgeEl badge={child.badge} />}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const active = isActive(item.path!);
              return (
                <Link
                  key={item.key}
                  to={item.path!}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                    active ? "bg-zinc-900 text-white font-medium" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <Icon className="size-4 flex-shrink-0" strokeWidth={active ? 2 : 1.5} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && <BadgeEl badge={item.badge} />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

const allGuideNames = [
  "Renaissance Masterpieces",
  "Ancient Egypt Collection",
  "Modern Art Gallery",
  "Sculpture Garden Tour",
];

export function StudioLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visitorPickerOpen, setVisitorPickerOpen] = useState(false);
  const [visitorGuide, setVisitorGuide] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("museoo_onboarded")) setShowOnboarding(true);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("museoo_onboarded", "true");
    setShowOnboarding(false);
    navigate("/guides", { state: { openNewGuide: true } });
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const mobileTabItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/guides", icon: Headphones, label: "Guides" },
    { path: "/marketing", icon: Megaphone, label: "Growth" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const sidebarWidth = collapsed ? "lg:w-[64px]" : "lg:w-[220px]";
  const mainPadding = collapsed ? "lg:pl-[64px]" : "lg:pl-[220px]";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out ${sidebarWidth}`}>
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Logo + toggle */}
          <div className={`flex items-center border-b border-zinc-100 h-14 flex-shrink-0 relative ${collapsed ? "justify-center px-0" : "px-4 gap-2.5"}`}>
            <Link to="/" className="flex items-center gap-2.5 min-w-0 flex-1">
              {collapsed ? (
                <div className="size-6 rounded bg-[#D33333] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">M</span>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 min-w-0">
                  <MainLogoVariant className="h-[16px] w-[87px] relative flex-shrink-0" />
                  <span className="text-[11px] text-zinc-400 truncate leading-tight">{mockMuseum.name}</span>
                </div>
              )}
            </Link>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="ml-auto p-1 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}
          </div>

          {/* Expand button (collapsed state) */}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="mx-auto mt-2 mb-1 p-1.5 text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="size-4" />
            </button>
          )}

          <SidebarNav collapsed={collapsed} />

          {/* Bottom items */}
          <div className={`px-2 py-2 border-t border-zinc-100 space-y-0.5 flex-shrink-0 ${collapsed ? "flex flex-col items-center" : ""}`}>
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              if (collapsed) {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    className={`p-2.5 rounded-lg transition-colors ${active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"}`}
                  >
                    <Icon className="size-[18px]" strokeWidth={active ? 2 : 1.5} />
                  </Link>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                    active ? "bg-zinc-900 text-white font-medium" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <Icon className="size-4 flex-shrink-0" strokeWidth={active ? 2 : 1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {collapsed ? (
              <button title="Log out" className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
                <LogOut className="size-[18px]" strokeWidth={1.5} />
              </button>
            ) : (
              <button className="flex items-center gap-2.5 px-2 py-1.5 w-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 rounded-md transition-colors text-[13px]">
                <LogOut className="size-4 flex-shrink-0" strokeWidth={1.5} />
                <span>Log out</span>
              </button>
            )}
            {!collapsed && (
              <Link
                to="/superadmin"
                className="flex items-center gap-2.5 px-2 py-1.5 text-zinc-300 hover:text-zinc-500 hover:bg-zinc-50 rounded-md transition-colors text-[11px]"
              >
                <span className="size-4 flex-shrink-0 flex items-center justify-center">
                  <span className="size-1.5 rounded-full bg-zinc-300" />
                </span>
                <span>SuperAdmin</span>
              </Link>
            )}
          </div>

          {/* User card */}
          <div className={`border-t border-zinc-100 flex-shrink-0 ${collapsed ? "flex justify-center py-3" : "px-4 py-4"}`}>
            {collapsed ? (
              <Link to="/profile" title={currentUser.name}>
                <div className="size-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[11px]">
                  {currentUser.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
              </Link>
            ) : (
              <>
                <div className="flex items-start gap-2.5">
                  <div className="size-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                    {currentUser.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-800 leading-tight truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
                    {currentUser.bio && (
                      <p className="text-[11px] text-zinc-400 italic mt-1 leading-snug line-clamp-2">{currentUser.bio}</p>
                    )}
                  </div>
                </div>
                <Link to="/profile" className="mt-2 block text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2">
                  Edit
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center">
            <MainLogoVariant className="h-[20px] w-[108px] relative" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-md"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 bg-white max-h-[80vh] overflow-y-auto">
            <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
            <div className="px-2 pb-3 pt-1 border-t border-zinc-100 space-y-0.5">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-2 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 rounded-md text-[13px]"
                  >
                    <Icon className="size-4" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button className="flex items-center gap-2.5 px-2 py-1.5 w-full text-zinc-500 hover:bg-zinc-50 rounded-md text-[13px]">
                <LogOut className="size-4" strokeWidth={1.5} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200">
        <div className="flex items-center justify-around px-1 py-2">
          {mobileTabItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg flex-1 transition-colors ${
                  active ? "text-zinc-900" : "text-zinc-400"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className={`${mainPadding} pt-14 pb-20 lg:pt-0 lg:pb-0 bg-white min-h-screen transition-all duration-300 ease-in-out`}>
        <Outlet />
      </main>

      {/* Visitor Mode — guide picker */}
      {visitorPickerOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setVisitorPickerOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div>
                <h2 className="text-[14px] font-semibold text-zinc-900">Visitor Mode</h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">Select a guide to preview</p>
              </div>
              <button onClick={() => setVisitorPickerOpen(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-2">
              {allGuideNames.map((name) => (
                <button
                  key={name}
                  onClick={() => { setVisitorGuide(name); setVisitorPickerOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors text-left"
                >
                  <div className="size-7 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {name.slice(0, 3).toUpperCase()}
                  </div>
                  <span className="text-[13px] text-zinc-800 font-medium">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {visitorGuide && (
        <GuidePreviewModal guideName={visitorGuide} onClose={() => setVisitorGuide(null)} />
      )}

      <AIAssistantDrawer />

      {showOnboarding && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}


    </div>
  );
}
