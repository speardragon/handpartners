import { z } from "zod";

// 기업 정보
const CompanyInfoSchema = z.object({
  company_id: z.number(),
  pdf_path: z.string().optional(), // 필요 시
  group_name: z.string().optional(), // 없으면 서버에서 'A'로 처리
});

// 심사위원 정보
const UserInfoSchema = z.object({
  user_id: z.string(),
  group_name: z.string().optional(), // 없으면 서버에서 'A'로 처리
});

// 심사 생성 폼 스키마
export const JudgeCreateFormSchema = z.object({
  name: z.string().min(1, "심사 이름을 입력해주세요."),
  description: z.string().min(1, "심사 설명을 입력해주세요."),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  // companies: z.array(CompanyInfoSchema).optional(),
  // users: z.array(UserInfoSchema).optional(),
});

export type JudgeCreateFormType = z.infer<typeof JudgeCreateFormSchema>;
