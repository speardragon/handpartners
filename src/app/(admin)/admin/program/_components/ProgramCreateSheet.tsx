"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
import { Separator } from "@/components/ui/separator";
import CompanySelect from "./CompanySelect";
import { useState } from "react";
import { CompanyRow } from "@/actions/company-action";

export default function ProgramCreateSheet() {
  const { createOpen, setCreateOpen } = useDialogOpenStore((state) => state);
  const queryClient = useQueryClient();

  const [targetList, setTargetList] = useState<CompanyRow[]>([]);

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
    await createProgram(
      data as ProgramRowInsert,
      targetList.map((company) => company.id) // [1,2,3...]
    );
    queryClient.invalidateQueries({ queryKey: ["programs"] });
    setCreateOpen(false);
    toast.success("새로운 프로그램 추가되었습니다.");
  };

  return (
    <Sheet open={createOpen} onOpenChange={setCreateOpen}>
      <SheetContent className="overflow-y-auto min-w-[600px]">
        <SheetHeader>
          <SheetTitle>프로그램 추가</SheetTitle>
          <SheetDescription>프로그램을 추가합니다.</SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <Form {...form}>
          <form
            autoComplete="off"
            autoFocus={false}
            onSubmit={form.handleSubmit(onSubmit)}
            className="items-start space-y-4"
          >
            <div className="space-y-6 pt-4">
              <div className="font-medium">프로그램 정보</div>
              <div className="flex justify-between items-center">
                <div className="w-1/3 text-gray-800">프로그램 이름</div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-2/3">
                      <FormControl>
                        <Input
                          className="w-full border-gray-400"
                          autoFocus={false}
                          autoComplete="off"
                          placeholder="프로그램 이름을 입력해주세요."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="w-1/3 text-gray-800">설명</div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-2/3">
                      <FormControl>
                        <Input
                          className="w-full border-gray-400"
                          placeholder="설명을 입력해주세요."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="w-1/3 text-gray-800">시작일</div>
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="w-2/3">
                      <FormControl>
                        <Input className="w-full" type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="w-1/3 text-gray-800">종료일</div>
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="w-2/3">
                      <FormControl>
                        <Input className="w-full" type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="flex flex-col">
              <div className="mb-4 font-medium">프로그램 참여 기업 추가</div>
              <CompanySelect
                targetList={targetList}
                onTargetListChange={setTargetList}
              />
            </div>

            <Separator />

            <div className="flex w-full justify-center">
              <Button className="w-1/2" type="submit">
                생성하기
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
