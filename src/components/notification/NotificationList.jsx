import {
  Bell,
  Clock,
  BookOpen,
  AlertTriangle,
  Info,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { getTimeAgo } from "../../utils/statusUtils";

const iconMap = {
  book: BookOpen,
  warning: AlertTriangle,
  info: Info,
};

const iconStyleMap = {
  book: "bg-primary/10 text-primary dark:bg-primary/20",
  warning: "bg-warning/10 text-warning dark:bg-warning/20",
  info: "bg-accent/10 text-accent dark:bg-accent/20",
};

export const NotificationList = ({ filtered, onMarkAsRead, onDelete }) => {
  return (
    <div className="p-0 divide-y divide-border overflow-hidden">
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Bell className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">Tidak ada pemberitahuan</p>
          <p className="text-xs mt-1">Kamu sudah paham semuanya!</p>
        </div>
      ) : (
        filtered.map((item) => {
          const Icon = iconMap[item.type] ?? Bell;
          const iconStyle =
            iconStyleMap[item.type] ?? "bg-amber-100 text-amber-400";

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-start rounded-xl gap-4 px-5 py-4 transition-colors duration-150",
                !item.is_read && "bg-primary/3 dark:bg-primary/6",
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10  shrink-0 items-center justify-center rounded-xl",
                  iconStyle,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {item.title}
                  </p>
                  {!item.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  {item.message}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {getTimeAgo(item.created_at)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {!item.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(item.id)}
                    className="text-xs h-8 px-3 text-primary hover:text-primary cursor-pointer"
                  >
                    Tandai Baca
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
