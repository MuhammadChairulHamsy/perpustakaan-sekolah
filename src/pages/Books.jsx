import { useEffect, useState } from "react";
import supabase from "../lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Pencil, Trash2 } from "lucide-react";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase.from("buku").select("*");

        if (error) {
          console.error("Supabase Error:", error);
        } else {
          console.log("Data fetched:", data);
          setBooks(data || []);
        }
      } catch (err) {
        console.error("Catch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleEdit = (book) => {
    console.log("Edit book:", book);
    // Tambahkan logic edit di sini
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      const { error } = await supabase.from("buku").delete().eq("id", id);
      
      if (error) {
        console.error("Error deleting:", error);
      } else {
        setBooks(books.filter((book) => book.id !== id));
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container min-h-screen py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Buku</h1>
        <p className="text-muted-foreground">
          Kelola koleksi buku perpustakaan Anda
        </p>
      </div>

      <div className="data-table rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Judul
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Pengarang
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  ISBN
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Kategori
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Stok
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Tanggal
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {books.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data buku
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow
                    key={book.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F5FC]">
                          <BookOpen className="h-5 w-5 text-[#43B7EC]" />
                        </div>
                        <span className="font-medium text-foreground">
                          {book.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {book.author}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground font-mono">
                      {book.isbn}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {book.category || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          book.stock > 5
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : book.stock > 0
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {book.stock} buku
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(book.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(book)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(book.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Books;