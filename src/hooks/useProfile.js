import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const {user} = useAuth();
  const profileQuery =  useQuery({
    queryKey: ["data-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, email, role, avatar_url",
        ).eq("id", user.id).single();

      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (newName) => {

      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: newName }
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
    }
  });

  return {
    profile: profileQuery.data,       
    isLoading: profileQuery.isLoading,     
    isUpdating: updateMutation.isPending,
    updateProfile: updateMutation.mutate,
    error: profileQuery.error
  }
};
