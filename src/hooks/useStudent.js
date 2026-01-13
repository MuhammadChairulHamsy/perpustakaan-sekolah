import { useEffect, useState } from "react";
import supabase from "../lib/supabase/client";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.class?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from("siswa").select("*");

      if (error) {
        console.error("Supabase Error:", error);
        setError(error);
      } else {
        setStudents(data || []);
        setFilteredStudents(data || []);
      }
    } catch (err) {
      console.error("Catch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const { data, error } = await supabase
        .from("siswa")
        .insert([studentData])
        .select();

      if (error) throw error;

      // Tambahkan buku baru ke state
      setStudents((prevStudent) => [...prevStudent, ...data]);
      return true;
    } catch (err) {
      console.error("Error adding student:", err);
      return false;
    }
  };

  const editStudent = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from("siswa")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;

      // Update state lokal
      setStudents((prevStudent) =>
        prevStudent.map((student) =>
          student.id === id ? { ...student, ...updatedData } : student
        )
      );

      return true;
    } catch (err) {
      console.error("Error editing:", err);
      return false;
    }
  };

  const deleteStudent = async (id) => {
    const { error } = await supabase.from("siswa").delete().eq("id", id);

    if (error) {
      console.error("Error deleting:", error);
      return false;
    } else {
      setStudents(students.filter((student) => student.id !== id));
      return true;
    }
  };

  return {
    students: filteredStudents,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    addStudent,
    editStudent,
    deleteStudent,
    refetch: fetchStudents,
  };
};
