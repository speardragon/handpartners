"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Shield,
  SquareArrowOutUpRight,
  Download,
  PlayCircle,
  StopCircle,
  Clock,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { getAllJudgeEvaluations } from "@/actions/evaluation-action";
import type { ProgramRow } from "@/actions/program-action";
import {
  updateJudgingRoundStatus,
  type JudgingRoundStatus,
} from "@/actions/judging_round-action";
import { sendJudgingEmails, getJudgeEmailCount } from "@/actions/email-action";
import { useQueryClient } from "@tanstack/react-query";
import { judgingQueries, judgingRoundQueries } from "@/queries";
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

interface AdminPanelProps {
  judgingRoundId: string;
  programId: number;
  programName: string;
  currentStatus: JudgingRoundStatus;
}

const STATUS_LABEL: Record<JudgingRoundStatus, string> = {
  PENDING: "심사 전",
  IN_PROGRESS: "심사 중",
  COMPLETED: "심사 종료",
};

const StatusBadge = ({ status }: { status: JudgingRoundStatus }) => {
  const styles: Record<JudgingRoundStatus, string> = {
    PENDING: "bg-gray-100 text-gray-600",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
  };
  const icons: Record<JudgingRoundStatus, React.ReactNode> = {
    PENDING: <Clock size={12} />,
    IN_PROGRESS: <PlayCircle size={12} />,
    COMPLETED: <StopCircle size={12} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {icons[status]}
      {STATUS_LABEL[status]}
    </span>
  );
};

export default function AdminPanel({
  judgingRoundId,
  programId,
  programName,
  currentStatus,
}: AdminPanelProps) {
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [status, setStatus] = useState<JudgingRoundStatus>(currentStatus);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailCount, setEmailCount] = useState<{
    total: number;
    withEmail: number;
  } | null>(null);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusChange = async (nextStatus: JudgingRoundStatus) => {
    setIsUpdatingStatus(true);
    try {
      await updateJudgingRoundStatus(judgingRoundId, nextStatus);
      setStatus(nextStatus);
      queryClient.invalidateQueries({
        queryKey: judgingQueries.detailKeyPrefix(),
      });
      queryClient.invalidateQueries({
        queryKey: judgingQueries.all(),
      });
      queryClient.invalidateQueries({
        queryKey: judgingRoundQueries.all(),
      });
      toast.success(
        `심사 상태가 "${STATUS_LABEL[nextStatus]}"(으)로 변경되었습니다.`
      );
    } catch {
      toast.error("상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEmailDialogOpen = async () => {
    try {
      const count = await getJudgeEmailCount(judgingRoundId);
      setEmailCount(count);
      setEmailDialogOpen(true);
    } catch {
      toast.error("심사자 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleSendEmails = async () => {
    setEmailDialogOpen(false);
    setIsEmailSending(true);
    try {
      const result = await sendJudgingEmails(judgingRoundId);
      if (result.failedCount === 0) {
        toast.success(
          `${result.sentCount}명의 심사자에게 이메일을 발송했습니다.`
        );
      } else {
        toast.warning(
          `${result.sentCount}명 발송 성공, ${result.failedCount}명 발송 실패`
        );
      }
    } catch {
      toast.error("이메일 발송 중 오류가 발생했습니다.");
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleBulkDownload = async () => {
    setIsDownloading(true);
    try {
      const judgeEvaluations = await getAllJudgeEvaluations(judgingRoundId);

      if (judgeEvaluations.length === 0) {
        toast.error("다운로드할 심사 데이터가 없습니다.");
        return;
      }

      const [{ pdf }, { default: JSZip }, { saveAs }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("jszip"),
        import("file-saver"),
      ]);

      const { default: EvaluationDocument } =
        await import("@/app/(home)/_components/EvaluationDocument");

      const zip = new JSZip();

      const programInfo = {
        id: programId,
        name: programName,
      } as ProgramRow;

      for (const judge of judgeEvaluations) {
        if (judge.evaluations.length === 0) continue;

        const blob = await pdf(
          <EvaluationDocument
            programInfo={programInfo}
            evaluationReport={judge.evaluations}
          />
        ).toBlob();

        zip.file(`${judge.username}_심사보고서.pdf`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const date = new Date().toISOString().split("T")[0];
      saveAs(zipBlob, `심사보고서_${date}.zip`);

      toast.success("보고서 일괄 다운로드가 완료되었습니다.");
    } catch (error) {
      toast.error("보고서 다운로드 중 오류가 발생했습니다.");
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50/50 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Shield size={14} className="text-blue-600" />
        <h2 className="text-sm font-semibold text-blue-700">관리자 전용</h2>
      </div>

      <div className="rounded-md border border-blue-100 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">현재 상태</p>
            <StatusBadge status={status} />
          </div>
          <div className="flex items-center gap-2">
            {status === "PENDING" && (
              <LoadingButton
                size="sm"
                loading={isUpdatingStatus}
                onClick={() => handleStatusChange("IN_PROGRESS")}
                className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
              >
                <PlayCircle size={14} />
                심사 시작
              </LoadingButton>
            )}
            {status === "IN_PROGRESS" && (
              <>
                <LoadingButton
                  size="sm"
                  variant="outline"
                  loading={isUpdatingStatus}
                  onClick={() => handleStatusChange("PENDING")}
                  className="gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Clock size={14} />
                  심사 전으로
                </LoadingButton>
                <LoadingButton
                  size="sm"
                  loading={isUpdatingStatus}
                  onClick={() => handleStatusChange("COMPLETED")}
                  className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                >
                  <StopCircle size={14} />
                  심사 종료
                </LoadingButton>
              </>
            )}
            {status === "COMPLETED" && (
              <LoadingButton
                size="sm"
                variant="outline"
                loading={isUpdatingStatus}
                onClick={() => handleStatusChange("IN_PROGRESS")}
                className="gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <PlayCircle size={14} />
                심사 재개
              </LoadingButton>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={() =>
            window.open(`/admin/program/${programId}/judging`, "_blank")
          }
        >
          <SquareArrowOutUpRight size={14} />
          심사 관리
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={() => window.open(`/admin/${judgingRoundId}`, "_blank")}
        >
          <SquareArrowOutUpRight size={14} />
          심사 현황 보기
        </Button>
        <LoadingButton
          variant="outline"
          className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
          loading={isDownloading}
          onClick={handleBulkDownload}
        >
          <Download size={14} />
          보고서 일괄 다운로드
        </LoadingButton>
        <LoadingButton
          variant="outline"
          className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
          loading={isEmailSending}
          disabled={status !== "IN_PROGRESS"}
          onClick={handleEmailDialogOpen}
        >
          <Mail size={14} />
          심사자 이메일 발송
        </LoadingButton>
      </div>

      <AlertDialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>심사자 이메일 발송</AlertDialogTitle>
            <AlertDialogDescription>
              {emailCount
                ? `${emailCount.withEmail}명의 심사자에게 심사 링크를 이메일로 발송합니다.${
                    emailCount.total !== emailCount.withEmail
                      ? ` (이메일 미등록: ${emailCount.total - emailCount.withEmail}명)`
                      : ""
                  }`
                : "심사자 정보를 확인하는 중..."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendEmails}>
              발송
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
