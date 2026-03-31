import { AlertCircle, BookOpen, CheckCircle2, DollarSign } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { useFinance } from "../hooks/useFinance";
import {
  FineCollectionTrend,
  FinanceSkeleton,
  QuickSummary,
} from "../components/finance";
import { SearchBar } from "../components/search-bar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Filter } from "lucide-react";

const Finance = () => {
  const {
    fines,
    finance,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    collectedData,
  } = useFinance();
  const statsCards = [
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

  if (isLoading) {
    return <FinanceSkeleton />;
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
    <div className="container min-h-screen space-y-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7 bg-card border rounded-xl overflow-hidden shadow-sm">
          <FineCollectionTrend data={collectedData} />
        </div>

        <div className="lg:col-span-3 bg-card border rounded-xl overflow-hidden shadow-sm">
          <QuickSummary fines={finance.finesRaw || []} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari siswa atau buku..."
            className="max-w-md"
          />
        </div>
        <Select>
          <SelectTrigger className="w-40">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground"/>
          <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem>

            </SelectItem>
          </SelectContent>
        </Select>
      </div>


    </div>
  );
};

export default Finance;
