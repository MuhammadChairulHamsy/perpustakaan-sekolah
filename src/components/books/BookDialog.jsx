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
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    cover_url: "",
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
        cover_url: book.cover_url || "",
        category: book.category || "",
        stock: book.stock || 0,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        isbn: "",
        cover_url: "",
        category: "",
        stock: 0,
      });
    }
  }, [book, open]);

  const handleInputChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file") {
      setSelectedFile(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: id === "stock" ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData, selectedFile);
    if (success) {
      onOpenChange(false);
      setSelectedFile(null);
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
              placeholder="978-..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
            id="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Pelajaran/Novel"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="cover_url">Cover Buku (Upload)</Label>
            <Input
              id="cover_url"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {formData.cover_url && !selectedFile && (
              <p className="text-xs text-muted-foreground">
                Gambar saat ini tersedia.
              </p>
            )}
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
              className="cursor-pointer hover:bg-foreground transition-colors duration-500 ease-in-out"
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
