import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  FileText,
  BarChart3,
  Settings,
  TrafficCone,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Live Feed", path: "/live-feed", icon: Video },
  { title: "Plate Log", path: "/plate-log", icon: FileText },
  { title: "Analytics", path: "/analytics", icon: BarChart3 },
  { title: "Settings", path: "/settings", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrafficCone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              TRAFFIC<span className="text-primary">IQ</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              V1.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer branding */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary">ED</span>
            </div>
            <span className="text-xs font-semibold text-foreground">
              Edo State
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Edo State Traffic Management Authority (EDSTMA), Benin City
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
