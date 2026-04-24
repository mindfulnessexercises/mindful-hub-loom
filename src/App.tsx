import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { usePageArrivalTracker } from "@/lib/cta-arrival";

const CEPolicies = lazy(() => import("./pages/CEPolicies.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Library = lazy(() => import("./pages/Library.tsx"));
const Search = lazy(() => import("./pages/Search.tsx"));
const Category = lazy(() => import("./pages/Category.tsx"));
const WPResolver = lazy(() => import("./pages/WPResolver.tsx"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
  },
});

const PageFallback = () => <div className="min-h-screen bg-background" />;

/**
 * Sits inside <BrowserRouter> so it can read the current location and fire
 * `cta_destination_arrived` events when the user lands on the page a CTA
 * was pointing at. See `src/lib/cta-arrival.ts` for the full mechanism.
 */
const RouterEffects = () => {
  usePageArrivalTracker();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouterEffects />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ce-policies" element={<CEPolicies />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/library" element={<Library />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:slug" element={<Category />} />
            {/* Admin/internal — public route per product decision; noindex via meta */}
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            {/* Alias: /blog/:slug also resolves to the post via WPResolver */}
            <Route path="/blog/:slug" element={<WPResolver />} />
            {/* Smart resolver: tries post first, then WP page. Keep last before NotFound */}
            <Route path="/:slug" element={<WPResolver />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

