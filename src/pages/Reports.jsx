// src/pages/Reports.jsx
import { StatsCard } from "../components/dashboard";
import { useReportsData } from "../hooks/useReport";
import { TrendingUp, BookOpen, AlertTriangle, Users } from "lucide-react";

const Reports = () => {
  const { stats, loading, error } = useReportsData();

  const summaryCard = [
    {
      title: "Total Pinjaman",
      value: stats.totalLoans,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Rata-rata Pinjaman Harian",
      value: stats.dailyLoans,
      icon: BookOpen,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Tingkat Keterlambatan",
      value: `${stats.overdueRate}%`,
      icon: AlertTriangle,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Peminjam Aktif",
      value: stats.activeBorrowers,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
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
    <div className="container min-h-screen py-8">
      <div className="mb-6 w-full flex flex-col">
        <h1 className="text-3xl font-bold text-foreground mb-2">Laporan</h1>
        <p className="text-muted-foreground">
          Analisis dan wawasan perpustakaan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCard.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Reports;