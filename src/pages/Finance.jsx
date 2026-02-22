import { AlertCircle, BookOpen, CheckCircle2, DollarSign } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { useFinance } from "../hooks/useFinance";

const Finance = () => {
  const { fine, loading, error } = useFinance();
  const statsCards = [
    {
      title: "Pendapatan Total",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }).format(fine.totalRevenue),
      icon: DollarSign,
      color: "text-sky-400",
      bgColor: "bg-sky-100",
      description: "Semua waktu yang dikumpulkan",
    },
    {
      title: "Denda yang Tertunda",
      value: fine.pendingFinance,
      icon: AlertCircle,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "5 transaksi yang belum dibayar.",
    },
    {
      title: "Denda yang Dikumpulkan",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }).format(fine.collectedFines),
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Pembayaran berhasil.",
    },
    {
      title: "Buku Terlambat Dikembalikan",
      value: fine.overdueBooks,
      icon: BookOpen,
      color: "text-orange-400",
      bgColor: "bg-orange-100",
      description: "Saat ini sudah jatuh tempo.",
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
