// src/pages/Books.jsx
import { BookTable } from "../components/books";
import { useBooks } from "../hooks/useBooks";

const Books = () => {
  const { books, loading, deleteBook } = useBooks();

  const handleEdit = (book) => {
    console.log("Edit book:", book);
    // Tambahkan logic edit di sini
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      await deleteBook(id);
    }
  };

  if (loading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Buku</h1>
        <p className="text-muted-foreground">
          Kelola koleksi buku perpustakaan Anda
        </p>
      </div>

      <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Books;