import { AlertCircle, BookOpen, CheckCircle2, DollarSign } from "lucide-react";

export const getStatsCards = (finance) => {
  return [
    {
      title: "Pendapatan Total",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(finance.totalRevenue),
      icon: DollarSign,
      color: "text-sky-400",
      bgColor: "bg-sky-100",
      description: "Semua waktu yang dikumpulkan",
    },
    {
      title: "Denda yang Tertunda",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(finance.pendingFinance),
      icon: AlertCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-100",
      description: "5 transaksi yang belum dibayar.",
    },
    {
      title: "Denda yang Dikumpulkan",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(finance.collectedFines),
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Pembayaran berhasil.",
    },
    {
      title: "Buku Terlambat Dikembalikan",
      value: `${finance.overdueBooks} Buku`,
      icon: BookOpen,
      color: "text-orange-400",
      bgColor: "bg-orange-100",
      description: "Saat ini sudah jatuh tempo.",
    },
  ];
};
