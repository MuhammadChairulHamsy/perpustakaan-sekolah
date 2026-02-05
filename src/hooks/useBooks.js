import { useState, useEffect } from "react";
import {supabase} from "../lib/supabase/client";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();

    const channel = supabase
      .channel("perubahan-stok")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "buku" },
        (payload) => {
          // Jika ada stok berubah di DB, update state lokal secara otomatis
          setBooks((currentBooks) =>
            currentBooks.map((b) =>
              b.id === payload.new.id ? payload.new : b,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase.from("buku").select("*");

      if (error) {
        console.error("Supabase Error:", error);
        setError(error);
      } else {
        setBooks(data || []);
        setFilteredBooks(data || []);
      }
    } catch (err) {
      console.error("Catch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData) => {
    try {
      const { data, error } = await supabase
        .from("buku")
        .insert([bookData])
        .select();

      if (error) throw error;

      // Tambahkan buku baru ke state
      setBooks((prevBooks) => [...prevBooks, ...data]);
      return true;
    } catch (err) {
      console.error("Error adding book:", err);
      return false;
    }
  };

  const editBook = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from("buku")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;

      // Update state lokal
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id ? { ...book, ...updatedData } : book,
        ),
      );

      return true;
    } catch (err) {
      console.error("Error editing:", err);
      return false;
    }
  };

  const deleteBook = async (id) => {
    try {
      const { error } = await supabase.from("buku").delete().eq("id", id);

      if (error) throw error;

      setBooks(books.filter((book) => book.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting:", err);
      return false;
    }
  };

  return {
    books: filteredBooks,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    addBook,
    editBook,
    deleteBook,
    refetch: fetchBooks,
  };
};
