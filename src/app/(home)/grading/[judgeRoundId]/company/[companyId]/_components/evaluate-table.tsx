"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  judgingRoundQueries,
  evaluationQueries,
  companyQueries,
} from "@/queries";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { useEvaluationMutation } from "../_hooks/useEvaluationMutation";
import { useAutoSaveMutation } from "../_hooks/useAutoSaveMutation";
import { EvaluateTableSkeleton } from "./evaluate-table-skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info, Loader2, CircleDot, CheckCircle2, Ban } from "lucide-react";

type EvaluationStatus = "ONGOING" | "DONE" | null;

type EvaluationItem = {
  id: number;
  grade: number;
  item_name: string;
  points: number;
  description: string | null;
};

type Props = {
  judgeRoundId: string;
  companyId: number;
  isParticipant: boolean;
};

const DEBOUNCE_MS = 1000;

const StatusBadge = ({ status }: { status: EvaluationStatus }) => {
  if (status === "DONE") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle2 size={12} />
        제출 완료
      </span>
    );
  }

  if (status === "ONGOING") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <CircleDot size={12} />
        작성 중
      </span>
    );
  }

  return null;
};

export default function EvaluateTable({
  judgeRoundId,
  companyId,
  isParticipant,
}: Props) {
  const router = useRouter();

  const { data: judgeRound, isLoading: isLoadingJudgeRound } = useQuery(
    judgingRoundQueries.judge(judgeRoundId)
  );
  const { data: existEvaluation, isLoading: isLoadingEvaluation } = useQuery(
    evaluationQueries.byUser(judgeRoundId, companyId)
  );
  const { data: company, isLoading: isLoadingCompany } = useQuery(
    companyQueries.detail(companyId)
  );
  const isLoading =
    isLoadingJudgeRound || isLoadingEvaluation || isLoadingCompany;

  const isJudgingActive = judgeRound?.status === "IN_PROGRESS";
  const canEdit = isParticipant && isJudgingActive;

  const { mutate: submitEvaluation, isPending } = useEvaluationMutation();
  const { mutate: autoSave, isPending: isAutoSaving } = useAutoSaveMutation();

  const [feedback, setFeedback] = useState("");
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [status, setStatus] = useState<EvaluationStatus>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const isInitialized = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 초기 데이터 로드 (최초 마운트 시 1회만)
  useEffect(() => {
    if (isInitialized.current) return;
    if (!judgeRound?.criterias || !existEvaluation?.evaluations) return;

    const initialEvaluations = judgeRound.criterias.map((item) => {
      const existing = existEvaluation.evaluations.find(
        (e) => e.evaluation_criterion_id === item.id
      );
      return { ...item, grade: existing ? Number(existing.grade) : 0 };
    });

    setEvaluations(initialEvaluations);
    setFeedback(existEvaluation.evaluations[0]?.feedback ?? "");
    setStatus(
      (existEvaluation.evaluations[0]?.status as EvaluationStatus) ?? null
    );

    setTimeout(() => {
      isInitialized.current = true;
    }, 0);
  }, [judgeRound, existEvaluation]);

  // 자동 저장
  const triggerAutoSave = useCallback(() => {
    if (!isInitialized.current || !canEdit || evaluations.length === 0) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      autoSave(
        { judgeRoundId, companyId, feedback, evaluations },
        { onSuccess: () => setStatus("ONGOING") }
      );
    }, DEBOUNCE_MS);
  }, [judgeRoundId, companyId, feedback, evaluations, canEdit, autoSave]);

  useEffect(() => {
    triggerAutoSave();
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [triggerAutoSave]);

  const handleInputChange = (id: number, value: string) => {
    const numValue = Number(value);
    if (numValue < 0) return;

    setEvaluations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, grade: Math.min(numValue, item.points) }
          : item
      )
    );
  };

  const handleClose = () => {
    if (canEdit && status === "ONGOING") {
      setShowLeaveDialog(true);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    submitEvaluation(
      { judgeRoundId, companyId, feedback, evaluations },
      { onSuccess: () => setStatus("DONE") }
    );
  };

  const totalScore = evaluations.reduce((sum, item) => sum + item.grade, 0);
  const maxScore = evaluations.reduce((sum, item) => sum + item.points, 0);

  if (isLoading) {
    return <EvaluateTableSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <section className="rounded-lg border bg-white px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          평가 대상 기업
        </p>
        <h2 className="mt-1 text-lg font-semibold text-gray-900">
          {company?.name ?? `기업 ${companyId}`}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {company?.description?.trim() || "기업 소개가 없습니다."}
        </p>
      </section>

      {!isParticipant && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <Info size={16} className="shrink-0" />
          <span>참여 중인 심사가 아니므로 점수를 제출할 수 없습니다.</span>
        </div>
      )}

      {isParticipant && !isJudgingActive && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <Ban size={16} className="shrink-0" />
          <span>
            {judgeRound?.status === "PENDING"
              ? "아직 심사가 시작되지 않았습니다. 심사가 시작되면 평가할 수 있습니다."
              : "심사가 종료되어 점수를 수정하거나 제출할 수 없습니다."}
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 text-sm text-white">
              <th className="px-4 py-3 text-left font-medium">평가 항목</th>
              <th className="px-4 py-3 text-left font-medium">세부 내용</th>
              <th className="w-24 px-4 py-3 text-center font-medium">배점</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {evaluations.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {item.item_name}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    최대 {item.points}점
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {item.description}
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    value={item.grade}
                    max={item.points}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    disabled={!canEdit}
                    className="w-16 rounded-md border px-2 py-1.5 text-center text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 bg-gray-50">
              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                총점
              </td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-center">
                <span className="text-lg font-bold text-blue-600">
                  {totalScore}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  / {maxScore}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">총평</label>
        <Textarea
          placeholder="총 피드백을 입력하세요"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={!canEdit}
          className="resize-none disabled:cursor-not-allowed disabled:bg-gray-100"
          rows={4}
        />
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {isAutoSaving && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            임시 저장 중...
          </span>
        )}
        {!isAutoSaving && <StatusBadge status={status} />}
        <Button variant="outline" onClick={handleClose}>
          닫기
        </Button>
        <LoadingButton
          loading={isPending}
          onClick={handleSubmit}
          disabled={!canEdit}
        >
          제출
        </LoadingButton>
      </div>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>아직 제출하지 않았습니다</AlertDialogTitle>
            <AlertDialogDescription>
              작성 중인 평가가 임시 저장되어 있습니다. 제출하지 않고
              나가시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>계속 작성</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700"
            >
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
