import { createClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/action";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

type LoginRequest = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  const searchParams = useSearchParams();
  const supabase = createClient();

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
      const redirect = searchParams.get("redirect");
      window.location.href = redirect ?? "/";
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "로그인에 실패했습니다");

      if (message === "invalid_credentials") {
        toast.error("이메일 또는 비밀번호가 잘못되었습니다");
        return;
      }
      toast.error("로그인에 실패했습니다");
    },
  });
}
