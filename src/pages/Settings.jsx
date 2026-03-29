import { useState, useEffect } from "react";
import { Bell, Database, Plus, User, Loader2, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  SettingDialog,
  SettingSection,
  SettingSkeleton,
  SettingTable,
  ToggleSetting,
} from "../components/settings";
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
    notifications: serverNotifications,
    config: serverConfig,
    updateNotifications,
    updateConfig,
    isLoading,
    isSaving,
    addUsers,
    editUser,
    deleteUser,
  } = useSettings(currentUser);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [localConfig, setLocalConfig] = useState({
    loanDuration: "7",
    maxBooks: "5",
  });

  const [localNotifications, setLocalNotifications] = useState({
    overdue: true,
    email: true,
  });

  useEffect(() => {
    if (serverConfig) {
      setLocalConfig({
        loanDuration: serverConfig.loanDuration,
        maxBooks: serverConfig.maxBooks,
      });
    }
  }, [serverConfig?.loanDuration, serverConfig?.maxBooks]);

  useEffect(() => {
    if (serverNotifications) {
      setLocalNotifications({
        overdue: serverNotifications.overdue,
        email: serverNotifications.email,
      });
    }
  }, [serverNotifications?.overdue, serverNotifications?.email]);

  const handleSaveConfig = async () => {
    await updateConfig(localConfig);
  };

  const handleSaveNotifications = async () => {
    await updateNotifications(localNotifications);
  };

  if (isLoading) {
    return <SettingSkeleton />;
  }

  return (
    <div className="container max-w-6xl space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground text-lg">
          Kelola sistem perpustakaan dan preferensi akun Anda.
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="users" className="gap-2">
            <User className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="library" className="gap-2">
            <Database className="h-4 w-4" /> Library
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="library">
          <SettingSection
            title="Konfigurasi Global"
            description="Atur aturan peminjaman yang berlaku untuk seluruh siswa."
            footer={
              <Button onClick={handleSaveConfig} disabled={isSaving}>
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
                <Select
                  value={localConfig.loanDuration}
                  onValueChange={(val) =>
                    setLocalConfig((prev) => ({ ...prev, loanDuration: val }))
                  }
                >
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
                <Select
                  value={localConfig.maxBooks}
                  onValueChange={(val) =>
                    setLocalConfig((prev) => ({ ...prev, maxBooks: val }))
                  }
                >
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
                checked={localNotifications.overdue}
                onCheckedChange={(val) =>
                  setLocalNotifications((prev) => ({ ...prev, overdue: val }))
                }
              />
              <ToggleSetting
                title="Email Digest"
                description="Terima laporan harian aktivitas perpustakaan via email."
                checked={localNotifications.email}
                onCheckedChange={(val) =>
                  setLocalNotifications((prev) => ({ ...prev, email: val }))
                }
              />
            </div>
          </SettingSection>
        </TabsContent>
      </Tabs>

      <SettingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSubmit={async (formData) => {
          const success = editingUser
            ? await editUser(editingUser.id, formData)
            : await addUsers(formData);

          if (success) setDialogOpen(false);
          return success;
        }}
      />
    </div>
  );
};

export default Settings;
