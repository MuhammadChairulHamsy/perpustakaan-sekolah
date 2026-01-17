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

  const addUsers = async (userData) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([userData])
        .select();

      if (error) throw error;

      // Tambahkan buku baru ke state
      setUsers((prevUser) => [...prevUser, ...data]);
      return true;
    } catch (err) {
      console.error("Error adding user:", err);
      return false;
    }
  };

  const editUser = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;

      // Update state lokal
      setUsers((prevUser) =>
        prevUser.map((user) =>
          user.id === id ? { ...user, ...updatedData } : user
        )
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
  }
};
