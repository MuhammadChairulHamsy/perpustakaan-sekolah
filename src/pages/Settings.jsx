import { useSettings } from "../hooks/useSetting";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { SettingTable } from "../components/settings/SettingTable";
import { SettingDialog } from "../components/settings";
import { toast } from "sonner";

const Settings = () => {
  const { users, loading, error, addUsers, editUser, deleteUser } =
    useSettings();
   const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

   const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    const success = await (editingUser
      ? editUser(editingUser.id, formData)
      : addUsers(formData));
    if (success) {
      toast.success("Berhasil Simpan!", {
        description: `Siswa ${formData.full_name} sudah masuk sistem.`,
        className: "!text-white",
      });
    } else {
      toast.error("Gagal Menyimpan Siswa Yang Sudah Ada");
    }
    return success;
  };

  const handleDelete = async (id) => {
    const success = await deleteUser(id);
    if (success) {
      toast.success("Data siswa dihapus");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
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
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pengaturan
          </h1>
          <p className="text-muted-foreground">
            Kelola pengguna dan konfigurasi pustaka.
          </p>
        </div>
        <div className="flex flex-col justify-between lg:flex lg:flex-row lg:items-center">
          <p>Manajemen Pengguna</p>
          <Button onClick={() => handleOpenDialog()} className="font-bold cursor-pointer">
            <Plus className="h-4 w-4" />
            Tambah User
          </Button>
        </div>

        <SettingDialog open={dialogOpen} onOpenChange={setDialogOpen} user={editingUser} onSubmit={handleSubmit}/>

        <SettingTable setting={users} onEdit={handleOpenDialog} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Settings;
