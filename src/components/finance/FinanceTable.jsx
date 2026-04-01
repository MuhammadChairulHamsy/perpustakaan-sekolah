import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FinanceRow } from "./FinanceRow";

export const FinanceTable = ({
  fines,
  searchQuery,
  onReturn,
  onPrint,
  onDelete
}) => {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="px-4 py-3 text-sm font-medium text-muted-foreground">
                Nama Siswa
              </TableHead>
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                Judul Buku
              </TableHead>
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                tenggat waktu
              </TableHead>
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                Terlambat Beberapa Hari
              </TableHead>
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                Jumlah Denda
              </TableHead>
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                Konfirmasi
              </TableHead>
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {fines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchQuery ? (
                    <span>
                      Tidak ada data Keuangan <b>"{searchQuery}"</b>
                    </span>
                  ) : (
                    "Tidak ada data keuangan tersedia"
                  )}
                </TableCell>
              </TableRow>
            ) : (
              fines.map((loan) => (
                <FinanceRow
                  key={loan.id}
                  fines={loan}
                  onReturn={onReturn}
                  onPrint={onPrint}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
