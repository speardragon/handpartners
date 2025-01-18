"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useCallback, useState } from "react";
import {
  JudgeUpdateFormSchema,
  JudgeUpdateFormType,
} from "../_lib/JudgeFormSchema";
import JudgeCompanySelect from "./JudgeCompanySelect";
import JudgeUserSelect from "./JudgeUserSelect";
import { v4 as uuidv4 } from "uuid";

// ************** 변경된 부분: updateJudgeBasic, updateJudgeUser는 객체로 전달 **************
import { updateJudgeBasic } from "@/actions/judging_round-action";
import {
  updateJudgeCompany,
  updateJudgeCompany2,
} from "@/actions/judging_rounds_company-action";
import { updateJudgeUser } from "@/actions/judging_round_user-action";
import JudgeCriteriaSelect from "./JudgeCriteriaSelect";
import { updateJudgeCriteria } from "@/actions/evaluation_criteria-action";
import { Database } from "types_db";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

// (참고) 기존 sanitizeFileName 등 필요한 함수/타입들
function sanitizeFileName(originalName: string) {
  return originalName.replace(/[^a-zA-Z0-9.\-]/g, "");
}

type Props = {
  programId: number;
  judgingRoundId?: number;
  judgingRoundInfo: JudgeUpdateFormType;
  setOpenEdit: (open: boolean) => void;
};

export interface SimpleCompany {
  id: number;
  name: string;
  pdf_file?: File;
  pdf_path?: string;
  group_name?: string;
}
export interface SimpleUser {
  id: string;
  name: string;
  affiliation: string;
  group_name?: string;
}

// ★ 심사 기준 타입
export interface SimpleCriteria {
  id?: number;
  item_name: string;
  points: number;
  description?: string | null;
}

