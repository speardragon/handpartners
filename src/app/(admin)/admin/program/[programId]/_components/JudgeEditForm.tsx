"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { judgingRoundQueries } from "@/queries";
import JudgeCompanySelect from "./JudgeCompanySelect";
import JudgeUserSelect from "./JudgeUserSelect";
import JudgeCriteriaSelect from "./JudgeCriteriaSelect";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  FileText,
  FileUp,
  GripVertical,
  Info,
  Pencil,
  Users,
} from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useJudgeEditMutations } from "../_hooks/useJudgeEditMutations";
import { getCompanyPdfDownloadUrl } from "@/actions/judging_rounds_company-action";
import type { JudgingRoundStatus } from "@/actions/judging_round-action";

type JudgeTab = "overview" | "companies" | "judges" | "criteria";

type Props = {
  programId: number;
  judgingRoundId: string;
  overview: {
    programName: string;
    programDescription: string | null;
    startDate: string | null;
    endDate: string | null;
    status: JudgingRoundStatus;
    companyCount: number;
    judgeCount: number;
  };
};

export interface SimpleCompany {
  id: number;
  name: string;
  pdf_file?: File;
  pdf_path?: string;
  group_name?: string;
  judge_num?: number;
  original_filename?: string | null;
  submitted_at?: string | null;
}

export interface SimpleUser {
  id: string;
  name: string;
  affiliation: string | null;
  group_name?: string;
}

export interface SimpleCriteria {
  id?: number;
  item_name: string;
  points: number;
  description?: string | null;
}

const STATUS_LABEL: Record<JudgingRoundStatus, string> = {
  PENDING: "심사 전",
  IN_PROGRESS: "심사 중",
  COMPLETED: "심사 종료",
};

const TABS: {
  key: JudgeTab;
  label: string;
  icon: typeof ClipboardCheck;
}[] = [
  { key: "overview", label: "개요", icon: ClipboardCheck },
  { key: "companies", label: "참여 기업", icon: Building2 },
  { key: "judges", label: "심사자", icon: Users },
  { key: "criteria", label: "심사 기준", icon: FileText },
];

function formatPeriod(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "일정 미정";
  return `${startDate || "-"} ~ ${endDate || "-"}`;
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-neutral-200 pb-5 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-neutral-950">{title}</h3>
        <p className="text-sm leading-6 text-neutral-600">{description}</p>
      </div>
      {action}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        tone === "success" &&
          "border-emerald-200 bg-emerald-50/80 text-emerald-950",
        tone === "warning" && "border-amber-200 bg-amber-50/80 text-amber-950",
        tone === "default" && "border-neutral-200 bg-white text-neutral-950"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-2 text-sm text-neutral-600">{hint}</p>}
    </div>
  );
}

function ChecklistItem({
  label,
  done,
  detail,
}: {
  label: string;
  done: boolean;
  detail: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4",
        done
          ? "border-emerald-200 bg-emerald-50/80"
          : "border-amber-200 bg-amber-50/80"
      )}
    >
      {done ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      )}
      <div>
        <p className="text-sm font-semibold text-neutral-950">{label}</p>
        <p className="mt-1 text-sm leading-6 text-neutral-600">{detail}</p>
      </div>
    </div>
  );
}

