import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

export const useCatalog = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setIsLoading(true);

      const { data, error: dbError } = await supabase
        .from("buku")
        .select("*")
        .order("created_at", { ascending: false });
      console.log("Data dari Supabase:", data);

      if (dbError) throw dbError;

      const formatedBooks = data.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author || "Unknown Author",
        cover:
          book.cover_url ||
          "https://images.unsplash.com/photo-1543004471-24b94d873f24?q=80&w=1000&auto=format&fit=crop",
        genre: book.category || "General",
        rating: book.rating || 4.5,
        pages: book.pages || 0,
        year: book.year || new Date().getFullYear(),
        description: book.description || "No description available for this book.",
        available: book.stock || 0,
      }));

      setAllBooks(formatedBooks);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });


    const addToWishlist = async (userId, bookId) => {
    const { error } = await supabase
      .from("wishlist")
      .insert([{ user_id: userId, book_id: bookId }]);
    return { error };
  };

  const dynamicGenres = ["All", ...new Set(allBooks.map((book) => book.genre))];

  return {
    books: filteredBooks,
    addToWishlist,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres: dynamicGenres,
    refetch: fetchCatalog,
  };
};
