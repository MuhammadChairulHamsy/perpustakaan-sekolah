// src/pages/Books.jsx
import { BookTable, BookDialog } from "../components/books";
import { Plus } from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { Button } from "../components/ui/button";
import { useState } from "react";

const Books = () => {
  const { books, loading, editBook, deleteBook, addBook } = useBooks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleOpenDialog = (book = null) => {
    setEditingBook(book);
    setDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    if (editingBook) {
      return await editBook(editingBook.id, formData);
    } else {
      return await addBook(formData);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      await deleteBook(id);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="mb-6 w-full flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-foreground mb-2">Buku</h1>
          <p className="text-muted-foreground">
            Kelola koleksi buku perpustakaan Anda
          </p>
        </div>

        <Button onClick={() => handleOpenDialog()} className="font-bold gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Tambah Buku
        </Button>
        <BookDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          book={editingBook}
          onSubmit={handleSubmit}
        />
      </div>

      <BookTable
        books={books}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Books;
