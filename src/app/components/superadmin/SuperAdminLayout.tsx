import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Building2, LogOut, ChevronRight, Shield } from "lucide-react";

const navItems = [
  { path: "/superadmin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/superadmin/tenants", label: "Organizations", icon: Building2, exact: false },
];

export function SuperAdminLayout() {
  const location = useLocation();

  const isActive = (path: string, exact: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-[200px] flex-shrink-0 flex flex-col border-r border-white/[0.06]">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="size-6 rounded bg-[#D33333] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">M</span>
            </div>
            <div>
              <span className="text-white text-[13px] font-semibold block leading-tight">MuseoCMS</span>
              <span className="text-zinc-500 text-[10px] font-medium tracking-wide">SUPERADMIN</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  active
                    ? "bg-white/10 text-white font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="size-4 flex-shrink-0" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-white/[0.06] space-y-0.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Shield className="size-4 flex-shrink-0" strokeWidth={1.5} />
            Back to Studio
          </Link>
          <button className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-[12px] text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="size-4 flex-shrink-0" strokeWidth={1.5} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen bg-zinc-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
