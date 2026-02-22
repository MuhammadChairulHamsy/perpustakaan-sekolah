import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

export const useFinance = () => {
  const [fine, setFinance] = useState({
    totalRevenue: 0,
    pendingFinance: 0,
    collectedFines: 0,
    overdueBooks: 0,
  });
  console.log(fine.totalRevenue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    setLoading(true);
    setError(null);

    try {
      // TOtal uang
      const { data: loanData, error: dbError } = await supabase
        .from("peminjaman")
        .select("fine, status")
        .gt("fine", 0);

      if (dbError) throw dbError;

      const { data: overdueCount, error: countError } = await supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true })
        .eq("status", "overdue");

        if (countError) throw countError;

      let collected = 0;
      let pending = 0;

      loanData?.forEach((item) => {
        const fineAmount = Number(item.fine) || 0;
        if (item.status === "returned") { 
          collected += fineAmount;
        } else if (item.status === "overdue" || item.status === "borrowed") {
          pending += fineAmount;
        }
      });
      setFinance({
        totalRevenue: collected,
        pendingFinance: pending,
        collectedFines: collected,
        overdueBooks: overdueCount || 0,
      });
    } catch (error) {
      console.error("Error Finance:", error.message);
      setError(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return {
    fine,
    loading,
    error,
    refetch: fetchFinance,
  };
};
