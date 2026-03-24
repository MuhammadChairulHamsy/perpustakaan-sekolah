// src/pages/Books.jsx
import { BookTable, BookDialog } from "../components/books";
import { Plus } from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { SearchBar } from "../components/search-bar";
import { Button } from "../components/ui/button";
import { useState } from "react";
import BookSkeleton from "../components/books/BookSkeleton";

const Books = () => {
  const {
    books,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    addBook,
    editBook,
    deleteBook,
  } = useBooks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleOpenDialog = (book = null) => {
    setEditingBook(book);
    setDialogOpen(true);
  };

 const handleSubmit = async (formData) => {
    try {
      if (editingBook && editingBook.id) {
        await editBook.mutateAsync({
          id: editingBook.id,
          updatedData: formData,
        });
      } else {
        await addBook.mutateAsync(formData);
      }
      setDialogOpen(false);
      return true;
    } catch (err) { 
      console.error("Submit Error:", err);
      return false;
    }
  };

 const handleDelete = async (id) => {
    try {
      await deleteBook.mutateAsync(id);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  if (isLoading) {
    return <BookSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Error</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="mb-6 w-full flex flex-col gap-4">
        <div className="flex flex-col justify-between items-start lg:flex lg:flex-row">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">Semua Buku</h1>
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
