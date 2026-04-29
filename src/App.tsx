import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { usePageArrivalTracker } from "@/lib/cta-arrival";
import { useCertificationClickTracker } from "@/hooks/use-certification-click-tracker";
import { useLegacyRedirects } from "@/hooks/use-legacy-redirects";
import { StickyEmailBar } from "@/components/email/StickyEmailBar";

const CEPolicies = lazy(() => import("./pages/CEPolicies.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Library = lazy(() => import("./pages/Library.tsx"));
const AudioLibrary = lazy(() => import("./pages/AudioLibrary.tsx"));
const VideoLibrary = lazy(() => import("./pages/VideoLibrary.tsx"));
const VideoCollectionPage = lazy(() => import("./pages/VideoCollectionPage.tsx"));
const CoursesHub = lazy(() => import("./pages/CoursesHub.tsx"));
const QuotesHub = lazy(() => import("./pages/QuotesHub.tsx"));
const AffirmationsHub = lazy(() => import("./pages/AffirmationsHub.tsx"));
const ScriptsHub = lazy(() => import("./pages/ScriptsHub.tsx"));
const Search = lazy(() => import("./pages/Search.tsx"));
const Category = lazy(() => import("./pages/Category.tsx"));
const WPResolver = lazy(() => import("./pages/WPResolver.tsx"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics.tsx"));
const AdminCtaQA = lazy(() => import("./pages/AdminCtaQA.tsx"));
const AdminLinkChecker = lazy(() => import("./pages/AdminLinkChecker.tsx"));
const AdminCategoryAudit = lazy(() => import("./pages/AdminCategoryAudit.tsx"));
const AdminMeditationScriptsAudit = lazy(() => import("./pages/AdminMeditationScriptsAudit.tsx"));
const AdminSeoSnapshots = lazy(() => import("./pages/AdminSeoSnapshots.tsx"));
const AdminAudioAudit = lazy(() => import("./pages/AdminAudioAudit.tsx"));
const AdminPublishDiagnostics = lazy(() => import("./pages/AdminPublishDiagnostics.tsx"));
const DemoMeditationPlayer = lazy(() => import("./pages/DemoMeditationPlayer.tsx"));
const DemoMeditationScript = lazy(() => import("./pages/DemoMeditationScript.tsx"));

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
  useLegacyRedirects();
  useCertificationClickTracker();
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
            <Route path="/audio-library" element={<AudioLibrary />} />
            <Route path="/videos" element={<VideoLibrary />} />
            <Route path="/videos/:slug" element={<VideoCollectionPage />} />
            <Route path="/quotes" element={<QuotesHub />} />
            <Route path="/affirmations" element={<AffirmationsHub />} />
            <Route path="/meditation-scripts" element={<ScriptsHub />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:slug" element={<Category />} />
            {/* Legacy WP section landings — render the Category page directly so
                the app URL matches the WordPress URL (no /category/ prefix). */}
            <Route path="/podcast" element={<Category sectionSlug="podcast" />} />
            <Route path="/downloads" element={<Category sectionSlug="downloads" />} />
            {/* Admin/internal — public route per product decision; noindex via meta */}
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/cta-qa" element={<AdminCtaQA />} />
            <Route path="/admin/link-checker" element={<AdminLinkChecker />} />
            <Route path="/admin/category-audit" element={<AdminCategoryAudit />} />
            <Route path="/admin/meditation-scripts-audit" element={<AdminMeditationScriptsAudit />} />
            <Route path="/admin/seo-snapshots" element={<AdminSeoSnapshots />} />
            <Route path="/admin/audio-audit" element={<AdminAudioAudit />} />
            <Route path="/admin/publish-diagnostics" element={<AdminPublishDiagnostics />} />
            <Route path="/admin/meditation-player-demo" element={<DemoMeditationPlayer />} />
            <Route path="/admin/meditation-script-demo" element={<DemoMeditationScript />} />
            {/* Alias: /blog/:slug also resolves to the post via WPResolver */}
            <Route path="/blog/:slug" element={<WPResolver />} />
            {/* Smart resolver: tries post first, then WP page. Keep last before NotFound.
                Nested paths (/course/x, /podcast-episodes/y, /downloads/z) resolve via
                the last path segment — see WPResolver. */}
            <Route path="/:slug" element={<WPResolver />} />
            <Route path="/course/*" element={<WPResolver />} />
            <Route path="/courses/*" element={<WPResolver />} />
            <Route path="/podcast-episodes/*" element={<WPResolver />} />
            <Route path="/downloads/*" element={<WPResolver />} />
            <Route path="/lessons/*" element={<WPResolver />} />
            {/* Thrive Apprentice "chapter" CPT — 42 day-by-day course chapters
                live at /chapter/<slug> on WP. Resolve via WPResolver so the
                last segment is looked up as a post slug. */}
            <Route path="/chapter/*" element={<WPResolver />} />
            {/* Legacy nested permalinks from the WordPress site that rank in
                our top-100. Keep these splats so WPResolver can resolve the
                last URL segment as the post slug — preserves SEO equity. */}
            <Route path="/meditation/*" element={<WPResolver />} />
            <Route path="/meaningful-work/*" element={<WPResolver />} />
            {/* Native Courses hub replaces the flat WP list. Order matters:
                this exact-match route MUST come before the splat below so the
                hub renders instead of WPResolver fetching the WP page. */}
            <Route path="/free-online-mindfulness-courses" element={<CoursesHub />} />
            <Route path="/free-online-mindfulness-courses/*" element={<WPResolver />} />
            <Route path="/how-to-teach-meditation/*" element={<WPResolver />} />
            {/* Teacher CPT pages — surfaced inline by WPResolver. The legacy
                redirect rule used to push these off-site; we now keep them. */}
            <Route path="/mindfulness-teacher/*" element={<WPResolver />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* Site-wide sticky capture bar. Self-hides on the homepage and
            admin routes; auto-picks the right audience track per path. */}
        <StickyEmailBar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

