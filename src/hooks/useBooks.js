// src/hooks/useBooks.js
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

  const deleteBook = async (id) => {
    const { error } = await supabase.from("buku").delete().eq("id", id);

    if (error) {
      console.error("Error deleting:", error);
      return false;
    } else {
      setBooks(books.filter((book) => book.id !== id));
      return true;
    }
  };

  return { books, loading, error, deleteBook, refetch: fetchBooks };
};