import { Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

export const ProfileFormInformation = () => {
  const { user } = useAuth();
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
    <section className="lg:col-span-2 space-y-6">
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
    </section>
  );
};
