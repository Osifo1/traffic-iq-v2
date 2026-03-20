import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <AppSidebar />
      <main className="ml-64 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
