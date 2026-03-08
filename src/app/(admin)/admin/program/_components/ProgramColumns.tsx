"use client";

import { deleteProgram, ProgramRow } from "@/actions/program-action";
import { executeAction, getErrorMessage } from "@/lib/action";
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
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  Pencil,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
import ProgramEditForm from "./ProgramEditForm";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { programQueries } from "@/queries";

function ProgramManageCell({
  row,
}: {
  row: { original: Partial<ProgramRow> };
}) {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/admin/program/${row.original.id}/judging`)}
      variant="outline"
      size="sm"
      className="gap-1.5 whitespace-nowrap"
    >
      프로그램 관리
      <SquareArrowOutUpRight size={14} />
    </Button>
  );
}

function ProgramActionsCell({
  row,
}: {
  row: { original: Partial<ProgramRow> };
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const queryClient = useQueryClient();
  const programId = Number(row.original.id?.toString());

  const deleteHandler = async (id: number) => {
    try {
      await executeAction(deleteProgram(id));
      toast.success("프로그램이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: programQueries.all() });
    } catch (error) {
      toast.error(getErrorMessage(error, "프로그램을 삭제하지 못했습니다."));
    }
  };

  return (
    <>
      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-xl lg:max-w-2xl">
          <SheetHeader className="shrink-0 border-b border-neutral-100 px-6 py-4">
            <SheetTitle>프로그램 수정</SheetTitle>
            <SheetDescription>{row.original.name}</SheetDescription>
          </SheetHeader>
          <ProgramEditForm
            setOpenEdit={setOpenEdit}
            programId={programId}
            programInfo={{
              name: row.original.name ?? "",
              description: row.original.description ?? "",
              start_date: row.original.start_date ?? "",
              end_date: row.original.end_date ?? "",
              categories: row.original.categories ?? [],
            }}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>프로그램 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              관련된 심사 및 피드백이 전부 삭제됩니다. 정말로 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteHandler(programId)}
              className="bg-red-500 hover:bg-red-600"
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
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuLabel>프로그램 작업</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setOpenEdit(true);
              setOpenMenu(false);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            프로그램 수정
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => {
              setOpenDelete(true);
              setOpenMenu(false);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            프로그램 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const programColumns: ColumnDef<Partial<ProgramRow>>[] = [
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "프로그램 이름",
    size: 150,
  },
  {
    accessorKey: "description",
    header: "설명",
    meta: { className: "hidden md:table-cell" },
    cell: ({ getValue }) => {
      const description = (getValue() ?? "").toString();
      return (
        <div
          title={description}
          className="max-w-75 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {description}
        </div>
      );
    },
  },
  {
    id: "dateRange",
    header: "기간",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => {
      const startDate = row.original.start_date ?? "";
      const endDate = row.original.end_date ?? "";
      return (
        <div className="whitespace-nowrap">
          {startDate} ~ {endDate}
        </div>
      );
    },
  },
  {
    id: "addColumns",
    header: "",
    cell: ({ row }) => <ProgramManageCell row={row} />,
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <ProgramActionsCell row={row} />,
  },
];
