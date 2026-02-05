// src/components/loans/LoanTable.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { LoanRow } from "./LoanRow";

export const LoanTable = ({ loans, onDelete, onReturn, onPrint }) => {
  return (
    <div className="data-table rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Nama Siswa
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Judul Buku
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Tanggal Pinjam
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Tanggal kembali
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Denda
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left center-sm font-medium text-muted-foreground">
                Konfirmasi
              </TableHead>
              <TableHead className="py-4 px-3 text-right text-sm font-medium text-muted-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {loans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data peminjaman
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <LoanRow
                  key={loan.id}
                  loan={loan}
                  onDelete={onDelete}
                  onReturn={onReturn}
                  onPrint={onPrint}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};