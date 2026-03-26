import { Star } from "lucide-react";

export const RatingCatalogStars = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-3.5 w-3.5 ${
          star <= Math.round(rating || 0)
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground/30"
        }`}
      />
    ))}
    <span className="ml-1 text-xs font-medium text-muted-foreground">
      {rating || "0"}
    </span>
  </div>
);
