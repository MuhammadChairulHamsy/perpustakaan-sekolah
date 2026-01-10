import { useEffect, useState } from "react";
import supabase from "../lib/db";
import { BookOpen, Users, BookMarked, AlertTriangle, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedToday: 0,
    totalStudents: 0,
    overdueLoan: 0,
  });
  const [latestActivities, setLatestActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total buku
        const { data: books } = await supabase.from("buku").select("*");

        // Fetch total siswa
        const { data: students } = await supabase.from("siswa").select("*");

        // Fetch pinjaman hari ini
        const today = new Date().toISOString().split("T")[0];
        const { data: todayLoans } = await supabase
          .from("peminjaman")
          .select("*")
          .eq("tanggal_pinjam", today);

        // Fetch pinjaman tertunggak (melewati tanggal kembali)
        const { data: overdueLoans } = await supabase
          .from("peminjaman")
          .select("*")
          .lt("tanggal_kembali", new Date().toISOString())
          .is("status", null);

        // Fetch latest activities (5 aktivitas terbaru)
        const { data: activities } = await supabase
          .from("peminjaman")
          .select(`
            *,
            siswa:siswa_id (nama),
            buku:buku_id (title)
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalBooks: books?.length || 0,
          borrowedToday: todayLoans?.length || 0,
          totalStudents: students?.length || 0,
          overdueLoan: overdueLoans?.length || 0,
        });

        setLatestActivities(activities || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Buku",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Dipinjam Hari Ini",
      value: stats.borrowedToday,
      icon: BookMarked,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Total Siswa",
      value: stats.totalStudents,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Pinjaman Tertunggak",
      value: stats.overdueLoan,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  const getActivityStatus = (activity) => {
    const today = new Date();
    const returnDate = new Date(activity.tanggal_kembali);

    if (activity.status === "dikembalikan") {
      return {
        label: "Completed",
        badge: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        action: "Returned",
      };
    }

    if (returnDate < today && activity.status !== "dikembalikan") {
      const daysOverdue = Math.floor(
        (today - returnDate) / (1000 * 60 * 60 * 24)
      );
      return {
        label: "Overdue",
        badge: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        action: `${daysOverdue} days overdue`,
      };
    }

    return {
      label: "Active",
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      action: "Borrowed",
    };
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut adalah kegiatan yang berlangsung di
          perpustakaan Anda hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Latest Activity Table */}
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Latest Activity
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Recent borrowing and return activities
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Student</TableHead>
                <TableHead className="text-muted-foreground">Book</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
                <TableHead className="text-muted-foreground">Time</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestActivities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No recent activities
                  </TableCell>
                </TableRow>
              ) : (
                latestActivities.map((activity) => {
                  const statusInfo = getActivityStatus(activity);
                  return (
                    <TableRow
                      key={activity.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {activity.nama?.name || "Unknown Student"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {activity.title?.title || "Unknown Book"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {statusInfo.status}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getTimeAgo(activity.created_at)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.badge}`}
                        >
                          {statusInfo.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};