// src/pages/Dashboard.jsx
import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { LatestActivityTable } from "../components/dashboard/LatestActivityTable";
import { useDashboard } from "../hooks/useDashboard";
import LoanStatusChart from "../components/reports/LoanStatusChart";


export const Dashboard = () => {
  const { data, isLoading, error } = useDashboard();

  const stats = data?.stats || {};
  const latestActivities = data?.latestActivities || [];

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

  if (isLoading) {
    return (
      <div className="container space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl border" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-gray-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center border-2 border-dashed rounded-xl m-8">
        <div className="text-center">
          <div className="bg-red-50 p-3 rounded-full inline-block mb-4">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <p className="text-red-600 font-bold mb-1">Gagal Memuat Data</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
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
