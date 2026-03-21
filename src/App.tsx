import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import LiveFeed from "@/pages/LiveFeed";
import PlateLog from "@/pages/PlateLog";
import Analytics from "@/pages/Analytics";
import SettingsPage from "@/pages/Settings";
import Incidents from "@/pages/Incidents";
import Offenders from "@/pages/Offenders";
import NotFound from "@/pages/NotFound";

interface Feed {
  url: string;
  name: string;
  fileName: string;
}

const queryClient = new QueryClient();

const App = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard feeds={feeds} />} />
              <Route
                path="/live-feed"
                element={<LiveFeed feeds={feeds} setFeeds={setFeeds} />}
              />
              <Route path="/plate-log" element={<PlateLog />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/offenders" element={<Offenders />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;