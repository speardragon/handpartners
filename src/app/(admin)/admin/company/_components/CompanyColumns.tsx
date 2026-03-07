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
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { CompanyRow, deleteCompany } from "@/actions/company-action";
import CompanyEditForm from "./CompanyEditForm";
import { companyQueries } from "@/queries";

function CompanyActionsCell({
  row,
}: {
  row: { original: Partial<CompanyRow> };
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const queryClient = useQueryClient();

  const deleteHandler = async (companyId: number) => {
    await deleteCompany(companyId);
    toast.success("기업이 삭제되었습니다.");
    queryClient.invalidateQueries({ queryKey: companyQueries.all() });
  };

  const companyId = Number(row.original.id?.toString());

  return (
    <div className="flex w-full justify-end">
      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent className="w-[calc(100%-2rem)] overflow-y-auto sm:min-w-150">
          <SheetHeader>
            <SheetTitle>기업 수정</SheetTitle>
            <SheetDescription>
              {row.original.name} / {row.original.representative_name}
            </SheetDescription>
            <Separator />
          </SheetHeader>
          <CompanyEditForm
            companyId={companyId}
            companyInfo={{
              name: row.original.name ?? "",
              representative_name: row.original.representative_name ?? "",
              description: row.original.description ?? "",
            }}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>기업 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              관련된 심사 및 피드백이 전부 삭제됩니다. 정말로 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteHandler(companyId)}
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
          <DropdownMenuLabel>기업 작업</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setOpenEdit(true);
              setOpenMenu(false);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            기업 수정
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => {
              setOpenDelete(true);
              setOpenMenu(false);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            기업 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const companyColumns: ColumnDef<Partial<CompanyRow>>[] = [
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "기업명",
    size: 160,
  },
  {
    accessorKey: "representative_name",
    header: "대표자 성명",
    size: 140,
    meta: { className: "hidden sm:table-cell" },
  },
  {
    accessorKey: "description",
    header: "기업 소개",
    meta: { className: "hidden md:table-cell" },
    cell: ({ getValue }) => {
      const description = (getValue() ?? "").toString();
      return (
        <div className="max-w-100 truncate" title={description}>
          {description || <span className="text-neutral-400">소개 없음</span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CompanyActionsCell row={row} />,
  },
];
