"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { executeAction, getErrorMessage } from "@/lib/action";
import {
  createMentoringSessionPhotoUploadUrl,
  type MentoringSession,
  upsertMentoringSessionByAdmin,
} from "@/actions/mentoring-action";
import { mentoringQueries } from "@/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Camera,
  FileImage,
  FileText,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

// ISO 문자열을 datetime-local input 값(YYYY-MM-DDTHH:mm)으로 변환한다.
function toLocalInputValue(dateString?: string | null) {
  const date = dateString ? new Date(dateString) : new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
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

type Props = {
  session: MentoringSession;
  companyName: string;
  mentoringId: string;
  isDownloading: boolean;
  isDeleting: boolean;
  onDownloadReport: () => void;
  onDelete: () => void;
};

export default function MentoringSessionCard({
  session,
  companyName,
  mentoringId,
  isDownloading,
  isDeleting,
  onDownloadReport,
  onDelete,
}: Props) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [sessionNo, setSessionNo] = useState(String(session.session_no));
  const [mentoredAt, setMentoredAt] = useState(
    toLocalInputValue(session.mentored_at)
  );
  const [place, setPlace] = useState(session.place ?? "");
  const [content, setContent] = useState(session.content ?? "");
  const [editorPhotos, setEditorPhotos] = useState<EditorPhotoItem[]>([]);
  const newPhotoFilesRef = useRef<
    Record<string, { file: File; previewUrl: string }>
  >({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 새 사진 미리보기로 만든 objectURL 을 정리해 메모리 누수를 방지한다.
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

  // 언마운트 시 남아 있는 미리보기 objectURL 을 정리한다.
  useEffect(() => () => clearEditorPhotos(), []);

  const resetForm = () => {
    setSessionNo(String(session.session_no));
    setMentoredAt(toLocalInputValue(session.mentored_at));
    setPlace(session.place ?? "");
    setContent(session.content ?? "");
  };

  const startEditing = () => {
    resetForm();
    clearEditorPhotos();
    setEditorPhotos(
      session.photos.map((photo) => ({
        key: `existing-${photo.id}`,
        kind: "existing" as const,
        name: photo.original_filename || "사진",
        previewUrl: photo.download_url ?? photo.photo_path,
        photoPath: photo.photo_path,
      }))
    );
    setIsEditing(true);
  };

  const cancelEditing = () => {
    resetForm();
    clearEditorPhotos();
    setIsEditing(false);
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
          : `photo-${index}-${file.name}`;
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

  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsedSessionNo = Number(sessionNo);
      if (!Number.isFinite(parsedSessionNo) || parsedSessionNo <= 0) {
        throw new Error("회차는 1 이상의 숫자여야 합니다.");
      }
      if (!mentoredAt) {
        throw new Error("멘토링 일시를 입력해 주세요.");
      }

      // 새로 추가된 사진만 S3 에 업로드하고, 기존 사진은 photo_path 를 그대로 유지한다.
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
        upsertMentoringSessionByAdmin({
          sessionId: session.id,
          mentoringId,
          sessionNo: parsedSessionNo,
          mentoredAt: new Date(mentoredAt).toISOString(),
          place,
          content,
          photos: uploadedPhotos,
        })
      );
    },
    onSuccess: () => {
      toast.success("멘토링 기록을 수정했습니다.");
      clearEditorPhotos();
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "멘토링 기록 수정에 실패했습니다."));
    },
  });

  if (isEditing) {
    return (
      <article className="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm ring-1 ring-neutral-200">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-neutral-900">
            {companyName} · 기록 수정
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-neutral-500"
            onClick={cancelEditing}
            disabled={saveMutation.isPending}
          >
            <X className="h-4 w-4" />
            취소
          </Button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`session-no-${session.id}`}>회차</Label>
            <Input
              id={`session-no-${session.id}`}
              type="number"
              min={1}
              value={sessionNo}
              onChange={(event) => setSessionNo(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`mentored-at-${session.id}`}>멘토링 일시</Label>
            <Input
              id={`mentored-at-${session.id}`}
              type="datetime-local"
              value={mentoredAt}
              onChange={(event) => setMentoredAt(event.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor={`place-${session.id}`}>장소</Label>
            <Input
              id={`place-${session.id}`}
              type="text"
              placeholder="멘토링 장소"
              value={place}
              onChange={(event) => setPlace(event.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor={`content-${session.id}`}>멘토링 내용</Label>
            <Textarea
              id={`content-${session.id}`}
              rows={6}
              placeholder="멘토링 내용을 입력하세요."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>사진</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              tabIndex={-1}
              className="sr-only"
              onChange={(event) => handlePhotoFileChange(event.target.files)}
            />
            {editorPhotos.length === 0 ? (
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                사진 선택
              </button>
            ) : (
              <div className="space-y-3">
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
                          {photo.kind === "existing" ? "기존 사진" : "새 사진"}
                        </div>
                        <button
                          type="button"
                          className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-white hover:text-red-500"
                          onClick={() => handleRemovePhoto(photo.key)}
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
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={cancelEditing}
            disabled={saveMutation.isPending}
          >
            취소
          </Button>
          <LoadingButton
            type="button"
            size="sm"
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            저장
          </LoadingButton>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{session.session_no}회차</Badge>
            <span className="text-sm font-medium text-neutral-900">
              {session.mentored_at.slice(0, 16).replace("T", " ")}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <UserRound className="h-3.5 w-3.5" />
              {session.mentor_name || "작성자 없음"}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {session.place || "장소 미입력"}
            </span>
          </div>
          {session.content && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
              {session.content}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <LoadingButton
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            loading={isDownloading}
            onClick={onDownloadReport}
          >
            <FileText className="h-4 w-4" />
            보고서
          </LoadingButton>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={startEditing}
          >
            <Pencil className="h-4 w-4" />
            수정
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  멘토링 세션을 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {companyName} · {session.session_no}회차 기록과 첨부된 사진이
                  모두 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </article>
  );
}
