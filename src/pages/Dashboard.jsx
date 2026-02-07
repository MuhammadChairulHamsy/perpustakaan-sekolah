// src/pages/Dashboard.jsx
import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { LatestActivityTable } from "../components/dashboard/LatestActivityTable";
import { useDashboard } from "../hooks/useDashboard";
import LoanStatusChart from "../components/reports/LoanStatusChart";

export const Dashboard = () => {
  const { stats, latestActivities, loading, error } = useDashboard();

  const statsCards = [
    {
      title: "Total Buku",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-sky-400",
      bgColor: "bg-sky-100",
      description: "Koleksi buku yang siap dipinjam.",
    },
    {
      title: "Dipinjam Hari Ini",
      value: stats.borrowedToday,
      icon: BookMarked,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Trend membaca hari ini meningkat.",
    },
    {
      title: "Total Siswa",
      value: stats.totalStudents,
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Anggota perpustakaan yang terdaftar.",
    },
    {
      title: "Pinjaman Tertunggak",
      value: stats.overdueLoan,
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-100",
      description: "Segera tindak lanjuti keterlambatan.",
    },
  ];

  // Data Dummy untuk Chart (Sambil menunggu data asli dari hook)
  const chartStatusData = [
    {
      status: "borrowed",
      total: stats.totalActiveBorrowed || 0,
    },
    {
      status: "returned",
      total: stats.totalReturned || 0,
    },
    {
      status: "overdue",
      total: stats.overdueLoan || 0,
    },
  ];

  const totalAllLoans = chartStatusData.reduce(
    (acc, curr) => acc + curr.total,
    0,
  );

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
    <div className="container space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Selamat datang kembali! Berikut ringkasan perpustakaan Anda hari
            ini.
          </p>
        </div>
        <div className="text-sm px-4 py-2 bg-muted/50 rounded-full border text-muted-foreground font-medium">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* MAIN CONTENT: TABLE & CHART (Penyesuaian Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10 items-stretch">
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Aktivitas Terkini
            </h2>
          </div>
          <div className="flex-1 bg-white border rounded-xl overflow-hidden shadow-sm">
            <LatestActivityTable activities={latestActivities} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Statistik Status
          </h2>
          <div className="bg-white border rounded-xl shadow-sm h-full  flex items-center justify-center">
            <LoanStatusChart data={chartStatusData} />
          </div>
        </div>
      </div>
    </div>
  );
};
