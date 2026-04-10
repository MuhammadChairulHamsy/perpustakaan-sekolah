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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { useEffect } from "react";
import { Button } from "../components/ui/button";

const Finance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const {
    fines,
    finance,
    totalCount,
    searchQuery,
    setSearchQuery,
    selectedLoan,
    setSelectedLoan,
    returnLoan,
    isLoading,
    error,
    deleteLoan,
    collectedData,
  } = useFinance(currentPage, pageSize);
  const totalPages = Math.ceil(totalCount / pageSize);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const statsCards = useMemo(() => getStatsCards(finance), [finance]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage, filter]);

  const filterData = useMemo(() => {
    if (filter === "unpaid")
      return fines.filter((n) => n.displayStatus === "unpaid");
    if (filter === "paid")
      return fines.filter((n) => n.displayStatus === "paid");
    return fines;
  }, [fines, filter]);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIdsOnPage = fines.map((item) => item.id);
      setSelectedIds(allIdsOnPage);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDelete = async (id) => {
    const idsToDelete = typeof id === "string" ? [id] : selectedIds;

    if (idsToDelete.length === 0) return;
    if (confirm(`Yakin ingin menghapus ${selectedIds.length} data terpilih?`)) {
      try {
        await deleteLoan(idsToDelete);
        setSelectedIds([]);
      } catch (err) {
        console.error(err);
      }
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
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
          <QuickSummary summary={finance} />
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

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-destructive/10 p-4 rounded-lg border border-destructive/20 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm font-medium text-destructive">
            {selectedIds.length} data terpilih
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="cursor-pointer"
          >
            Hapus Semua Terpilih
          </Button>
        </div>
      )}

      <FinanceTable
        filtered={filterData}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        searchQuery={searchQuery}
        onReturn={handleReturn}
        onPrint={handlePrint}
        onDelete={handleDelete}
      />

      {!isLoading && totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {/* Tombol Previous */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Logic Angka Halaman */}
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i} className="hidden sm:block">
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Tombol Next */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    setCurrentPage((prev) => prev + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <PrintPreviewDialog
        loan={selectedLoan}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
};

export default Finance;
