import { z } from "zod";

export const ProgramUpdateFormSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  categories: z.array(z.string()),
});

export const ProgramCreateFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  description: z.string().min(1, "구분을 입력해주세요."),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  categories: z.array(z.string()),
});