export default function JudgeEditForm({
  programId,
  judgingRoundId,
  judgingRoundInfo,
  setOpenEdit,
}: Props) {
  const supabaseClient = createBrowserSupabaseClient();
  const queryClient = useQueryClient();

  const [targetList, setTargetList] = useState<SimpleCompany[]>([]);
  const [targetUserList, setTargetUserList] = useState<SimpleUser[]>([]);
  const [pdfEditMap, setPdfEditMap] = useState<Record<number, boolean>>({});

  // (B) 심사 기준 상태
  const [targetCriteriaList, setTargetCriteriaList] = useState<
    SimpleCriteria[]
  >([]);

  // -------------- 기본 정보 Form 설정 --------------
  const form = useForm<JudgeUpdateFormType>({
    resolver: zodResolver(JudgeUpdateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: judgingRoundInfo.name ?? "",
      description: judgingRoundInfo.description ?? "",
      start_date: judgingRoundInfo.start_date ?? "",
      end_date: judgingRoundInfo.end_date ?? "",
    },
  });

  const handleUserListChange = useCallback((newList: SimpleUser[]) => {
    setTargetUserList(newList);
  }, []);

  // ---------------------------------------------------------------------------
  //  (1) 기본 정보 업데이트 → 객체 payload로 updateJudgeBasic 호출
  // ---------------------------------------------------------------------------
  const handleSubmitBasic = async (data: JudgeUpdateFormType) => {
    try {
      // ★★★ 변경: FormData 대신 객체를 만든다.
      const payload = {
        judgingRoundId: judgingRoundId ?? 0,
        name: data.name ?? "",
        description: data.description ?? "",
        start_date: data.start_date ?? "",
        end_date: data.end_date ?? "",
      };

      const result = await updateJudgeBasic(payload);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["judging_rounds"] });
        toast.success("기본 심사 정보를 수정하였습니다.");
      } else {
        toast.error("기본 정보 수정 중 오류가 발생했습니다.");
      }
    } catch (error: any) {
      toast.error(`업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  // ---------------------------------------------------------------------------
  //  (2) 기업 정보 업데이트 → PDF 처리가 있어 FormData 유지
  // ---------------------------------------------------------------------------
  // const handleSubmitCompanies = async () => {
  //   try {
  //     // PDF 파일 처리를 위해 기존대로 FormData 사용
  //     const formData = new FormData();
  //     formData.append("judgingRoundId", String(judgingRoundId ?? ""));

  //     // company payload
  //     const companiesPayload = targetList.map((c) => ({
  //       company_id: c.id,
  //       group_name: c.group_name ?? "",
  //     }));
  //     formData.append("companies", JSON.stringify(companiesPayload));

  //     // 파일들 (index 일치)
  //     targetList.forEach((c, i) => {
  //       if (c.pdf_file) {
  //         const sanitizedName = sanitizeFileName(c.pdf_file.name);
  //         const renamedFile = new File([c.pdf_file], sanitizedName, {
  //           type: c.pdf_file.type,
  //         });
  //         formData.append(`files[${i}]`, renamedFile);
  //       }
  //     });

  //     const result = await updateJudgeCompany(formData);
  //     if (result.success) {
  //       queryClient.invalidateQueries({
  //         queryKey: ["judging_round_companies"],
  //       });
  //       queryClient.invalidateQueries({ queryKey: ["judging_round_users"] });
  //       toast.success("기업 정보를 수정하였습니다.");
  //     } else {
  //       toast.error("기업 정보 수정 중 오류가 발생했습니다.");
  //     }
  //   } catch (error: any) {
  //     toast.error(`기업 업데이트 중 오류가 발생했습니다: ${error.message}`);
  //   }
  // };

  // ---------------------------------------------------------------------------
  //  (3) 사용자(심사자) 정보 업데이트 → 객체 payload로 updateJudgeUser 호출
  // ---------------------------------------------------------------------------
  const handleSubmitUsers = async () => {
    try {
      // ★★★ 변경: FormData 대신 객체를 만든다.
      const payload = {
        judgingRoundId: judgingRoundId ?? 0,
        users: targetUserList.map((u) => ({
          user_id: u.id,
          group_name: u.group_name ?? "",
        })),
      };

      const result = await updateJudgeUser(payload);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["judging_round_users"] });
        toast.success("심사자 정보를 수정하였습니다.");
      } else {
        toast.error("심사자 정보 수정 중 오류가 발생했습니다.");
      }
    } catch (error: any) {
      toast.error(`사용자 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  // 기업 PDF 수정 모드 토글
  const handleClickPdfEdit = (companyId: number) => {
    setPdfEditMap((prev) => ({
      ...prev,
      [companyId]: true,
    }));
  };

  // 기업 PDF file change
  const handleFileChange = (index: number, file?: File) => {
    setTargetList((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], pdf_file: file };
      return newArr;
    });
  };

  // 기업 group_name change
  const handleGroupChange = (index: number, value: string) => {
    setTargetList((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], group_name: value };
      return newArr;
    });
  };

  // 사용자 group_name change
  const handleUserGroupChange = (index: number, value: string) => {
    setTargetUserList((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], group_name: value };
      return newArr;
    });
  };

  const handleSubmitCompanies = async () => {
    try {
      // 1) 클라이언트에서 Supabase에 직접 업로드
      //    (기존 FormData로 보내지 않는다!)
      const updatedList = [...targetList]; // 복사본

      for (let i = 0; i < updatedList.length; i++) {
        const c = updatedList[i];
        if (c.pdf_file) {
          // 파일이 새로 선택된 경우만 업로드
          const sanitizedName = sanitizeFileName(c.pdf_file.name);
          const uniqueId = uuidv4();
          const fileName = `${Date.now()}-${uniqueId}-${sanitizedName}`;
          const filePath = `judging-round-pdfs/${fileName}`;

          const { error: storageError } = await supabaseClient.storage
            .from("handpartners")
            .upload(filePath, c.pdf_file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (storageError) {
            console.error("Storage upload error:", storageError);
            throw new Error(storageError.message);
          }

          // public URL 생성
          const { data: publicUrlData } = supabaseClient.storage
            .from("handpartners")
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            // 업로드 성공 시 local state에 pdf_path 저장
            updatedList[i] = {
              ...updatedList[i],
              pdf_path: publicUrlData.publicUrl,
            };
          }
        }
      }

      // 2) 모든 업로드가 끝났으면, DB에 반영할 최종 정보만 Server Action에 전달
      //    Server Action으로는 큰 파일이 아니라 { judgingRoundId, companies }만 보냄
      const companiesPayload = updatedList.map((c) => ({
        company_id: c.id,
        group_name: c.group_name ?? "",
        pdf_path: c.pdf_path || null,
      }));

      const payload = {
        judgingRoundId: judgingRoundId ?? 0,
        companies: companiesPayload,
      };

      const result = await updateJudgeCompany2(payload);

      if (result.success) {
        setTargetList(updatedList); // state 갱신
        queryClient.invalidateQueries({
          queryKey: ["judging_round_companies"],
        });
        toast.success("기업 정보를 수정하였습니다.");
      } else {
        toast.error("기업 정보 수정 중 오류가 발생했습니다.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`기업 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  // ------------------------------------------------------------------
  // (4) 심사 기준 배점 설정 → 객체 payload
  // ------------------------------------------------------------------
  const handleSubmitCriteria = async () => {
    try {
      const payload = {
        judgingRoundId: judgingRoundId ?? 0,
        criteriaList: targetCriteriaList.map((c) => ({
          id: c.id,
          item_name: c.item_name,
          points: c.points,
          description: c.description ?? null,
        })),
      };

      const result = await updateJudgeCriteria(payload);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["judging_round_criteria"] });
        toast.success("심사 기준을 수정하였습니다.");
      } else {
        toast.error("심사 기준 수정 중 오류가 발생했습니다.");
      }
    } catch (error: any) {
      toast.error(
        `심사 기준 업데이트 중 오류가 발생했습니다: ${error.message}`
      );
    }
  };

  // ----------------------------------------------------------------
  // render
  // ----------------------------------------------------------------
  return (
    <div className="flex flex-col space-y-8">
      {/* -------------------- (1) 기본 정보 수정 Form -------------------- */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitBasic)}
          className="items-start w-full space-y-6"
        >
          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center">
              <div className="w-1/3 text-gray-800">심사 이름</div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormControl>
                      <Input
                        className="w-full border-gray-400"
                        placeholder="심사 이름을 입력해주세요."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* 설명 */}
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
            {/* 시작일 */}
            <div className="flex justify-between items-center">
              <div className="w-1/3 text-gray-800">시작일</div>
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormControl>
                      <Input className="w-full" type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* 종료일 */}
            <div className="flex justify-between items-center">
              <div className="w-1/3 text-gray-800">종료일</div>
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormControl>
                      <Input className="w-full" type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex w-full justify-end">
            {/* 기본 정보만 업데이트 */}
            <Button type="submit">기본 정보 수정</Button>
          </div>
        </form>
      </Form>

      <Separator />

      {/* -------------------- (2) 기업 정보 수정 영역 -------------------- */}
      <div className="flex flex-col space-y-2">
        <div className="font-medium mb-2">심사 참여 기업</div>
        <JudgeCompanySelect
          judgingRoundId={judgingRoundId}
          programId={programId}
          targetList={targetList}
          onTargetListChange={setTargetList}
        />

        {/* 기업별 PDF, group_name 입력 */}
        <div className="h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
          {targetList.length === 0 && (
            <div className="text-gray-500">아직 추가된 기업이 없습니다.</div>
          )}
          {targetList.map((item, index) => {
            const pdfPathExists = !!item.pdf_path;
            const isEditMode = pdfEditMap[item.id] === true;

            return (
              <div
                key={item.id}
                className="flex items-center gap-2 border p-3 rounded-md mb-2"
              >
                {/* 기업명 */}
                <div className="w-24">
                  <p className="text-sm font-medium">{item.name}</p>
                </div>

                {/* PDF */}
                <div className="flex-1">
                  {pdfPathExists && !isEditMode ? (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleClickPdfEdit(item.id)}
                    >
                      PDF 수정
                    </Button>
                  ) : (
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        handleFileChange(index, file);
                      }}
                    />
                  )}
                </div>

                {/* group_name */}
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="그룹 이름(ex. A)"
                    value={item.group_name ?? ""}
                    onChange={(e) => handleGroupChange(index, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex w-full justify-end">
          {/* 기업 정보만 업데이트 (PDF 파일 때문에 FormData 유지) */}
          <Button type="button" onClick={handleSubmitCompanies}>
            기업 정보 수정
          </Button>
        </div>
      </div>

      <Separator />

      {/* -------------------- (3) 사용자(심사자) 정보 수정 영역 -------------------- */}
      <div className="flex flex-col space-y-2">
        <div className="font-medium mb-2">심사자 정보</div>
        <JudgeUserSelect
          judgingRoundId={judgingRoundId}
          targetList={targetUserList}
          onTargetListChange={handleUserListChange}
        />

        {/* 사용자별 group_name 입력 */}
        <div className="h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
          {targetUserList.length === 0 && (
            <div className="text-gray-500">아직 추가된 심사자가 없습니다.</div>
          )}
          {targetUserList.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center gap-2 border p-3 rounded-md mb-2"
            >
              {/* 사용자 이름 */}
              <div className="w-24">
                <p className="text-sm font-medium">{user.name}</p>
              </div>

              {/* group_name */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="그룹 이름(ex. A)"
                  value={user.group_name ?? ""}
                  onChange={(e) => handleUserGroupChange(index, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full justify-end">
          {/* 사용자(심사자) 정보만 업데이트 → 객체 전달 */}
          <Button type="button" onClick={handleSubmitUsers}>
            심사자 정보 수정
          </Button>
        </div>
      </div>

      {/* -------------------- (4) 심사 기준 배점 설정 영역 -------------------- */}
      <div className="flex flex-col space-y-2">
        <div className="font-medium mb-2">심사 기준 배점 설정</div>
        <JudgeCriteriaSelect
          judgingRoundId={judgingRoundId}
          targetList={targetCriteriaList}
          onTargetListChange={setTargetCriteriaList}
        />

        <div className="flex w-full justify-end">
          <Button type="button" onClick={handleSubmitCriteria}>
            심사 기준 수정
          </Button>
        </div>
      </div>
    </div>
  );
}
