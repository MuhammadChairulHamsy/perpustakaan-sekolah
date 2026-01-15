// src/hooks/useReport.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabase/client";

export const useReportsData = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    dailyLoans: 0,
    overdueRate: 0,
    activeBorrowers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Total Pinjaman
      const { count: totalLoans, error: loanError } = await supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true });

      if (loanError) throw loanError;

      // 2. Pinjaman Hari Ini
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: dailyLoansData, error: dailyLoansError } = await supabase
        .from("peminjaman")
        .select("id")
        .gte("loan_date", today.toISOString());

      if (dailyLoansError) throw dailyLoansError;

      // 3. Tingkat Keterlambatan
      const { data: overdueData, error: overdueError } = await supabase
        .from("peminjaman")
        .select("id")
        .lt("due_date", new Date().toISOString())
        .neq("status", "returned");

      if (overdueError) throw overdueError;

      // Hitung persentase keterlambatan
      const overdueRate =
        totalLoans > 0
          ? ((overdueData?.length || 0) / totalLoans) * 100
          : 0;

      // 4. Peminjam Aktif (yang sedang pinjam)
      const { data: activeBorrowersData, error: activeBorrowersError } =
        await supabase
          .from("peminjaman")
          .select("student_id")
          .eq("status", "borrowed");

      if (activeBorrowersError) throw activeBorrowersError;

      // Hitung unique student_id
      const uniqueBorrowers = new Set(
        activeBorrowersData?.map((loan) => loan.student_id)
      );

      setStats({
        totalLoans: totalLoans || 0,
        dailyLoans: dailyLoansData?.length || 0,
        overdueRate: overdueRate.toFixed(1),
        activeBorrowers: uniqueBorrowers.size || 0,
      });
    } catch (err) {
      console.error("Report Error:", err);
      setError(err.message || "Terjadi Kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchReportData,
  };
};