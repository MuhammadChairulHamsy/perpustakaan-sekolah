// src/components/books/BookDialog.jsx
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
import { useState, useEffect } from "react";

export const StudentDialog = ({ open, onOpenChange, student, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    email: "",
    created_at: "",
  });

  // Reset form ketika dialog dibuka dengan data baru
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        class: student.class || "",
        email: student.email || "",
        created_at: student.created_at || "",
      });
    } else {
      setFormData({
        name: "",
        class: "",
        email: "",
        created_at: "",
      });
    }
  }, [student, open]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "stock" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {student ? "Edit Siswa" : "Tambah Siswa Baru"}
          </DialogTitle>
          <DialogDescription>
            {student
              ? "Perbarui informasi Siswa"
              : "Tambahkan siswa baru ke perpustakaan"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama anda"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Kelas</Label>
            <Input
              id="class"
              value={formData.class}
              onChange={handleInputChange}
              placeholder="Masukkan nama kelas"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="created_at" className="cursor-pointer">Tanggal daftar</Label>
            <Input
              id="created_at"
              type="date"
              value={formData.created_at}
              onChange={handleInputChange}
              placeholder="Masukkan tanggal daftar"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="hover:bg-foreground transition-colors duration-500 ease-in-out cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" className="cursor-pointer">
              {student ? "Simpan Perubahan" : "Tambah Siswa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
