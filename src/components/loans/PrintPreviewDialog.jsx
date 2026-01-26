import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import exportToPDF from "../../utils/exportPDF"
import { Printer } from "lucide-react";

export const PrintPreviewDialog = ({ loan, open, onOpenChange }) => {
  if (!loan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-60">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Printer className="h-5 w-5 text-blue-600" />
            Pratinjau Kartu Pinjam
          </DialogTitle>
          <DialogDescription>
            Pastikan data peminjaman di bawah ini sudah benar sebelum mengunduh
            PDF.
          </DialogDescription>
        </DialogHeader>

        {/* Tampilan Kartu di Layar */}
        <div className="border p-6 bg-white rounded-lg shadow-sm text-slate-900">
          <div className="border-b-2 border-blue-600 pb-2 mb-4">
            <h2 className="font-bold text-blue-600">KARTU PINJAM</h2>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Nama:</strong> {loan.siswa?.name}
            </p>
            <p>
              <strong>Buku:</strong> {loan.buku?.title}
            </p>
            <div className="flex justify-between pt-4 border-t border-dashed mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase">
                  Tgl Pinjam
                </span>
                <span className="text-[11px]">{loan.loan_date || "-"}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-400 uppercase">
                  Batas Kembali
                </span>
                <span className="text-[11px] font-bold text-red-600">
                  {loan.due_date || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={() => {
              exportToPDF(loan);
              onOpenChange(false);
            }}
          >
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
