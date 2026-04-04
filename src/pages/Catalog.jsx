import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Filter } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalog } from "../hooks/useCatalog";
import { Button } from "../components/ui/button";
import {
  CatalogDialog,
  CatalogSkeleton,
  RatingCatalogStars,
} from "../components/catalog";
import { SearchBar } from "../components/search-bar";

const Catalog = () => {
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState(null);
  const {
    books,
    isLoading,
    searchQuery,
    setSearchQuery,
    addToWishlist,
    genres,
    selectedGenre,
    setSelectedGenre,
  } = useCatalog();

  const handleWishlist = async (book) => {
    if (!user) return toast.error("Silakan login dahulu");

    addToWishlist(user.id, book.id);
  };

  if (isLoading) {
    return <CatalogSkeleton />;
  }

  return (
    <div className="container min-h-screen space-y-8">
      <div className="flex flex-col justify-between items-start lg:flex lg:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Digital Catalog
          </h1>
          <p className="text-muted-foreground">
            Jelajahi dan temukan buku-buku dalam koleksi perpustakaan kami.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari judul atau penulis..."
            className="max-w-md"
          />
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-40">
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:shadow-lg hover:-translate-y-1 "
          >
            <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {book.available === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Badge variant="destructive" className="text-xs">
                    Habis
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 flex items-end justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-t from-black/50 to-transparent p-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs shadow-md cursor-pointer"
                >
                  Lihat Detail
                </Button>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-1 p-3">
              <h2 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                {book.title}
              </h2>
              <p className="text-xs text-muted-foreground">{book.author}</p>

              {book.stock === 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 h-8 w-full border-amber-200 bg-amber-50 text-[10px] text-amber-700 hover:bg-amber-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlist(book);
                  }}
                >
                  <Bell className="mr-1 h-3 w-3" />
                  Beritahu Saya
                </Button>
              )}

              <div className="mt-auto pt-2">
                <RatingCatalogStars rating={book.rating} />
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
          {searchQuery ? (
            <span className="text-lg font-medium">
              Buku tidak ditemukan <b>"{searchQuery}"</b>
            </span>
          ) : (
            <span className="text-muted-foreground">
              Coba gunakan kata kunci pencarian lain.
            </span>
          )}
        </div>
      )}

      <CatalogDialog
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onWishlist={handleWishlist}
      />
    </div>
  );
};

export default Catalog;
