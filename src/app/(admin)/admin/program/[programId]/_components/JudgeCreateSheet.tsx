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
import {
  JudgeCreateFormSchema,
  JudgeCreateFormType,
} from "../_lib/JudgeFormSchema";
import { createJudgingRound } from "@/actions/judging_round-action";
import { useQueryClient } from "@tanstack/react-query";
import { judgingRoundQueries } from "@/queries";

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
  const queryClient = useQueryClient();
  const { createOpen, setCreateOpen } = useDialogOpenStore((state) => state);

  const form = useForm<JudgeCreateFormType>({
    resolver: zodResolver(JudgeCreateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: JudgeCreateType) => {
    try {
      await createJudgingRound({ ...data, program_id: programId });
      queryClient.invalidateQueries({ queryKey: judgingRoundQueries.all() });
      toast.success("새로운 심사가 생성되었습니다.");
      setCreateOpen(false);
    } catch (error: any) {
      toast.error(error.message || "오류가 발생했습니다.");
    }
  };

  return (
    <Sheet open={createOpen} onOpenChange={setCreateOpen}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg lg:max-w-2xl">
        <SheetHeader className="border-b border-neutral-100 px-6 py-4">
          <SheetTitle>심사 추가</SheetTitle>
          <SheetDescription>새로운 심사를 생성합니다.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 p-6"
          >
            <section className="rounded-lg border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-neutral-900">
                  심사 정보
                </h3>
              </div>
              <div className="space-y-4 p-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">
                        심사 이름
                      </FormLabel>
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
                      <FormLabel className="text-neutral-700">
                        심사 설명
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="심사에 대한 설명을 입력해주세요."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700">
                          시작일
                        </FormLabel>
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
                        <FormLabel className="text-neutral-700">
                          종료일
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              심사 생성
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
