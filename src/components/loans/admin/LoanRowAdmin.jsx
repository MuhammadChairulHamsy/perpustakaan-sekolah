import { TableCell, TableRow } from "../../ui/table";
import { BookOpen } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Checkbox } from "../../ui/checkbox";

export const LoanRowAdmin = ({ loan, onDelete, isSelected, onSelectOne }) => {
  return (
    <TableRow className={isSelected ? "bg-muted/50 transition-colors" : ""}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectOne(loan.id, checked)}
        />
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {loan.siswa?.name || "Siswa Tidak Dikenal"}
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
      <TableCell className="px-4 py-3">
        <div className="flex justify-end gap-2">
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
                <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus siswa <b>{loan.name}</b>{" "}
                  ini?
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
