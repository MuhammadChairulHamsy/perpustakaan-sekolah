import { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

export const useLoans = () => {
  const queryClient = useQueryClient();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allLoans = [], isLoading, error, refetch } = useQuery({
    queryKey: ["data-loans"],
    queryFn: async () => {
      const { data, error: dbError } = await supabase
        .from("peminjaman")
        .select(`
          id,
          loan_date,
          due_date,
          return_date,
          status,
          fine,
          siswa:student_id (name, class),
          buku:book_id (title, author)
        `)
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const addLoan = useMutation({
    mutationFn: async ({ student_id, book_id }) => {
      const { error } = await supabase
        .from("peminjaman")
        .insert([{ student_id, book_id }]); 

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-loans"] });
      toast.success("Peminjaman Berhasil!", {
        description: "Data peminjaman telah dicatat.",
      });
    },
    onError: (err) => { 
      toast.error(`Gagal: ${err.message || "Terjadi kesalahan"}`);
    },
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
      queryClient.invalidateQueries({ queryKey: ["data-loans"] });
    },
  });

  const filteredLoans = useMemo(() => {
    return allLoans.filter((loan) => {
      const search = searchQuery.toLowerCase();
      return (
        loan.siswa?.name?.toLowerCase().includes(search) ||
        loan.buku?.title?.toLowerCase().includes(search)
      );
    });
  }, [allLoans, searchQuery]);

  return {
    loans: filteredLoans,
    searchQuery,
    setSearchQuery,
    setSelectedLoan,
    selectedLoan,
    isLoading,
    error: error?.message,
    addLoan,
    returnLoan: returnLoanMutation.mutateAsync,
    deleteLoan,
    refetch
  };
};
