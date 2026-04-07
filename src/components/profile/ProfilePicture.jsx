import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useProfile } from "../../hooks/useProfile";
import { Loader2 } from "lucide-react";

export const ProfilePicture = () => {
  const { profile, isLoading } = useProfile();
  return (
    <section className="lg:col-span-1">
      <div className="border rounded-xl flex flex-col items-center space-y-4 p-6 bg-card shadow-sm">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage
              src={
                profile?.avatar_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.email}`
              }
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {profile?.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          >
            <Camera className="h-8 w-8 text-white" />
          </button>
        </div>
        <div className="text-center min-h-12">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
          ) : (
            <>
              <p className="font-bold text-foreground text-lg">
                {profile?.full_name}
              </p>
              <p className="text-sm text-muted-foreground">{profile?.role}</p>
            </>
          )}
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
    </section>
  );
};
