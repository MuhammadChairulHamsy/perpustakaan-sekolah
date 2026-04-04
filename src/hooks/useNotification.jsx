import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";
import { useAuth } from "../context/AuthContext";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";

const NotificationContext = createContext(null);
export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["notifications", user?.id];

  const { data, isLoading, error } = useQuery({
    queryKey,
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, user_id, title, message, is_read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`db-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.setQueryData(queryKey, (prev) => {
            if (!prev) return [payload.new];
            if (prev.find((n) => n.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });

          new Audio("/audio/notification.mp3")
            .play()
            .catch((err) => console.warn("Audio diblokir browser:", err));

          toast.info(payload.new.title, {
            description: payload.new.message,
            action: {
              label: "Tandai Baca",
              onClick: () => markAsRead(payload.new.id),
            },
          });
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id]);

  const markAsRead = useCallback(
    async (id) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (!error) {
        queryClient.setQueryData(queryKey, (prev) =>
          prev?.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        );
      }
    },
    [queryKey],
  );

  const markAllAsRead = useCallback(async () => {
    const unreadIds = data?.filter((n) => !n.is_read).map((n) => n.id);
    if (!unreadIds?.length) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (!error) {
      queryClient.setQueryData(queryKey, (prev) =>
        prev?.map((n) => ({ ...n, is_read: true })),
      );
    }
  }, [data, queryKey]);

  const deleteAllNotifications = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      toast.error("Gagal menghapus notifikasi");
      return;
    }

    queryClient.setQueryData(queryKey, []);
    toast.success("Semua notifikasi dihapus permanen");
  }, [user, queryKey]);

  const deleteNotification = useCallback(async (id) => {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id);

  if (!error) {
    queryClient.setQueryData(queryKey, (prev) =>
      prev?.filter((n) => n.id !== id)
    );
  }
}, [queryKey]);

  const { unread, read, unreadCount } = useMemo(() => {
    if (!data) return { unread: [], read: [], unreadCount: 0 };
    const unread = data.filter((n) => !n.is_read);
    const read = data.filter((n) => n.is_read);
    return { unread, read, unreadCount: unread.length };
  }, [data]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: data || [],
        unread,
        read,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
};
