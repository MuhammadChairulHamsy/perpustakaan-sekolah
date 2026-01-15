// src/pages/Dashboard.jsx
import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { LatestActivityTable } from "../components/dashboard/LatestActivityTable";
import { useDashboard } from "../hooks/useDashboard";

export const Dashboard = () => {
  const { stats, latestActivities, loading, error } = useDashboard();

  const statsCards = [
    {
      title: "Total Buku",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-sky-400",
      bgColor: "bg-sky-100",
    },
    {
      title: "Dipinjam Hari Ini",
      value: stats.borrowedToday,
      icon: BookMarked,
      color: "text-green-400",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Siswa",
      value: stats.totalStudents,
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-100",
    },
    {
      title: "Pinjaman Tertunggak",
      value: stats.overdueLoan,
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Error</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="mb-6 w-full flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
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
