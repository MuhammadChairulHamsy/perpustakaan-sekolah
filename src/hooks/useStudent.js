import { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

export const useStudents = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: allStudents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["data-students"],
    queryFn: async () => {
      const { data, error: dbError } = await supabase
        .from("siswa")
        .select("id, name, class, email, created_at")
        .order("created_at", { ascending: false });
      console.log("Data students dari supabase:", data);

      if (dbError) throw dbError;

      return data.map((student) => ({
        ...student,
      }));
    },

    staleTime: 100 * 60 * 10,
  });

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const search = searchQuery.toLowerCase();
      return (
        student.name?.toLowerCase().includes(search) ||
        student.email?.toLowerCase().includes(search) ||
        student.class?.toLowerCase().includes(search)
      );
    });
  }, [allStudents, searchQuery]);

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
    mutationFn: async ({id, updatedData}) => {
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
      const { error } = await supabase.from("siswa").delete().eq("id", id);
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
    students: filteredStudents,
    searchQuery,
    setSearchQuery,
    isLoading,
    error: error?.message,
    addStudent,
    editStudent,
    deleteStudent,
    refetch,
  };
};
