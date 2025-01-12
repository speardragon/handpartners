"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProgramUpdateFormSchema } from "../_lib/ProgramFormSchema";
import { ProgramRow, updateProgram } from "@/actions/program-action";
import { Separator } from "@/components/ui/separator";
import CompanySelectForModify from "./CompanySelectForModify";
import { CompanyRow } from "@/actions/company-action";
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

  const {
    formState: { dirtyFields },
  } = form;

  const onSubmit = async (data: z.infer<typeof ProgramUpdateFormSchema>) => {
    const result = await updateProgramAndCompanies(
      programId,
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
        className="items-start w-full space-y-6"
      >
        <div className="space-y-6 pt-4">
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
          <CompanySelectForModify
            programId={programId}
            targetList={targetList}
            onTargetListChange={setTargetList}
          />
        </div>

        <Separator />

        <div className="flex w-full justify-end">
          <Button type="submit">수정하기</Button>
        </div>
      </form>
    </Form>
  );
}
