"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import useDialogOpenStore from "@/store/useDialogOpenStore";
import { useForm } from "react-hook-form";
import { ProfileCreateFormSchema } from "../_lib/ProfileFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/actions/user-actions";
import { executeAction, getErrorMessage } from "@/lib/action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { userQueries } from "@/queries";
import { USER_ROLES } from "@/constants/auth";

export default function UserCreateDialog() {
  const { createOpen, setCreateOpen } = useDialogOpenStore((state) => state);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ProfileCreateFormSchema>>({
    resolver: zodResolver(ProfileCreateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      role: "",
      email: "",
      affiliation: "",
      position: "",
      phone_number: "",
      password: "",
    },
  });

  const onSubmit = async (
    userData: z.infer<typeof ProfileCreateFormSchema>
  ) => {
    try {
      await executeAction(registerUser(userData));
      queryClient.invalidateQueries({ queryKey: userQueries.all() });
      setCreateOpen(false);
      form.reset();
      toast.success("새로운 사용자가 추가되었습니다.");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "사용자 등록에 실패했습니다."));
    }
  };

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg">사용자 추가</DialogTitle>
          <DialogDescription>새로운 사용자를 등록합니다.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      이름 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input autoComplete="off" placeholder="이름" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      비밀번호 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        type="password"
                        placeholder="비밀번호"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    구분 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="구분을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={USER_ROLES.JUDGE}>심사자</SelectItem>
                        <SelectItem value={USER_ROLES.ADMIN}>관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    이메일 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="이메일" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      소속
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="소속" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      직급
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="직급" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    전화번호
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="전화번호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t border-neutral-100 pt-4">
              <DialogFooter className="flex-row justify-end gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCreateOpen(false);
                    form.reset();
                  }}
                >
                  취소
                </Button>
                <Button type="submit" size="sm">
                  생성하기
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
