import { TrendingUp, BookOpen, AlertTriangle, Users } from "lucide-react";

export const getSummaryCards = (summary) => {
 return  [
    {
      title: "Total Pinjaman",
      value: summary.totalLoans,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-100",
      description: "Total sirkulasi buku yang tercatat.",
    },
    {
      title: "Pinjaman Hari Ini",
      value: summary.dailyLoans,
      icon: BookOpen,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Aktivitas peminjaman hari ini.",
    },
    {
      title: "Tingkat Keterlambatan (%)",
      value: `${summary.overdueRate}%`,
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-100",
      description: "Persentase buku yang belum kembali.",
    },
    {
      title: "Peminjam Aktif",
      value: summary.activeBorrowers,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-100",
      description: "Siswa yang aktif meminjam buku.",
    },
  ];
};
