import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalyticsTracker } from "@/lib/analytics";
import { useLenis } from "@/lib/useLenis";
import Index from "./pages/Index.tsx";
import Mobile from "./pages/Mobile.tsx";
import Validation from "./pages/Validation.tsx";
import Analytics from "./pages/Analytics.tsx";
import Privacy from "./pages/Privacy.tsx";
import Reviews from "./pages/Reviews.tsx";
import Feedback from "./pages/Feedback.tsx";
import NotFound from "./pages/NotFound.tsx";
import ChatBubble from "./components/ChatBubble.tsx";

const queryClient = new QueryClient();

/// True when the current device is a phone (not tablet). Used to
/// auto-redirect `/` visitors to `/mobile` so the 99 % of users on
/// phones land on the layout designed for them. UA sniffing is the
/// right tool here — viewport-width media queries would also
/// redirect desktop browsers in narrow windows, which is wrong.
const isMobileUA = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/// Renders the desktop landing on `/` for desktop devices, but
/// redirects phones to `/mobile`. iPads stay on desktop — the
/// landing was designed at 1200px max-width and reads fine at
/// tablet sizes.
const RootRoute = () => {
  if (isMobileUA()) {
    return <Navigate to="/mobile" replace />;
  }
  return <Index />;
};

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
            <Route path="/" element={<RootRoute />} />
            <Route path="/mobile" element={<Mobile />} />
            <Route path="/wildcats" element={<Index />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/feedback" element={<Feedback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Floating "Ask RYZN" widget — mounted outside Routes so it
              renders on every page (including /reviews, /privacy, etc.).
              Backed by /api/chat (Edge runtime → OpenAI gpt-4o-mini). */}
          <ChatBubble />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
