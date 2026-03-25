import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBooks = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: allBooks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["data-books"],
    queryFn: async () => {
      const { data, error: dbError } = await supabase
        .from("buku")
        .select("id, title, author, isbn, category, stock, created_at")
        .order("created_at", { ascending: false });
      console.log("Data books dari supabase:", data);

      if (dbError) throw dbError;

      return data.map((book) => ({
        ...book,
        available: book.stock || 0,
      }));
    },

    staleTime: 100 * 60 * 10,
  });

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      const search = searchQuery.toLowerCase();
      return (
        book.title?.toLowerCase().includes(search) ||
        book.author?.toLowerCase().includes(search) ||
        book.isbn?.toLowerCase().includes(search) ||
        book.category?.toLowerCase().includes(search)
      );
    });
  }, [allBooks, searchQuery]);

  const addBook = useMutation({
    mutationFn: async (bookData) => {
      const { error } = await supabase.from("buku").insert([bookData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-books"] });
      toast.success("Buku berhasil di tambahkan");
    },
    onError: () => {
      toast.error(`Gagal: ${error.message}`);
    },
  });

  const editBook = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      if (!id) throw new Error("ID Buku tidak ditemukan!");

      const { error } = await supabase
        .from("buku")
        .update(updatedData)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-books"] });
      toast.success("Buku berhasil diperbarui");
    },
    onError: (err) => {
      toast.error(`Gagal: ${err.message || "Terjadi kesalahan sistem"}`);
    },
  });

 const deleteBook = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("buku").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-books"] });
      toast.success("Buku berhasil dihapus");
    },
    onError: (err) => {
      toast.error(`Gagal: ${err.message}`);
    },
  });

  return {
    books: filteredBooks,
    searchQuery,
    setSearchQuery,
    isLoading,
    error: error?.message,
    addBook,
    editBook,
    deleteBook,
    refetch,
  };
};
