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
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CompanyRow, deleteCompany } from "@/actions/company-action";
import CompanyEditForm from "./CompanyEditForm";

export const companyColumns: ColumnDef<Partial<CompanyRow>>[] = [
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "기업명",
    size: 140,
  },
  {
    accessorKey: "description",
    header: "기업 소개",
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
    // 드롭다운 메뉴 액션 컬럼
    id: "actions",
    cell: ({ row }) => {
      const [openEdit, setOpenEdit] = useState(false);
      const [openDelete, setOpenDelete] = useState(false);
      const [openMenu, setOpenMenu] = useState(false);

      const queryClient = useQueryClient();

      const deleteHandler = async (companyId: number) => {
        const result = await deleteCompany(companyId);
        toast.success("기업이 삭제되었습니다.", result);
        queryClient.invalidateQueries({ queryKey: ["companies"] });
      };

      const companyId = Number(row.original.id?.toString());
      return (
        <div className="flex w-full justify-end">
          <Sheet open={openEdit} onOpenChange={setOpenEdit}>
            <SheetContent className="min-w-[600px]">
              <SheetHeader>
                <SheetTitle>기업 수정</SheetTitle>
                <SheetDescription>{row.original.name}</SheetDescription>
                <Separator />
              </SheetHeader>
              <CompanyEditForm
                companyId={companyId}
                companyInfo={{
                  name: row.original.name ?? "",
                  description: row.original.description ?? "",
                }}
              />
            </SheetContent>
          </Sheet>

          <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>기업 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  관련된 심사 및 피드백이 전부 삭제됩니다. 정말로
                  삭제하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteHandler(companyId)}
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
              <DropdownMenuLabel>기업 작업</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-gray-700 hover:text-black"
                onClick={() => {
                  setOpenEdit(true);
                  setOpenMenu(false);
                }}
              >
                <Pencil /> 기업 수정
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-gray-700 hover:text-black"
                onClick={() => {
                  setOpenDelete(true);
                  setOpenMenu(false);
                }}
              >
                <Trash color="red" /> 기업 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
