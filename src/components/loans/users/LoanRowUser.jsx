import { TableCell, TableRow } from "../../ui/table";
import { BookOpen } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";

export const LoanRowUser = ({ loan }) => {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
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
    </TableRow>
  );
};
