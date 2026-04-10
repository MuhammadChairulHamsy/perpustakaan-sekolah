import { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

export const useStudents = (page = 1, pageSize = 10) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data-students", page, pageSize, debouncedSearch],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("siswa")
        .select("id, name, class, email, created_at", { count: "exact" });

      if (debouncedSearch) {
        query = query.or(
          `name.ilike.%${debouncedSearch}%, email.ilike.%${debouncedSearch}%, class.ilike.%${debouncedSearch}%`,
        );
      }
      const {
        data: students,
        error: dbError,
        count,
      } = await query.order("created_at", { ascending: false }).range(from, to);

      if (dbError) throw dbError;

      const formattedStudents = (students || []).map((student) => ({
        ...student,
      }));
      return { students: formattedStudents, totalCount: count || 0 };
    },

    staleTime: 100 * 60 * 10,
  });

  const addStudent = useMutation({
    mutationFn: async (studentData) => {
      const { error } = await supabase.from("siswa").insert([studentData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-students"] });
      toast.success("Siswa berhasil di tambahkan");
    },
    onError: () => {
      toast.error(`Gagal: ${error.message}`);
    },
  });

  const editStudent = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      if (!id) throw new Error("Id Siswa tidak ditemukan!");

      const { error } = await supabase
        .from("siswa")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-students"] });
      toast.success("Siswa berhasil diperbarui");
    },
    onError: () => {
      toast.error(`Gagal: ${error.message || "Terjadi kesalahan sistem"}`);
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("siswa").delete().in("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-students"] });
      toast.success("Siswa berhasil dihapus");
    },
    onError: () => {
      toast.error(`Gagal: ${error.message}`);
    },
  });

  return {
    students: data?.students || [],
    totalCount: data?.totalCount || 0,
    searchQuery,
    setSearchQuery,
    isLoading,
    error: error?.message,
    addStudent,
    editStudent,
    deleteStudent: deleteStudent.mutateAsync,
    refetch,
  };
};
