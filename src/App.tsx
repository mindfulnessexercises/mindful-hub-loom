import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const CEPolicies = lazy(() => import("./pages/CEPolicies.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Search = lazy(() => import("./pages/Search.tsx"));
const WPResolver = lazy(() => import("./pages/WPResolver.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
  },
});

const PageFallback = () => <div className="min-h-screen bg-background" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ce-policies" element={<CEPolicies />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/search" element={<Search />} />
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
