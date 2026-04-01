import { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFinance = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data-finance"],
    queryFn: async () => {
      const { data: loanData, error: dbError } = await supabase
        .from("peminjaman")
        .select(`
          id, 
          fine, 
          status, 
          return_date, 
          created_at,
          loan_date,
          due_date,
          siswa (name), 
          buku (title, author)
        `)
        .not("fine", "is", null);

      if (dbError) throw dbError;

      const { count: overdueCount } = await supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true })
        .eq("status", "overdue");

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
      
      const grouped = (loanData || [])
        .filter(item => item.status === "returned" && item.return_date && new Date(item.return_date) >= sevenDaysAgo)
        .reduce((acc, curr) => {
          const dateLabel = new Date(curr.return_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
          acc[dateLabel] = (acc[dateLabel] || 0) + Number(curr.fine || 0);
          return acc;
        }, {});

      const chartData = Object.keys(grouped).map((key) => ({
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
        chartData,
      };
    },
    staleTime: 1000 * 60 * 5,
  });

    const deleteLoan = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("peminjaman")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-loans"] });
      toast.success("Data pinjaman berhasil dihapus");
    },
    onError: (err) => {
      toast.error(`Gagal: ${err.message}`);
    },
  });

  const returnLoanMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("peminjaman")
        .update({
          status: "returned",
          return_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-finance"] });
    },
  });

  const filteredFines = useMemo(() => {
    const rawData = data?.summary?.finesRaw || [];
    if (!searchQuery) return rawData;

    const search = searchQuery.toLowerCase();
    return rawData.filter((item) => 
      item.siswa?.name?.toLowerCase().includes(search) ||
      item.buku?.title?.toLowerCase().includes(search)
    );
  }, [data?.summary?.finesRaw, searchQuery]);

  return {
    fines: filteredFines,
    finance: data?.summary || { totalRevenue: 0, pendingFinance: 0, collectedFines: 0, overdueBooks: 0, finesRaw: [] },
    searchQuery,
    setSearchQuery,
    setSelectedLoan,
    selectedLoan,
    returnLoan: returnLoanMutation.mutateAsync,
    collectedData: data?.chartData || [],
    isLoading,
    error: error?.message,
    deleteLoan,
    refetch,
  };
};