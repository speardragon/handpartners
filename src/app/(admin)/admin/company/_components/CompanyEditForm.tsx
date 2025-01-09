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
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProgramRow, updateProgram } from "@/actions/program-action";
import {
  CompanyCreateFormType,
  CompanyUpdateFormSchema,
} from "../_lib/CompanyFormSchema";
import { CompanyRow, updateCompany } from "@/actions/company-action";

type Props = {
  companyId?: number;
  companyInfo: Partial<CompanyRow>;
};

export default function CompanyEditForm({ companyId, companyInfo }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof CompanyUpdateFormSchema>>({
    resolver: zodResolver(CompanyUpdateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: companyInfo.name ?? "",
      description: companyInfo.description ?? "",
    },
  });

  const {
    formState: { dirtyFields },
  } = form;

  const onSubmit = async (data: CompanyCreateFormType) => {
    const updatedData: any = {};

    Object.keys(dirtyFields).forEach((key) => {
      const fieldKey = key as keyof CompanyCreateFormType; // 'key'를 'UserData'의 키로 타입 단언
      if (dirtyFields[fieldKey] && data[fieldKey] !== undefined) {
        updatedData[fieldKey] = data[fieldKey];
      }
    });

    if (Object.keys(updatedData).length > 0) {
      const result = await updateCompany({ ...updatedData, id: companyId });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("프로그램 정보를 수정하였습니다.", result);
    } else {
      toast.error("수정사항이 존재하지 않습니다.");
    }
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
            <div className="w-1/3 text-gray-800">기업명</div>
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
                      placeholder="기업명을 입력해주세요."
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
        </div>

        <div className="flex w-full justify-end">
          <Button type="submit">수정하기</Button>
        </div>
      </form>
    </Form>
  );
}
