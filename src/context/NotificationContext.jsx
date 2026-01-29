import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../lib/supabase/client";
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
          const audio = new Audio("/notification.mp3");
          audio
            .play()
            .catch((err) => console.log("Audio play blocked by browser"));

          // Update list untuk lonceng
          setNotifications((prev) => [payload.new, ...prev].slice(0, 10));

          // Munculkan pop-up toast
          toast.info(payload.new.title, {
            description: payload.new.message,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
