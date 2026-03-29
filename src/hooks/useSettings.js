import { supabase } from "../lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSettings = (currentUser) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["settings-data"],
    queryFn: async () => {
      const [usersRes, prefRes, configRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, role, updated_at")
          .order("full_name", { ascending: true }),

        currentUser
          ? supabase
              .from("profiles")
              .select("overdue_notifications, due_date_reminders, email_notifications")
              .eq("id", currentUser.id)
              .single()
          : Promise.resolve({ data: null }),

        supabase.from("library_settings").select("*"),
      ]);

      if (usersRes.error) throw usersRes.error;

      const settingsMap = {};
      configRes.data?.forEach((item) => {
        settingsMap[item.key] = item.value;
      });

      return {
        users: usersRes.data || [],
        notifications: {
          overdue: prefRes.data?.overdue_notifications ?? true,
          reminders: prefRes.data?.due_date_reminders ?? true,
          email: prefRes.data?.email_notifications ?? true,
        },
        config: {
          loanDuration: settingsMap["loan_duration"] || "7",
          maxBooks: settingsMap["max_books"] || "5",
        },
      };
    },
    enabled: !!currentUser, 
  });

  const updateConfig = useMutation({
    mutationFn: async ({ loanDuration, maxBooks }) => {
      const { error } = await supabase.from("library_settings").upsert(
        [
          { key: "loan_duration", value: loanDuration },
          { key: "max_books", value: maxBooks },
        ],
        { onConflict: "key" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-data"] });
      toast.success("Konfigurasi perpustakaan disimpan!");
    },
    onError: (err) => toast.error("Gagal: " + err.message),
  });

  const updateNotifications = useMutation({
    mutationFn: async (newPrefs) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          overdue_notifications: newPrefs.overdue,
          due_date_reminders: newPrefs.reminders,
          email_notifications: newPrefs.email,
        })
        .eq("id", currentUser.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-data"] });
      toast.success("Preferensi disimpan");
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-data"] });
      toast.success("User berhasil dihapus");
    },
  });

  const addUsers = async (formData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: "PasswordDefault123!",
        options: { data: { full_name: formData.full_name, role: formData.role } },
      });
      if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["settings-data"] });
      toast.success("User ditambahkan");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  return {
    users: data?.users || [],
    notifications: data?.notifications || { overdue: true, reminders: true, email: true },
    config: data?.config || { loanDuration: "7", maxBooks: "5" },
    isLoading,
    isSaving: updateConfig.isPending || updateNotifications.isPending || deleteUser.isPending,
    error: error?.message,
    updateConfig: updateConfig.mutateAsync,
    updateNotifications: updateNotifications.mutateAsync,
    deleteUser: deleteUser.mutateAsync,
    addUsers,
    refetch,
  };
};