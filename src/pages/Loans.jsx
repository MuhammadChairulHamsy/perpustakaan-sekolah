import { Plus } from "lucide-react";
import { useLoans } from "../hooks/useLoans";
import { SearchBar } from "../components/search-bar";
import { LoanDialog, LoanTable } from "../components/loans";
import { Button } from "../components/ui/button";
import { useState } from "react";

const Loans = () => {
  const {
    loans,
    searchQuery,
    setSearchQuery,
    loading,
    addLoan,
    returnLoan,
    deleteLoan,
  } = useLoans();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
   return await addLoan(formData)
  };

  const handleDelete = async (id) => {
      await deleteLoan(id);
  };

  const handleReturn = async (loan) => {
    if (confirm("Tandai buku ini sebagai sudah dikembalikan?")) {
      await returnLoan(loan);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
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
            onClick={() => handleOpenDialog()}
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

        <LoanDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
        />

        <LoanTable
          loans={loans}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
          onReturn={handleReturn}
        />
      </div>
    </div>
  );
};

export default Loans;
