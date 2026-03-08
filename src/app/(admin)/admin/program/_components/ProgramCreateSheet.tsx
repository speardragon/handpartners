"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import { executeAction, getErrorMessage } from "@/lib/action";
import { useQueryClient } from "@tanstack/react-query";
import { ProgramCreateFormSchema } from "../_lib/ProgramFormSchema";
import { createProgram, ProgramRowInsert } from "@/actions/program-action";
import CompanySelect from "./CompanySelect";
import { useState } from "react";
import { CompanyRow } from "@/actions/company-action";
import { programQueries } from "@/queries";

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
    try {
      await executeAction(
        createProgram(
          data as ProgramRowInsert,
          targetList.map((company) => company.id)
        )
      );
      queryClient.invalidateQueries({ queryKey: programQueries.all() });
      setCreateOpen(false);
      toast.success("새로운 프로그램 추가되었습니다.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "프로그램을 추가하지 못했습니다.")
      );
    }
  };

  return (
    <Sheet open={createOpen} onOpenChange={setCreateOpen}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-xl lg:max-w-2xl">
        <SheetHeader className="shrink-0 border-b border-neutral-100 px-6 py-4">
          <SheetTitle>프로그램 추가</SheetTitle>
          <SheetDescription>새로운 프로그램을 추가합니다.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            autoComplete="off"
            autoFocus={false}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6"
          >
            <section className="shrink-0 rounded-lg border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-neutral-900">
                  프로그램 정보
                </h3>
              </div>
              <div className="space-y-4 p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">
                        프로그램 이름
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoFocus={false}
                          autoComplete="off"
                          placeholder="프로그램 이름을 입력해주세요."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">설명</FormLabel>
                      <FormControl>
                        <Input placeholder="설명을 입력해주세요." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700">
                          시작일
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700">
                          종료일
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="shrink-0 rounded-lg border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-neutral-900">
                  참여 기업
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  DB에 등록된 전체 기업 중 이 프로그램에 참여할 기업을
                  선택합니다.
                </p>
              </div>
              <div className="p-4">
                <CompanySelect
                  targetList={targetList}
                  onTargetListChange={setTargetList}
                />
              </div>
            </section>

            <Button type="submit" className="w-full shrink-0">
              프로그램 생성
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
