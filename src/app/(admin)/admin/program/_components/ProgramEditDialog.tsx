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
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteUser, updateUser, UserRow } from "@/actions/user-actions";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProgramUpdateFormSchema } from "../_lib/ProgramFormSchema";
import {
  deleteProgram,
  ProgramRow,
  updateProgram,
} from "@/actions/program-action";

type Props = {
  programId?: number;
  programInfo: Partial<ProgramRow>;
};

export default function ProgramEditDialog({ programId, programInfo }: Props) {
  const { open, setOpen } = useDialogOpenStore((state) => state);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ProgramUpdateFormSchema>>({
    resolver: zodResolver(ProgramUpdateFormSchema),
    mode: "onSubmit",
  });

  const {
    formState: { dirtyFields },
  } = form;

  useEffect(() => {
    form.setValue("name", programInfo.name ?? "");
    form.setValue("description", programInfo.description ?? "");
    form.setValue("start_date", programInfo.start_date ?? "");
    form.setValue("end_date", programInfo.end_date ?? "");
    form.setValue("categories", programInfo.categories ?? []);
  }, [programInfo]);

  const onSubmit = async (data: z.infer<typeof ProgramUpdateFormSchema>) => {
    type UserData = z.infer<typeof ProgramUpdateFormSchema>;
    const updatedData: any = {};

    Object.keys(dirtyFields).forEach((key) => {
      const fieldKey = key as keyof UserData; // 'key'를 'UserData'의 키로 타입 단언
      if (dirtyFields[fieldKey] && data[fieldKey] !== undefined) {
        updatedData[fieldKey] = data[fieldKey];
      }
    });

    if (Object.keys(updatedData).length > 0) {
      const result = await updateProgram({ ...updatedData, id: programId });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setOpen(false);
      toast.success("프로그램 정보를 수정하였습니다.", result);
    } else {
      toast.error("수정사항이 존재하지 않습니다.");
    }
  };

  const deleteHandler = async (programId: number) => {
    const confirmation = window.confirm(
      "정말로 이 프로그램을 삭제하시겠습니까?"
    );
    if (!confirmation) {
      return; // 사용자가 취소를 눌렀을 경우 삭제 로직을 실행하지 않습니다.
    }

    const result = await deleteProgram(programId);
    toast.success("프로그램이 삭제되었습니다.", result);
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["programs"] });
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">
                      프로그램 이름 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={false}
                        autoComplete="off"
                        placeholder="프로그램 이름을 입력해주세요."
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">
                      설명 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="설명을 입력해주세요." {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">
                      시작일 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-black">
                      종료일 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-between">
                <Button type="submit">수정하기</Button>
                <Button
                  onClick={() => deleteHandler(programId)}
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
