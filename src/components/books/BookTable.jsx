import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BookRow } from "./BookRow";

export const BookTable = ({ books, searchQuery, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {/* Kolom Buku (Judul + Cover) dibuat lebih lebar */}
              <TableHead className="px-4 py-3 w-[40%] min-w-52">
                Info Buku
              </TableHead>
              {/* ISBN disembunyikan di layar kecil (sm), muncul di lg */}
              <TableHead className="px-4 py-3 hidden lg:table-cell">
                ISBN
              </TableHead>
              <TableHead className="px-4 py-3 hidden md:table-cell">
                Kategori
              </TableHead>
              <TableHead className="px-4 py-3 text-center">Stok</TableHead>
              <TableHead className="px-4 py-3 hidden xl:table-cell">
                Tanggal
              </TableHead>
              <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchQuery ? (
                    <span>
                      Tidak ada data buku <b>"{searchQuery}"</b>
                    </span>
                  ) : (
                    "Tidak ada data buku tersedia"
                  )}
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <BookRow
                  key={book.id}
                  book={book}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
