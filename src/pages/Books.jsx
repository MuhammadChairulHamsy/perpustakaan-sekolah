// src/pages/Books.jsx
import { BookTable, BookDialog } from "../components/books";
import { Plus } from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { SearchBar } from "../components/search-bar";
import { Button } from "../components/ui/button";
import { useState } from "react";

const Books = () => {
  const {
    books,
    searchQuery,
    setSearchQuery,
    loading,
    editBook,
    deleteBook,
    addBook,
  } = useBooks();
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
      await deleteBook(id);
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
      <div className="mb-6 w-full flex flex-col gap-4">
        <div className="flex flex-col justify-between items-start lg:flex lg:flex-row">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">Buku</h1>
            <p className="text-muted-foreground">
              Kelola koleksi buku perpustakaan Anda
            </p>
          </div>

          <Button
            onClick={() => handleOpenDialog()}
            className="font-bold mt-2 gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Buku
          </Button>
        </div>

        <div className="relative max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari judul, pengarang, ISBN, atau kategori..."
            className="max-w-md"
          />
        </div>

        <BookTable
          books={books}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
        />

        <BookDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          book={editingBook}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Books;
