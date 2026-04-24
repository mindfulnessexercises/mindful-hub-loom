import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared "Load more" footer for paginated infinite lists.
 *
 * Provides two layers of perceived speed:
 *  1. Optimistic skeleton rows — when `isFetching` is true and a layout is
 *     given, we render N placeholder cards/rows INSIDE the grid above the
 *     button. Users see instant structure for the rows that are about to
 *     appear instead of just a spinner sitting in a void.
 *  2. The button itself stays visible (disabled + spinner) so click context
 *     is preserved without a jarring layout shift.
 *
 * The skeleton layer is rendered by the consumer via the `pendingSkeleton`
 * prop because grid templates differ per page (3-col cards vs 2-col list).
 */
export interface LoadMoreSectionProps {
  loaded: number;
  total: number;
  hasNext: boolean;
  isFetching: boolean;
  onClick: () => void;
  /** Plural noun shown in the button label (e.g. "articles", "pages"). */
  label: string;
  /** Optional skeleton block rendered above the button while fetching. */
  pendingSkeleton?: React.ReactNode;
}

export function LoadMoreSection({
  loaded, total, hasNext, isFetching, onClick, label, pendingSkeleton,
}: LoadMoreSectionProps) {
  return (
    <>
      {isFetching && pendingSkeleton ? (
        <div className="mt-6 lg:mt-8" aria-hidden>
          {pendingSkeleton}
        </div>
      ) : null}

      <div className="mt-12 flex flex-col items-center gap-3" aria-live="polite">
        <p className="text-body-sm text-muted-foreground">
          Showing {loaded.toLocaleString()} of {total.toLocaleString()}{label ? ` ${label}` : ""}
        </p>
        {hasNext && (
          <Button
            size="lg"
            variant="outline"
            className="h-11 min-w-[200px]"
            onClick={onClick}
            disabled={isFetching}
          >
            {isFetching ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading more {label}…</>
            ) : (
              <>Load more {label}</>
            )}
          </Button>
        )}
      </div>
    </>
  );
}

// ---- Reusable skeleton blocks ---------------------------------------------

/** N "card" placeholders matching the 3-column featured-image post grid. */
export function PostCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[16/10] w-full rounded-lg" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

/** N "row" placeholders matching the 2-column page-list layout. */
export function PageRowSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}
