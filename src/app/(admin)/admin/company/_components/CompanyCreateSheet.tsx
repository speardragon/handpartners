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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import useDialogOpenStore from "@/store/useDialogOpenStore";

import { CompanyCreateFormType } from "../_lib/CompanyFormSchema";
import { JudgeCreateFormSchema } from "../../program/[programId]/_lib/JudgeFormSchema";
import { CompanyRowInsert, createCompany } from "@/actions/company-action";
import { useQueryClient } from "@tanstack/react-query";

export default function CompanyCreateSheet() {
  const queryClient = useQueryClient();
  const { createOpen, setCreateOpen } = useDialogOpenStore((state) => state);

  const form = useForm<CompanyCreateFormType>({
    resolver: zodResolver(JudgeCreateFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // 폼 제출 함수
  const onSubmit = async (data: CompanyCreateFormType) => {
    try {
      await createCompany(data as CompanyRowInsert);
      toast.success("새로운 기업이 생성되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      form.reset();
      setCreateOpen(false);
    } catch (error: any) {
      toast.error(error.message || "오류가 발생했습니다.");
    }
  };

  return (
    <Sheet open={createOpen} onOpenChange={setCreateOpen}>
      <SheetContent className="overflow-y-auto min-w-[600px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>기업 추가</SheetTitle>
          <SheetDescription>새로운 기업을 생성합니다.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-4 p-6">
              <div className="flex justify-between">
                <div className="w-1/3 font-medium">기업 정보</div>
                <div className="flex flex-col w-2/3 space-y-6">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>기업명</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="기업명을 입력해주세요."
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
                        <FormLabel>아이템 설명</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="심사에 대한 설명을 입력해주세요."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center w-full mt-4">
              <Button type="submit" disabled={isSubmitting}>
                기업 생성
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
