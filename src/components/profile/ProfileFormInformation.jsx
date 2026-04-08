import { Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useProfile } from "../../hooks/useProfile";
import { useForm } from "react-hook-form";

export const ProfileFormInformation = () => {
  const { profile, isLoading, isUpdating, updateProfile,  } = useProfile();

  const { register, handleSubmit } = useForm({
    values: {
      fullName: profile?.full_name || "",
      email: profile?.email || "",
    },
  });

  const onSaveProfile = (data) => {
    updateProfile(data.fullName);
  };

  if (isLoading) return <p>Memuat...</p>;
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
             defaultValue={profile?.full_name}
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
            className="gap-2 px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer"
            disabled={isUpdating}
          >
            <Save className="h-4 w-4" />
            {isUpdating ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </section>
  );
};
