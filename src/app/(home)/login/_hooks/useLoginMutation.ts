import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type LoginRequest = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ email, password }: LoginRequest) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({queryKey: ["users"]});
      // queryClient.invalidateQueries({queryKey: ["users"]});
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(JSON.stringify(error));
    },
  });
}
