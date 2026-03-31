// src/components/books/BookRow.jsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export const BookRow = ({ book, onEdit, onDelete }) => {
  const getStockBadgeClass = (stock) => {
    if (stock > 5) {
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    }
    if (stock > 0) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-10 h-14 object-cover rounded shadow-sm border"
              />
            ) : (
              <div className="flex h-14 w-10 items-center justify-center rounded bg-muted">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-foreground truncate block">
              {book.title}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {book.author}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="px-4 py-3 text-xs font-mono hidden lg:table-cell">
        {book.isbn}
      </TableCell>

      <TableCell className="px-4 py-3 text-sm hidden md:table-cell">
        <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
          {book.category || "-"}
        </span>
      </TableCell>

     <TableCell className="px-4 py-3 text-center">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStockBadgeClass(
            book.stock
          )}`}
        >
          {book.stock} buku
        </span>
      </TableCell>

      <TableCell className="px-4 py-3 text-sm text-muted-foreground hidden xl:table-cell">
        {formatDate(book.created_at)}
      </TableCell>

      <TableCell className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(book)}
            className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Buku?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus buku <b>{book.title}</b>{" "}
                  ini?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
                  onClick={() => onDelete(book.id)}
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};
