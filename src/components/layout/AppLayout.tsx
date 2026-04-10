import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import AppSidebar from "./AppSidebar";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      {/* Hamburger menu button - mobile only */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-3 bg-sidebar border border-sidebar-border rounded-lg hover:bg-sidebar-accent transition-colors"
      >
        <Menu className="w-5 h-5 text-sidebar-foreground" />
      </button>

      {/* Sidebar with mobile overlay functionality */}
      <AppSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main content area */}
      <main className="ml-0 lg:ml-64 min-h-screen pt-16 lg:pt-6 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
