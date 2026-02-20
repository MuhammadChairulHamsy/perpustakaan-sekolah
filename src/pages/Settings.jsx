import { useState } from "react";
import { Bell, Database, Plus, User, Loader2, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { SettingTable } from "../components/settings/SettingTable";
import { SettingDialog } from "../components/settings";
import { SettingSection, ToggleSetting } from "../components/settings/index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useSettings } from "../hooks/useSettings";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user: currentUser } = useAuth();
  const {
    users,
    notifications,
    updateNotifications,
    toggleNotification,
    isSaving,
    loading,
    loanDuration,
    setLoanDuration,
    updateLibraryConfig,
    maxBooks,
    setMaxBooks,
    addUsers,
    editUser,
    deleteUser,
  } = useSettings(currentUser);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleSaveNotifications = async () => {
    await updateNotifications(notifications);
  };

  if (loading)
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="container max-w-6xl py-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground text-lg">
          Kelola sistem perpustakaan dan preferensi akun Anda.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none gap-6 mb-6">
          <TabsTrigger
            value="users"
            className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none bg-transparent px-2 pb-3 gap-2"
          >
            <User className="h-4 w-4" /> Manajemen Pengguna
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none bg-transparent px-2 pb-3 gap-2"
          >
            <Database className="h-4 w-4" /> Kebijakan Pustaka
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none bg-transparent px-2 pb-3 gap-2"
          >
            <Bell className="h-4 w-4" /> Notifikasi
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Users */}
        <TabsContent value="users">
          <SettingSection
            title="Daftar Pengguna"
            description="Tambahkan atau edit akses petugas perpustakaan."
            footer={
              <Button
                onClick={() => {
                  setEditingUser(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah User Baru
              </Button>
            }
          >
            <SettingTable
              setting={users}
              onEdit={(u) => {
                setEditingUser(u);
                setDialogOpen(true);
              }}
              onDelete={deleteUser}
            />
          </SettingSection>
        </TabsContent>

        {/* Tab 2: Library Config */}
        <TabsContent value="library">
          <SettingSection
            title="Konfigurasi Global"
            description="Atur aturan peminjaman yang berlaku untuk seluruh siswa."
            footer={
              <Button onClick={updateLibraryConfig} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Perubahan
              </Button>
            }
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label>Durasi Pinjam Default</Label>
                <Select value={loanDuration} onValueChange={(value) => setLoanDuration(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih durasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">1 Minggu</SelectItem>
                    <SelectItem value="14">2 Minggu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Limit Buku per Siswa</Label>
                <Select value={maxBooks} onValueChange={(value) => setMaxBooks(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Buku</SelectItem>
                    <SelectItem value="5">5 Buku</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SettingSection>
        </TabsContent>

        {/* Tab 3: Notifications */}
        <TabsContent value="notifications">
          <SettingSection
            title="Notifikasi"
            description="Atur bagaimana sistem menghubungi Anda."
            footer={
              <Button onClick={handleSaveNotifications} disabled={isSaving}>
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            }
          >
            <div className="grid gap-4">
              <ToggleSetting
                title="Notifikasi Keterlambatan"
                checked={notifications.overdue}
                onCheckedChange={(key) => toggleNotification("overdue")}
              />
              <ToggleSetting
                title="Email Digest"
                description="Terima laporan harian aktivitas perpustakaan via email."
                checked={notifications.email}
                onCheckedChange={(v) => toggleNotification("email")}
              />
            </div>
          </SettingSection>
        </TabsContent>
      </Tabs>

      <SettingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSubmit={async (data) => {
          const ok = editingUser
            ? await editUser(editingUser.id, data)
            : await addUsers(data);
          if (ok) setDialogOpen(false);
          return ok;
        }}
      />
    </div>
  );
};

export default Settings;
