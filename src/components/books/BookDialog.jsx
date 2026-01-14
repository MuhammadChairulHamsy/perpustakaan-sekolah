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

export const BookDialog = ({ open, onOpenChange, book, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    stock: 0,
  });

  // Reset form ketika dialog dibuka dengan data baru
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        category: book.category || "",
        stock: book.stock || 0,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "",
        stock: 0,
      });
    }
  }, [book, open]);

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
          <DialogTitle>{book ? "Edit Buku" : "Tambah Buku Baru"}</DialogTitle>
          <DialogDescription>
            {book
              ? "Perbarui informasi buku"
              : "Tambahkan buku baru ke perpustakaan"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul buku"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Pengarang</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Masukkan nama pengarang"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              placeholder="Masukkan ISBN"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Masukkan kategori"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stok</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Masukkan jumlah stok"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" className="cursor-pointer">
              {book ? "Simpan Perubahan" : "Tambah Buku"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};