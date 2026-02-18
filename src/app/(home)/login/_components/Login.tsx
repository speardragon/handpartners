"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import HandPartnersLogo from "../../../../../public/images/handpartners_logo.png";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "../_hooks/useLoginMutation";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
  isAgree: z
    .boolean()
    .refine((val) => val === true, { message: "약관에 동의해야 합니다." }),
  password: z
    .string()
    .min(2, { message: "비밀번호는 2자 이상 20자 이하입니다." })
    .max(20, { message: "비밀번호는 2자 이상 20자 이하입니다." }),
});

export default function Login() {
  const { mutate } = useLoginMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      isAgree: false,
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password } = data;
    mutate({ email, password });
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 py-16">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[600px] flex-col items-center border bg-white shadow-lg"
        >
          <div className="flex flex-col items-center justify-center space-y-2 p-4 px-8">
            <Image className="w-64" src={HandPartnersLogo} alt="logo" />
            <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
              <div className="mb-4 text-xl font-bold">비밀유지 서약</div>
              <div className="text-center">
                본 심사위원은 (주) 핸드파트너스가 주관하는 프로그램에 출품된
                아이디어가 출품자의 지식재산임을 인정합니다. 심사과정에서 열람한
                내용을 출품자의 서면 허락없이 사용하거나 외부에 발설하는 등
                출품자의 지식재산권을 침해 할 만한 행위를 하지 않겠으며, 이로
                인한 법적 문제 발생 시 민·형사상 책임을 지도록 하겠습니다.
                <br />
              </div>
            </div>
            <FormField
              control={form.control}
              name="isAgree"
              render={({ field }) => (
                <FormItem className="flex w-full flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>위 비밀유지 서약에 동의합니다.</FormLabel>
                    <FormDescription>
                      You can manage your mobile notifications in the
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex w-full flex-col gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="이메일 주소" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="mt-4 w-full" type="submit">
              로그인
            </Button>
            <Link
              href="/upload"
              className="text-sm text-muted-foreground hover:underline"
            >
              발표 자료 업로드하기
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
