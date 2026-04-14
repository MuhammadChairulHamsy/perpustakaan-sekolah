import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";

export const getStatsCards = (data) => {
  const stats = data?.stats || {};
  return [
    {
      title: "Total Buku",
      value: Number(stats.totalBooks || 0),
      icon: BookOpen,
      color: "text-sky-500",
      bgColor: "bg-sky-100",
      description: "Koleksi buku tersedia.",
    },
    {
      title: "Dipinjam Hari Ini",
      value: Number(stats.borrowedToday || 0),
      icon: BookMarked,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      description: "Sirkulasi hari ini.",
    },
    {
      title: "Total Siswa",
      value: Number(stats.totalStudents || 0),
      icon: Users,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      description: "Anggota terdaftar.",
    },
    {
      title: "Pinjaman Tertunggak",
      value: Number(stats.overdueLoan || 0),
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      description: "Perlu tindak lanjut.",
    },
  ];
};

export const getChartStatusData = (data) => {
  const stats = data?.stats || {};
  return [
    {
      status: "borrowed", // Tetap pakai bahasa inggris untuk key chart
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