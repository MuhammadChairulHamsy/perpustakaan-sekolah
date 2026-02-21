import { Bell, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { supabase } from "../lib/supabase/client";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export const NotificationBell = () => {
  const { user } = useAuth();
  const { notifications, setNotifications, deleteAllNotifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Fungsi untuk menandai semua sudah dibaca
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && markAllAsRead()}>
      <DropdownMenuTrigger className="relative p-2 outline-none cursor-pointer group">
        <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center animate-in zoom-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="p-4 flex items-center justify-between font-semibold">
          <div className="flex items-center gap-2">
            Notifikasi
            {unreadCount > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                {unreadCount} pesan baru
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                if (confirm("Hapus semua notifikasi?"))
                  deleteAllNotifications();
              }}
              className="text-xs font-normal text-destructive hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Hapus Semua
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />

        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Belum ada notifikasi.
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={`flex flex-col items-start p-4 gap-1 border-b border-border last:border-0 focus:bg-muted/50 cursor-default ${
                  !n.is_read ? "bg-muted/30" : ""
                }`}
              >
                <div className="flex w-full justify-between items-center gap-2">
                  <p
                    className={`text-sm font-semibold ${!n.is_read ? "text-primary" : "text-foreground"}`}
                  >
                    {n.title}
                  </p>
                  {!n.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {n.message}
                </p>
                <span className="text-[10px] text-muted-foreground/60 mt-1">
                  {new Date(n.created_at).toLocaleDateString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
