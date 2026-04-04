import { StatsCard } from "../components/dashboard/StatsCard";
import { useFinance } from "../hooks/useFinance";
import {
  FineCollectionTrend,
  FinanceSkeleton,
  QuickSummary,
  FinanceTable,
} from "../components/finance";
import { SearchBar } from "../components/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Filter } from "lucide-react";
import { getStatsCards } from "../data/dataFinance";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PrintPreviewDialog } from "../components/loans";

const Finance = () => {
  const {
    fines,
    finance,
    searchQuery,
    setSearchQuery,
    selectedLoan,
    setSelectedLoan,
    returnLoan,
    isLoading,
    error,
    deleteLoan,
    collectedData,
  } = useFinance();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const statsCards = useMemo(() => getStatsCards(finance), [finance]);

  const filterData = useMemo(() => {
    if (filter === "unpaid")
      return fines.filter((n) => n.displayStatus === "unpaid");
    if (filter === "paid")
      return fines.filter((n) => n.displayStatus === "paid");

    return fines;
  }, [fines, filter]);

  const handleDelete = async (id) => {
    try {
      await deleteLoan.mutateAsync(id);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleReturn = async (loan) => {
    try {
      await returnLoan(loan.id);
      toast.success("Buku Telah Dikembalikan", {
        description: "Status pinjaman diperbarui dan stok buku bertambah.",
        className: "!text-white",
      });
    } catch (error) {
      toast.error("Gagal memproses pengembalian");
    }
  };

  const handlePrint = async (loan) => {
    setSelectedLoan(loan);
    setPreviewOpen(true);
  };

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
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Pilih Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="paid">Dibayar</SelectItem>
            <SelectItem value="unpaid">Belum Dibayar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FinanceTable
        filtered={filterData}
        searchQuery={searchQuery}
        onReturn={handleReturn}
        onPrint={handlePrint}
        onDelete={handleDelete}
      />

      <PrintPreviewDialog
        loan={selectedLoan}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
};

export default Finance;
