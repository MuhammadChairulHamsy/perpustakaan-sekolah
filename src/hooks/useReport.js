// src/hooks/useReportData.js
import { useEffect, useState } from "react";
import {supabase} from "../lib/supabase/client";

export const useReport = () => {
  const [summary, setSummary] = useState({
    totalLoans: 0,
    dailyLoans: 0,
    overdueRate: 0,
    activeBorrowers: 0,
  });

  const [monthlyLoans, setMonthlyLoans] = useState([]);
  const [loanStatus, setLoanStatus] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);

    try {
      const [totalRes, overdueRes, activeRes] = await Promise.all([
        supabase.from("report_total_loans").select("*").maybeSingle(),
        supabase.from("report_overdue_rate").select("*").maybeSingle(),
        supabase.from("report_active_borrowers").select("*"),
      ]);

      // Berikan nilai fallback (0) jika data null agar tidak error
      const total = totalRes.data || { total_loans: 0 };
      const overdue = overdueRes.data || { total_loans: 0, overdue_count: 0 };
      const activeCount = activeRes.data ? activeRes.data.length : 0;

      const overdueRate =
        overdue.total_loans > 0
          ? ((overdue.overdue_count / overdue.total_loans) * 100).toFixed(1)
          : 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: dailyData } = await supabase
        .from("peminjaman")
        .select("id")
        .gte("loan_date", today.toISOString());

      setSummary({
        totalLoans: total.total_loans,
        dailyLoans: dailyData?.length || 0,
        overdueRate: Number(overdueRate),
        activeBorrowers: activeCount,
      });

      const { data: monthly } = await supabase
        .from("report_monthly_loans")
        .select("*");

      const { data: status } = await supabase
        .from("report_loan_status_distribution")
        .select("*");

      const { data: books } = await supabase
        .from("report_top_books")
        .select("*");

      setMonthlyLoans(monthly || []);
      setLoanStatus(status || []);
      setTopBooks(books || []);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    summary,
    monthlyLoans,
    loanStatus,
    topBooks,
  };
};
