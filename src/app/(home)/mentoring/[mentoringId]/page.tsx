"use client";
/* eslint-disable @next/next/no-img-element */

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { executeAction, getErrorMessage } from "@/lib/action";
import {
  createMentoringSessionPhotoUploadUrl,
  deleteMentoringSession,
  getMentoringSessionReportAssets,
  upsertMentoringSession,
  type MentoringSession,
} from "@/actions/mentoring-action";
import { mentoringQueries } from "@/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import MentoringHeader from "./_components/mentoring-header";
import MentoringSessionDocument from "./_components/MentoringSessionDocument";
import {
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  FileText,
  FileImage,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function toLocalInputValue(dateString?: string | null) {
  const date = dateString ? new Date(dateString) : new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function formatDateTime(dateString: string) {
  return dateString.slice(0, 16).replace("T", " ");
}

function isWebpFile(file: File) {
  return (
    file.type.toLowerCase() === "image/webp" ||
    file.name.toLowerCase().endsWith(".webp")
  );
}

type EditorPhotoItem =
  | {
      key: string;
      kind: "existing";
      name: string;
      previewUrl: string;
      photoPath: string;
    }
  | {
      key: string;
      kind: "new";
      name: string;
      previewUrl: string;
      fileKey: string;
    };

function DetailSkeleton() {
  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-300 flex-col space-y-4 p-4 pb-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Skeleton className="h-180 rounded-2xl" />
          <Skeleton className="h-180 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}

export default function MentoringDetailPage() {
  const params = useParams<{ mentoringId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const mentoringId = params.mentoringId;
  const requestedCompanyId = Number(searchParams.get("companyId"));

  const {
    data: mentoring,
    isLoading,
    isError,
    error,
  } = useQuery(mentoringQueries.detail(mentoringId));

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [sessionNo, setSessionNo] = useState("1");
  const [mentoredAt, setMentoredAt] = useState(toLocalInputValue());
  const [place, setPlace] = useState("");
  const [content, setContent] = useState("");
  const [editorPhotos, setEditorPhotos] = useState<EditorPhotoItem[]>([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const [downloadingSessionId, setDownloadingSessionId] = useState<
    number | null
  >(null);
  const [sessionCarouselApi, setSessionCarouselApi] = useState<CarouselApi>();
  const composerRef = useRef<HTMLDivElement | null>(null);
  const newPhotoFilesRef = useRef<
    Record<string, { file: File; previewUrl: string }>
  >({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const myAssignments = useMemo(
    () => mentoring?.assignments.filter((item) => item.is_mine) ?? [],
    [mentoring]
  );
  const activeCompanyId = useMemo(() => {
    if (!mentoring || mentoring.assignments.length === 0) {
      return null;
    }

    if (
      Number.isFinite(requestedCompanyId) &&
      requestedCompanyId > 0 &&
      mentoring.assignments.some(
        (item) => item.company_id === requestedCompanyId
      )
    ) {
      return requestedCompanyId;
    }

    if (
      selectedCompanyId &&
      mentoring.assignments.some(
        (item) => item.company_id === selectedCompanyId
      )
    ) {
      return selectedCompanyId;
    }

    return (
      myAssignments[0]?.company_id ??
      mentoring.assignments[0]?.company_id ??
      null
    );
  }, [mentoring, myAssignments, requestedCompanyId, selectedCompanyId]);

  const selectedCompany = useMemo(
    () =>
      mentoring?.assignments.find(
        (item) => item.company_id === activeCompanyId
      ) ?? null,
    [activeCompanyId, mentoring]
  );

  const companySessions = useMemo(
    () =>
      mentoring?.sessions.filter(
        (session) => session.company_id === activeCompanyId
      ) ?? [],
    [activeCompanyId, mentoring]
  );

  const nextSessionNo = useMemo(() => {
    if (companySessions.length === 0) return 1;
    return (
      Math.max(
        ...companySessions.map((session) => Number(session.session_no || 0))
      ) + 1
    );
  }, [companySessions]);

  const canComposeSession =
    !mentoring?.isAdminView &&
    selectedCompany?.is_mine &&
    mentoring?.status !== "COMPLETED";

  const clearEditorPhotos = () => {
    Object.values(newPhotoFilesRef.current).forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
    });
    newPhotoFilesRef.current = {};
    setEditorPhotos([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!selectedCompany) return;
    if (editingSessionId) return;
    startTransition(() => {
      setSessionNo(String(nextSessionNo));
      setMentoredAt(toLocalInputValue());
      setPlace("");
      setContent("");
    });
    clearEditorPhotos();
  }, [editingSessionId, nextSessionNo, selectedCompany]);

  useEffect(() => {
    if (!sessionCarouselApi) return;

    const syncSelectedIndex = () => {
      setSelectedSessionIndex(sessionCarouselApi.selectedScrollSnap());
    };

    syncSelectedIndex();
    sessionCarouselApi.on("select", syncSelectedIndex);
    sessionCarouselApi.on("reInit", syncSelectedIndex);

    return () => {
      sessionCarouselApi.off("select", syncSelectedIndex);
      sessionCarouselApi.off("reInit", syncSelectedIndex);
    };
  }, [sessionCarouselApi]);

  useEffect(() => {
    if (!selectedCompany) return;
    startTransition(() => {
      setSelectedSessionIndex(0);
      setIsComposerOpen(
        Boolean(selectedCompany.is_mine && companySessions.length === 0)
      );
    });
    sessionCarouselApi?.scrollTo(0);
  }, [companySessions.length, selectedCompany, sessionCarouselApi]);

  useEffect(() => () => clearEditorPhotos(), []);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCompany) {
        throw new Error("기업을 선택해주세요.");
      }

      const uploadedPhotos = await Promise.all(
        editorPhotos.map(async (photoItem, index) => {
          if (photoItem.kind === "existing") {
            return {
              photo_path: photoItem.photoPath,
              original_filename: photoItem.name,
              sort_order: index + 1,
            };
          }

          const fileEntry = newPhotoFilesRef.current[photoItem.fileKey];
          if (!fileEntry) return null;

          const { uploadUrl, publicUrl } = await executeAction(
            createMentoringSessionPhotoUploadUrl({
              fileName: fileEntry.file.name,
              contentType: fileEntry.file.type,
            })
          );

          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": fileEntry.file.type || "image/jpeg",
            },
            body: fileEntry.file,
          });

          if (!uploadResponse.ok) {
            throw new Error("사진 업로드에 실패했습니다.");
          }

          return {
            photo_path: publicUrl,
            original_filename: fileEntry.file.name,
            sort_order: index + 1,
          };
        })
      ).then((results) => results.filter((r) => r !== null));

      return executeAction(
        upsertMentoringSession({
          id: editingSessionId ?? undefined,
          mentoringId,
          companyId: selectedCompany.company_id,
          sessionNo: Number(sessionNo),
          mentoredAt: new Date(mentoredAt).toISOString(),
          place,
          content,
          photos: uploadedPhotos,
        })
      );
    },
    onSuccess: () => {
      toast.success(
        editingSessionId
          ? "멘토링 기록을 수정했습니다."
          : "멘토링 기록을 저장했습니다."
      );
      setEditingSessionId(null);
      setIsComposerOpen(false);
      clearEditorPhotos();
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (mutationError: unknown) => {
      toast.error(
        getErrorMessage(mutationError, "멘토링 기록을 저장하지 못했습니다.")
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (sessionId: number) =>
      executeAction(deleteMentoringSession({ sessionId, mentoringId })),
    onSuccess: () => {
      toast.success("멘토링 기록을 삭제했습니다.");
      setEditingSessionId(null);
      setIsComposerOpen(false);
      clearEditorPhotos();
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (mutationError: unknown) => {
      toast.error(
        getErrorMessage(mutationError, "멘토링 기록 삭제에 실패했습니다.")
      );
    },
  });

  const scrollComposerIntoView = () => {
    requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const openComposerForNewSession = () => {
    resetEditor();
    setIsComposerOpen(true);
    scrollComposerIntoView();
  };

  const handleEditSession = (session: MentoringSession) => {
    clearEditorPhotos();
    setEditingSessionId(session.id);
    setSessionNo(String(session.session_no));
    setMentoredAt(toLocalInputValue(session.mentored_at));
    setPlace(session.place ?? "");
    setContent(session.content ?? "");
    setEditorPhotos(
      session.photos.map((photo) => ({
        key: `existing-${photo.id}`,
        kind: "existing" as const,
        name: photo.original_filename || "사진",
        previewUrl: photo.download_url ?? photo.photo_path,
        photoPath: photo.photo_path,
      }))
    );
    setIsComposerOpen(true);
    scrollComposerIntoView();
  };

  const resetEditor = () => {
    setEditingSessionId(null);
    setSessionNo(String(nextSessionNo));
    setMentoredAt(toLocalInputValue());
    setPlace("");
    setContent("");
    clearEditorPhotos();
  };

  const handlePhotoFileChange = (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    const allowedFiles = selectedFiles.filter((file) => !isWebpFile(file));

    if (allowedFiles.length !== selectedFiles.length) {
      toast.error(
        "WEBP 이미지는 업로드할 수 없습니다. PNG 또는 JPG 파일을 사용해주세요."
      );
    }

    if (allowedFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const added = allowedFiles.map((file, index) => {
      const fileKey =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `photo-${Date.now()}-${index}`;
      const previewUrl = URL.createObjectURL(file);
      newPhotoFilesRef.current[fileKey] = { file, previewUrl };

      return {
        key: `new-${fileKey}`,
        kind: "new" as const,
        name: file.name,
        previewUrl,
        fileKey,
      };
    });
    setEditorPhotos((current) => [...current, ...added]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = (key: string) => {
    setEditorPhotos((current) => {
      const target = current.find((item) => item.key === key);
      if (target?.kind === "new") {
        const fileEntry = newPhotoFilesRef.current[target.fileKey];
        if (fileEntry) {
          URL.revokeObjectURL(fileEntry.previewUrl);
          delete newPhotoFilesRef.current[target.fileKey];
        }
      }
      return current.filter((item) => item.key !== key);
    });
  };

  const handleDownloadSessionPdf = async (session: MentoringSession) => {
    if (!selectedCompany || !mentoring) return;

    setDownloadingSessionId(session.id);
    try {
      // 다운로드 직전에 이미지 presigned URL을 다시 발급해 만료로 인한 누락을 방지한다.
      const [{ pdf }, { saveAs }, assets] = await Promise.all([
        import("@react-pdf/renderer"),
        import("file-saver"),
        executeAction(
          getMentoringSessionReportAssets({
            mentoringId,
            sessionId: session.id,
          })
        ),
      ]);

      const freshPhotoUrlById = new Map(
        assets.photos.map((photo) => [photo.id, photo.download_url])
      );
      const photos = session.photos.map((photo) => ({
        ...photo,
        download_url: freshPhotoUrlById.get(photo.id) ?? photo.download_url,
      }));

      const blob = await pdf(
        <MentoringSessionDocument
          programName={mentoring.program.name}
          companyName={selectedCompany.company_name}
          companyDescription={selectedCompany.company_description}
          representativeName={selectedCompany.representative_name}
          mentorName={session.mentor_name}
          mentorAffiliation={
            session.mentor_affiliation ??
            (selectedCompany.mentors[0]?.mentor_affiliation ?? null)
          }
          mentorPosition={
            session.mentor_position ??
            (selectedCompany.mentors[0]?.mentor_position ?? null)
          }
          mentorSignatureUrl={assets.mentorSignatureUrl}
          logoUrl={assets.logoUrl}
          sessionNo={session.session_no}
          mentoredAt={session.mentored_at}
          place={session.place}
          content={session.content}
          photos={photos}
        />
      ).toBlob();

      const sessionDate = session.mentored_at.slice(0, 10);
      saveAs(
        blob,
        `${selectedCompany.company_name}_멘토링일지_${session.session_no}회차_${sessionDate}.pdf`
      );
    } catch (downloadError) {
      console.error(downloadError);
      toast.error("멘토링 보고서 저장 중 오류가 발생했습니다.");
    } finally {
      setDownloadingSessionId(null);
    }
  };

  const formatMentorNames = (
    mentors: { mentor_name: string | null }[]
  ): string => {
    if (mentors.length === 0) return "미배정";
    const names = mentors.map((m) => m.mentor_name).filter(Boolean) as string[];
    if (names.length === 0) return "미배정";
    return names.length === 1
      ? `담당 ${names[0]}`
      : `담당 ${names[0]} 외 ${names.length - 1}명`;
  };

  if (isLoading || !mentoring) {
    return <DetailSkeleton />;
  }

  if (isError) {
    return (
      <main className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-240 flex-col space-y-4 p-4 pb-10">
          <Button
            variant="ghost"
            className="flex items-center gap-1 self-start px-2 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/mentoring")}
          >
            <ArrowLeft size={16} />
            목록으로 돌아가기
          </Button>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {getErrorMessage(error, "멘토링 상세 정보를 불러오지 못했습니다.")}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-300 flex-col space-y-4 p-4 pb-10">
        <Button
          variant="ghost"
          className="flex items-center gap-1 self-start px-2 text-gray-600 hover:text-gray-900"
          onClick={() => router.push("/mentoring")}
        >
          <ArrowLeft size={16} />
          멘토링 목록으로 돌아가기
        </Button>

        <MentoringHeader mentoring={mentoring} />

        <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-4">
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-neutral-500" />
                <h2 className="text-sm font-semibold text-neutral-900">
                  {mentoring.isAdminView ? "전체 기업 현황" : "내 담당 기업"}
                </h2>
              </div>
              <div className="mt-4 space-y-2">
                {(mentoring.isAdminView ? mentoring.assignments : myAssignments)
                  .length === 0 ? (
                  <div className="rounded-xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
                    {mentoring.isAdminView
                      ? "등록된 기업이 없습니다."
                      : "아직 선택한 기업이 없습니다."}
                  </div>
                ) : (
                  (mentoring.isAdminView
                    ? mentoring.assignments
                    : myAssignments
                  ).map((company) => (
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
                        <span className="font-medium">
                          {company.company_name}
                        </span>
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
                        {formatMentorNames(company.mentors)}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </section>
          </aside>

          <section className="min-w-0 space-y-4">
            {selectedCompany ? (
              <>
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-medium tracking-[0.18em] text-neutral-400 uppercase">
                        기업 워크스페이스
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
                        {formatMentorNames(selectedCompany.mentors)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-950">
                          멘토링 세션 스택
                        </h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          최근 세션부터 한 장씩 넘겨 보면서 기록을 검토할 수
                          있습니다.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">
                          {companySessions.length}건
                        </Badge>
                        {companySessions.length > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-neutral-600"
                          >
                            {selectedSessionIndex + 1} /{" "}
                            {companySessions.length}
                          </Badge>
                        )}
                        {canComposeSession && (
                          <Button
                            type="button"
                            size="sm"
                            className="gap-1.5"
                            onClick={openComposerForNewSession}
                          >
                            <Plus className="h-4 w-4" />새 세션 시작
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      {companySessions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-10 text-center">
                          <p className="text-sm font-medium text-neutral-700">
                            아직 저장된 멘토링 세션이 없습니다.
                          </p>
                          <p className="mt-2 text-sm text-neutral-500">
                            첫 세션을 작성하면 이 영역에서 회차별 기록을
                            넘겨보며 관리할 수 있습니다.
                          </p>
                          {canComposeSession && (
                            <Button
                              type="button"
                              className="mt-5 gap-2"
                              onClick={openComposerForNewSession}
                            >
                              <Sparkles className="h-4 w-4" />첫 멘토링 세션
                              작성
                            </Button>
                          )}
                        </div>
                      ) : (
                        <>
                          <Carousel
                            setApi={setSessionCarouselApi}
                            opts={{
                              align: "start",
                              containScroll: "trimSnaps",
                            }}
                            className="w-full"
                          >
                            <CarouselContent>
                              {companySessions.map((session) => (
                                <CarouselItem key={session.id}>
                                  <article className="rounded-6 border border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm">
                                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                      <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <Badge variant="secondary">
                                            {session.session_no}회차
                                          </Badge>
                                          <span className="text-sm font-medium text-neutral-900">
                                            {formatDateTime(
                                              session.mentored_at
                                            )}
                                          </span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-500">
                                          <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {session.place || "장소 미입력"}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <UserRound className="h-4 w-4" />
                                            {session.mentor_name ||
                                              "작성자 없음"}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        <LoadingButton
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="gap-1.5"
                                          loading={
                                            downloadingSessionId === session.id
                                          }
                                          onClick={() =>
                                            handleDownloadSessionPdf(session)
                                          }
                                        >
                                          <FileText className="h-4 w-4" />
                                          보고서 저장(.pdf)
                                        </LoadingButton>
                                        {session.can_edit && (
                                          <>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              className="gap-1.5"
                                              onClick={() =>
                                                handleEditSession(session)
                                              }
                                            >
                                              <Pencil className="h-4 w-4" />이
                                              세션 수정
                                            </Button>
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                  disabled={
                                                    deleteMutation.isPending
                                                  }
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                  삭제
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    멘토링 세션을
                                                    삭제하시겠습니까?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    {session.session_no}회차
                                                    기록과 첨부된 사진이 모두
                                                    삭제됩니다. 이 작업은 되돌릴
                                                    수 없습니다.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    취소
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() =>
                                                      deleteMutation.mutate(
                                                        session.id
                                                      )
                                                    }
                                                    className="bg-red-500 hover:bg-red-600"
                                                  >
                                                    삭제
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
                                      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                                        멘토링 내용
                                      </p>
                                      <div className="mt-3 h-48 overflow-y-auto pr-1">
                                        <p className="text-sm leading-6 whitespace-pre-wrap text-neutral-700">
                                          {session.content?.trim() ||
                                            "기록 없음"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="mt-5">
                                      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                                        현장 사진
                                      </p>
                                      <div className="mt-3 min-h-53">
                                        {session.photos.length === 0 ? (
                                          <div className="flex h-53 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-400">
                                            첨부된 사진이 없습니다.
                                          </div>
                                        ) : (
                                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            {session.photos.map((photo) => (
                                              <a
                                                key={photo.id}
                                                href={
                                                  photo.download_url ??
                                                  photo.photo_path
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                                              >
                                                <img
                                                  src={
                                                    photo.download_url ??
                                                    photo.photo_path
                                                  }
                                                  alt={
                                                    photo.original_filename ||
                                                    "멘토링 사진"
                                                  }
                                                  className="h-36 w-full object-cover"
                                                />
                                                <div className="border-t border-neutral-100 px-3 py-2 text-xs text-neutral-500">
                                                  {photo.original_filename ||
                                                    "사진"}
                                                </div>
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </article>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex flex-wrap gap-2">
                                {companySessions.map((session, index) => (
                                  <Button
                                    key={session.id}
                                    type="button"
                                    variant={
                                      index === selectedSessionIndex
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    className="gap-1.5 rounded-full"
                                    onClick={() =>
                                      sessionCarouselApi?.scrollTo(index)
                                    }
                                  >
                                    <span>{session.session_no}회차</span>
                                    <span className="text-[11px] opacity-70">
                                      {session.mentored_at.slice(5, 10)}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 self-end lg:self-auto">
                                <CarouselPrevious className="static translate-y-0" />
                                <CarouselNext className="static translate-y-0" />
                              </div>
                            </div>
                          </Carousel>
                        </>
                      )}
                    </div>
                  </div>

                  {!mentoring.isAdminView && selectedCompany.is_mine && (
                    <div
                      ref={composerRef}
                      className="rounded-2xl border bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-neutral-950">
                              {editingSessionId
                                ? `${sessionNo}회차 기록 수정`
                                : "새 멘토링 세션 작성"}
                            </h3>
                            <Badge variant="outline">
                              다음 권장 회차 {nextSessionNo}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-neutral-600">
                            새 세션을 추가하거나 기존 세션을 열어 업데이트할 수
                            있습니다.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {!isComposerOpen && (
                            <Button
                              type="button"
                              className="gap-1.5"
                              onClick={openComposerForNewSession}
                            >
                              <Plus className="h-4 w-4" />
                              세션 작성 열기
                            </Button>
                          )}
                          {isComposerOpen && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                resetEditor();
                                setIsComposerOpen(false);
                              }}
                            >
                              닫기
                            </Button>
                          )}
                        </div>
                      </div>

                      {!isComposerOpen ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-6">
                          <p className="text-sm font-medium text-neutral-700">
                            새 멘토링 세션을 추가할 준비가 되면 작성 패널을
                            열어주세요.
                          </p>
                          <p className="mt-2 text-sm text-neutral-500">
                            회차, 일시, 장소, 멘토링 내용, 현장 사진을 한 번에
                            정리할 수 있습니다.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
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
                              <label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
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
                            <label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
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
                            <label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                              멘토링 내용
                            </label>
                            <Textarea
                              rows={6}
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              placeholder="멘토링에서 다룬 내용과 논의 사항을 입력하세요."
                              className="mt-2 min-h-55 resize-y"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                              사진 첨부
                            </label>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              tabIndex={-1}
                              className="sr-only"
                              onChange={(e) =>
                                handlePhotoFileChange(e.target.files)
                              }
                            />
                            {editorPhotos.length === 0 ? (
                              <button
                                type="button"
                                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-white"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Camera className="h-4 w-4" />
                                사진 선택
                              </button>
                            ) : (
                              <div className="mt-2 space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                  {editorPhotos.map((photo) => (
                                    <div
                                      key={photo.key}
                                      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                                    >
                                      <div className="relative aspect-[4/3] bg-neutral-100">
                                        <img
                                          src={photo.previewUrl}
                                          alt={photo.name}
                                          className="h-full w-full object-cover"
                                        />
                                        <div className="absolute top-2 left-2 rounded-full bg-black/65 px-2 py-1 text-[11px] font-medium text-white">
                                          {photo.kind === "existing"
                                            ? "기존 사진"
                                            : "새 사진"}
                                        </div>
                                        <button
                                          type="button"
                                          className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-white hover:text-red-500"
                                          onClick={() =>
                                            handleRemovePhoto(photo.key)
                                          }
                                        >
                                          삭제
                                        </button>
                                      </div>
                                      <div className="flex items-center gap-2 border-t border-neutral-100 px-3 py-2 text-sm text-neutral-600">
                                        <FileImage className="h-4 w-4 shrink-0 text-neutral-400" />
                                        <span className="min-w-0 flex-1 truncate">
                                          {photo.name}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-white"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Plus className="h-4 w-4" />
                                  사진 추가
                                </button>
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
                      )}
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
