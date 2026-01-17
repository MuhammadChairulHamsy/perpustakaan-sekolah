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
import { Pencil, Trash2, User } from "lucide-react";

export const SettingRow = ({user, onEdit, onDelete}) => {
    return(
          <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <User className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <span className="font-medium text-foreground block">
              {user.full_name}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {user.email || "-"}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {user.role || "-"}
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
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
                <AlertDialogTitle>Hapus uSer?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus user <b>{user.full_name}</b>{" "}
                  ini?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
                  onClick={() => onDelete(user.id)}
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
    )    
}
