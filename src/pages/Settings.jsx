import { useSettings } from "../hooks/useSetting";
import { useState, useEffect } from "react";
import { Bell, Database, Plus, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { SettingTable } from "../components/settings/SettingTable";
import { SettingDialog } from "../components/settings";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../components/ui/label";
import  {supabase}  from "../lib/supabase/client";
import { useAuth } from "../context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";

const Settings = () => {
  const { user } = useAuth();
  const { users, loading, error, addUsers, editUser, deleteUser } =
    useSettings();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Library Settings State
  const [loanDuration, setLoanDuration] = useState("7");
  const [maxBooks, setMaxBooks] = useState("5");

  // Notification Preferences State
  const [overdueNotifications, setOverdueNotifications] = useState(true);
  const [dueDateReminders, setDueDateReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // 1. Ambil data preferensi user dari tabel profiles saat load
  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select(
          "overdue_notifications, due_date_reminders, email_notifications",
        )
        .eq("id", user.id)
        .single();

      if (data) {
        setOverdueNotifications(data.overdue_notifications ?? true);
        setDueDateReminders(data.due_date_reminders ?? true);
        setEmailNotifications(data.email_notifications ?? true);
      }
    };
    fetchPrefs();
  }, [user]);

  // 2. Fungsi Simpan Khusus Notifikasi
  const handleSaveNotificationPrefs = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          overdue_notifications: overdueNotifications,
          due_date_reminders: dueDateReminders,
          email_notifications: emailNotifications,
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Preferensi Notifikasi Berhasil Disimpan!");
    } catch (err) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Fungsi Simpan Khusus Konfigurasi Perpustakaan
  const handleSaveLibraryConfig = async () => {
    toast.success("Konfigurasi Perpustakaan diperbarui!", {
      description: `Durasi: ${loanDuration} hari, Maks: ${maxBooks} buku.`,
    });
    // Jika Anda punya tabel global config, eksekusi query-nya di sini.
  };

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
        description: `User ${formData.full_name} sudah masuk sistem.`,
        className: "!text-white",
      });
    } else {
      toast.error("Gagal Menyimpan user Yang Sudah Ada");
    }
    return success;
  };

  const handleDelete = async (id) => {
    const success = await deleteUser(id);
    if (success) {
      toast.success("Data user dihapus");
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
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pengaturan
          </h1>
          <p className="text-muted-foreground">
            Kelola pengguna dan konfigurasi pustaka.
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-muted/50 ">
            <TabsTrigger value="users" className="gap-2 cursor-pointer">
              <User className="h-4 w-4" /> Pengguna
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2 cursor-pointer">
              <Database className="h-4 w-4" /> Perpustakaan
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 cursor-pointer">
              <Bell className="h-4 w-4" /> Notifikasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-3">
            <div className="flex flex-col justify-between lg:flex lg:flex-row lg:items-center ">
              <div className="lg:flex justify-between lg:w-full space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Manajemen Pengguna
                </h2>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="font-bold cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Tambah User
                </Button>
              </div>
            </div>
            <SettingDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              user={editingUser}
              onSubmit={handleSubmit}
            />
            <SettingTable
              setting={users}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="data-table rounded-lg border border-border bg-card p-7 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">
                Konfigurasi Perpustakaan
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="loanDuration">
                    Jangka Waktu Pinjaman (hari)
                  </Label>
                  <Select value={loanDuration} onValueChange={setLoanDuration}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Hari</SelectItem>
                      <SelectItem value="14">14 Hari</SelectItem>
                      <SelectItem value="21">21 Hari</SelectItem>
                      <SelectItem value="30">30 Hari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBooks">
                    Jumlah Buku Maksimal per Siswa
                  </Label>
                  <Select value={maxBooks} onValueChange={setMaxBooks}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Buku</SelectItem>
                      <SelectItem value="5">5 Buku</SelectItem>
                      <SelectItem value="7">7 Buku</SelectItem>
                      <SelectItem value="10">10 Buku</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveLibraryConfig}
                  className="cursor-pointer"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="data-table rounded-lg border border-border bg-card p-7 space-y-5">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Notifikasi Preferensi
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        Notifikasi Keterlambatan
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Kirim notifikasi saat buku terlambat dikembalikan
                      </p>
                    </div>
                    <Switch
                      checked={overdueNotifications}
                      onCheckedChange={setOverdueNotifications}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        Pengingat Tanggal Jatuh Tempo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Kirim pengingat sebelum buku jatuh tempo.
                      </p>
                    </div>
                    <Switch
                      checked={dueDateReminders}
                      onCheckedChange={setDueDateReminders}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        Email Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Terima pemberitahuan melalui email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveNotificationPrefs}
                    disabled={isSaving}
                    className="cursor-pointer"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Preferensi"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
