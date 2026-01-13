// src/components/loans/LoanRow.jsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { BookOpen, Trash2, CheckCircle } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import { getLoanStatus } from "../../utils/loanUtils";

export const LoanRow = ({ loan, onDelete, onReturn }) => {
  const statusInfo = getLoanStatus(loan);

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {loan.siswa?.name || "Unknown Student"}
          </span>
          <span className="text-xs text-muted-foreground">
            {loan.siswa?.class || "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F5FC]">
            <BookOpen className="h-5 w-5 text-[#43B7EC]" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {loan.buku?.title || "Unknown Book"}
            </span>
            <span className="text-xs text-muted-foreground">
              {loan.buku?.author || "-"}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {formatDate(loan.loan_date)}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {formatDate(loan.due_date)}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {loan.fine ? `Rp ${loan.fine.toLocaleString()}` : "-"}
      </TableCell>
      <TableCell className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.badge}`}
        >
          {statusInfo.label}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {loan.status !== "returned" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReturn(loan)}
              className="h-8 px-3 text-muted-foreground hover:text-green-600 hover:bg-green-600/10 cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Kembalikan
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Siswa Pinjam Buku?</AlertDialogTitle>
                <AlertDialogDescription>
                 Apakah Anda yakin ingin menghapus data peminjaman nama <b>{loan.siswa?.name ?? "Unknown Student"}</b> ini? 
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => onDelete(loan.id)}
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};