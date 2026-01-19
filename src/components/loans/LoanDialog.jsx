import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import supabase from "../../lib/supabase/client";
import { useEffect, useState } from "react";

export const LoanDialog = ({ open, onOpenChange, onSubmit }) => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    book_id: "",
  });

  // fetch siswa & buku tersedia
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      const { data: siswa } = await supabase
        .from("siswa")
        .select("id, name, class");

      const { data: buku } = await supabase
        .from("buku")
        .select("id, title, stock")
        .gt("stock", 0);

      setStudents(siswa || []);
      setBooks(buku || []);
    };

    fetchData();
  }, [open]);

  // reset form setiap dialog dibuka
  useEffect(() => {
    if (open) {
      setFormData({
        student_id: "",
        book_id: "",
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student_id || !formData.book_id) {
      alert("Siswa dan Buku wajib dipilih");
      return;
    }

    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);

    if (success) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={open ? "open" : "closed"} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Peminjaman</DialogTitle>
          <DialogDescription>
            Pilih siswa dan buku. Tanggal & status diatur otomatis sistem.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Siswa */}
          <div>
            <Select
              value={formData.student_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, student_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih siswa" />
              </SelectTrigger>
              <SelectContent>
                {students.map((siswa) => (
                  <SelectItem key={siswa.id} value={siswa.id}>
                    {siswa.name} - {siswa.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buku */}
          <div>
            <Select
              value={formData.book_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, book_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih buku" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} (stok: {book.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer hover:bg-foreground transition-colors duration-500 ease-in-out"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? "Menyimpan..." : "Tambah Peminjaman"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
