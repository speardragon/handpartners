"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { executeAction, getErrorMessage } from "@/lib/action";
import {
  createJudgeCompanyPdfUploadUrl,
  updateJudgeCompany2,
} from "@/actions/judging_rounds_company-action";
import { updateJudgeUser } from "@/actions/judging_round_user-action";
import { updateJudgeCriteria } from "@/actions/evaluation_criteria-action";
import type {
  SimpleCompany,
  SimpleCriteria,
  SimpleUser,
} from "../_components/JudgeEditForm";
import { judgingQueries, judgingRoundQueries } from "@/queries";

export function useJudgeEditMutations(judgingRoundId: string | undefined) {
  const queryClient = useQueryClient();
  const roundId = judgingRoundId ?? "";

  const usersMutation = useMutation({
    mutationFn: async (users: SimpleUser[]) => {
      await executeAction(
        updateJudgeUser({
          judgingRoundId: roundId,
          users: users.map((u) => ({
            user_id: u.id,
            group_name: u.group_name ?? "",
          })),
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: judgingRoundQueries.users.all(),
      });
      toast.success("심사자 정보를 수정하였습니다.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "심사자 정보를 수정하지 못했습니다."));
    },
  });

  const companiesMutation = useMutation({
    mutationFn: async (companies: SimpleCompany[]) => {
      if (!judgingRoundId) throw new Error("심사 라운드 ID가 없습니다.");

      const updatedList = [...companies];

      for (let i = 0; i < updatedList.length; i++) {
        const c = updatedList[i];
        if (c.pdf_file) {
          const { uploadUrl, publicUrl } = await executeAction(
            createJudgeCompanyPdfUploadUrl({
              fileName: c.pdf_file.name,
              contentType: c.pdf_file.type || "application/pdf",
            })
          );
          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": c.pdf_file.type || "application/pdf" },
            body: c.pdf_file,
          });
          if (!uploadResponse.ok) throw new Error("PDF 업로드에 실패했습니다.");
          updatedList[i] = {
            ...updatedList[i],
            pdf_path: publicUrl,
            original_filename: c.pdf_file.name,
            submitted_at: new Date().toISOString(),
          };
        }
      }

      await executeAction(
        updateJudgeCompany2({
          judgingRoundId,
          companies: updatedList.map((c, i) => ({
            company_id: c.id,
            group_name: c.group_name ?? "",
            pdf_path: c.pdf_path || null,
            judge_num: i + 1,
            original_filename: c.original_filename ?? null,
            submitted_at: c.submitted_at ?? null,
          })),
        })
      );

      return updatedList;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: judgingRoundQueries.companies.all(),
      });
      queryClient.invalidateQueries({
        queryKey: judgingQueries.detailKeyPrefix(),
      });
      toast.success("기업 정보를 수정하였습니다.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "기업 정보를 수정하지 못했습니다."));
    },
  });

  const criteriaMutation = useMutation({
    mutationFn: async (criteriaList: SimpleCriteria[]) => {
      await executeAction(
        updateJudgeCriteria({
          judgingRoundId: roundId,
          criteriaList: criteriaList.map((c) => ({
            id: c.id,
            item_name: c.item_name,
            points: c.points,
            description: c.description ?? null,
          })),
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: judgingRoundQueries.criteria.all(),
      });
      toast.success("심사 기준을 수정하였습니다.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "심사 기준을 수정하지 못했습니다."));
    },
  });

  return { usersMutation, companiesMutation, criteriaMutation };
}
