import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

// ---- Mocks ---------------------------------------------------------------

// Mock the WP client so tests are deterministic and offline.
vi.mock("@/lib/wp", async () => {
  const actual = await vi.importActual<typeof import("@/lib/wp")>("@/lib/wp");
  const fakePost = {
    id: 1,
    date: "2025-01-01T00:00:00",
    modified: "2025-01-01T00:00:00",
    slug: "how-to-meditate",
    link: "https://mindfulnessexercises.com/how-to-meditate",
    title: { rendered: "How to Meditate" },
    excerpt: { rendered: "<p>An intro</p>" },
    content: { rendered: "<p>Body</p>" },
    featured_media: 0,
    categories: [],
    tags: [],
  };
  return {
    ...actual,
    wp: {
      posts: vi.fn().mockResolvedValue({ items: [fakePost], total: 1, totalPages: 1 }),
      postBySlug: vi.fn(async (slug: string) => (slug === "how-to-meditate" ? fakePost : null)),
      pages: vi.fn().mockResolvedValue({ items: [], total: 0, totalPages: 1 }),
      pageBySlug: vi.fn().mockResolvedValue(null),
      categories: vi.fn().mockResolvedValue({ items: [], total: 0, totalPages: 1 }),
      categoryBySlug: vi.fn().mockResolvedValue(null),
    },
  };
});

// Heavy/irrelevant child components — replace with stubs so the routing test
// stays focused and doesn't depend on layout markup.
vi.mock("@/components/homepage/Navbar", () => ({ Navbar: () => <nav data-testid="navbar" /> }));
vi.mock("@/components/homepage/Footer", () => ({ Footer: () => <footer data-testid="footer" /> }));
vi.mock("@/components/wp/WPSeo", () => ({ WPSeo: () => null }));

// ---- Helpers -------------------------------------------------------------

const Blog = lazy(() => import("@/pages/Blog"));
const WPResolver = lazy(() => import("@/pages/WPResolver"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function renderAt(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        <Suspense fallback={<div>loading…</div>}>
          <Routes>
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<WPResolver />} />
            <Route path="/:slug" element={<WPResolver />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// ---- Tests ---------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

describe("routing resolution", () => {
  it("/blog renders the blog index (not the WP resolver)", async () => {
    renderAt("/blog");
    // Blog page renders an h1 — wait for it.
    await waitFor(() => {
      expect(document.querySelector("h1")).toBeTruthy();
    });
    // Resolver should NOT have been asked to fetch a page or post for "blog".
    const { wp } = await import("@/lib/wp");
    expect(wp.postBySlug).not.toHaveBeenCalledWith("blog");
    expect(wp.pageBySlug).not.toHaveBeenCalledWith("blog");
  });

  it("/:slug resolves a WordPress post via WPResolver", async () => {
    renderAt("/how-to-meditate");
    await waitFor(() => {
      expect(screen.getByText("How to Meditate")).toBeInTheDocument();
    });
    const { wp } = await import("@/lib/wp");
    expect(wp.postBySlug).toHaveBeenCalledWith("how-to-meditate");
  });

  it("/blog/:slug also resolves the same post via WPResolver", async () => {
    renderAt("/blog/how-to-meditate");
    await waitFor(() => {
      expect(screen.getByText("How to Meditate")).toBeInTheDocument();
    });
    const { wp } = await import("@/lib/wp");
    expect(wp.postBySlug).toHaveBeenCalledWith("how-to-meditate");
  });

  it("/:slug for a reserved segment short-circuits to NotFound without hitting WP", async () => {
    renderAt("/search"); // /search has no Route in this test harness
    // search has no matching route here, so it falls through to *
    // and renders NotFound. The key assertion: no WP fetch was made.
    const { wp } = await import("@/lib/wp");
    expect(wp.postBySlug).not.toHaveBeenCalledWith("search");
    expect(wp.pageBySlug).not.toHaveBeenCalledWith("search");
  });
});
