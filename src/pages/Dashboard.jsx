// src/pages/Dashboard.jsx
import { BookOpen, Users, BookMarked, AlertTriangle, PlusCircle, ArrowRight, UserPlus, FileText } from "lucide-react";
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
    { status: "borrowed", total: stats.borrowedToday || 0 },
    { status: "returned", total: stats.totalBooks - stats.borrowedToday || 0 },
    { status: "overdue", total: stats.overdueLoan || 0 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
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
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang kembali! Berikut ringkasan perpustakaan Anda hari ini.
          </p>
        </div>
        <div className="text-sm px-4 py-2 bg-muted/50 rounded-full border text-muted-foreground font-medium">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* QUICK ACTIONS SECTION (Tambahan Baru) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <Link to="/pinjaman/baru" className="flex items-center justify-between p-4 bg-white border rounded-xl hover:border-primary hover:shadow-md transition-all group"> */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">Pinjam Buku</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          {/* </Link> */}

          {/* <Link to="/siswa/tambah" className="flex items-center justify-between p-4 bg-white border rounded-xl hover:border-primary hover:shadow-md transition-all group"> */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">Tambah Siswa</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          {/* </Link> */}

          {/* <Link to="/laporan" className="flex items-center justify-between p-4 bg-white border rounded-xl hover:border-primary hover:shadow-md transition-all group"> */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">Cetak Laporan</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          {/* </Link> */}
        </div>
      </div>

      {/* MAIN CONTENT: TABLE & CHART (Penyesuaian Layout) */}
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Aktivitas Terkini</h2>
            {/* <Link to="/pinjaman" className="text-sm text-primary hover:underline font-medium">Lihat Semua</Link> */}
          </div>
          <div className="flex-1 bg-white border rounded-xl overflow-hidden shadow-sm">
            <LatestActivityTable activities={latestActivities} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Statistik Status</h2>
          <div className="bg-white border rounded-xl shadow-sm h-full flex items-center justify-center">
            <LoanStatusChart data={chartStatusData} />
          </div>
        </div>
      </div>
    </div>
  );
};