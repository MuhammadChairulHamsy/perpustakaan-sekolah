import { Camera, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAuth } from "../../context/AuthContext"; // Sesuaikan path
import { useForm } from "react-hook-form";

export const ProfilePicture = () => {
  const { user } = useAuth();

  // Inisialisasi form dengan data user yang ada
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
    },
  });

  const onSaveProfile = (data) => {
    console.log("Data yang akan disimpan:", data);
    // Di sini nanti panggil supabase.auth.updateUser...
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Kolom Kiri: Foto Profil */}
      <div className="lg:col-span-1">
        <div className="border rounded-xl flex flex-col items-center space-y-4 p-6 bg-card shadow-sm">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage
                src={
                  user?.user_metadata?.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`
                }
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {user?.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <Camera className="h-8 w-8 text-white" />
            </button>
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground text-lg">
              {user?.user_metadata?.full_name || "User Name"}
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.role || "Student"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 w-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Camera className="h-4 w-4" />
            Ganti Foto
          </Button>
          <p className="text-[10px] text-muted-foreground text-center italic">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Form Informasi */}
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit(onSaveProfile)}
          className="border rounded-xl p-6 space-y-6 bg-card shadow-sm"
        >
          <div>
            <h2 className="text-xl font-bold text-foreground font-display">
              Informasi Profil
            </h2>
            <p className="text-sm text-muted-foreground">
              Perbarui detail personal akun Anda
            </p>
          </div>
          <Separator />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Nama Lengkap
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Masukkan nama lengkap"
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Alamat Email
              </Label>
              <Input
                id="email"
                {...register("email")}
                disabled
                className="bg-muted/50 cursor-not-allowed border-dashed"
              />
              <p className="text-[10px] text-orange-500 font-medium italic">
                Hubungi admin untuk mengubah email utama
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="gap-2 px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
