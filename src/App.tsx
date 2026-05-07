import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalyticsTracker } from "@/lib/analytics";
import { useLenis } from "@/lib/useLenis";
import Index from "./pages/Index.tsx";
import Validation from "./pages/Validation.tsx";
import Analytics from "./pages/Analytics.tsx";
import Privacy from "./pages/Privacy.tsx";
import Reviews from "./pages/Reviews.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  useLenis();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wildcats" element={<Index />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/reviews" element={<Reviews />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
