import { useEffect } from "react";
import supabase from "../lib/supabase/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useNotification = () => {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`user-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          toast.info(payload.new.title, {
            description: payload.new.message,
            duration: 5000,
            className: "bg-sidebar text-foreground border-border",
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
};