function SortableCompanyItem({
  company,
  index,
  isPdfEditing,
  isDownloading,
  onClickPdfEdit,
  onClickPdfView,
  onClickPdfDownload,
  onFileChange,
  onGroupChange,
}: {
  company: SimpleCompany;
  index: number;
  isPdfEditing: boolean;
  isDownloading: boolean;
  onClickPdfEdit: (companyId: number) => void;
  onClickPdfView: (company: SimpleCompany) => void;
  onClickPdfDownload: (company: SimpleCompany) => void;
  onFileChange: (companyId: number, file?: File) => void;
  onGroupChange: (companyId: number, value: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: company.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasSavedPdf = Boolean(company.pdf_path);
  const hasPendingFile = Boolean(company.pdf_file);
  const pdfLabel = hasPendingFile
    ? company.pdf_file?.name
    : company.original_filename || "등록된 발표자료가 없습니다.";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <button
            type="button"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
            {...attributes}
            {...listeners}
            aria-label={`${company.name} 순서 변경`}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-2 py-1 text-xs">
                순서 {index + 1}
              </Badge>
              <h4 className="text-base font-semibold text-neutral-950">
                {company.name}
              </h4>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="rounded-full bg-neutral-100 px-2.5 py-1">
                그룹: {company.group_name?.trim() || "미지정"}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1">
                발표자료:{" "}
                {hasSavedPdf
                  ? "등록됨"
                  : hasPendingFile
                    ? "업로드 예정"
                    : "없음"}
              </span>
              {company.submitted_at && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-1">
                  업로드일 {company.submitted_at.slice(0, 10)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => onClickPdfEdit(company.id)}
          >
            <Pencil className="h-4 w-4" />
            {isPdfEditing ? "취소" : hasSavedPdf ? "자료 변경" : "자료 등록"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={!hasSavedPdf}
            onClick={() => onClickPdfView(company)}
          >
            <Eye className="h-4 w-4" />
            보기
          </Button>
          <LoadingButton
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            loading={isDownloading}
            disabled={!hasSavedPdf}
            onClick={() => onClickPdfDownload(company)}
          >
            <Download className="h-4 w-4" />
            저장
          </LoadingButton>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            발표자료
          </p>
          <p className="mt-2 truncate text-sm font-medium text-neutral-900">
            {pdfLabel}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            PDF 파일만 권장됩니다. 변경 사항은 기업 정보 수정 버튼을 눌러야
            저장됩니다.
          </p>
          {isPdfEditing && (
            <div className="mt-3">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50">
                <FileUp className="h-4 w-4" />
                PDF 파일 선택
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) =>
                    onFileChange(company.id, e.target.files?.[0] || undefined)
                  }
                />
              </label>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            그룹명
          </p>
          <Input
            className="mt-2 h-10 bg-white"
            placeholder="예: A조, 바이오 트랙"
            value={company.group_name ?? ""}
            onChange={(e) => onGroupChange(company.id, e.target.value)}
          />
          <p className="mt-2 text-xs text-neutral-500">
            그룹명은 심사자 배정과 결과 해석에 같이 사용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JudgeEditForm({
  programId,
  judgingRoundId,
  overview,
}: Props) {
  const [activeTab, setActiveTab] = useState<JudgeTab>("overview");
  const [targetList, setTargetList] = useState<SimpleCompany[]>([]);
  const [targetUserList, setTargetUserList] = useState<SimpleUser[]>([]);
  const [targetCriteriaList, setTargetCriteriaList] = useState<
    SimpleCriteria[]
  >([]);
  const [pdfEditMap, setPdfEditMap] = useState<Record<number, boolean>>({});
  const [pdfDownloadMap, setPdfDownloadMap] = useState<Record<number, boolean>>(
    {}
  );
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [isCompanyStateHydrated, setIsCompanyStateHydrated] = useState(false);
  const [isUserStateHydrated, setIsUserStateHydrated] = useState(false);
  const [isCriteriaStateHydrated, setIsCriteriaStateHydrated] = useState(false);

  const { usersMutation, companiesMutation, criteriaMutation } =
    useJudgeEditMutations(judgingRoundId);
  const { data: roundCompanies } = useQuery(
    judgingRoundQueries.companies.byRound(judgingRoundId)
  );
  const { data: roundUsers } = useQuery(
    judgingRoundQueries.users.byRound(judgingRoundId)
  );
  const { data: roundCriteria } = useQuery(
    judgingRoundQueries.criteria.byRound(judgingRoundId)
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    if (isCompanyStateHydrated || !roundCompanies) return;

    setTargetList(
      roundCompanies.map((item) => ({
        id: item.company_id,
        name: item.company?.name || "",
        pdf_path: item.pdf_path ?? undefined,
        group_name: item.group_name ?? undefined,
        judge_num: item.judge_num ?? undefined,
        original_filename: item.original_filename ?? undefined,
        submitted_at: item.submitted_at ?? undefined,
      }))
    );
    setIsCompanyStateHydrated(true);
  }, [isCompanyStateHydrated, roundCompanies]);

  useEffect(() => {
    if (isUserStateHydrated || !roundUsers) return;

    setTargetUserList(
      roundUsers.map((item) => ({
        id: item.user_id,
        name: item.user?.username || "",
        affiliation: item.user?.affiliation || "",
        group_name: item.group_name ?? undefined,
      }))
    );
    setIsUserStateHydrated(true);
  }, [isUserStateHydrated, roundUsers]);

  useEffect(() => {
    if (isCriteriaStateHydrated || !roundCriteria) return;

    setTargetCriteriaList(
      roundCriteria.map((item) => ({
        id: item.id,
        item_name: item.item_name,
        points: item.points,
        description: item.description ?? null,
      }))
    );
    setIsCriteriaStateHydrated(true);
  }, [isCriteriaStateHydrated, roundCriteria]);

  const companyMissingGroupCount = useMemo(
    () => targetList.filter((company) => !company.group_name?.trim()).length,
    [targetList]
  );
  const companyMissingPdfCount = useMemo(
    () =>
      targetList.filter(
        (company) => !company.pdf_path && !company.pdf_file?.name?.trim()
      ).length,
    [targetList]
  );
  const judgeMissingGroupCount = useMemo(
    () => targetUserList.filter((judge) => !judge.group_name?.trim()).length,
    [targetUserList]
  );
  const totalCriteriaPoints = useMemo(
    () =>
      targetCriteriaList.reduce(
        (sum, criteria) => sum + Number(criteria.points || 0),
        0
      ),
    [targetCriteriaList]
  );
  const invalidCriteriaCount = useMemo(
    () =>
      targetCriteriaList.filter(
        (criteria) => !criteria.item_name.trim() || Number(criteria.points) <= 0
      ).length,
    [targetCriteriaList]
  );

  const handleCompanyListChange = useCallback((newList: SimpleCompany[]) => {
    setIsCompanyStateHydrated(true);
    setTargetList(newList);
  }, []);

  const handleUserListChange = useCallback((newList: SimpleUser[]) => {
    setIsUserStateHydrated(true);
    setTargetUserList(newList);
  }, []);

  const handleCriteriaListChange = useCallback((newList: SimpleCriteria[]) => {
    setIsCriteriaStateHydrated(true);
    setTargetCriteriaList(newList);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      setTargetList((current) => {
        const oldIndex = current.findIndex((item) => item.id === active.id);
        const newIndex = current.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return current;
        return arrayMove(current, oldIndex, newIndex);
      });
    },
    [setTargetList]
  );

  const handleClickPdfEdit = useCallback((companyId: number) => {
    setPdfEditMap((prev) => ({ ...prev, [companyId]: !prev[companyId] }));
  }, []);

  const handleClickPdfView = useCallback(async (company: SimpleCompany) => {
    if (!company.pdf_path) return;

    try {
      const { downloadUrl } = await getCompanyPdfDownloadUrl(company.pdf_path);
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("발표자료를 여는 중 오류가 발생했습니다.");
    }
  }, []);

  const handleClickPdfDownload = useCallback(async (company: SimpleCompany) => {
    if (!company.pdf_path) return;

    setPdfDownloadMap((prev) => ({ ...prev, [company.id]: true }));

    try {
      const [{ saveAs }] = await Promise.all([import("file-saver")]);
      const { downloadUrl } = await getCompanyPdfDownloadUrl(company.pdf_path);
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("파일 다운로드에 실패했습니다.");
      }

      const blob = await response.blob();
      saveAs(blob, company.original_filename || `${company.name}_발표자료.pdf`);
    } catch {
      toast.error("발표자료 다운로드 중 오류가 발생했습니다.");
    } finally {
      setPdfDownloadMap((prev) => ({ ...prev, [company.id]: false }));
    }
  }, []);

  const handleBulkPresentationDownload = useCallback(async () => {
    const companiesWithPdf = targetList.filter((company) => company.pdf_path);

    if (companiesWithPdf.length === 0) {
      toast.error("다운로드할 발표자료가 없습니다.");
      return;
    }

    setIsBulkDownloading(true);

    try {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);

      const zip = new JSZip();

      await Promise.all(
        companiesWithPdf.map(async (company) => {
          const { downloadUrl } = await getCompanyPdfDownloadUrl(
            company.pdf_path!
          );
          const response = await fetch(downloadUrl);
          if (!response.ok) return;

          const blob = await response.blob();
          zip.file(
            company.original_filename || `${company.name}_발표자료.pdf`,
            blob
          );
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const date = new Date().toISOString().split("T")[0];
      saveAs(zipBlob, `발표자료_${date}.zip`);
      toast.success("발표자료 일괄 다운로드가 완료되었습니다.");
    } catch {
      toast.error("발표자료 다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsBulkDownloading(false);
    }
  }, [targetList]);

  const handleFileChange = useCallback(
    (companyId: number, file?: File) => {
      setTargetList((current) =>
        current.map((company) =>
          company.id === companyId
            ? {
                ...company,
                pdf_file: file,
                original_filename:
                  file?.name ?? company.original_filename ?? null,
              }
            : company
        )
      );
    },
    [setTargetList]
  );

  const handleGroupChange = useCallback((companyId: number, value: string) => {
    setTargetList((current) =>
      current.map((company) =>
        company.id === companyId ? { ...company, group_name: value } : company
      )
    );
  }, []);

  const handleUserGroupChange = useCallback((userId: string, value: string) => {
    setTargetUserList((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, group_name: value } : user
      )
    );
  }, []);

  return (
    <section className="rounded-[28px] border border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-sm">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as JudgeTab)}
        className="p-4 sm:p-6"
      >
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
                Judging Workspace
              </p>
              <div>
                <h2 className="text-2xl font-semibold text-neutral-950">
                  심사 상세 관리
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  기업, 심사자, 기준을 한 화면에서 구성하고 저장합니다. 탭마다
                  저장 버튼을 눌러야 실제 심사 설정에 반영됩니다.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatPeriod(overview.startDate, overview.endDate)}
              </Badge>
              <Badge variant="outline" className="px-3 py-1.5">
                {STATUS_LABEL[overview.status]}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {TABS.map(({ key, label, icon: Icon }) => {
              const countLabel =
                key === "companies"
                  ? `${targetList.length || overview.companyCount}개`
                  : key === "judges"
                    ? `${targetUserList.length || overview.judgeCount}명`
                    : key === "criteria"
                      ? `${targetCriteriaList.length}개`
                      : overview.programName;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-colors",
                    activeTab === key
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl",
                          activeTab === key
                            ? "bg-white/15 text-white"
                            : "bg-neutral-100 text-neutral-600"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold">{label}</span>
                    </div>
                    {key !== "overview" && (
                      <Badge
                        variant={activeTab === key ? "outline" : "secondary"}
                        className={cn(
                          "border-transparent px-2 py-0.5",
                          activeTab === key &&
                            "border-white/20 bg-white/10 text-white"
                        )}
                      >
                        {countLabel}
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-sm leading-6",
                      activeTab === key ? "text-white/80" : "text-neutral-600"
                    )}
                  >
                    {key === "overview" &&
                      "현재 심사 준비 상태를 한눈에 확인합니다."}
                    {key === "companies" &&
                      "참여 기업, 발표자료, 그룹 배정을 관리합니다."}
                    {key === "judges" &&
                      "심사자 선택과 그룹 매칭을 빠르게 정리합니다."}
                    {key === "criteria" &&
                      "평가 항목과 배점을 바로 수정합니다."}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <TabsContent value="overview" className="pt-6">
          <div className="space-y-6">
            <SectionHeader
              title={overview.programName}
              description={
                overview.programDescription?.trim() ||
                "프로그램 설명이 아직 등록되지 않았습니다."
              }
              action={
                <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
                  <p className="font-medium text-neutral-900">운영 기간</p>
                  <p className="mt-1">
                    {formatPeriod(overview.startDate, overview.endDate)}
                  </p>
                </div>
              }
            />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="심사 상태"
                value={STATUS_LABEL[overview.status]}
                hint="현재 심사 진행 단계"
                tone={overview.status === "COMPLETED" ? "success" : "default"}
              />
              <SummaryCard
                label="참여 기업"
                value={`${targetList.length || overview.companyCount}개`}
                hint={
                  companyMissingPdfCount > 0
                    ? `발표자료 미등록 ${companyMissingPdfCount}개`
                    : "발표자료 확인 완료"
                }
                tone={companyMissingPdfCount > 0 ? "warning" : "success"}
              />
              <SummaryCard
                label="심사자"
                value={`${targetUserList.length || overview.judgeCount}명`}
                hint={
                  judgeMissingGroupCount > 0
                    ? `그룹 미지정 ${judgeMissingGroupCount}명`
                    : "배정 정보 확인 완료"
                }
                tone={judgeMissingGroupCount > 0 ? "warning" : "success"}
              />
              <SummaryCard
                label="총 배점"
                value={`${totalCriteriaPoints}점`}
                hint={
                  invalidCriteriaCount > 0
                    ? `입력 확인 필요 ${invalidCriteriaCount}개`
                    : "기준 입력 상태 양호"
                }
                tone={invalidCriteriaCount > 0 ? "warning" : "success"}
              />
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <ChecklistItem
                label="참여 기업 구성이 준비되었는지"
                done={targetList.length > 0 && companyMissingGroupCount === 0}
                detail={
                  targetList.length === 0
                    ? "심사 대상 기업을 아직 선택하지 않았습니다."
                    : companyMissingGroupCount > 0
                      ? `그룹명이 비어 있는 기업이 ${companyMissingGroupCount}개 있습니다.`
                      : "모든 기업에 기본 정보가 입력되었습니다."
                }
              />
              <ChecklistItem
                label="심사자 배정이 준비되었는지"
                done={targetUserList.length > 0 && judgeMissingGroupCount === 0}
                detail={
                  targetUserList.length === 0
                    ? "심사자가 아직 추가되지 않았습니다."
                    : judgeMissingGroupCount > 0
                      ? `그룹 미지정 심사자가 ${judgeMissingGroupCount}명 있습니다.`
                      : "모든 심사자의 배정 그룹이 입력되었습니다."
                }
              />
              <ChecklistItem
                label="심사 기준이 준비되었는지"
                done={
                  targetCriteriaList.length > 0 && invalidCriteriaCount === 0
                }
                detail={
                  targetCriteriaList.length === 0
                    ? "심사 기준이 아직 없습니다."
                    : invalidCriteriaCount > 0
                      ? `이름 또는 배점 확인이 필요한 기준이 ${invalidCriteriaCount}개 있습니다.`
                      : "심사 기준과 배점 구성이 완료되었습니다."
                }
              />
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">
                      빠른 이동
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      가장 먼저 기업과 심사자를 구성하고, 마지막에 기준 탭에서
                      총 배점을 검토하는 흐름이 가장 안정적입니다.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("companies")}
                  >
                    기업 관리
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("judges")}
                  >
                    심사자 관리
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("criteria")}
                  >
                    기준 관리
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="pt-6">
          <div className="space-y-6">
            <SectionHeader
              title="참여 기업 관리"
              description="프로그램 참여 기업 중 심사에 포함할 기업을 선택하고, 드래그로 순서를 바꾼 뒤 그룹명과 발표자료를 입력합니다."
              action={
                <div className="flex flex-wrap gap-2">
                  <LoadingButton
                    type="button"
                    variant="outline"
                    className="gap-2"
                    loading={isBulkDownloading}
                    onClick={handleBulkPresentationDownload}
                  >
                    <Download className="h-4 w-4" />
                    발표자료 ZIP 저장
                  </LoadingButton>
                  <LoadingButton
                    type="button"
                    className="gap-2"
                    loading={companiesMutation.isPending}
                    onClick={() => companiesMutation.mutate(targetList)}
                  >
                    <Building2 className="h-4 w-4" />
                    기업 정보 수정
                  </LoadingButton>
                </div>
              }
            />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="선택 기업"
                value={`${targetList.length}개`}
                hint="심사 참여 기업 수"
              />
              <SummaryCard
                label="그룹 미입력"
                value={`${companyMissingGroupCount}개`}
                hint="그룹명 누락 기업"
                tone={companyMissingGroupCount > 0 ? "warning" : "success"}
              />
              <SummaryCard
                label="발표자료 미등록"
                value={`${companyMissingPdfCount}개`}
                hint="등록 전 기업"
                tone={companyMissingPdfCount > 0 ? "warning" : "success"}
              />
              <SummaryCard
                label="저장 안내"
                value="수동 저장"
                hint="선택/순서/자료 변경 후 버튼 클릭 필요"
              />
            </div>

            <JudgeCompanySelect
              judgingRoundId={judgingRoundId}
              programId={programId}
              targetList={targetList}
              onTargetListChange={handleCompanyListChange}
            />

            {targetList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
                <Building2 className="mx-auto h-8 w-8 text-neutral-300" />
                <p className="mt-3 text-sm font-medium text-neutral-900">
                  심사 참여 기업을 먼저 선택해주세요
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  왼쪽 목록에서 기업을 선택한 뒤 오른쪽으로 이동하면 세부 설정을
                  이어서 입력할 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">
                      세부 설정
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      순서 변경, 발표자료 등록, 그룹명 입력을 여기서
                      마무리합니다.
                    </p>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">
                    저장 대상 {targetList.length}개
                  </Badge>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={targetList.map((company) => company.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {targetList.map((company, index) => (
                        <SortableCompanyItem
                          key={company.id}
                          company={company}
                          index={index}
                          isPdfEditing={Boolean(pdfEditMap[company.id])}
                          isDownloading={Boolean(pdfDownloadMap[company.id])}
                          onClickPdfEdit={handleClickPdfEdit}
                          onClickPdfView={handleClickPdfView}
                          onClickPdfDownload={handleClickPdfDownload}
                          onFileChange={handleFileChange}
                          onGroupChange={handleGroupChange}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="judges" className="pt-6">
          <div className="space-y-6">
            <SectionHeader
              title="심사자 관리"
              description="심사자를 선택한 뒤 그룹명을 지정합니다. 그룹명은 기업 그룹과 같은 규칙으로 맞추는 것이 가장 이해하기 쉽습니다."
              action={
                <LoadingButton
                  type="button"
                  className="gap-2"
                  loading={usersMutation.isPending}
                  onClick={() => usersMutation.mutate(targetUserList)}
                >
                  <Users className="h-4 w-4" />
                  심사자 정보 수정
                </LoadingButton>
              }
            />

            <div className="grid gap-3 md:grid-cols-3">
              <SummaryCard
                label="선택 심사자"
                value={`${targetUserList.length}명`}
                hint="현재 심사 참여 인원"
              />
              <SummaryCard
                label="그룹 미입력"
                value={`${judgeMissingGroupCount}명`}
                hint="배정 확인 필요"
                tone={judgeMissingGroupCount > 0 ? "warning" : "success"}
              />
              <SummaryCard
                label="저장 안내"
                value="수동 저장"
                hint="선택/배정 변경 후 버튼 클릭 필요"
              />
            </div>

            <JudgeUserSelect
              judgingRoundId={judgingRoundId}
              targetList={targetUserList}
              onTargetListChange={handleUserListChange}
            />

            {targetUserList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
                <Users className="mx-auto h-8 w-8 text-neutral-300" />
                <p className="mt-3 text-sm font-medium text-neutral-900">
                  심사자를 먼저 선택해주세요
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  전체 심사자 목록에서 필요한 인원을 선택하면 아래에서 배정
                  그룹을 바로 설정할 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {targetUserList.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-neutral-950">
                          {user.name}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {user.affiliation || "소속 정보 없음"}
                        </p>
                      </div>
                      <Badge variant="secondary" className="px-2.5 py-1">
                        {user.group_name?.trim() ? "배정 완료" : "그룹 미입력"}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                        그룹명
                      </p>
                      <Input
                        className="mt-2 h-10"
                        placeholder="예: A조, 바이오 트랙"
                        value={user.group_name ?? ""}
                        onChange={(e) =>
                          handleUserGroupChange(user.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="pt-6">
          <div className="space-y-6">
            <SectionHeader
              title="심사 기준 관리"
              description="평가 항목, 배점, 설명을 바로 편집합니다. 항목명이 비어 있거나 배점이 0점이면 저장 전에 확인하는 편이 좋습니다."
              action={
                <LoadingButton
                  type="button"
                  className="gap-2"
                  loading={criteriaMutation.isPending}
                  onClick={() => criteriaMutation.mutate(targetCriteriaList)}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  심사 기준 수정
                </LoadingButton>
              }
            />

            <div className="grid gap-3 md:grid-cols-3">
              <SummaryCard
                label="기준 수"
                value={`${targetCriteriaList.length}개`}
                hint="현재 등록된 평가 항목"
              />
              <SummaryCard
                label="총 배점"
                value={`${totalCriteriaPoints}점`}
                hint="기준별 배점 합계"
                tone={totalCriteriaPoints > 0 ? "success" : "warning"}
              />
              <SummaryCard
                label="입력 확인"
                value={`${invalidCriteriaCount}개`}
                hint="이름 또는 배점 확인 필요"
                tone={invalidCriteriaCount > 0 ? "warning" : "success"}
              />
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <JudgeCriteriaSelect
                judgingRoundId={judgingRoundId}
                targetList={targetCriteriaList}
                onTargetListChange={handleCriteriaListChange}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
