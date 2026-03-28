import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";
import {
  StatsCard,
  LatestActivityTable,
  DashboardSkeleton,
} from "../components/dashboard";
import { useDashboard } from "../hooks/useDashboard";
import { lazy, Suspense } from "react";
import { useMemo } from "react";

const LoanStatusChart = lazy(() => 
  import("../components/reports/LoanStatusChart").then(module => ({ 
    default: module.LoanStatusChart 
  }))
);
export const Dashboard = () => {
  const { data, isLoading, error } = useDashboard();

  const stats = data?.stats || {};
  const latestActivities = data?.latestActivities || [];

  if (data) {
    console.log("DEBUG DASHBOARD DATA:", data);
    console.log("DEBUG STATS:", data.stats);
    console.log("DEBUG ACTIVITIES:", data.latestActivities);
  }

  const statsCards = [
    {
      title: "Total Buku",
      value: Number(stats.totalBooks || 0), 
      icon: BookOpen,
      color: "text-sky-400",
      bgColor: "bg-sky-100",
      description: "Koleksi buku yang siap dipinjam.",
    },
    {
      title: "Dipinjam Hari Ini",
      value: Number(stats.borrowedToday || 0),
      icon: BookMarked,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Trend membaca hari ini meningkat.",
    },
    {
      title: "Total Siswa",
      value: Number(stats.totalStudents || 0),
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Anggota perpustakaan yang terdaftar.",
    },
    {
      title: "Pinjaman Tertunggak",
      value: Number(stats.overdueLoan || 0),
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-100",
      description: "Segera tindak lanjuti keterlambatan.",
    },
  ];

 const chartStatusData = useMemo(
  () => [
    {
     status: "borrowed", 
      total: Number(stats.totalActiveBorrowed || 0), 
    },
    {
     status: "returned",
      total: Number(stats.totalReturned || 0),
    },
    {
     status: "overdue",
      total: Number(stats.overdueLoan || 0),
    },
  ],
  [stats]
);

 const totalAllLoans = useMemo(() => {
  return chartStatusData.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
}, [chartStatusData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-chart-large items-center justify-center border-2 border-dashed rounded-xl m-8">
        <div className="text-center">
          <div className="bg-red-50 p-3 rounded-full inline-block mb-4">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <p className="text-red-600 font-bold mb-1">Gagal Memuat Data</p>
          <p className="text-muted-foreground text-sm">
            {typeof error === "object"
              ? error.message || "Terjadi kesalahan sistem"
              : String(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-8">
      <div className="flex flex-col md:flex-row     md:items-center justify-between gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
            value={
              stat.value !== undefined && stat.value !== null
                ? String(stat.value)
                : "0"
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-10 items-stretch">
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Aktivitas Terkini
            </h2>
          </div>
          <div className="flex-1 bg-slate-50 border rounded-xl overflow-hidden shadow-sm">
            <LatestActivityTable activities={latestActivities} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Statistik Status
          </h2>
          <div className="bg-slate-50 border rounded-xl shadow-sm h-full flex items-center justify-center">
            <Suspense fallback={<div>Loading chart...</div>}>
              <LoanStatusChart data={chartStatusData} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};
