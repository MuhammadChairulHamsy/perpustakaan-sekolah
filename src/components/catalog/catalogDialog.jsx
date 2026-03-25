import { BellRing } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Link } from "react-router-dom";
import { RatingCatalogStars } from "./RatingCatalogStars";

export const CatalogDialog = ({ book, onClose, onWishlist }) => {
  if (!book) return null;

  const isAvailable = Number(book.available) > 0;

  return (
    <Dialog open={!!book} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-5">
          <img
            src={
              book.cover ||
              book.cover_url ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"
            }
            alt={book.title}
            className="h-52 w-36 mx-auto sm:mx-0 shrink-0 rounded-lg object-cover shadow-md"
          />
          <div className="flex flex-col gap-2 flex-1">
            <p className="text-sm text-muted-foreground">
              by{" "}
              <span className="font-medium text-foreground">{book.author}</span>
            </p>
            <RatingCatalogStars rating={book.rating} />
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">
                {book.genre || book.category || "General"}
              </Badge>
              <span>{book.pages || 0} pages</span>
              <span>•</span>
              <span>{book.year || "-"}</span>
            </div>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-foreground/80 line-clamp-4">
              {book.description || "Tidak ada deskripsi untuk buku ini."}
            </DialogDescription>

            {/* Indikator Stok & Tombol Aksi */}
            <div className="mt-auto pt-4 space-y-3">
              <div className="flex items-center justify-between">
                {isAvailable ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {book.available} Tersedia
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                    Habis
                  </div>
                )}
              </div>

              {/* Tombol Logika */}
              {isAvailable ? (
                <Button asChild className="w-full cursor-pointer">
                  <Link to={`/pinjaman?bookId=${book.id}`}>
                    Pinjam Sekarang
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 cursor-pointer"
                  onClick={() => {
                    onWishlist(book);
                    onClose();
                  }}
                >
                  <BellRing className="h-4 w-4" />
                  Beritahu Saya Jika Tersedia
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
