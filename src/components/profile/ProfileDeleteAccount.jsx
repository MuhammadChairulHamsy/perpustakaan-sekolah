import { AlertTriangle, Trash2 } from "lucide-react";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";


export const ProfileDeleteAccount = () => {
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const handleDeleteAccount = () => {
    // Logika hapus akun
    console.log("Delete Account");
  };
  return (
    <section className="rounded-xl border-2 border-destructive/20 bg-destructive/5 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h2 className="text-lg font-semibold text-destructive">Zona Bahaya</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Setelah Anda menghapus akun, tidak ada jalan kembali. Semua data Anda
        akan dihapus secara permanen setelah 30 hari.
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="gap-2 cursor-pointer">
            <Trash2 className="h-4 w-4" />
            Hapus Akun
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin??</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menjadwalkan penghapusan permanen akun Anda.
              Semua data akan dihapus setelah 30 hari. Jenis{" "}
              <strong>Hapus</strong> untuk mengkonfirmasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder='Ketik "DELETE" untuk konfirmasi'
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirm("")}>
              Membatalkan
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteConfirm !== "DELETE"}
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Akun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
