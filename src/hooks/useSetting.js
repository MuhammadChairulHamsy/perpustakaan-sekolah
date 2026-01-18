import { useEffect, useState } from "react";
import supabase from "../lib/supabase/client";

export const useSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error("Supabase Error:", error);
        setError(error);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error("Catch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addUsers = async (formData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: "PasswordDefault123!",
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role,
          },
        },
      });

      if (error) throw error;

      // Refresh data setelah berhasil
      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Error inviting user:", err);
      return false;
    }
  };

  const editUser = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: updatedData.full_name,
          role: updatedData.role,
        })
        .eq("id", id);

      if (error) throw error;

      // AMBIL DATA TERBARU DARI DB (Paling Aman)
      await fetchUsers();

      return true;
    } catch (err) {
      console.error("Error editing:", err);
      return false;
    }
  };

  const deleteUser = async (id) => {
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);

      if (error) {
        alert("Gagal menghapus: " + error.message);
        return false;
      }

      // Jika berhasil di DB, baru hapus di state UI
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return true;
    } catch (err) {
      console.error("Error:", err);
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    addUsers,
    editUser,
    deleteUser,
    refetch: fetchUsers,
  };
};
