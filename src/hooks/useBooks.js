import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBooks = (page = 1, pageSize = 10) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data-books", page, pageSize, searchQuery],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("buku")
        .select(
          "id, title, author, isbn, cover_url, category, stock, created_at",
          {
            count: "exact",
          },
        );

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,isbn.ilike.%${searchQuery}%`,
        );
      }
      const {
        data: books,
        error: dbError,
        count,
      } = await query
        .order("created_at", {
          ascending: false,
        })
        .range(from, to);

      if (dbError) throw dbError;

      const formattedBooks = (books || []).map((book) => ({
        ...book,
        available: book.stock || 0,
      }));
      return { books: formattedBooks, totalCount: count || 0 };
    },
    staleTime: 1000 * 60 * 5,
  });

  const uploadImage = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from("book-covers")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload detail:", uploadError);
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("book-covers").getPublicUrl(filePath);

    return publicUrl;
  };

  const addBook = useMutation({
    mutationFn: async ({ bookData, file }) => {
      let coverUrl = file ? await uploadImage(file) : null;
      const { error } = await supabase
        .from("buku")
        .insert([{ ...bookData, cover_url: coverUrl }]);
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
    mutationFn: async ({ id, updatedData, file }) => {
      let finalData = { ...updatedData };

      if (file) {
        const coverUrl = await uploadImage(file);
        finalData.cover_url = coverUrl;
      }

      if (!id) throw new Error("ID Buku tidak ditemukan!");

      const { error } = await supabase
        .from("buku")
        .update(finalData)
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
    books: data?.books || [],
    totalCount: data?.totalCount || 0,
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
