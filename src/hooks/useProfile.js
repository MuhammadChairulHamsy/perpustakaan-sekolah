import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const profileQuery = useQuery({
    queryKey: ["data-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, role, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (newName) => {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: newName },
      });
      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ full_name: newName })
        .eq("id", user.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-profile", user?.id] });
      toast.success("Profil berhasil diperbarui!");
    },
    onError: (error) => {
      toast.error("Gagal memperbarui: " + error.message);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file) => {
      // Sekarang 'user.id' di bawah ini tidak akan error lagi
      if (!user?.id) throw new Error("User tidak ditemukan");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`; 

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await Promise.all([
        supabase.auth.updateUser({ data: { avatar_url: publicUrl } }),
        supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id)
      ]);

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-profile", user?.id] });
      toast.success("Foto profil berhasil diperbarui!");
    },
    onError: (error) => {
      toast.error("Gagal unggah foto: " + error.message);
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isUpdating: updateMutation.isPending,
    updateProfile: updateMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    error: profileQuery.error,
  };
};
