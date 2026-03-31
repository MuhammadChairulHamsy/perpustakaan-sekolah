import { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFinance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data-finance"],
    queryFn: async () => {
      const { data: loanData, error: dbError } = await supabase
        .from("peminjaman")
        .select("fine, status, return_date, created_at")
        .not("fine", "is", null);

      if (dbError) throw dbError;

      const { count: overdueCount, error: countError } = await supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true })
        .eq("status", "overdue");

      if (countError) throw countError;

      let collected = 0;
      let pending = 0;

      const mappedFines = (loanData || []).map((item) => ({
        ...item,
        displayStatus: item.status === "returned" ? "paid" : "unpaid",
      }));

      mappedFines.forEach((item) => {
        const fineAmount = Number(item.fine) || 0;
        if (item.status === "returned") {
          collected += fineAmount;
        } else {
          pending += fineAmount;
        }
      });

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const grouped = loanData
        ?.filter(
          (item) =>
            item.status === "returned" &&
            item.return_date &&
            new Date(item.return_date) >= sevenDaysAgo,
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

      return {
        summary: {
          totalRevenue: collected,
          pendingFinance: pending,
          collectedFines: collected,
          overdueBooks: overdueCount || 0,
          finesRaw: mappedFines,
        },
        chartData: chartData,
      };
    },
    staleTime: 1000 * 60 * 5,
  });

 const filteredFines = useMemo(() => {
    const rawData = data?.summary?.finesRaw || [];
    if (!searchQuery) return rawData;

    const search = searchQuery.toLowerCase();
    return rawData.filter((item) => {
      return (
        item.siswa?.name?.toLowerCase().includes(search) ||
        item.buku?.title?.toLowerCase().includes(search)
      );
    });
  }, [data?.summary?.finesRaw, searchQuery]);

  return {
    fines: filteredFines,
    finance: data?.summary || {
      totalRevenue: 0,
      pendingFinance: 0,
      collectedFines: 0,
      overdueBooks: 0,
      finesRaw: [],
    },
    searchQuery,
    setSearchQuery,
    collectedData: data?.chartData || [],
    isLoading,
    error: error?.message,
    refetch,
  };
};
