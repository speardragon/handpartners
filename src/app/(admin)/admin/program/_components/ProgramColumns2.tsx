"use client";

import { deleteProgram, ProgramRow } from "@/actions/program-action";
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
import { EllipsisVertical, Map, Pencil, Trash } from "lucide-react";
import ProgramEditForm from "./ProgramEditForm";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const programColumns: ColumnDef<Partial<ProgramRow>>[] = [
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "프로그램 이름",
    size: 300,
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
    id: "addColumns",
    header: "",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          onClick={() => router.push(`/admin/program/${row.original.id}`)}
          className="p-0 px-4 hover:border hover:border-gray-400"
          variant="outline"
        >
          심사 관리 <Map className="ml-2 h-4 w-4" />
        </Button>
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

      const deleteHandler = async (programId: number) => {
        const result = await deleteProgram(programId);
        toast.success("프로그램이 삭제되었습니다.", result);
        queryClient.invalidateQueries({ queryKey: ["programs"] });
      };

      const programId = Number(row.original.id?.toString());
      return (
        <>
          <Sheet open={openEdit} onOpenChange={setOpenEdit}>
            <SheetContent className="min-w-[600px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>프로그램 수정</SheetTitle>
                <SheetDescription></SheetDescription>
                <Separator />
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
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>프로그램 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  관련된 심사 및 피드백이 전부 삭제됩니다. 정말로
                  삭제하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteHandler(programId)}
                  className="bg-red-500"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
            <DropdownMenuTrigger className="border border-gray-300 p-2 rounded-lg hover:border hover:border-gray-400">
              <EllipsisVertical size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>프로그램 작업</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-gray-700 hover:text-black"
                onClick={() => {
                  setOpenEdit(true);
                  setOpenMenu(false);
                }}
              >
                <Pencil /> 프로그램 수정
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-gray-700 hover:text-black"
                onClick={() => {
                  setOpenDelete(true);
                  setOpenMenu(false);
                }}
              >
                <Trash color="red" /> 프로그램 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
