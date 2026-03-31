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
        .select("id, title, author, isbn, cover_url, category, stock, created_at")
        .order("created_at", { ascending: false });

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

  const uploadImage = async (file) => {
    if(!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const {error: uploadError, data} = await supabase.storage.from("book-covers").upload(filePath, file);

   if (uploadError) {
    console.error("Upload detail:", uploadError);
    throw uploadError;
  }

    const {data: {publicUrl} } = supabase.storage.from("book-covers").getPublicUrl(filePath);

    return publicUrl;
  }

  const addBook = useMutation({
    mutationFn: async ({bookData, file}) => {
      let coverUrl = null;

      if(file) {
        coverUrl = await uploadImage(file)
      }

      const { error } = await supabase.from("buku").insert([{...bookData, cover_url: coverUrl}]);

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
      let finalData = {...updatedData};

      if(file) {
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
