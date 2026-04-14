import { supabase } from "../lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useReport = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["report-data"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalRes,
        dailyRes,
        monthlyRes,
        statusRes,
        topBooksRes,
        realOverdueRes,
        activeBorrowersRes,
      ] = await Promise.all([
        supabase.from("report_total_loans").select("*").maybeSingle(),
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .gte("loan_date", today.toISOString()),
        supabase.from("report_monthly_loans").select("*"),
        supabase.from("report_loan_status_distribution").select("*"),
        supabase.from("report_top_books").select("*"),
        // Hitung manual Terlambat
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .lt("due_date", now)
          .neq("status", "dikembalikan"),
        // Hitung Peminjam Aktif
        supabase
          .from("peminjaman")
          .select("student_id")
          .neq("status", "dikembalikan"),
      ]);

      const totalCount = totalRes.data?.total_loans || 0;
      const realOverdueCount = realOverdueRes.count || 0;
      const rawStatus = statusRes.data || [];

      // 1. Inisialisasi Map Status agar tidak terjadi double counting
      const statusMap = {
        borrowed: 0,
        returned: 0,
        overdue: realOverdueCount, // Ambil dari hitungan manual terbaru
      };
      rawStatus.forEach((item) => {
        // Pastikan kata 'dikembalikan' (sesuai DB) dipetakan ke 'returned' (untuk chart)
        if (item.status === "dikembalikan" || item.status === "returned") {
          statusMap.returned = item.total;
        } else if (item.status === "dipinjam" || item.status === "borrowed") {
          statusMap.borrowed = Math.max(0, item.total - realOverdueCount);
        }
      });

      // 2. Pastikan pinjaman baru hari ini tetap masuk ke chart jika statusMap masih 0
      if (statusMap.borrowed === 0 && dailyRes.count > 0) {
        statusMap.borrowed = dailyRes.count;
      }

      // 3. Masukkan ke array untuk Recharts
      const mappedStatus = [
        { status: "borrowed", total: statusMap.borrowed },
        { status: "returned", total: statusMap.returned },
        { status: "overdue", total: statusMap.overdue },
      ];

      const uniqueBorrowers = new Set(
        activeBorrowersRes.data?.map((i) => i.student_id),
      );
      const activeBorrowersCount = uniqueBorrowers.size;

      const overdueRate =
        totalCount > 0 ? ((realOverdueCount / totalCount) * 100).toFixed(1) : 0;

      return {
        summary: {
          totalLoans: totalCount,
          dailyLoans: dailyRes.count || 0,
          overdueRate: Number(overdueRate),
          activeBorrowers: activeBorrowersCount,
        },
        monthlyLoans: monthlyRes.data || [],
        loanStatus: mappedStatus,
        topBooks: topBooksRes.data || [],
      };
    },
    staleTime: 1000 * 60 * 1,
  });

  return {
    isLoading,
    error: error?.message,
    summary: data?.summary || {
      totalLoans: 0,
      dailyLoans: 0,
      overdueRate: 0,
      activeBorrowers: 0,
    },
    monthlyLoans: data?.monthlyLoans || [],
    loanStatus: data?.loanStatus || [],
    topBooks: data?.topBooks || [],
    refetch,
  };
};
