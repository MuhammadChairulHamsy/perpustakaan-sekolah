import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLoans = (page = 1, pageSize = 10) => {
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
    queryKey: ["data-loans", page, pageSize, debouncedSearch],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_peminjaman", {
        search_query: debouncedSearch || "",
        page_offset: (page - 1) * pageSize,
        page_limit: pageSize,
      });

      if (error) throw error;

      const loans = (data || []).map((item) => ({
        id: item.id,
        loan_date: item.loan_date,
        due_date: item.due_date,
        status: item.status,
        siswa: { name: item.student_name, class: item.student_class },
        buku: { title: item.book_title, author: item.book_author },
      }));

      const totalCount = data?.[0]?.total_count || 0;

      return { loans, totalCount };
    },
    staleTime: 1000 * 60 * 5,
  });

  const addLoan = useMutation({
    mutationFn: async ({ student_id, book_id, loan_date, due_date }) => {
      const { error } = await supabase
        .from("peminjaman")
        .insert([{ student_id, book_id, loan_date, due_date, status: "dipinjam" }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-loans"] });
      toast.success("Peminjaman Berhasil!");
    },
    onError: (err) => {
      toast.error(`Gagal: ${err.message}`);
    },
  });

  return {
    loans: data?.loans || [],
    totalCount: data?.totalCount || 0,
    searchQuery,
    setSearchQuery,
    setSelectedLoan,
    selectedLoan,
    isLoading,
    error: error?.message,
    addLoan,
    refetch,
  };
};