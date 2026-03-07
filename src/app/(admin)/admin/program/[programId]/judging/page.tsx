"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { judgingQueries, judgingRoundQueries } from "@/queries";
import { getAllJudgeEvaluations } from "@/actions/evaluation-action";
import {
  type JudgingRoundStatus,
  updateJudgingRoundStatus,
} from "@/actions/judging_round-action";
import type { ProgramRow } from "@/actions/program-action";
import {
  getCompanyPdfDownloadUrl,
  getJudgingRoundCompaniesById,
} from "@/actions/judging_rounds_company-action";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Download,
  PlayCircle,
  SquareArrowOutUpRight,
  StopCircle,
} from "lucide-react";
import JudgeEditForm from "../_components/JudgeEditForm";
import ProgramFeatureTabs from "../_components/ProgramFeatureTabs";
import ScoreToExcelButton from "@/app/(home)/_components/ScoreToExcelButton";
import FeedbackToExcelButton from "@/app/(home)/_components/FeedbackToExcelButton";

type Props = {
  params: Promise<{
    programId: string;
  }>;
};

const STATUS_LABEL: Record<JudgingRoundStatus, string> = {
  PENDING: "심사 전",
  IN_PROGRESS: "심사 중",
  COMPLETED: "심사 종료",
};

function ManagementSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-4 p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-10 w-64 rounded-full" />
      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
      <Skeleton className="h-[640px] rounded-2xl" />
    </div>
  );
}

