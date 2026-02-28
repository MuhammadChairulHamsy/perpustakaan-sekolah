import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const {
    data: allBooks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["catalog-books"],
    queryFn: async () => {
      const { data, error: dbError } = await supabase
        .from("buku")
        .select(
          "id, title, author, cover_url, category, rating, pages, year, description, stock",
        )
        .order("created_at", { ascending: false });
      console.log("Data dari Supabase:", data);

      if (dbError) throw dbError;

      return data.map((book) => ({
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
        description:
          book.description || "No description available for this book.",
        available: book.stock || 0,
      }));
    },

    staleTime: 100 * 60 * 10,
  });

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "All" || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [allBooks, searchQuery, selectedGenre]);

  const genres = useMemo(() => {
    return ["All", ...new Set(allBooks.map((book) => book.genre))];
  });

  const wishlistMutation = useMutation({
    mutationFn: async ({ userId, bookId }) => {
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: userId, book_id: bookId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Berhasil ditambah ke wishlist");
    },
    onError: () => {
      toast.error(`Gagal: ${error.message}`);
    }
  });
  return {
    books: filteredBooks,
    isLoading,
    error: error?.message,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres,
    addToWishlist: wishlistMutation.mutate,
    isAddingToWishlist: wishlistMutation.isPending,
    refetch,
  };
};
