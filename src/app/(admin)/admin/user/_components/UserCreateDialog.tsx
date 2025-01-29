"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  ProfileCreateFormSchema,
  ProfileUpdateFormSchema,
} from "../_lib/ProfileFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUser,
  registerUser,
  updateUser,
  UserRowInsert,
} from "@/actions/user-actions";
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
      await registerUser(userData);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setCreateOpen(false);
      form.reset();
      toast.success("새로운 사용자가 추가되었습니다.");
    } catch (error) {
      // 에러 처리 로직
      toast.error("사용자 등록에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent className="overflow-y-auto w-[1000px] h-3/4">
        <DialogHeader>
          <DialogTitle>유저 추가</DialogTitle>
          <DialogDescription>유저를 추가합니다.</DialogDescription>
          <Form {...form}>
            <form
              autoComplete="off"
              autoFocus={false}
              onSubmit={form.handleSubmit(onSubmit)}
              className="items-start space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">
                      이름 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="이름을 입력해주세요."
                        {...field}
                      />
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
                    <FormLabel className="text-base font-bold">
                      비밀번호 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="비밀번호 입력해주세요."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">
                      구분 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="구분을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="심사자">심사자</SelectItem>
                          <SelectItem value="관리자">관리자</SelectItem>
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
                    <FormLabel className="text-base font-bold">
                      이메일 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="이메일을 입력해주세요." {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="affiliation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-black">
                      소속 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="소속을 입력해주세요." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">
                      직급 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="직급을 입력해주세요." {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">
                      전화번호 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="전화번호를 입력해주세요."
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <div className="flex justify-end w-full">
                <Button className="" type="submit">
                  생성하기
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
