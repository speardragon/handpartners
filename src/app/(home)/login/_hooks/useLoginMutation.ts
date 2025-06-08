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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        throw new Error(error.code);
      }
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (error: any) => {
      if (error.message === "invalid_credentials") {
        toast.error("이메일 또는 비밀번호가 잘못되었습니다");
        return;
      }
      toast.error("로그인에 실패했습니다");
    },
  });
}
