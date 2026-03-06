import { z } from "zod";

export const CompanyUpdateFormSchema = z.object({
  name: z.string().optional(),
  representative_name: z.string().optional(),
  description: z.string().optional(),
});

export const CompanyCreateFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  representative_name: z.string().min(1, "대표자 성명을 입력해주세요."),
  description: z.string().min(1, "기업 소개를 입력해주세요."),
});

export type CompanyCreateFormType = z.infer<typeof CompanyCreateFormSchema>;
export type CompanyUpdateFormType = z.infer<typeof CompanyUpdateFormSchema>;
