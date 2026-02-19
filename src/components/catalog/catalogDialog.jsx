import { Badge, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

const RatingStars = ({ rating }) => (
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

const CatalogDialog = ({ book, onClose }) => {
  return (
    <Dialog open={!!book} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {book && (
          <>
            <DialogHeader>
              <DialogTitle>{book.title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={
                  book.cover_url ||
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"
                }
                alt={book.title}
                className="h-52 w-36 mx-auto sm:mx-0 flex-shrink-0 rounded-lg object-cover shadow-md"
              />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  by{" "}
                  <span className="font-medium text-foreground">
                    {book.author}
                  </span>
                </p>
                <RatingStars rating={book.rating} />
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">
                    {book.category || "General"}
                  </Badge>
                  <span>{book.pages || 0} pages</span>
                  <span>•</span>
                  <span>{book.year || "-"}</span>
                </div>
                <DialogDescription className="mt-2 text-sm leading-relaxed text-foreground/80 line-clamp-4">
                  {book.description || "Tidak ada deskripsi untuk buku ini."}
                </DialogDescription>
                <div className="mt-auto pt-3">
                  {book.stock > 0 ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      {book.stock} copies available
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Currently unavailable</Badge>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CatalogDialog;
