import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";

export const ProfilePicture = () => {
  const { user } = useAuth();

  return (
      <section className="lg:col-span-1">
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
      </section>
  );
};
