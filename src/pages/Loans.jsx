import { Plus } from "lucide-react";
import { LoanDialog, LoanTable } from "../components/loans";
import { Button } from "../components/ui/button";
import { useLoans } from "../hooks/useLoans";
import { useState } from "react";

const Loans = () => {
  const { loans, loading, addLoan, editLoan, returnLoan, deleteLoan } =
    useLoans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);

  const handleOpenDialog = (loan = null) => {
    setEditingLoan(loan);
    setDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    if (editingLoan) {
      return await editLoan(editingLoan.id, formData);
    } else {
      return await addLoan(formData);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
      await deleteLoan(id);
    }
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
      <div className="mb-6 w-full flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Peminjaman
          </h1>
          <p className="text-muted-foreground">
            Lacak peminjaman dan pengembalian buku.
          </p>
        </div>

        <Button
          onClick={() => handleOpenDialog()}
          className="font-bold gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Pinjam Buku 
        </Button>
        <LoanDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          loan={editingLoan}
          onSubmit={handleSubmit}
        />
      </div>

      <LoanTable
        loans={loans}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
        onReturn={handleReturn}
      />
    </div>
  );
};

export default Loans;
