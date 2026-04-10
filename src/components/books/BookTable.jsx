import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BookRow } from "./BookRow";

export const BookTable = ({
  books,
  selectedIds,
  onSelectAll,
  onSelectOne,
  searchQuery,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-14">
                <Checkbox
                  checked={
                    books.length > 0 && selectedIds.length === books.length
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="px-4 py-3 w-[40%] min-w-52">
                Info Buku
              </TableHead>
              <TableHead className="px-4 py-3 lg:table-cell">ISBN</TableHead>
              <TableHead className="px-4 py-3 md:table-cell">
                Kategori
              </TableHead>
              <TableHead className="px-4 py-3 text-center">Stok</TableHead>
              <TableHead className="px-4 py-3 xl:table-cell">Tanggal</TableHead>
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
                  isSelected={selectedIds.includes(book.id)}
                  onSelectOne={onSelectOne}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
