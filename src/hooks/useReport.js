// src/hooks/useReportData.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabase/client";

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
      const [{ data: total }, { data: daily }, { data: overdue }, { data: active }] =
        await Promise.all([
          supabase.from("report_total_loans").select("*").single(),
          supabase.from("report_daily_loans").select("*").single(),
          supabase.from("report_overdue_rate").select("*").single(),
          supabase.from("report_active_borrowers").select("*").single(),
        ]);

      const overdueRate =
        overdue.total_loans > 0
          ? ((overdue.overdue_count / overdue.total_loans) * 100).toFixed(1)
          : 0;

      setSummary({
        totalLoans: total.total_loans,
        dailyLoans: daily.daily_loans,
        overdueRate: Number(overdueRate),
        activeBorrowers: active.active_borrowers,
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
