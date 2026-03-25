// src/hooks/useLoans.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

export const useLoans = () => {
  const queryClient = useQueryClient();
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: allLoans = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["data-loans"],
    queryFn: async () => {
      const { data, error: dbError } = await supabase
        .from("peminjaman")
        .select(
          `
        id,
        loan_date,
        due_date,
        return_date,
        status,
        fine,
            siswa:student_id (name, class),
            buku:book_id (title, author)
          `,
        )
        .order("created_at", { ascending: false });
      console.log("Data loans dari supabase", data);

      if (dbError) throw dbError;

      return data.map((loan) => ({
        ...loan,
      }));
    },

    staleTime: 100 * 60 * 10,
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
        description: "Data peminjaman telah dicatat dan stok buku berkurang.",
      });
    },
    onError: () => {
      toast.error(`Gagal: ${error.message}`);
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

  const deleteLoan = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("peminjaman").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-loans"] });
      toast.success("Data pinjaman berhasil dihapus");
    },
    onError: () => {
      toast.error(`Gagal: ${error.message}`);
    },
  });

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
    refetch,
  };
};
