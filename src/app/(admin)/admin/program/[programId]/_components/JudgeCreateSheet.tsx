"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import useDialogOpenStore from "@/store/useDialogOpenStore";
import {
  JudgeCreateFormSchema,
  JudgeCreateFormType,
} from "../_lib/JudgeFormSchema";
import { createJudgingRound } from "@/actions/judging_round-action";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";

interface JudgeCreateType {
  name: string;
  description: string;
  start_date?: string;
  end_date?: string;
}

type Props = {
  programId: number;
};

export default function JudgeCreateSheet({ programId }: Props) {
  const { createOpen, setCreateOpen } = useDialogOpenStore((state) => state);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });

  // const { data: companies } = useCompanyQuery(pagination);

  const form = useForm<JudgeCreateFormType>({
    resolver: zodResolver(JudgeCreateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      companies: [
        // 예시용 기본값 (없으면 비워둠)
        { company_id: 0, pdf_path: "", group_name: "" },
      ],
      users: [
        // 예시용 기본값
        { user_id: "", group_name: "" },
      ],
    },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // 기업 항목 dynamic 관리 (예시)
  // const { fields: companyFields, append: appendCompany } = useFieldArray({
  //   control,
  //   name: "companies",
  // });

  // // 심사위원 항목 dynamic 관리 (예시)
  // const { fields: userFields, append: appendUser } = useFieldArray({
  //   control,
  //   name: "users",
  // });

  // 폼 제출 함수
  const onSubmit = async (data: JudgeCreateType) => {
    try {
      // await createJudge(programId, data);
      await createJudgingRound({ ...data, program_id: programId });
      toast.success("새로운 심사가 생성되었습니다.");
      setCreateOpen(false);
    } catch (error: any) {
      toast.error(error.message || "오류가 발생했습니다.");
    }
  };

  return (
    <Sheet open={createOpen} onOpenChange={setCreateOpen}>
      <SheetContent className="overflow-y-auto min-w-[800px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>심사 추가</SheetTitle>
          <SheetDescription>새로운 심사를 생성합니다.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <div className="flex flex-col gap-4 p-6">
              <div className="flex justify-between">
                <div className="w-1/3 font-medium">심사 정보</div>
                <div className="flex flex-col w-2/3 space-y-6">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>심사 이름</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="심사 라운드 이름을 입력해주세요."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>심사 설명</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="심사에 대한 설명을 입력해주세요."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>시작일</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>종료일</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center w-full mt-4">
              <Button type="submit" disabled={isSubmitting}>
                심사 생성
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
