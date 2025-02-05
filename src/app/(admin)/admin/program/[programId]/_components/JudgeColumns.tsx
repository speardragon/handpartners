"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
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
import { EllipsisVertical, NotepadText, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  deleteJudgingRound,
  JudgingRoundRow,
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

export const judgeColumns: ColumnDef<Partial<JudgingRoundRow>>[] = [
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "심사 이름",
    size: 300,
    cell: ({ row, getValue }) => {
      const judgingRoundId = Number(row.original.id);
      return (
        <Dialog>
          <DialogTrigger className="cursor-pointer text-blue-600 hover:underline text-left break-all">
            {`${getValue()}`}
          </DialogTrigger>
          <DialogContent className="min-w-[80vw] h-[80vh]">
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
    header: "참여 기업 수",
  },
  {
    accessorKey: "number_of_users",
    header: "심사위원 수",
  },
  {
    accessorKey: "description",
    header: "설명",
    cell: ({ getValue }) => {
      const description = (getValue() ?? "").toString();
      return (
        <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
          {description}
        </div>
      );
    },
  },
  {
    id: "dateRange",
    header: "기간",
    cell: ({ row }) => {
      const startDate = row.original.start_date ?? "";
      const endDate = row.original.end_date ?? "";
      return (
        <div className="w-[130px]">
          {startDate} ~ {endDate}
        </div>
      );
    },
  },
  {
    // 드롭다운 메뉴 액션 컬럼
    id: "actions",
    cell: ({ row }) => {
      const [openEdit, setOpenEdit] = useState(false);
      const [openDelete, setOpenDelete] = useState(false);
      const [openMenu, setOpenMenu] = useState(false);

      const queryClient = useQueryClient();
      const router = useRouter();

      const deleteHandler = async (judgingRoundId: number) => {
        const result = await deleteJudgingRound(judgingRoundId);
        toast.success("프로그램이 삭제되었습니다.", result);
        queryClient.invalidateQueries({ queryKey: ["judging_rounds"] });
      };

      const judgingRoundId = Number(row.original.id?.toString());
      const programId = Number(row.original.program_id?.toString());
      return (
        <>
          <Sheet open={openEdit} onOpenChange={setOpenEdit}>
            <SheetContent className="min-w-[800px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>심사 수정</SheetTitle>
                <SheetDescription>{row.original.name}</SheetDescription>
                <Separator />
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
                  className="bg-red-500"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
            <DropdownMenuTrigger className="p-2 border border-gray-300 rounded-lg hover:border hover:border-gray-400">
              <EllipsisVertical size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>심사 작업</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-gray-700 cursor-pointer hover:text-black"
                onClick={() => {
                  setOpenEdit(true);
                  setOpenMenu(false);
                }}
              >
                <Pencil /> 심사 수정
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-gray-700 cursor-pointer hover:text-black"
                onClick={() => {
                  router.push(`/admin/${judgingRoundId}`);
                }}
              >
                <NotepadText /> 심사 결과 확인
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0 text-gray-700 hover:text-black">
                <FeedbackToExcelButton
                  className="flex items-center justify-start w-full gap-2 p-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-100 hover:text-black"
                  judgingRoundId={judgingRoundId}
                />
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0 text-gray-700 hover:text-black">
                <ScoreToExcelButton
                  className="flex items-center justify-start w-full gap-2 p-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-100 hover:text-black"
                  judgingRoundId={judgingRoundId}
                />
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0 text-gray-700 hover:text-black">
                <PdfDownloadButton
                  className="flex items-center justify-start w-full gap-2 p-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-100 hover:text-black"
                  programId={programId}
                  judgingRoundId={judgingRoundId}
                />
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-gray-700 hover:text-black"
                onClick={() => {
                  setOpenDelete(true);
                  setOpenMenu(false);
                }}
              >
                <Trash color="red" /> 심사 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
