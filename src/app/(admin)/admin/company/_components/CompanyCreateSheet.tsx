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
import { executeAction, getErrorMessage } from "@/lib/action";

import useDialogOpenStore from "@/store/useDialogOpenStore";

import {
  CompanyCreateFormSchema,
  CompanyCreateFormType,
} from "../_lib/CompanyFormSchema";
import { CompanyRowInsert, createCompany } from "@/actions/company-action";
import { useQueryClient } from "@tanstack/react-query";
import { companyQueries } from "@/queries";

export default function CompanyCreateSheet() {
  const queryClient = useQueryClient();
  const { createOpen, setCreateOpen } = useDialogOpenStore((state) => state);

  const form = useForm<CompanyCreateFormType>({
    resolver: zodResolver(CompanyCreateFormSchema),
    defaultValues: {
      name: "",
      representative_name: "",
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
      await executeAction(createCompany(data as CompanyRowInsert));
      toast.success("새로운 기업이 생성되었습니다.");
      queryClient.invalidateQueries({ queryKey: companyQueries.all() });
      form.reset();
      setCreateOpen(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "오류가 발생했습니다."));
    }
  };

  return (
    <Sheet open={createOpen} onOpenChange={setCreateOpen}>
      <SheetContent className="min-w-150 overflow-y-auto p-0">
        <SheetHeader className="border-b p-4">
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
                <div className="flex w-2/3 flex-col space-y-6">
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
                    name="representative_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>대표자 성명</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="대표자 성명을 입력해주세요."
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
                        <FormLabel>기업 소개</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="기업 소개를 입력해주세요."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex w-full justify-center">
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
