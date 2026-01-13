// src/hooks/useLoans.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabase/client";

export const useLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredLoans(loans);
    } else {
      const filtered = loans.filter(
        (loan) =>
          loan.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loan.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLoans(filtered);
    }
  }, [searchQuery, loans]);

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
        setFilteredLoans(data || []);
      }
    } catch (err) {
      console.error("Catch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

 const addLoan = async ({ student_id, book_id }) => {
  try {
    // 1. insert dulu
    const { error: insertError } = await supabase
      .from("peminjaman")
      .insert([{ student_id, book_id }]);

    if (insertError) throw insertError;

    // 2. ambil ulang data TERAKHIR + JOIN
    const { data, error } = await supabase
      .from("peminjaman")
      .select(`
        id,
        loan_date,
        due_date,
        return_date,
        status,
        fine,
        siswa:student_id (
          id,
          name,
          class
        ),
        buku:book_id (
          id,
          title,
          author
        )
      `)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    setLoans((prev) => [data, ...prev]);
    return true;
  } catch (err) {
    console.error("addLoan error:", err);
    return false;
  }
};


 const returnLoan = async (loan) => {
  try {
    const { error } = await supabase
      .from("peminjaman")
      .update({
        status: "returned",
        return_date: new Date().toISOString().split("T")[0],
      })
      .eq("id", loan.id);

    if (error) throw error;

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loan.id
          ? { ...l, status: "returned", return_date: new Date() }
          : l
      )
    );
    return true;
  } catch (err) {
    console.error(err);
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
    loans: filteredLoans,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    addLoan,
    returnLoan,
    deleteLoan,
    refetch: fetchLoans,
  };
};
