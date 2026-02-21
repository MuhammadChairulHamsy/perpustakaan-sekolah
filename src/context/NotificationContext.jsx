import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // 1. Ambil history notifikasi
    const fetchInitial = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setNotifications(data);
    };

    fetchInitial();

    // 2. Setup Realtime Listener tunggal
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
          const audio = new Audio("/audio/notification.mp3");
          audio
            .play()
            .then(() => {
              console.log("Audio notifikasi berhasil diputar");
            })
            .catch((err) => {
              console.warn(
                "Audio diblokir browser. User harus klik halaman dulu satu kali.",
                err,
              );
            });

          // Update list untuk lonceng
          setNotifications((prev) => {
            if (prev.find((n) => n.id === payload.new.id)) return prev;
            return [payload.new, ...prev].slice(0, 10);
          });

          // Munculkan pop-up toast
          toast.info(payload.new.title, {
            description: payload.new.message,
            action: {
              label: "Tandai Baca",
              onClick: () => console.log("Read from toast"),
            },
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const deleteAllNotifications = async () => {
    if (!user) return;

    try {
      // 1. Hapus di Database
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Gagal hapus di DB:", error.message);
        throw error;
      }

      // 2. Jika DB berhasil, baru kosongkan state UI
      setNotifications([]);
      toast.success("Semua notifikasi dihapus permanen");
    } catch (err) {
      toast.error("Gagal sinkronisasi dengan database");
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, deleteAllNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
