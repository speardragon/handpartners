"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  claimMentoringCompany,
  createMentoringSessionPhotoUploadUrl,
  upsertMentoringSession,
  type MentoringSession,
} from "@/actions/mentoring-action";
import { mentoringQueries } from "@/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import MentoringHeader from "./_components/mentoring-header";
import {
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  FileImage,
  MapPin,
  Pencil,
  Plus,
  UserRound,
} from "lucide-react";

function toLocalInputValue(dateString?: string | null) {
  const date = dateString ? new Date(dateString) : new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function formatDateTime(dateString: string) {
  return dateString.slice(0, 16).replace("T", " ");
}

function DetailSkeleton() {
  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-[1200px] flex-col space-y-4 p-4 pb-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Skeleton className="h-[720px] rounded-2xl" />
          <Skeleton className="h-[720px] rounded-2xl" />
        </div>
      </div>
    </main>
  );
}

export default function MentoringDetailPage() {
  const params = useParams<{ mentoringId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mentoringId = params.mentoringId;

  const { data: mentoring, isLoading, isError, error } = useQuery(
    mentoringQueries.detail(mentoringId)
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [sessionNo, setSessionNo] = useState("1");
  const [mentoredAt, setMentoredAt] = useState(toLocalInputValue());
  const [place, setPlace] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const myAssignments = useMemo(
    () => mentoring?.assignments.filter((item) => item.is_mine) ?? [],
    [mentoring]
  );
  const availableAssignments = useMemo(
    () => mentoring?.assignments.filter((item) => item.can_claim) ?? [],
    [mentoring]
  );

  const selectedCompany = useMemo(
    () =>
      mentoring?.assignments.find((item) => item.company_id === selectedCompanyId) ??
      null,
    [mentoring, selectedCompanyId]
  );

  const companySessions = useMemo(
    () =>
      mentoring?.sessions.filter((session) => session.company_id === selectedCompanyId) ??
      [],
    [mentoring, selectedCompanyId]
  );

  const nextSessionNo = useMemo(() => {
    if (companySessions.length === 0) return 1;
    return (
      Math.max(...companySessions.map((session) => Number(session.session_no || 0))) + 1
    );
  }, [companySessions]);

  useEffect(() => {
    if (!mentoring || mentoring.assignments.length === 0) return;
    const candidate =
      myAssignments[0]?.company_id ??
      availableAssignments[0]?.company_id ??
      mentoring.assignments[0]?.company_id ??
      null;

    if (!selectedCompanyId || !mentoring.assignments.some((item) => item.company_id === selectedCompanyId)) {
      setSelectedCompanyId(candidate);
    }
  }, [availableAssignments, mentoring, myAssignments, selectedCompanyId]);

  useEffect(() => {
    if (!selectedCompany) return;
    if (editingSessionId) return;
    setSessionNo(String(nextSessionNo));
    setMentoredAt(toLocalInputValue());
    setPlace("");
    setContent("");
    setResult("");
    setPhotoFiles([]);
  }, [editingSessionId, nextSessionNo, selectedCompany]);

  const claimMutation = useMutation({
    mutationFn: async (companyId: number) =>
      claimMentoringCompany({ mentoringId, companyId }),
    onSuccess: () => {
      toast.success("기업을 선점했습니다.");
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (mutationError: Error) => {
      toast.error(mutationError.message);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCompany) {
        throw new Error("기업을 선택해주세요.");
      }

      const uploadedPhotos = await Promise.all(
        photoFiles.map(async (file, index) => {
          const { uploadUrl, publicUrl } = await createMentoringSessionPhotoUploadUrl({
            fileName: file.name,
            contentType: file.type,
          });

          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type || "image/jpeg",
            },
            body: file,
          });

          if (!uploadResponse.ok) {
            throw new Error("사진 업로드에 실패했습니다.");
          }

          return {
            photo_path: publicUrl,
            original_filename: file.name,
            sort_order: index + 1,
          };
        })
      );

      return upsertMentoringSession({
        id: editingSessionId ?? undefined,
        mentoringId,
        companyId: selectedCompany.company_id,
        sessionNo: Number(sessionNo),
        mentoredAt: new Date(mentoredAt).toISOString(),
        place,
        content,
        result,
        photos: uploadedPhotos,
      });
    },
    onSuccess: () => {
      toast.success(
        editingSessionId ? "멘토링 기록을 수정했습니다." : "멘토링 기록을 저장했습니다."
      );
      setEditingSessionId(null);
      setPhotoFiles([]);
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (mutationError: Error) => {
      toast.error(mutationError.message);
    },
  });

  const handleEditSession = (session: MentoringSession) => {
    setEditingSessionId(session.id);
    setSessionNo(String(session.session_no));
    setMentoredAt(toLocalInputValue(session.mentored_at));
    setPlace(session.place ?? "");
    setContent(session.content ?? "");
    setResult(session.result ?? "");
    setPhotoFiles([]);
  };

  const resetEditor = () => {
    setEditingSessionId(null);
    setSessionNo(String(nextSessionNo));
    setMentoredAt(toLocalInputValue());
    setPlace("");
    setContent("");
    setResult("");
    setPhotoFiles([]);
  };

  if (isLoading || !mentoring) {
    return <DetailSkeleton />;
  }

  if (isError) {
    return (
      <main className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[960px] flex-col space-y-4 p-4 pb-10">
          <Button
            variant="ghost"
            className="flex items-center gap-1 self-start px-2 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/mentoring")}
          >
            <ArrowLeft size={16} />
            목록으로 돌아가기
          </Button>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {(error as Error | undefined)?.message ||
              "멘토링 상세 정보를 불러오지 못했습니다."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-[1200px] flex-col space-y-4 p-4 pb-10">
        <Button
          variant="ghost"
          className="flex items-center gap-1 self-start px-2 text-gray-600 hover:text-gray-900"
          onClick={() => router.push("/mentoring")}
        >
          <ArrowLeft size={16} />
          멘토링 목록으로 돌아가기
        </Button>

        <MentoringHeader mentoring={mentoring} />

        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-neutral-500" />
                <h2 className="text-sm font-semibold text-neutral-900">
                  {mentoring.isAdminView ? "전체 기업 현황" : "내 담당 기업"}
                </h2>
              </div>
              <div className="mt-4 space-y-2">
                {(mentoring.isAdminView ? mentoring.assignments : myAssignments).length ===
                0 ? (
                  <div className="rounded-xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
                    {mentoring.isAdminView
                      ? "등록된 기업이 없습니다."
                      : "아직 선점한 기업이 없습니다."}
                  </div>
                ) : (
                  (mentoring.isAdminView ? mentoring.assignments : myAssignments).map(
                    (company) => (
                      <button
                        key={company.company_id}
                        type="button"
                        onClick={() => {
                          setSelectedCompanyId(company.company_id);
                          setEditingSessionId(null);
                        }}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                          selectedCompanyId === company.company_id
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{company.company_name}</span>
                          <Badge
                            variant={
                              selectedCompanyId === company.company_id
                                ? "outline"
                                : "secondary"
                            }
                            className={
                              selectedCompanyId === company.company_id
                                ? "border-white/30 bg-white/10 text-white"
                                : ""
                            }
                          >
                            {company.session_count}회
                          </Badge>
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            selectedCompanyId === company.company_id
                              ? "text-white/70"
                              : "text-neutral-500"
                          }`}
                        >
                          {company.mentor_name
                            ? `담당 ${company.mentor_name}`
                            : "미배정"}
                        </p>
                      </button>
                    )
                  )
                )}
              </div>
            </section>

            {!mentoring.isAdminView && (
              <section className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-neutral-500" />
                  <h2 className="text-sm font-semibold text-neutral-900">
                    배정 가능한 기업
                  </h2>
                </div>
                <div className="mt-4 space-y-2">
                  {availableAssignments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
                      선점 가능한 기업이 없습니다.
                    </div>
                  ) : (
                    availableAssignments.map((company) => (
                      <div
                        key={company.company_id}
                        className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-neutral-900">
                              {company.company_name}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              대표자 {company.representative_name || "-"}
                            </p>
                          </div>
                          <Badge variant="outline">미배정</Badge>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          className="mt-3 w-full gap-1.5"
                          disabled={
                            claimMutation.isPending ||
                            mentoring.status === "COMPLETED"
                          }
                          onClick={() => claimMutation.mutate(company.company_id)}
                        >
                          <Plus className="h-4 w-4" />
                          이 기업 선점하기
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </aside>

          <section className="min-w-0 space-y-4">
            {selectedCompany ? (
              <>
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                        Company Workspace
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
                        {selectedCompany.company_name}
                      </h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
                        {selectedCompany.company_description?.trim() ||
                          "기업 소개가 아직 등록되지 않았습니다."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        대표자 {selectedCompany.representative_name || "-"}
                      </Badge>
                      <Badge variant="outline">
                        {selectedCompany.mentor_name
                          ? `담당 ${selectedCompany.mentor_name}`
                          : "미배정"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-950">
                          멘토링 기록 타임라인
                        </h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          선택한 기업에 대한 멘토링 이력을 최신순으로 확인합니다.
                        </p>
                      </div>
                      <Badge variant="secondary">{companySessions.length}건</Badge>
                    </div>

                    <div className="mt-4 space-y-3">
                      {companySessions.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-400">
                          아직 기록이 없습니다.
                        </div>
                      ) : (
                        companySessions.map((session) => (
                          <div
                            key={session.id}
                            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="secondary">
                                    {session.session_no}회차
                                  </Badge>
                                  <span className="text-sm font-medium text-neutral-900">
                                    {formatDateTime(session.mentored_at)}
                                  </span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-neutral-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {session.place || "장소 미입력"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <UserRound className="h-4 w-4" />
                                    {session.mentor_name || "작성자 없음"}
                                  </span>
                                </div>
                              </div>
                              {session.can_edit && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5"
                                  onClick={() => handleEditSession(session)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  수정
                                </Button>
                              )}
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                  멘토링 내용
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                                  {session.content?.trim() || "기록 없음"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                  결과
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                                  {session.result?.trim() || "기록 없음"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                사진
                              </p>
                              {session.photos.length === 0 ? (
                                <p className="mt-2 text-sm text-neutral-400">
                                  첨부된 사진이 없습니다.
                                </p>
                              ) : (
                                <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                  {session.photos.map((photo) => (
                                    <a
                                      key={photo.id}
                                      href={photo.download_url ?? photo.photo_path}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
                                    >
                                      <img
                                        src={photo.download_url ?? photo.photo_path}
                                        alt={photo.original_filename || "멘토링 사진"}
                                        className="h-32 w-full object-cover"
                                      />
                                      <div className="border-t border-neutral-100 px-3 py-2 text-xs text-neutral-500">
                                        {photo.original_filename || "사진"}
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {!mentoring.isAdminView && selectedCompany.is_mine && (
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-950">
                            {editingSessionId ? "멘토링 기록 수정" : "새 멘토링 기록"}
                          </h3>
                          <p className="mt-1 text-sm text-neutral-600">
                            회차별 상담 내용을 누적해서 저장합니다.
                          </p>
                        </div>
                        {editingSessionId && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={resetEditor}
                          >
                            새로 작성
                          </Button>
                        )}
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                              회차
                            </label>
                            <Input
                              type="number"
                              min={1}
                              value={sessionNo}
                              onChange={(e) => setSessionNo(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                              멘토링 일시
                            </label>
                            <Input
                              type="datetime-local"
                              value={mentoredAt}
                              onChange={(e) => setMentoredAt(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                            장소
                          </label>
                          <Input
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            placeholder="예: 본사 회의실, 온라인 미팅"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                            멘토링 내용
                          </label>
                          <Textarea
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="멘토링에서 다룬 내용과 논의 사항을 입력하세요."
                            className="mt-2 min-h-[220px] resize-y"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                            결과
                          </label>
                          <Textarea
                            rows={5}
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            placeholder="후속 조치, 결정 사항, 결과 요약을 입력하세요."
                            className="mt-2 min-h-[180px] resize-y"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                            사진 첨부
                          </label>
                          <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-white">
                            <Camera className="h-4 w-4" />
                            사진 여러 장 선택
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={(e) =>
                                setPhotoFiles(Array.from(e.target.files ?? []))
                              }
                            />
                          </label>
                          {photoFiles.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {photoFiles.map((file) => (
                                <div
                                  key={file.name}
                                  className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600"
                                >
                                  <FileImage className="h-4 w-4 text-neutral-400" />
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <LoadingButton
                          type="button"
                          className="w-full gap-2"
                          loading={saveMutation.isPending}
                          onClick={() => saveMutation.mutate()}
                          disabled={mentoring.status === "COMPLETED"}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {editingSessionId ? "기록 수정" : "기록 저장"}
                        </LoadingButton>
                      </div>
                    </div>
                  )}

                  {!mentoring.isAdminView &&
                    selectedCompany &&
                    !selectedCompany.is_mine &&
                    selectedCompany.can_claim && (
                      <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-950">
                              먼저 기업을 선점해주세요
                            </h3>
                            <p className="mt-1 text-sm text-neutral-600">
                              이 기업은 아직 담당 멘토가 없습니다. 선점한 뒤
                              멘토링 기록을 작성할 수 있습니다.
                            </p>
                          </div>
                        </div>
                        <LoadingButton
                          type="button"
                          className="mt-4 w-full gap-2"
                          loading={claimMutation.isPending}
                          onClick={() => claimMutation.mutate(selectedCompany.company_id)}
                        >
                          <Plus className="h-4 w-4" />
                          이 기업 선점하기
                        </LoadingButton>
                      </div>
                    )}

                  {mentoring.isAdminView && (
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-neutral-950">
                        관리자 열람 모드
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        관리자는 이 화면에서 멘토링 기록을 수정하지 않고 전체
                        현황을 읽기 전용으로 확인합니다. 배정 변경은 프로그램별
                        멘토링 관리 화면에서 진행합니다.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border bg-white p-8 text-center text-sm text-neutral-400 shadow-sm">
                선택할 기업이 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
