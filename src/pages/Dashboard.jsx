// src/pages/Dashboard.jsx
import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { LatestActivityTable } from "../components/dashboard/LatestActivityTable";
import { useDashboardData } from "../hooks/useDashboardData";

export const Dashboard = () => {
  const { stats, latestActivities, loading } = useDashboardData();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut adalah kegiatan yang berlangsung di
          perpustakaan Anda hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <LatestActivityTable activities={latestActivities} />
    </div>
  );
};