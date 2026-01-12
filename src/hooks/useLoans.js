// src/hooks/useLoans.js
import { useEffect, useState } from "react";
import supabase from "../lib/db";

export const useLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const { data, error } = await supabase
        .from("peminjaman")
        .select(
          `
            *,
            siswa:student_id (name, class),
            buku:book_id (title, author)
          `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        setError(error);
      } else {
        setLoans(data || []);
      }
    } catch (err) {
      console.error("Catch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  
    const addLoan = async (loanData) => {
    try {
      const { data, error } = await supabase
        .from("peminjaman")
        .insert([loanData])
        .select();

      if (error) throw error;

      // Tambahkan buku baru ke state
      setLoans((prevLoan) => [...prevLoan, ...data]);
      return true;
    } catch (err) {
      console.error("Error adding loan:", err);
      return false;
    }
  };

   const editLoan = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from("peminjaman")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;

      // Update state lokal
      setLoans((prevLoan) =>
        prevLoan.map((loan) =>
          loan.id === id ? { ...loan, ...updatedData } : loan
        )
      );

      return true;
    } catch (err) {
      console.error("Error editing:", err);
      return false;
    }
  };


  const returnLoan = async (loan) => {
    try {
      const { error } = await supabase
        .from("peminjaman")
        .update({
          status: "returned",
          return_date: new Date().toISOString(),
        })
        .eq("id", loan.id);

      if (error) throw error;

      // Update state local
      setLoans((prevLoans) =>
        prevLoans.map((l) =>
          l.id === loan.id
            ? {
                ...l,
                status: "returned",
                return_date: new Date().toISOString(),
              }
            : l
        )
      );
      return true;
    } catch (err) {
      console.error("Error returning loan:", err);
      return false;
    }
  };

  const deleteLoan = async (id) => {
    try {
      const { error } = await supabase.from("peminjaman").delete().eq("id", id);

      if (error) throw error;

      setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting:", err);
      return false;
    }
  };

  return {
    loans,
    loading,
    error,
    addLoan,
    editLoan,
    returnLoan,
    deleteLoan,
    refetch: fetchLoans,
  };
};