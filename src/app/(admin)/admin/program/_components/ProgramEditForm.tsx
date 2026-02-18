"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProgramUpdateFormSchema } from "../_lib/ProgramFormSchema";
import { ProgramRow } from "@/actions/program-action";
import CompanySelectForModify from "./CompanySelectForModify";
import { useState } from "react";
import { updateProgramAndCompanies } from "@/actions/program-company-action";

interface Company {
  id: number;
  name: string;
}

type Props = {
  programId?: number;
  programInfo: Partial<ProgramRow>;
  setOpenEdit: (open: boolean) => void;
};

export default function ProgramEditForm({
  programId,
  programInfo,
  setOpenEdit,
}: Props) {
  const queryClient = useQueryClient();
  const [targetList, setTargetList] = useState<Company[]>([]);

  const form = useForm<z.infer<typeof ProgramUpdateFormSchema>>({
    resolver: zodResolver(ProgramUpdateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: programInfo.name ?? "",
      description: programInfo.description ?? "",
      start_date: programInfo.start_date ?? "",
      end_date: programInfo.end_date ?? "",
      categories: programInfo.categories ?? [],
    },
  });

  const onSubmit = async (data: z.infer<typeof ProgramUpdateFormSchema>) => {
    const result = await updateProgramAndCompanies(
      programId ?? 0,
      data,
      targetList.map((company) => company.id)
    );
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("프로그램 정보를 수정하였습니다.");
    } else {
      toast.error("예상치 못한 오류가 발생했습니다.");
    }
    setOpenEdit(false);
  };

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        autoFocus={false}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6"
      >
        {/* 프로그램 정보 */}
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
                    <FormLabel className="text-neutral-700">시작일</FormLabel>
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
                    <FormLabel className="text-neutral-700">종료일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </section>

        {/* 참여 기업 */}
        <section className="shrink-0 rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-neutral-900">
              참여 기업
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              DB에 등록된 전체 기업 중 이 프로그램에 참여할 기업을 선택합니다.
            </p>
          </div>
          <div className="p-4">
            <CompanySelectForModify
              programId={programId}
              targetList={targetList}
              onTargetListChange={setTargetList}
            />
          </div>
        </section>

        <Button type="submit" className="w-full shrink-0">
          수정하기
        </Button>
      </form>
    </Form>
  );
}
