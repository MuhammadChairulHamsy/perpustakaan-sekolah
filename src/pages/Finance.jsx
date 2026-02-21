import { AlertCircle, BookOpen, CheckCircle2, DollarSign } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { useDashboard } from "../hooks/useDashboard";

const Finance = () => {
  const { stats } = useDashboard();
  const statsCards = [
    {
      title: "Pendapatan Total",
      value: stats.totalBooks,
      icon: DollarSign,
      color: "text-sky-400",
      bgColor: "bg-sky-100",
      description: "Koleksi buku yang siap dipinjam.",
    },
    {
      title: "Denda yang Tertunda",
      value: stats.borrowedToday,
      icon: AlertCircle,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Trend membaca hari ini meningkat.",
    },
    {
      title: "Denda yang Dikumpulkan",
      value: stats.totalStudents,
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Anggota perpustakaan yang terdaftar.",
    },
    {
      title: "Buku Terlambat Dikembalikan",
      value: stats.overdueLoan,
      icon: BookOpen,
      color: "text-orange-400",
      bgColor: "bg-orange-100",
      description: "Segera tindak lanjuti keterlambatan.",
    },
  ];

  return (
    <div className="container min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Keuangan & Denda</h1>
          <p className="text-muted-foreground">
            Kelola denda keterlambatan dan lacak pendapatan perpustakaan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Finance;
