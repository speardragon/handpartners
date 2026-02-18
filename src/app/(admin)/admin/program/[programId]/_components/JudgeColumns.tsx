"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  EllipsisVertical,
  NotepadText,
  Pencil,
  Trash2,
  Download,
  Play,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  deleteJudgingRound,
  updateJudgingRoundStatus,
  JudgingRoundWithCounts,
  JudgingRoundStatus,
} from "@/actions/judging_round-action";
import JudgeEditForm from "./JudgeEditForm";
import { useRouter } from "next/navigation";
import { getAllJudgeEvaluations } from "@/actions/evaluation-action";
import type { ProgramRow } from "@/actions/program-action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import JudgingRoundDetailDialogContent from "./JudgingRoundDetailDialogContent";
import { Button } from "@/components/ui/button";

function JudgeActionsCell({
  row,
}: {
  row: { original: JudgingRoundWithCounts };
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const judgingRoundId = Number(row.original.id);
  const programId = Number(row.original.program_id);
  const programName = row.original.program?.name ?? "";
  const currentStatus = row.original.status as JudgingRoundStatus;

  const handleStatusChange = async (newStatus: JudgingRoundStatus) => {
    setIsStatusUpdating(true);
    setOpenMenu(false);
    try {
      await updateJudgingRoundStatus(judgingRoundId, newStatus);
      const statusLabel =
        newStatus === "IN_PROGRESS"
          ? "심사중"
          : newStatus === "COMPLETED"
            ? "심사 종료"
            : "심사전";
      toast.success(`상태가 '${statusLabel}'(으)로 변경되었습니다.`);
      queryClient.invalidateQueries({ queryKey: ["judging_rounds"] });
    } catch {
      toast.error("상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const deleteHandler = async (id: number) => {
    await deleteJudgingRound(id);
    toast.success("심사가 삭제되었습니다.");
    queryClient.invalidateQueries({ queryKey: ["judging_rounds"] });
  };

  const handleBulkDownload = async () => {
    setIsBulkDownloading(true);
    setOpenMenu(false);
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
      const programInfo = { id: programId, name: programName } as ProgramRow;

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

  return (
    <>
      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-xl lg:max-w-2xl">
          <SheetHeader className="border-b border-neutral-100 px-6 py-4">
            <SheetTitle>심사 수정</SheetTitle>
            <SheetDescription>{row.original.name}</SheetDescription>
          </SheetHeader>
          <JudgeEditForm
            setOpenEdit={setOpenEdit}
            programId={programId}
            judgingRoundId={judgingRoundId}
            judgingRoundInfo={{
              name: row.original.name ?? "",
              description: row.original.description ?? "",
              start_date: row.original.start_date ?? "",
              end_date: row.original.end_date ?? "",
            }}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>심사 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteHandler(judgingRoundId)}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => {
              setOpenEdit(true);
              setOpenMenu(false);
            }}
          >
            <Pencil className="h-4 w-4" /> 심사 수정
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => router.push(`/admin/${judgingRoundId}`)}
          >
            <NotepadText className="h-4 w-4" /> 심사 결과 확인
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {currentStatus !== "IN_PROGRESS" && (
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              disabled={isStatusUpdating}
              onClick={() => handleStatusChange("IN_PROGRESS")}
            >
              <Play className="h-4 w-4" /> 심사 시작
            </DropdownMenuItem>
          )}

          {currentStatus !== "COMPLETED" && (
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              disabled={isStatusUpdating}
              onClick={() => handleStatusChange("COMPLETED")}
            >
              <Square className="h-4 w-4" /> 심사 종료
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            disabled={isBulkDownloading}
            onClick={handleBulkDownload}
          >
            <Download className="h-4 w-4" />
            {isBulkDownloading ? "다운로드 중..." : "보고서 일괄 저장"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
            onClick={() => {
              setOpenDelete(true);
              setOpenMenu(false);
            }}
          >
            <Trash2 className="h-4 w-4" /> 심사 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const judgeColumns: ColumnDef<JudgingRoundWithCounts>[] = [
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "심사 이름",
    size: 200,
    cell: ({ row, getValue }) => {
      const judgingRoundId = Number(row.original.id);
      return (
        <Dialog>
          <DialogTrigger className="cursor-pointer break-all text-left font-medium text-neutral-900 hover:underline">
            {`${getValue()}`}
          </DialogTrigger>
          <DialogContent className="h-[80vh] max-w-[90vw] lg:max-w-[80vw]">
            <DialogHeader>
              <DialogTitle>{`${getValue()}`}</DialogTitle>
            </DialogHeader>
            <JudgingRoundDetailDialogContent judgingRoundId={judgingRoundId} />
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    size: 100,
    cell: ({ getValue }) => {
      const status = getValue() as JudgingRoundStatus;
      const config = {
        PENDING: {
          label: "심사전",
          className: "bg-neutral-100 text-neutral-600",
        },
        IN_PROGRESS: {
          label: "심사중",
          className: "bg-blue-50 text-blue-700",
        },
        COMPLETED: {
          label: "심사 종료",
          className: "bg-green-50 text-green-700",
        },
      } as const;
      const { label, className } = config[status] ?? config.PENDING;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "number_of_companies",
    header: "참여 기업",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ getValue }) => (
      <span className="tabular-nums">{`${getValue()}`}개</span>
    ),
  },
  {
    accessorKey: "number_of_users",
    header: "심사위원",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ getValue }) => (
      <span className="tabular-nums">{`${getValue()}`}명</span>
    ),
  },
  {
    accessorKey: "description",
    header: "설명",
    meta: { className: "hidden md:table-cell" },
    cell: ({ getValue }) => {
      const description = (getValue() ?? "").toString();
      return (
        <div
          className="max-w-[300px] truncate text-neutral-500"
          title={description}
        >
          {description || "설명 없음"}
        </div>
      );
    },
  },
  {
    id: "dateRange",
    header: "기간",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => {
      const startDate = row.original.start_date ?? "";
      const endDate = row.original.end_date ?? "";
      if (!startDate && !endDate)
        return <span className="text-neutral-400">-</span>;
      return (
        <span className="tabular-nums text-neutral-600">
          {startDate} ~ {endDate}
        </span>
      );
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <JudgeActionsCell row={row} />,
  },
];
