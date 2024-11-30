import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type LoginRequest = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ email, password }: LoginRequest) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data) {
        console.log(data);
      }

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(JSON.stringify(error));
    },
  });
}
