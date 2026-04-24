import { useEffect, useState } from "react";

/**
 * Slim progress bar fixed to the top of the viewport. Tracks how far the
 * user has scrolled through the targeted article element (or the whole
 * document, when no target is provided).
 *
 * Hidden under sm so it doesn't fight the navbar on small screens.
 */
export function ReadingProgress({ targetRef }: { targetRef?: React.RefObject<HTMLElement> }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const compute = () => {
      const el = targetRef?.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = Math.max(1, el.offsetHeight - window.innerHeight);
        const scrolled = Math.min(total, Math.max(0, -rect.top));
        setPct((scrolled / total) * 100);
      } else {
        const doc = document.documentElement;
        const total = Math.max(1, doc.scrollHeight - window.innerHeight);
        setPct((window.scrollY / total) * 100);
      }
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [targetRef]);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
