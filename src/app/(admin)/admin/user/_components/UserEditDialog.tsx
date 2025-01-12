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
import { ProfileUpdateFormSchema } from "../_lib/ProfileFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteUser, updateUser, UserRow } from "@/actions/user-actions";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId?: string;
  userProfile: Partial<UserRow>;
};

export default function UserEditDialog({ userId, userProfile }: Props) {
  const { open, setOpen } = useDialogOpenStore((state) => state);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ProfileUpdateFormSchema>>({
    resolver: zodResolver(ProfileUpdateFormSchema),
    mode: "onSubmit",
  });

  const {
    formState: { dirtyFields },
  } = form;

  useEffect(() => {
    form.setValue("username", userProfile.username ?? "");
    form.setValue("role", userProfile.role ?? "");
    form.setValue("email", userProfile.email ?? "");
    form.setValue("affiliation", userProfile.affiliation ?? "");
    form.setValue("position", userProfile.position ?? "");
    form.setValue("phone_number", userProfile.phone_number ?? "");
  }, [userProfile]);

  const onSubmit = async (data: z.infer<typeof ProfileUpdateFormSchema>) => {
    type UserData = z.infer<typeof ProfileUpdateFormSchema>;
    const updatedData: any = {};

    Object.keys(dirtyFields).forEach((key) => {
      const fieldKey = key as keyof UserData; // 'key'를 'UserData'의 키로 타입 단언
      if (dirtyFields[fieldKey] && data[fieldKey] !== undefined) {
        updatedData[fieldKey] = data[fieldKey];
      }
    });

    if (Object.keys(updatedData).length > 0) {
      await updateUser({ ...updatedData, id: userId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
      toast.success("유저 정보를 수정하였습니다.");
    } else {
      toast.error("수정사항이 존재하지 않습니다.");
    }
  };

  const deleteHandler = async (userId: string) => {
    const confirmation = window.confirm("정말로 이 사용자를 삭제하시겠습니까?");
    if (!confirmation) {
      return; // 사용자가 취소를 눌렀을 경우 삭제 로직을 실행하지 않습니다.
    }

    const result = await deleteUser(userId);
    toast.success("사용자가 삭제되었습니다.");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>유저 정보 수정</DialogTitle>
          <DialogDescription>유저 정보를 수정하세요.</DialogDescription>
          <Form {...form}>
            <form
              autoComplete="off"
              autoFocus={false}
              onSubmit={form.handleSubmit(onSubmit)}
              className="items-start w-full space-y-6"
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
                        autoFocus={false}
                        autoComplete="off"
                        placeholder="이름을 입력해주세요."
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
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
                      <Input placeholder="구분을 입력해주세요." {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
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

              <div className="flex w-full justify-between">
                <Button type="submit">수정하기</Button>
                <Button
                  onClick={() => deleteHandler(userId)}
                  type="button"
                  className="bg-red-500"
                >
                  삭제하기
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
