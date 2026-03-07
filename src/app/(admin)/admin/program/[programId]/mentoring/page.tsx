"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mentoringQueries } from "@/queries";
import {
  type MentoringStatus,
  updateMentoringStatus,
} from "@/actions/mentoring-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Clock3,
  Download,
  FileText,
  PlayCircle,
  SquareArrowOutUpRight,
  StopCircle,
} from "lucide-react";
import ProgramFeatureTabs from "../_components/ProgramFeatureTabs";
import MentoringEditForm from "../_components/MentoringEditForm";
import MentoringSessionDocument from "@/app/(home)/mentoring/[mentoringId]/_components/MentoringSessionDocument";

type Props = {
  params: Promise<{
    programId: string;
  }>;
};

const STATUS_LABEL: Record<MentoringStatus, string> = {
  PENDING: "진행 전",
  IN_PROGRESS: "진행 중",
  COMPLETED: "종료",
};

function ManagementSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-4 p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-10 w-28" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.75fr)_360px]">
        <Skeleton className="h-72 rounded-7" />
        <Skeleton className="h-80 rounded-7" />
      </div>
      <Skeleton className="h-240 rounded-7" />
    </div>
  );
}

export default function Page({ params }: Props) {
  const { programId } = use(params);
  const programIdNumber = Number(programId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isBulkReportDownloading, setIsBulkReportDownloading] = useState(false);
  const [isSingleReportDownloading, setIsSingleReportDownloading] =
    useState(false);
  const [selectedReportSessionId, setSelectedReportSessionId] = useState("");

  const {
    data: mentoring,
    isLoading,
    isError,
    error,
  } = useQuery(mentoringQueries.byProgram(programIdNumber));

  const { data: mentoringDetail } = useQuery({
    ...mentoringQueries.detail(mentoring?.id ?? ""),
    enabled: Boolean(mentoring?.id),
  });

  const selectedReportSession = useMemo(() => {
    if (!mentoringDetail || mentoringDetail.sessions.length === 0) {
      return null;
    }

    if (!selectedReportSessionId) {
      return mentoringDetail.sessions[0] ?? null;
    }

    return (
      mentoringDetail.sessions.find(
        (session) => String(session.id) === selectedReportSessionId
      ) ?? null
    );
  }, [mentoringDetail, selectedReportSessionId]);

  if (isLoading) {
    return <ManagementSkeleton />;
  }

  if (isError || !mentoring) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {(error as Error | undefined)?.message ||
            "멘토링 관리 정보를 불러오지 못했습니다."}
        </div>
      </div>
    );
  }

  const handleStatusChange = async (nextStatus: MentoringStatus) => {
    setIsStatusUpdating(true);

    try {
      await updateMentoringStatus(mentoring.id, nextStatus);
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
      toast.success(
        `멘토링 상태가 "${STATUS_LABEL[nextStatus]}"(으)로 변경되었습니다.`
      );
    } catch {
      toast.error("멘토링 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const buildSessionFileName = (
    companyName: string,
    sessionNo: number,
    date: string
  ) => `${companyName}_멘토링일지_${sessionNo}회차_${date.slice(0, 10)}.pdf`;

  const createSessionReportBlob = async (sessionId: number) => {
    if (!mentoringDetail) {
      throw new Error("멘토링 세부 정보를 불러오는 중입니다.");
    }

    const session = mentoringDetail.sessions.find(
      (item) => item.id === sessionId
    );
    if (!session) {
      throw new Error("멘토링 세션을 찾을 수 없습니다.");
    }

    const company = mentoringDetail.assignments.find(
      (item) => item.company_id === session.company_id
    );

    const companyName = company?.company_name ?? session.company_name;
    const companyDescription = company?.company_description ?? null;
    const representativeName = company?.representative_name ?? null;

    const { pdf } = await import("@react-pdf/renderer");

    const blob = await pdf(
      <MentoringSessionDocument
        programName={mentoring.program.name}
        companyName={companyName}
        companyDescription={companyDescription}
        representativeName={representativeName}
        mentorName={session.mentor_name}
        mentorAffiliation={
          session.mentor_affiliation ?? company?.mentor_affiliation ?? null
        }
        mentorPosition={
          session.mentor_position ?? company?.mentor_position ?? null
        }
        mentorSignatureUrl={session.mentor_signature_url}
        logoUrl={mentoring.report_logo_url}
        sessionNo={session.session_no}
        mentoredAt={session.mentored_at}
        place={session.place}
        content={session.content}
        photos={session.photos}
      />
    ).toBlob();

    return {
      blob,
      fileName: buildSessionFileName(
        companyName,
        session.session_no,
        session.mentored_at
      ),
    };
  };

  const handleSingleReportDownload = async () => {
    if (!selectedReportSession) {
      toast.error("저장할 멘토링 세션이 없습니다.");
      return;
    }

    setIsSingleReportDownloading(true);
    try {
      const [{ saveAs }, reportFile] = await Promise.all([
        import("file-saver"),
        createSessionReportBlob(selectedReportSession.id),
      ]);

      saveAs(reportFile.blob, reportFile.fileName);
      toast.success("멘토링 보고서를 저장했습니다.");
    } catch (downloadError) {
      console.error(downloadError);
      toast.error("멘토링 보고서 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSingleReportDownloading(false);
    }
  };

  const handleBulkReportDownload = async () => {
    if (!mentoringDetail || mentoringDetail.sessions.length === 0) {
      toast.error("저장할 멘토링 보고서가 없습니다.");
      return;
    }

    setIsBulkReportDownloading(true);
    try {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);

      const zip = new JSZip();

      for (const session of mentoringDetail.sessions) {
        const reportFile = await createSessionReportBlob(session.id);
        zip.file(reportFile.fileName, reportFile.blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const date = new Date().toISOString().slice(0, 10);
      saveAs(zipBlob, `멘토링보고서_${mentoring.program.name}_${date}.zip`);
      toast.success("멘토링 보고서 일괄 저장이 완료되었습니다.");
    } catch (downloadError) {
      console.error(downloadError);
      toast.error("멘토링 보고서 일괄 저장 중 오류가 발생했습니다.");
    } finally {
      setIsBulkReportDownloading(false);
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
        <ProgramFeatureTabs programId={programIdNumber} current="mentoring" />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.75fr)_360px]">
        <section className="overflow-hidden rounded-7 border border-neutral-200 bg-white shadow-sm">
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1.7fr)_300px]">
            <div className="p-6 sm:p-7">
              <p className="text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase">
                Program Mentoring
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-neutral-950">
                {mentoring.program.name}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                {mentoring.program.description?.trim() ||
                  "프로그램 설명이 아직 등록되지 않았습니다."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="justify-between gap-2 bg-white"
                  onClick={() => router.push(`/mentoring/${mentoring.id}`)}
                >
                  <span>멘토링 페이지 열기</span>
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border-t border-neutral-200 bg-neutral-50/80 p-6 sm:p-7 xl:border-t-0 xl:border-l">
              <p className="text-xs font-medium tracking-[0.18em] text-neutral-400 uppercase">
                관리 요약
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                    멘토링 상태
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {STATUS_LABEL[mentoring.status]}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                    멘토링 ID
                  </p>
                  <p className="mt-2 text-sm font-medium text-neutral-900">
                    {mentoring.id}
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                    최근 기록
                  </p>
                  <p className="mt-2 text-sm font-medium text-neutral-900">
                    {mentoring.recent_mentored_at
                      ? mentoring.recent_mentored_at
                          .slice(0, 16)
                          .replace("T", " ")
                      : "아직 없음"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 sm:grid-cols-3 sm:p-7">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                대상 기업
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {mentoring.number_of_companies}개
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                참여 멘토
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {mentoring.number_of_users}명
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                누적 기록
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {mentoring.number_of_sessions}건
              </p>
            </div>
          </div>
        </section>

        <section className="self-start rounded-7 border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase">
                Actions
              </p>
              <h2 className="mt-2 text-lg font-semibold text-neutral-950">
                멘토링 운영 관리
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                대상 기업과 참여 멘토를 구성한 뒤, 멘토가 직접 기업을 선택하고
                기록을 쌓도록 운영합니다.
              </p>
            </div>

            <div className="space-y-2">
              {mentoring.status === "PENDING" && (
                <LoadingButton
                  className="w-full gap-2"
                  loading={isStatusUpdating}
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                >
                  <PlayCircle className="h-4 w-4" />
                  멘토링 시작
                </LoadingButton>
              )}

              {mentoring.status === "IN_PROGRESS" && (
                <>
                  <LoadingButton
                    variant="outline"
                    className="w-full gap-2"
                    loading={isStatusUpdating}
                    onClick={() => handleStatusChange("PENDING")}
                  >
                    <Clock3 className="h-4 w-4" />
                    진행 전으로
                  </LoadingButton>
                  <LoadingButton
                    className="w-full gap-2 bg-red-600 hover:bg-red-700"
                    loading={isStatusUpdating}
                    onClick={() => handleStatusChange("COMPLETED")}
                  >
                    <StopCircle className="h-4 w-4" />
                    멘토링 종료
                  </LoadingButton>
                </>
              )}

              {mentoring.status === "COMPLETED" && (
                <LoadingButton
                  variant="outline"
                  className="w-full gap-2"
                  loading={isStatusUpdating}
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                >
                  <PlayCircle className="h-4 w-4" />
                  멘토링 재개
                </LoadingButton>
              )}
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <p className="text-xs font-medium tracking-[0.18em] text-neutral-400 uppercase">
                Reports
              </p>
              <h3 className="mt-2 text-base font-semibold text-neutral-950">
                멘토링 보고서 저장
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                업로드된 로고와 멘토 서명을 포함한 멘토링 일지를 개별 PDF 또는
                전체 ZIP으로 저장합니다.
              </p>

              <div className="mt-4 space-y-3">
                <LoadingButton
                  className="w-full gap-2"
                  loading={isBulkReportDownloading}
                  onClick={handleBulkReportDownload}
                  disabled={
                    !mentoringDetail || mentoringDetail.sessions.length === 0
                  }
                >
                  <Download className="h-4 w-4" />
                  멘토링 보고서 일괄 저장
                </LoadingButton>

                <div className="space-y-2">
                  <Select
                    value={
                      selectedReportSession
                        ? String(selectedReportSession.id)
                        : selectedReportSessionId
                    }
                    onValueChange={setSelectedReportSessionId}
                    disabled={
                      !mentoringDetail || mentoringDetail.sessions.length === 0
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="개별 저장할 세션 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {(mentoringDetail?.sessions ?? []).map((session) => (
                        <SelectItem key={session.id} value={String(session.id)}>
                          {session.company_name} · {session.session_no}회차 ·{" "}
                          {session.mentored_at.slice(0, 10)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <LoadingButton
                    variant="outline"
                    className="w-full gap-2"
                    loading={isSingleReportDownloading}
                    onClick={handleSingleReportDownload}
                    disabled={!selectedReportSession}
                  >
                    <FileText className="h-4 w-4" />
                    멘토링 보고서 개별 저장
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <MentoringEditForm
        programId={programIdNumber}
        mentoringId={mentoring.id}
        data={mentoring}
      />
    </div>
  );
}
