import { useState, useEffect } from "react";
import supabase from "../lib/db";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase.from("buku").select("*");

      if (error) {
        console.error("Supabase Error:", error);
        setError(error);
      } else {
        setBooks(data || []);
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
          book.id === id ? { ...book, ...updatedData } : book
        )
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
    books,
    loading,
    error,
    addBook,
    editBook,
    deleteBook,
    refetch: fetchBooks,
  };
};