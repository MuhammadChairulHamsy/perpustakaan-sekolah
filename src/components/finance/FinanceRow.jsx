import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { BookOpen, Trash2, CheckCircle, Printer } from "lucide-react";
import { getLoanStatus } from "../../utils/loanUtils";
import { formatDate } from "../../utils/dateUtils";
import { TableCell, TableRow } from "../ui/table";

export const FinanceRow = ({ fines, onReturn, onPrint, onDelete }) => {
  const statusInfo = getLoanStatus(fines);
  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {fines.siswa?.name || "Siswa Tidak Dikenal"}
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
              {fines.buku?.title || "Unknown Book"}
            </span>
            <span className="text-xs text-muted-foreground">
              {fines.buku?.author || "-"}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {formatDate(fines.loan_date)}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {formatDate(fines.due_date)}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {fines.fine ? `Rp ${fines.fine.toLocaleString()}` : "-"}
      </TableCell>
      <TableCell className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.badge}`}
        >
          {statusInfo.label}
        </span>
      </TableCell>
      <TableCell className="py-3">
        <div className="flex justify-end gap-2">
          {fines.status !== "returned" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReturn(fines)}
              className="h-8 px-3 text-muted-foreground hover:text-green-600 hover:bg-green-600/10 cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Kembalikan
            </Button>
          ) : (
            <span className="text-md mx-auto text-muted-foreground ml-3 italic">
              Selesai
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className=" py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPrint(fines)}
            className="h-8 w-8 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Siswa Pinjam Buku?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus data peminjaman nama{" "}
                  <b>{fines.siswa?.name ?? "Siswa Tidak Dikenal"}</b> ini?
                </AlertDialogDescription>
              </AlertDialogHeader>

               <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
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
