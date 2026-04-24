import { useEffect, useState } from "react";
import { Filter, Search, X, FileText, BookOpen, Check } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WPCategory } from "@/lib/wp";
import { LIBRARY_SORT_OPTIONS, type LibrarySort } from "@/components/wp/LibrarySortSelect";

export interface MobileLibraryFiltersProps {
  /** Current applied state, sourced from the URL. */
  tab: "posts" | "pages";
  search: string;
  category?: number;
  sort: LibrarySort;

  /** All loadable categories (already filtered to non-empty / non-uncategorized). */
  categories: WPCategory[];

  /**
   * Commit handler. Receives the new state to persist to the URL — the parent
   * is responsible for translating this into useSearchParams updates so links
   * remain shareable.
   */
  onApply: (next: {
    tab: "posts" | "pages";
    search: string;
    category?: number;
    sort: LibrarySort;
  }) => void;
}

/**
 * Mobile-only bottom-sheet that consolidates Search + Tab + Category + Sort
 * for the Library page. The sheet stages changes locally so the user can tweak
 * multiple filters at once, then commits them through `onApply` — which writes
 * them back to the URL so the resulting view is still shareable.
 */
export function MobileLibraryFilters({
  tab,
  search,
  category,
  sort,
  categories,
  onApply,
}: MobileLibraryFiltersProps) {
  const [open, setOpen] = useState(false);

  // Local staged state — only committed when the user taps "Apply".
  const [draftTab, setDraftTab] = useState<"posts" | "pages">(tab);
  const [draftSearch, setDraftSearch] = useState(search);
  const [draftCategory, setDraftCategory] = useState<number | undefined>(category);
  const [draftSort, setDraftSort] = useState<LibrarySort>(sort);

  // Re-sync the draft whenever the sheet opens OR the URL state changes from
  // outside (e.g. category chip tapped on desktop, deep link, back button).
  useEffect(() => {
    if (open) {
      setDraftTab(tab);
      setDraftSearch(search);
      setDraftCategory(category);
      setDraftSort(sort);
    }
  }, [open, tab, search, category, sort]);

  const activeCount =
    (search ? 1 : 0) +
    (category ? 1 : 0) +
    (tab === "pages" ? 1 : 0) +
    (sort !== "newest" ? 1 : 0);

  const handleApply = () => {
    onApply({
      tab: draftTab,
      search: draftSearch.trim(),
      category: draftTab === "posts" ? draftCategory : undefined,
      sort: draftTab === "pages" && draftSort === "popular" ? "newest" : draftSort,
    });
    setOpen(false);
  };

  const handleClearAll = () => {
    setDraftSearch("");
    setDraftCategory(undefined);
    setDraftTab("posts");
    setDraftSort("newest");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 justify-between bg-card"
          aria-label="Open library filters"
        >
          <span className="inline-flex items-center gap-2">
            <Filter className="h-4 w-4" aria-hidden />
            Filters &amp; search
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[88vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Filter the library</DrawerTitle>
          <DrawerDescription>
            Search, switch between articles and pages, or narrow by category.
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="px-4 flex-1 overflow-y-auto">
          <div className="space-y-6 pb-4">
            {/* Search */}
            <div>
              <label
                htmlFor="mobile-lib-search"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block"
              >
                Search
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleApply();
                }}
              >
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="mobile-lib-search"
                    type="search"
                    value={draftSearch}
                    onChange={(e) => setDraftSearch(e.target.value)}
                    placeholder={draftTab === "posts" ? "Search articles…" : "Search pages…"}
                    className="pl-9 pr-9 h-12 bg-card text-base"
                  />
                  {draftSearch && (
                    <button
                      type="button"
                      onClick={() => setDraftSearch("")}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Tab segmented control */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Content type
              </p>
              <div
                role="tablist"
                aria-label="Choose content type"
                className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-muted"
              >
                <SegmentedItem
                  active={draftTab === "posts"}
                  onClick={() => setDraftTab("posts")}
                  icon={<FileText className="h-4 w-4" aria-hidden />}
                  label="Articles"
                />
                <SegmentedItem
                  active={draftTab === "pages"}
                  onClick={() => setDraftTab("pages")}
                  icon={<BookOpen className="h-4 w-4" aria-hidden />}
                  label="Pages"
                />
              </div>
            </div>

            {/* Category list (posts only) */}
            {draftTab === "posts" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Category
                  </p>
                  {draftCategory !== undefined && (
                    <button
                      type="button"
                      onClick={() => setDraftCategory(undefined)}
                      className="text-xs font-semibold text-primary hover:underline underline-offset-4"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <ul className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
                  <li>
                    <CategoryRow
                      label="All categories"
                      selected={draftCategory === undefined}
                      onClick={() => setDraftCategory(undefined)}
                    />
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <CategoryRow
                        label={c.name}
                        count={c.count}
                        selected={draftCategory === c.id}
                        onClick={() => setDraftCategory(c.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t border-border bg-background gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearAll}
              className="flex-1 h-12"
            >
              Clear all
            </Button>
            <Button type="button" onClick={handleApply} className="flex-1 h-12">
              Apply filters
            </Button>
          </div>
          <DrawerClose asChild>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground py-1"
            >
              Cancel
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function SegmentedItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 h-11 rounded-md text-sm font-semibold transition-colors min-h-[44px] ${
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function CategoryRow({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count?: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full flex items-center justify-between gap-3 text-left px-4 py-3 min-h-[48px] transition-colors ${
        selected ? "bg-primary/10 text-foreground" : "hover:bg-accent/50"
      }`}
    >
      <span className="flex-1 text-sm font-medium">{label}</span>
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">{count.toLocaleString()}</span>
      )}
      {selected && <Check className="h-4 w-4 text-primary shrink-0" aria-hidden />}
    </button>
  );
}
