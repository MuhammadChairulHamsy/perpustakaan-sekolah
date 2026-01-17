import { useEffect, useState } from "react";
import supabase from "../lib/supabase/client";

export const useSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
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
      password: "PasswordDefault123!", // User bisa ganti nanti lewat 'Forgot Password'
      options: {
        data: {
          full_name: formData.full_name,
          role: formData.role, // Ini akan ditangkap trigger/metadata
        },
      },
    });

    if (error) throw error;
    
    // Refresh data setelah berhasil
    await fetchSettings(); 
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
          full_name: updatedData.name,
          role: updatedData.role,
        })
        .eq("id", id);

      if (error) throw error;

      // Update state lokal
      setUsers((prevUser) =>
        prevUser.map((user) =>
          user.id === id ? { ...user, ...updatedData } : user,
        ),
      );

      return true;
    } catch (err) {
      console.error("Error editing:", err);
      return false;
    }
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      console.error("Error deleting:", error);
      return false;
    } else {
      setUsers(users.filter((user) => user.id !== id));
      return true;
    }
  };

  return {
    users,
    loading,
    error,
    addUsers,
    editUser,
    deleteUser,
    refetch: fetchSettings,
  };
};
