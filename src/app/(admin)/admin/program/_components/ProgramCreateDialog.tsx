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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import useDialogOpenStore from "@/store/useDialogOpenStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProgramCreateFormSchema } from "../_lib/ProgramFormSchema";
import { createProgram, ProgramRowInsert } from "@/actions/program-action";

export default function ProgramCreateDialog() {
  const { createOpen, setCreateOpen } = useDialogOpenStore((state) => state);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ProgramCreateFormSchema>>({
    resolver: zodResolver(ProgramCreateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      categories: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof ProgramCreateFormSchema>) => {
    await createProgram(data as ProgramRowInsert);
    queryClient.invalidateQueries({ queryKey: ["programs"] });
    setCreateOpen(false);
    toast.success("새로운 프로그램 추가되었습니다.");
  };

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent className="overflow-y-auto w-[1000px] h-3/4">
        <DialogHeader>
          <DialogTitle>프로그램 추가</DialogTitle>
          <DialogDescription>프로그램을 추가합니다.</DialogDescription>
          <Form {...form}>
            <form
              autoComplete="off"
              autoFocus={false}
              onSubmit={form.handleSubmit(onSubmit)}
              className="items-start space-y-4"
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
