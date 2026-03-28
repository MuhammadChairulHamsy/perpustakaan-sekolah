import { supabase } from "../lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useReport = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["report-data"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalRes, 
        overdueRateRes, 
        activeRes, 
        dailyRes, 
        monthlyRes, 
        statusRes, 
        topBooksRes,
        realOverdueRes
      ] = await Promise.all([
        supabase.from("report_total_loans").select("*").maybeSingle(),
        supabase.from("report_overdue_rate").select("*").maybeSingle(),
        supabase.from("report_active_borrowers").select("*"),
        supabase.from("peminjaman").select("id", { count: "exact", head: true }).gte("loan_date", today.toISOString()),
        supabase.from("report_monthly_loans").select("*"),
        supabase.from("report_loan_status_distribution").select("*"),
        supabase.from("report_top_books").select("*"),
        supabase.from("peminjaman").select("id", { count: "exact", head: true }).lt("due_date", new Date().toISOString()).neq("status", "returned")
      ]);

      // 2. Olah Data Summary
      const totalCount = totalRes.data?.total_loans || 0;
      const overdueData = overdueRateRes.data || { total_loans: 0, overdue_count: 0 };
      const realOverdueCount = realOverdueRes.count || 0;

      const overdueRate = overdueData.total_loans > 0
        ? ((realOverdueCount / overdueData.total_loans) * 100).toFixed(1)
        : 0;

      // 3. Mapping Status Distribution (Logika Overdue vs Borrowed)
      const rawStatus = statusRes.data || [];
      let mappedStatus = rawStatus.map((item) => {
        if (item.status === "overdue") return { ...item, total: realOverdueCount };
        if (item.status === "borrowed") {
          return { ...item, total: Math.max(0, item.total - realOverdueCount) };
        }
        return item;
      });

      if (!mappedStatus.find((s) => s.status === "overdue")) {
        mappedStatus.push({ status: "overdue", total: realOverdueCount });
      }

      return {
        summary: {
          totalLoans: totalCount,
          dailyLoans: dailyRes.count || 0,
          overdueRate: Number(overdueRate),
          activeBorrowers: activeRes.data?.length || 0,
        },
        monthlyLoans: monthlyRes.data || [],
        loanStatus: mappedStatus,
        topBooks: topBooksRes.data || [],
      };
    },
    staleTime: 1000 * 60 * 15, 
  });

  return {
    isLoading,
    error: error?.message,
    summary: data?.summary || { totalLoans: 0, dailyLoans: 0, overdueRate: 0, activeBorrowers: 0 },
    monthlyLoans: data?.monthlyLoans || [],
    loanStatus: data?.loanStatus || [],
    topBooks: data?.topBooks || [],
    refetch,
  };
};