import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

export const useFinance = () => {
  const [fine, setFinance] = useState({
    totalRevenue: 0,
    pendingFinance: 0,
    collectedFines: 0,
    overdueBooks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [collectedData, setCollectedData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: loanData, error: dbError } = await supabase
        .from("peminjaman")
        .select("fine, status, created_at")
        .gt("fine", 0);

      if (dbError) throw dbError;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setHours(0, 0, 0, 0);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      console.log("Range Waktu:", sevenDaysAgo.toISOString());

      const { data: testData } = await supabase
        .from("peminjaman")
        .select("fine, status, return_date")
        .limit(5);

      console.log("Sample Data Tanpa Filter:", testData);

      const { data: chartRaw } = await supabase
        .from("peminjaman")
        .select("fine, return_date")
        .eq("status", "returned")
        .not("return_date", "is", null)
        .gte("return_date", sevenDaysAgo.toISOString());

      const grouped = chartRaw?.reduce((acc, curr) => {
        const dateStr = curr.return_date || curr.created_at;

        if (!dateStr) return acc; 

        const dateObj = new Date(dateStr);

      
        if (isNaN(dateObj.getTime())) return acc;

        const dateLabel = dateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });

        acc[dateLabel] = (acc[dateLabel] || 0) + (Number(curr.fine || 0));
        return acc;
      }, {});
      console.log("Isi chartRaw:", chartRaw);

      const formatChartDate = Object.keys(grouped || {}).map((key) => ({
        date: key,
        amount: grouped[key],
      }));

      setCollectedData(formatChartDate);

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
    collectedData,
    refetch: fetchFinance,
  };
};
