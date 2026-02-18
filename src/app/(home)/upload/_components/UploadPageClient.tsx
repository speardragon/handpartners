"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useJudgingRoundCompaniesQuery } from "../_hooks/useJudgingRoundCompaniesQuery";
import {
  createJudgeCompanyPdfUploadUrl,
  updateCompanyPdfPath,
} from "@/actions/judging_rounds_company-action";

type SelectedFiles = Record<number, File>;

function FileDropZone({
  rowId,
  selectedFile,
  onFileSelect,
}: {
  rowId: number;
  selectedFile: File | undefined;
  onFileSelect: (rowId: number, file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (file.type !== "application/pdf") {
        toast.error("PDF 파일만 업로드할 수 있습니다.");
        return;
      }
      onFileSelect(rowId, file);
    },
    [rowId, onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(rowId, file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-3 py-2 transition-colors ${
        isDragging
          ? "border-neutral-400 bg-neutral-50"
          : selectedFile
            ? "border-neutral-300 bg-neutral-50"
            : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleChange}
      />
      <svg
        className={`h-4 w-4 shrink-0 ${selectedFile ? "text-neutral-500" : "text-neutral-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="truncate text-sm text-neutral-500">
        {selectedFile ? selectedFile.name : "PDF 파일 선택 또는 드래그"}
      </span>
    </div>
  );
}

export default function UploadPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialId = searchParams.get("id");
  const [inputValue, setInputValue] = useState(initialId ?? "");
  const [judgingRoundId, setJudgingRoundId] = useState<number | null>(
    initialId ? parseInt(initialId, 10) : null
  );
  const [uploadingIds, setUploadingIds] = useState<Set<number>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<SelectedFiles>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = searchParams.get("id");
    const parsed = id ? parseInt(id, 10) : null;
    if (parsed && !isNaN(parsed)) {
      setInputValue(String(parsed));
      setJudgingRoundId(parsed);
    }
  }, [searchParams]);

  const { data, isLoading, isError, error } =
    useJudgingRoundCompaniesQuery(judgingRoundId);

  const handleSearch = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("유효한 심사 ID를 입력해주세요.");
      return;
    }
    setSelectedFiles({});
    router.push(`?id=${parsed}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleFileSelect = useCallback((rowId: number, file: File) => {
    setSelectedFiles((prev) => ({ ...prev, [rowId]: file }));
  }, []);

  const handleUpload = async (companyRowId: number) => {
    const file = selectedFiles[companyRowId];
    if (!file) {
      toast.error("PDF 파일을 선택해주세요.");
      return;
    }

    setUploadingIds((prev) => new Set(prev).add(companyRowId));

    try {
      const { uploadUrl, publicUrl } = await createJudgeCompanyPdfUploadUrl({
        fileName: file.name,
        contentType: file.type,
      });

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("파일 업로드에 실패했습니다.");
      }

      await updateCompanyPdfPath({
        judgingRoundCompanyId: companyRowId,
        pdfPath: publicUrl,
        originalFilename: file.name,
      });

      setSelectedFiles((prev) => {
        const next = { ...prev };
        delete next[companyRowId];
        return next;
      });

      queryClient.invalidateQueries({
        queryKey: ["public_judging_round_companies", judgingRoundId],
      });

      toast.success("PDF 업로드 완료");
    } catch (err: any) {
      toast.error(err.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingIds((prev) => {
        const next = new Set(prev);
        next.delete(companyRowId);
        return next;
      });
    }
  };

  const uploadedCount =
    data?.companies.filter((c: any) => c.pdf_path).length ?? 0;
  const totalCount = data?.companies.length ?? 0;

  return (
    <div className="min-h-full">
      {/* 헤더 영역 */}
      <div className="border-b bg-white px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-1 text-3xl font-bold text-neutral-900">
            발표자료 PDF 업로드
          </h1>
          <p className="text-sm text-neutral-500">
            심사 ID를 입력하면 해당 심사의 기업 목록이 표시됩니다.
          </p>

          <div className="mt-6 flex gap-2">
            <Input
              type="text"
              placeholder="심사 ID 입력 (예: 42)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-w-xs bg-white"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  검색 중
                </span>
              ) : (
                "검색"
              )}
            </Button>
          </div>

          {isError && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-red-500">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {(error as Error)?.message || "심사를 찾을 수 없습니다."}
            </p>
          )}
        </div>
      </div>

      {/* 결과 영역 */}
      <div className="mx-auto max-w-3xl px-6 py-6">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        )}

        {data && (
          <>
            {/* 심사 정보 & 진행 현황 */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  {data.roundName}
                </h2>
                <p className="text-sm text-neutral-500">
                  총 {totalCount}개 기업
                </p>
              </div>
              {totalCount > 0 && (
                <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-sm">
                  <span className="font-semibold text-neutral-900">
                    {uploadedCount}
                  </span>
                  <span className="text-neutral-400">/</span>
                  <span className="text-neutral-500">{totalCount}</span>
                  <span className="text-neutral-500">업로드 완료</span>
                </div>
              )}
            </div>

            {data.companies.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white py-16 text-center">
                <svg
                  className="mb-3 h-10 w-10 text-neutral-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm text-neutral-400">
                  등록된 기업이 없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.companies.map((item: any, index: number) => {
                  const companyName =
                    (item.company as any)?.name ?? "알 수 없음";
                  const hasPdf = !!item.pdf_path;
                  const isUploading = uploadingIds.has(item.id);
                  const selectedFile = selectedFiles[item.id];
                  const submittedAt: string | null = item.submitted_at;
                  const originalFilename: string | null = item.original_filename;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      {/* 순번 */}
                      <span className="w-6 shrink-0 text-center text-sm font-medium text-neutral-300">
                        {index + 1}
                      </span>

                      {/* 기업명 + 상태 + 제출 정보 */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-neutral-900">
                            {companyName}
                          </span>
                          {hasPdf ? (
                            <Badge className="shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                              제출 완료
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-neutral-400"
                            >
                              미업로드
                            </Badge>
                          )}
                        </div>
                        {hasPdf && (originalFilename || submittedAt) && (
                          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                            {originalFilename && (
                              <span className="truncate max-w-[180px]" title={originalFilename}>
                                {originalFilename}
                              </span>
                            )}
                            {originalFilename && submittedAt && (
                              <span>·</span>
                            )}
                            {submittedAt && (
                              <span className="shrink-0">
                                {new Date(submittedAt).toLocaleString("ko-KR", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 파일 선택 */}
                      <div className="w-56 shrink-0">
                        <FileDropZone
                          rowId={item.id}
                          selectedFile={selectedFile}
                          onFileSelect={handleFileSelect}
                        />
                      </div>

                      {/* 업로드 버튼 */}
                      <Button
                        size="sm"
                        onClick={() => handleUpload(item.id)}
                        disabled={isUploading || !selectedFile}
                        className="shrink-0"
                      >
                        {isUploading ? (
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="h-3.5 w-3.5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            업로드 중
                          </span>
                        ) : (
                          "업로드"
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* 초기 상태 (검색 전) */}
        {!data && !isLoading && !isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
              <svg
                className="h-8 w-8 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-400">
              심사 ID를 입력하고 검색하세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
