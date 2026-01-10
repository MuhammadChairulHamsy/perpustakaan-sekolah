import { useEffect, useState } from "react";
import supabase from "../lib/db";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from("siswa").select("*");

      if (error) {
        console.error("Supabase Error:", error);
        setError(error);
      } else {
        setStudents(data || []);
      }
    } catch (err) {
      console.error("Catch Error:", err);
      setError(err)
    } finally {
      setLoading(false);
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

  return { students, loading, error, deleteStudent, refetch: fetchStudents };
};
