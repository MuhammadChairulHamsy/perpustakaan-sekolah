import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFinance = (page = 1, pageSize = 10) => {
  const queryClient = useQueryClient();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data-finance", page, pageSize, debouncedSearch],
    queryFn: async () => {
      const offset = (page - 1) * pageSize;

      const [financeResult, chartResult, overdueResult] = await Promise.all([
        supabase.rpc("get_finance_data", {
          search_query: debouncedSearch || "",
          page_offset: offset,
          page_limit: pageSize,
        }),
        supabase.rpc("get_finance_chart"),
        supabase
          .from("peminjaman")
          .select("*", { count: "exact", head: true })
          .eq("status", "overdue"),
      ]);

      if (financeResult.error) throw financeResult.error;
      if (chartResult.error) throw chartResult.error;

      const result = financeResult.data || [];

      const mappedFines = result.map((item) => ({
        id: item.id,
        loan_date: item.loan_date,
        due_date: item.due_date,
        return_date: item.return_date,
        status: item.status,
        fine: item.fine,
        siswa: { name: item.student_name },
        buku: { title: item.book_title },
        displayStatus: item.status === "returned" ? "paid" : "unpaid",
      }));

      const summary = {
        totalRevenue: result[0]?.total_revenue_all || 0,
        pendingFinance: result[0]?.total_pending_all || 0,
        collectedFines: result[0]?.total_revenue_all || 0,
        overdueBooks: overdueResult.count || 0,
        paidCount: result[0]?.count_paid || 0,
        unpaidCount: result[0]?.count_unpaid || 0,
      };

      const chartData = (chartResult.data || []).map((item) => ({
        date: item.date_label,
        amount: Number(item.total_amount) || 0,
      }));

      return {
        fines: mappedFines,
        totalCount: result[0]?.total_count_filtered || 0,
        summary,
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
      queryClient.invalidateQueries({ queryKey: ["data-finance"] });
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
      toast.success("Peminjaman berhasil dikembalikan");
    },
    onError: (err) => {
      toast.error(`Gagal: ${err.message}`);
    },
  });

  return {
    fines: data?.fines || [],
    totalCount: data?.totalCount || 0,
    finance: data?.summary || {
      totalRevenue: 0,
      pendingFinance: 0,
      collectedFines: 0,
      overdueBooks: 0,
    },
    collectedData: data?.chartData || [],
    searchQuery,
    setSearchQuery,
    setSelectedLoan,
    selectedLoan,
    returnLoan: returnLoanMutation.mutateAsync,
    isLoading,
    error: error?.message,
    deleteLoan,
    refetch,
  };
};