import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRef } from "react";
import { Button } from "../ui/button";
import { useProfile } from "../../hooks/useProfile";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export const ProfilePicture = () => {
  const { profile, isLoading, uploadAvatar, isUploadingAvatar } = useProfile();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const displayAvatar = profile?.avatar_url || user?.avatar_url;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File terlalu besar! Maksimal 2MB.");
      }
      uploadAvatar(file);
    }
  };
  return (
    <section className="lg:col-span-1">
      <div className="border rounded-xl flex flex-col items-center space-y-4 p-6 bg-card shadow-sm">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage
              src={displayAvatar}
              alt={profile?.full_name}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {profile?.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploadingAvatar}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={isUploadingAvatar}
            type="button"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          >
            {isUploadingAvatar ? (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            ) : (
              <Camera className="h-8 w-8 text-white" />
            )}
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
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current.click()}
          disabled={isUploadingAvatar}
          className="gap-2 w-full hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          {isUploadingAvatar ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          {isUploadingAvatar ? "Mengunggah..." : "Ganti Foto"}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center italic">
          JPG, PNG or GIF. Max 2MB.
        </p>
      </div>
    </section>
  );
};
