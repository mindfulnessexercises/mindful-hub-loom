import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { wp, getFeaturedImage, getWpPostHref } from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";

interface RelatedPostsProps {
  categoryId: number;
  excludeId: number;
  /** Endpoint to query — defaults to /wp/v2/posts; pass a CPT endpoint
   *  (e.g. /wp/v2/podcast-episodes) to keep recommendations in the same
   *  format as the article being read. */
  endpoint?: string;
}

const LIMIT = 3;

/**
 * Lightweight "Continue reading" rail rendered at the bottom of every
 * post/page. Fetches the most-recent N items from the post's primary
 * category (or matching CPT) and renders compact cards.
 */
export function RelatedPosts({ categoryId, excludeId, endpoint }: RelatedPostsProps) {
  const query = useQuery({
    queryKey: [
      ...wpKeys.postsList({
        scope: "related",
        category: categoryId,
        endpoint,
        perPage: LIMIT + 1,
      }),
    ],
    queryFn: () =>
      wp.posts({
        endpoint,
        categories: categoryId,
        per_page: LIMIT + 1,
        orderby: "date",
        order: "desc",
      }),
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
    enabled: Number.isFinite(categoryId) && categoryId > 0,
  });

  const posts = (query.data?.items ?? [])
    .filter((p) => p.id !== excludeId)
    .slice(0, LIMIT);

  if (posts.length === 0) return null;

  return (
    <section
      aria-label="Continue reading"
      className="mt-14 lg:mt-20 pt-10 border-t border-border"
    >
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="text-card-heading text-foreground">Continue reading</h2>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => {
          const img = getFeaturedImage(post);
          const href = getWpPostHref(post.slug, endpoint);
          return (
            <li key={post.id}>
              <article className="group h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                <Link to={href} className="block aspect-[16/10] bg-muted overflow-hidden">
                  {img ? (
                    <img
                      src={img.url}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[hsl(var(--accent))]" />
                  )}
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="text-sm font-semibold text-foreground line-clamp-2 mb-3"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <Link
                    to={href}
                    className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
                  >
                    Read <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
