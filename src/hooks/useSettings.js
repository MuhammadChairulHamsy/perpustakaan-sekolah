import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import { toast } from "sonner";

export const useSettings = (currentUser) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [loanDuration, setLoanDuration] = useState("7");
  const [maxBooks, setMaxBooks] = useState("5");

  // State untuk Preferensi Notifikasi
  const [notifications, setNotifications] = useState({
    overdue: true,
    reminders: true,
    email: true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    fetchAllSettings();
  }, [currentUser]);

  // 1. Fetch Semua Data (Users & Preferences)
  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      // Menjalankan fetch secara paralel agar lebih cepat
      const [usersRes, prefRes, configRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, role, updated_at")
          .order("full_name", { ascending: true }),

        currentUser
          ? supabase
              .from("profiles")
              .select(
                "overdue_notifications, due_date_reminders, email_notifications",
              )
              .eq("id", currentUser.id)
              .single()
          : Promise.resolve({ data: null }),
        supabase.from("library_settings").select("*"),
      ]);
      if (usersRes.error) throw usersRes.error;
      setUsers(usersRes.data || []);

      if (prefRes.data) {
        setNotifications({
          overdue: prefRes.data.overdue_notifications ?? true,
          reminders: prefRes.data.due_date_reminders ?? true,
          email: prefRes.data.email_notifications ?? true,
        });
      }

      if (configRes.data) {
        const duration = configRes.data.find((c) => c.key === "loan_duration");
        const max = configRes.data.find((c) => c.key === "max_books");
        if (duration) setLoanDuration(duration.value);
        if (max) setMaxBooks(max.value);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menyimpan konfigurasi perpustakaan
  const updateLibraryConfig = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from("library_settings").upsert(
        [
          { key: "loan_duration", value: loanDuration },
          { key: "max_books", value: maxBooks },
        ],
        { onConflict: "key" },
      );

      if (error) throw error;
      toast.success("Konfigurasi perpustakaan berhasil disimpan!");
    } catch (err) {
      toast.error("Gagal menyimpan config: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Fungsi Simpan Notifikasi (Logic moved from UI)
  const updateNotifications = async (newPrefs) => {
    if (!currentUser) return false;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          overdue_notifications: newPrefs.overdue,
          due_date_reminders: newPrefs.reminders,
          email_notifications: newPrefs.email,
        })
        .eq("id", currentUser.id);

      if (error) throw error;

      setNotifications(newPrefs);
      toast.success("Preferensi berhasil disimpan");
      return true;
    } catch (err) {
      toast.error("Gagal menyimpan: " + err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // 3. CRUD Users (Profil Admin/Petugas)
  const addUsers = async (formData) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.signUp({
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
      await fetchAllSettings(); // Refresh list
      toast.success("User berhasil ditambahkan");
      return true;
    } catch (err) {
      toast.error("Error menambah user: " + err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

 const editUser = async (id, updatedData) => {
  setIsSaving(true);
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: updatedData.full_name,
        role: updatedData.role,
      })
      .eq("id", id)
      .select();
    if (error) throw error;
    if (data.length === 0) {
      console.error("Tidak ada baris yang diupdate. Periksa apakah ID sesuai.");
    }

    await fetchAllSettings();
    toast.success("Profil diperbarui");
    return true;
  } catch (err) {
    toast.error("Error mengedit: " + err.message);
    return false;
  } finally {
    setIsSaving(false);
  }
};

  const deleteUser = async (id) => {
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;

      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User berhasil dihapus");
      return true;
    } catch (err) {
      toast.error("Gagal menghapus: " + err.message);
      return false;
    }
  };

  return {
    users,
    notifications,
    setNotifications,
    toggleNotification,
    updateLibraryConfig,
    setLoanDuration,
    setMaxBooks,
    loading,
    isSaving,
    error,
    addUsers,
    editUser,
    deleteUser,
    updateNotifications,
    refetch: fetchAllSettings,
  };
};
