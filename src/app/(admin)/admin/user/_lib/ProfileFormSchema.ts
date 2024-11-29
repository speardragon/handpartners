import { z } from "zod";

export const ProfileUpdateFormSchema = z.object({
  username: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional(),
  affiliation: z.string().optional(),
  position: z
    .string()
    .max(20, {
      message: "최대 20자입니다.",
    })
    .optional(),
  phone_number: z.string().optional(),
});

export const ProfileCreateFormSchema = z.object({
  username: z.string().min(1, "이름을 입력해주세요."),
  role: z.string().min(1, "구분을 입력해주세요."),
  email: z.string().optional(),
  affiliation: z.string().optional(),
  position: z
    .string()
    .max(20, {
      message: "최대 20자입니다.",
    })
    .optional(),
  phone_number: z.string().optional(),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});
