import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { WPAuthor } from "@/lib/wp";

interface AuthorCardProps {
  author: WPAuthor;
  publishedAt: string;
  readingMinutes: number;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Inline byline: avatar + name + dot-separated meta. Used in the post hero
 * to humanise the article without taking up a whole sidebar.
 */
export function AuthorCard({ author, publishedAt, readingMinutes }: AuthorCardProps) {
  const avatar =
    author.avatar_urls?.["96"] ||
    author.avatar_urls?.["48"] ||
    author.avatar_urls?.["24"];
  const date = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        {avatar && <AvatarImage src={avatar} alt={author.name} />}
        <AvatarFallback>{initials(author.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-foreground">{author.name}</span>
        <span className="text-xs text-muted-foreground">
          {date} · {readingMinutes} min read
        </span>
      </div>
    </div>
  );
}
