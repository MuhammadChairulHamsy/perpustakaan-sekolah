import { Plus } from "lucide-react";
import { useLoans } from "../../hooks/useLoans";
import { SearchBar } from "../../components/search-bar";
import { LoanDialogAdmin, LoanTableAdmin } from "../../components/loans";
import { LoanSkeleton } from "../../components/loans";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { useEffect } from "react";

const LoansAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const {
    loans,
    totalCount,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    addLoan,
  } = useLoans(currentPage, pageSize);
  const totalPages = Math.ceil(totalCount / pageSize);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      await addLoan.mutateAsync(formData);
      setDialogOpen(false);
      return true;
    } catch (err) {
      console.error("Submit Error:", err);
      return false;
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <LoanSkeleton />;
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
      <div className="mb-6 w-full flex flex-col gap-4">
        <div className="flex flex-col justify-between items-start lg:flex lg:flex-row">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Peminjaman
            </h1>
            <p className="text-muted-foreground">
              Lacak peminjaman dan pengembalian buku.
            </p>
          </div>

          <Button
            onClick={handleOpenDialog}
            className="font-bold mt-2 gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Pinjam Buku
          </Button>
        </div>

        <div className="relative max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari berdasarkan siswa atau buku..."
            className="max-w-md"
          />
        </div>

        <LoanDialogAdmin
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
        />

        <LoanTableAdmin loans={loans} searchQuery={searchQuery} />

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
      </div>
    </div>
  );
};

export default LoansAdmin;
