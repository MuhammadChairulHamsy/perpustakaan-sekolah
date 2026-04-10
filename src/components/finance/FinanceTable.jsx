import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FinanceRow } from "./FinanceRow";
import { Checkbox } from "../ui/checkbox";
import { Coins } from "lucide-react";

export const FinanceTable = ({
  filtered,
  selectedIds,
  onSelectAll,
  onSelectOne,
  searchQuery,
  onReturn,
  onPrint,
  onDelete,
}) => {
  const total = filtered.reduce(
    (sum, item) => sum + (Number(item.fine) || 0),
    0,
  );

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-14">
                <Checkbox
                  checked={
                    filtered.length > 0 &&
                    selectedIds.length === filtered.length
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-medium text-muted-foreground">
                Nama Siswa
              </TableHead>
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                Judul Buku
              </TableHead>
              <TableHead className="px-2 py-3 hidden lg:table-cell">
                Tanggal Pinjam
              </TableHead>
              <TableHead className="px-2 py-3 hidden lg:table-cell">
                Tanggal Kembali
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
              <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Coins className="h-8 w-8 opacity-30" />
                    {searchQuery ? (
                      <span>
                        Tidak ada data untuk <b>"{searchQuery}"</b>
                      </span>
                    ) : (
                      <span>Tidak ada data keuangan tersedia</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((loan) => (
                <FinanceRow
                  key={loan.id}
                  fines={loan}
                  onReturn={onReturn}
                  onPrint={onPrint}
                  onDelete={onDelete}
                  isSelected={selectedIds.includes(loan.id)}
                  onSelectOne={onSelectOne}
                />
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-muted/50 font-semibold hover:bg-muted/50">
              <TableCell colSpan={8} className="text-foreground lg:table-cell">
                <b>Total : </b>
              </TableCell>

              <TableCell className="text-right text-primary whitespace-nowrap">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
