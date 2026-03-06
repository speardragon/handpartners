"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { companyQueries } from "@/queries";
import {
  CompanyUpdateFormType,
  CompanyUpdateFormSchema,
} from "../_lib/CompanyFormSchema";
import { CompanyRow, updateCompany } from "@/actions/company-action";

type Props = {
  companyId?: number;
  companyInfo: Partial<CompanyRow>;
};

export default function CompanyEditForm({ companyId, companyInfo }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<CompanyUpdateFormType>({
    resolver: zodResolver(CompanyUpdateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: companyInfo.name ?? "",
      representative_name: companyInfo.representative_name ?? "",
      description: companyInfo.description ?? "",
    },
  });

  const {
    formState: { dirtyFields },
  } = form;

  const onSubmit = async (data: CompanyUpdateFormType) => {
    const updatedData: Partial<CompanyUpdateFormType> = {};

    (Object.keys(dirtyFields) as Array<keyof CompanyUpdateFormType>).forEach(
      (fieldKey) => {
        const value = data[fieldKey];
        if (dirtyFields[fieldKey] && value !== undefined) {
          updatedData[fieldKey] = value;
        }
      }
    );

    if (Object.keys(updatedData).length > 0) {
      await updateCompany({ ...updatedData, id: companyId });
      queryClient.invalidateQueries({ queryKey: companyQueries.all() });
      toast.success("기업 정보를 수정하였습니다.");
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
        className="w-full items-start space-y-6"
      >
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-between">
            <div className="w-1/3 text-gray-800">대표자 성명</div>
            <FormField
              control={form.control}
              name="representative_name"
              render={({ field }) => (
                <FormItem className="w-2/3">
                  <FormControl>
                    <Input
                      className="w-full border-gray-400"
                      placeholder="대표자 성명을 입력해주세요."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="w-1/3 text-gray-800">기업 소개</div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-2/3">
                  <FormControl>
                    <Input
                      className="w-full border-gray-400"
                      placeholder="기업 소개를 입력해주세요."
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
