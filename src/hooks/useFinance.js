import { supabase } from "../lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useFinance = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data-finance"],
    queryFn: async () => {
      // 1. Ambil semua data peminjaman yang ada dendanya
      const { data: loanData, error: dbError } = await supabase
        .from("peminjaman")
        .select("fine, status, return_date, created_at")
       .not("fine", "is", null);

      if (dbError) throw dbError;

      // 2. Ambil jumlah buku overdue (exact count)
      const { count: overdueCount, error: countError } = await supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true })
        .eq("status", "overdue");

      if (countError) throw countError;

      // --- LOGIKA PERHITUNGAN RINGKASAN ---
      let collected = 0;
      let pending = 0;

      loanData?.forEach((item) => {
        const fineAmount = Number(item.fine) || 0;
        if (item.status === "returned") {
          collected += fineAmount;
        } else {
          pending += fineAmount;
        }
      });

      console.log("Total Terkumpul:", collected);
  console.log("Data Loan:", loanData);

      // --- LOGIKA PERHITUNGAN CHART (7 Hari Terakhir) ---
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const grouped = loanData
        ?.filter(item => 
          item.status === "returned" && 
          item.return_date && 
          new Date(item.return_date) >= sevenDaysAgo
        )
        .reduce((acc, curr) => {
          const dateObj = new Date(curr.return_date);
          const dateLabel = dateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          });

          acc[dateLabel] = (acc[dateLabel] || 0) + Number(curr.fine || 0);
          return acc;
        }, {});

      const chartData = Object.keys(grouped || {}).map((key) => ({
        date: key,
        amount: grouped[key],
      }));

      // Return satu objek besar berisi semua data yang dibutuhkan UI
      return {
        summary: {
          totalRevenue: collected,
          pendingFinance: pending,
          collectedFines: collected,
          overdueBooks: overdueCount || 0,
        },
        chartData: chartData,
      };
    },
    staleTime: 1000 * 60 * 5, // Simpan di cache selama 5 menit
  });

  return {
    finance: data?.summary || { totalRevenue: 0, pendingFinance: 0, collectedFines: 0, overdueBooks: 0 },
    collectedData: data?.chartData || [],
    isLoading,
    error: error?.message,
    refetch,
  };
};