export default function Page({ params }: Props) {
  const { programId } = use(params);
  const programIdNumber = Number(programId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [isBulkPresentationDownloading, setIsBulkPresentationDownloading] =
    useState(false);

  const {
    data: judgingRound,
    isLoading,
    isError,
    error,
  } = useQuery(judgingRoundQueries.byProgram(programIdNumber));

  if (isLoading) {
    return <ManagementSkeleton />;
  }

  if (isError || !judgingRound) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {(error as Error | undefined)?.message ||
            "심사 관리 정보를 불러오지 못했습니다."}
        </div>
      </div>
    );
  }

  const handleStatusChange = async (nextStatus: JudgingRoundStatus) => {
    setIsStatusUpdating(true);

    try {
      await updateJudgingRoundStatus(judgingRound.id, nextStatus);
      queryClient.invalidateQueries({ queryKey: judgingRoundQueries.all() });
      queryClient.invalidateQueries({ queryKey: judgingQueries.all() });
      toast.success(
        `심사 상태가 "${STATUS_LABEL[nextStatus]}"(으)로 변경되었습니다.`
      );
    } catch {
      toast.error("심사 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleBulkDownload = async () => {
    setIsBulkDownloading(true);

    try {
      const judgeEvaluations = await getAllJudgeEvaluations(judgingRound.id);

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
        id: judgingRound.program.id,
        name: judgingRound.program.name,
        description: judgingRound.program.description,
        start_date: judgingRound.start_date,
        end_date: judgingRound.end_date,
        categories: null,
        created_at: "",
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
    } catch {
      toast.error("보고서 다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsBulkDownloading(false);
    }
  };

  const handleBulkPresentationDownload = async () => {
    setIsBulkPresentationDownloading(true);

    try {
      const companies = await getJudgingRoundCompaniesById(judgingRound.id);
      const companiesWithPdf = companies.filter((company) => company.pdf_path);

      if (companiesWithPdf.length === 0) {
        toast.error("다운로드할 발표자료가 없습니다.");
        return;
      }

      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);

      const zip = new JSZip();

      await Promise.all(
        companiesWithPdf.map(async (company) => {
          try {
            const { downloadUrl } = await getCompanyPdfDownloadUrl(
              company.pdf_path!
            );
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error("Network response was not ok");

            const blob = await response.blob();
            const fileName =
              company.original_filename ||
              `${company.company?.name || "기업"}_발표자료.pdf`;

            zip.file(fileName, blob);
          } catch (error) {
            console.error(
              `Failed to download pdf for company ${company.company_id}:`,
              error
            );
          }
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const date = new Date().toISOString().split("T")[0];
      saveAs(zipBlob, `발표자료_${date}.zip`);
      toast.success("발표자료 일괄 다운로드가 완료되었습니다.");
    } catch {
      toast.error("발표자료 다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsBulkPresentationDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-neutral-600"
          onClick={() => router.push("/admin/program")}
        >
          <ArrowLeft className="h-4 w-4" />
          프로그램 목록
        </Button>
        <ProgramFeatureTabs programId={programIdNumber} current="judging" />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.75fr)_360px]">
        <section className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm">
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1.7fr)_300px]">
            <div className="p-6 sm:p-7">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                    Program Judging
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-neutral-950">
                    {judgingRound.program.name}
                  </h1>
                </div>
                <p className="max-w-3xl text-sm leading-6 text-neutral-600">
                  {judgingRound.program.description?.trim() ||
                    "프로그램 설명이 아직 등록되지 않았습니다."}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="justify-between gap-2 bg-white"
                    onClick={() => router.push(`/admin/${judgingRound.id}`)}
                  >
                    <span>심사 결과 확인</span>
                    <SquareArrowOutUpRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-between gap-2 bg-white"
                    onClick={() => router.push(`/judging/${judgingRound.id}`)}
                  >
                    <span>심사 페이지로 이동</span>
                    <SquareArrowOutUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 bg-neutral-50/80 p-6 sm:p-7 xl:border-l xl:border-t-0">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                관리 요약
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    심사 상태
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {STATUS_LABEL[judgingRound.status]}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    운영 기간
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
                    <CalendarDays className="h-4 w-4 text-neutral-400" />
                    {judgingRound.start_date || "-"} ~{" "}
                    {judgingRound.end_date || "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    심사 ID
                  </p>
                  <p className="mt-2 text-sm font-medium text-neutral-900">
                    {judgingRound.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 sm:grid-cols-3 sm:p-7">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                운영 기간
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {judgingRound.start_date || "-"} ~{" "}
                {judgingRound.end_date || "-"}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                참여 기업
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {judgingRound.number_of_companies}개
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                심사자
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {judgingRound.number_of_users}명
              </p>
            </div>
          </div>
        </section>

        <section className="self-start rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                Actions
              </p>
              <h2 className="mt-2 text-lg font-semibold text-neutral-950">
                심사 상태 및 이동
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                참여 기업, 심사자, 기준을 구성한 뒤 이 화면에서 심사 상태를 바로
                전환할 수 있습니다.
              </p>
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  상태 변경
                </p>
                {judgingRound.status === "PENDING" && (
                  <LoadingButton
                    className="w-full gap-2"
                    loading={isStatusUpdating}
                    onClick={() => handleStatusChange("IN_PROGRESS")}
                  >
                    <PlayCircle className="h-4 w-4" />
                    심사 시작
                  </LoadingButton>
                )}

                {judgingRound.status === "IN_PROGRESS" && (
                  <>
                    <LoadingButton
                      variant="outline"
                      className="w-full gap-2"
                      loading={isStatusUpdating}
                      onClick={() => handleStatusChange("PENDING")}
                    >
                      <Clock3 className="h-4 w-4" />
                      심사 전으로
                    </LoadingButton>
                    <LoadingButton
                      className="w-full gap-2 bg-red-600 hover:bg-red-700"
                      loading={isStatusUpdating}
                      onClick={() => handleStatusChange("COMPLETED")}
                    >
                      <StopCircle className="h-4 w-4" />
                      심사 종료
                    </LoadingButton>
                  </>
                )}

                {judgingRound.status === "COMPLETED" && (
                  <LoadingButton
                    variant="outline"
                    className="w-full gap-2"
                    loading={isStatusUpdating}
                    onClick={() => handleStatusChange("IN_PROGRESS")}
                  >
                    <PlayCircle className="h-4 w-4" />
                    심사 재개
                  </LoadingButton>
                )}
              </div>

              <div className="space-y-2 border-t border-neutral-100 pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  내보내기
                </p>
                <LoadingButton
                  variant="outline"
                  className="w-full gap-2"
                  loading={isBulkDownloading}
                  onClick={handleBulkDownload}
                >
                  <Download className="h-4 w-4" />
                  심사보고서 ZIP 저장
                </LoadingButton>
                <LoadingButton
                  variant="outline"
                  className="w-full gap-2"
                  loading={isBulkPresentationDownloading}
                  onClick={handleBulkPresentationDownload}
                >
                  <Download className="h-4 w-4" />
                  발표자료 ZIP 저장
                </LoadingButton>
                <ScoreToExcelButton
                  judgingRoundId={judgingRound.id}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
                />
                <FeedbackToExcelButton
                  judgingRoundId={judgingRound.id}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <JudgeEditForm
        programId={programIdNumber}
        judgingRoundId={judgingRound.id}
        overview={{
          programName: judgingRound.program.name,
          programDescription: judgingRound.program.description,
          startDate: judgingRound.start_date,
          endDate: judgingRound.end_date,
          status: judgingRound.status,
          companyCount: judgingRound.number_of_companies,
          judgeCount: judgingRound.number_of_users,
        }}
      />
    </div>
  );
}
