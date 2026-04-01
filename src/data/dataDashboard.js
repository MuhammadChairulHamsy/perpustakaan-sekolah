import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";

export const getStatsCards = (data) => {
  const stats = data?.stats || {};
  return [
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
};

export const getChartStatusData = (data) => {
  const stats = data?.stats || {};
  return [
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
  ];
};