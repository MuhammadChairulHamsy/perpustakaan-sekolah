// src/components/loans/LoanDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState, useEffect } from "react";
import supabase from "../../lib/db";

export const LoanDialog = ({ open, onOpenChange, loan, onSubmit }) => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    book_id: "",
    loan_date: "",
    due_date: "",
    return_date: "",
    fine: 0,
    status: "borrowed",
  });

  // Fetch students dan books untuk dropdown
  useEffect(() => {
    const fetchData = async () => {
      const { data: studentsData } = await supabase.from("siswa").select("*");
      const { data: booksData } = await supabase
        .from("buku")
        .select("*")
        .gt("stock", 0); // Hanya buku yang masih ada stok

      setStudents(studentsData || []);
      setBooks(booksData || []);
    };
    fetchData();
  }, []);

  // Reset form ketika dialog dibuka
  useEffect(() => {
    if (loan) {
      setFormData({
        student_id: loan.student_id || "",
        book_id: loan.book_id || "",
        loan_date: loan.loan_date
          ? new Date(loan.loan_date).toISOString().split("T")[0]
          : "",
        due_date: loan.due_date
          ? new Date(loan.due_date).toISOString().split("T")[0]
          : "",
        return_date: loan.return_date
          ? new Date(loan.return_date).toISOString().split("T")[0]
          : "",
        fine: loan.fine || 0,
        status: loan.status || "borrowed",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Default 7 hari
      
      setFormData({
        student_id: "",
        book_id: "",
        loan_date: today,
        due_date: dueDate.toISOString().split("T")[0],
        return_date: "",
        fine: 0,
        status: "borrowed",
      });
    }
  }, [loan, open]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "fine" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert dates to ISO string
    const submitData = {
      ...formData,
      loan_date: new Date(formData.loan_date).toISOString(),
      due_date: new Date(formData.due_date).toISOString(),
      return_date: formData.return_date
        ? new Date(formData.return_date).toISOString()
        : null,
    };

    const success = await onSubmit(submitData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {loan ? "Edit Peminjaman" : "Tambah Peminjaman Baru"}
          </DialogTitle>
          <DialogDescription>
            {loan
              ? "Perbarui informasi peminjaman buku"
              : "Tambahkan peminjaman buku baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student_id">Siswa</Label>
            <Select
              value={formData.student_id}
              onValueChange={(value) => handleSelectChange("student_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih siswa" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="book_id">Buku</Label>
            <Select
              value={formData.book_id}
              onValueChange={(value) => handleSelectChange("book_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih buku" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} - Stok: {book.stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loan_date">Tanggal Pinjam</Label>
            <Input
              id="loan_date"
              type="date"
              value={formData.loan_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
              required
            />
          </div>

          {loan && (
            <>
              <div className="space-y-2">
                <Label htmlFor="return_date">Tanggal Kembali</Label>
                <Input
                  id="return_date"
                  type="date"
                  value={formData.return_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fine">Denda (Rp)</Label>
                <Input
                  id="fine"
                  type="number"
                  value={formData.fine}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {loan ? "Simpan Perubahan" : "Tambah Peminjaman"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};