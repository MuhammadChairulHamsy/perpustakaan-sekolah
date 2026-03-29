export const getActivityStatus = (activity) => {
  if (!activity) return { label: "N/A", badge: "bg-gray-100", action: "-" };

  const today = new Date();
  const dueDate = activity.due_date ? new Date(activity.due_date) : null;

  if (activity.status === "returned") {
    return {
      label: "Selesai",
      badge: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200",
      action: "Dikembalikan",
    };
  }

  if (dueDate && dueDate < today && activity.status !== "returned") {
    const diffTime = Math.abs(today - dueDate);
    const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      label: "Terlambat",
      badge: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200",
      action: `${daysOverdue <= 0 ? 1 : daysOverdue} hari terlambat`,
    };
  }

  return {
    label: "Aktif",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200",
    action: "Dipinjam",
  };
};

export const getTimeAgo = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const now = new Date();
  const diffMs = now - date;

  if (diffMs < 0) return "Baru saja";

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} mnt lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  
  return date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' });
};