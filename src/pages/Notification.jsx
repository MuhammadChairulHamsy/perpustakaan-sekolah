import { Filter, CheckCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { NotificationList } from "../components/notification/NotificationList";
import { useNotification } from "../hooks/useNotification";
import { useState, useMemo } from "react";
import { NotificationSkeleton } from "../components/notification/NotificationSkeleton";

export const Notification = () => {
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    unreadCount,
    deleteNotification,
  } = useNotification();
  const [filter, setFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.is_read);
    if (filter === "read") return notifications.filter((n) => n.is_read);
    return notifications;
  }, [notifications, filter]);

  if (isLoading) {
    return <NotificationSkeleton />;
  }
  return (
    <div className="container min-h-screen space-y-6">
      <div className="flex flex-col justify-between items-center lg:flex lg:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pemberitahuan</h1>
          <p className="text-muted-foreground">
            Tetap terhubung dengan kegiatan dan pengumuman perpustakaan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Pilih Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="unread">Belum dibaca</SelectItem>
              <SelectItem value="read">Sudah dibaca</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="cursor-pointer"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Tandai semua dibaca
          </Button>
        </div>
      </div>

      <NotificationList
        filtered={filteredData}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
      />
    </div>
  );
};
