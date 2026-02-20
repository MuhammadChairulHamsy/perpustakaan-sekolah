import { useState } from "react";
import { Search, BookOpen, Filter, Star } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CatalogDialog from "../components/catalog/catalogDialog";
import { useCatalog } from "../hooks/useCatalog";
import { Button } from "../components/ui/button";

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

const Catalog = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const {
    books,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres,
  } = useCatalog();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Digital Catalog
          </h1>
          <p className="text-muted-foreground">
            Jelajahi dan temukan buku-buku dalam koleksi perpustakaan kami.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan judul atau penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:shadow-lg hover:-translate-y-1 "
          >
            {/* Container Gambar */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay Jika Stok Kosong */}
              {book.available === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Badge variant="destructive" className="text-xs">
                    Buku Habis
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 flex items-end justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/50 to-transparent p-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs shadow-md cursor-pointer"
                >
                  Lihat Detail
                </Button>
              </div>
            </div>

            {/* Info Buku */}
            <div className="flex flex-1 flex-col gap-1 p-3">
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-muted-foreground">{book.author}</p>

              <div className="mt-auto pt-2">
                <RatingStars rating={book.rating} />
              </div>

              <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
                {book.genre}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">Buku tidak ditemukan</h3>
          <p className="text-muted-foreground">
            Coba gunakan kata kunci pencarian lain.
          </p>
        </div>
      )}

      <CatalogDialog
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
};

export default Catalog;
