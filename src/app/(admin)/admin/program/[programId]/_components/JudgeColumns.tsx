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
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  deleteJudgingRound,
  JudgingRoundWithCounts,
} from "@/actions/judging_round-action";
import JudgeEditForm from "./JudgeEditForm";
import { useRouter } from "next/navigation";
import FeedbackToExcelButton from "@/app/(home)/_components/FeedbackToExcelButton";
import PdfDownloadButton from "@/app/(home)/_components/PdfDownloadButton";
import ScoreToExcelButton from "@/app/(home)/_components/ScoreToExcelButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import JudgingRoundDetailDialogContent from "./JudgingRoundDetailDialogContent";
import { Button } from "@/components/ui/button";

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
          <DialogTrigger className="cursor-pointer text-neutral-900 font-medium hover:underline text-left break-all">
            {`${getValue()}`}
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] h-[80vh] lg:max-w-[80vw]">
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
      if (!startDate && !endDate) return <span className="text-neutral-400">-</span>;
      return (
        <span className="text-neutral-600 tabular-nums">
          {startDate} ~ {endDate}
        </span>
      );
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => {
      const [openEdit, setOpenEdit] = useState(false);
      const [openDelete, setOpenDelete] = useState(false);
      const [openMenu, setOpenMenu] = useState(false);

      const queryClient = useQueryClient();
      const router = useRouter();

      const deleteHandler = async (judgingRoundId: number) => {
        await deleteJudgingRound(judgingRoundId);
        toast.success("심사가 삭제되었습니다.");
        queryClient.invalidateQueries({ queryKey: ["judging_rounds"] });
      };

      const judgingRoundId = Number(row.original.id);
      const programId = Number(row.original.program_id);
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
                onClick={() => {
                  router.push(`/admin/${judgingRoundId}`);
                }}
              >
                <NotepadText className="h-4 w-4" /> 심사 결과 확인
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="p-0">
                <FeedbackToExcelButton
                  className="flex w-full items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm"
                  judgingRoundId={judgingRoundId}
                />
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0">
                <ScoreToExcelButton
                  className="flex w-full items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm"
                  judgingRoundId={judgingRoundId}
                />
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0">
                <PdfDownloadButton
                  className="flex w-full items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm"
                  programId={programId}
                  judgingRoundId={judgingRoundId}
                />
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
    },
  },
];
