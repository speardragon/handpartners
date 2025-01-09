"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import ProgramEditSheet from "./ProgramEditForm";
import { useQueryClient } from "@tanstack/react-query";
import { deleteProgram, ProgramRow } from "@/actions/program-action";
import { toast } from "sonner";

type Props = {
  programId?: number;
  programInfo: Partial<ProgramRow>;
};

export default function ProgramActionCell({ programId, programInfo }: Props) {
  // Dialog, Sheet가 열려 있는지 저장하는 state
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const queryClient = useQueryClient();

  const deleteHandler = async (programId: number) => {
    const result = await deleteProgram(programId);
    toast.success("프로그램이 삭제되었습니다.", result);
    queryClient.invalidateQueries({ queryKey: ["programs"] });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <EllipsisVertical size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>프로그램 작업</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* 수정 */}
          <DropdownMenuItem
            onClick={() => {
              setOpenEdit(true);
            }}
          >
            <Pencil size={14} />
            프로그램 수정
          </DropdownMenuItem>

          {/* 삭제 */}
          <DropdownMenuItem
            onClick={() => {
              setOpenDelete(true);
            }}
          >
            <Trash color="red" size={14} />
            프로그램 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 2) DropdownMenu 바깥에 Sheet와 AlertDialog를 위치 */}
      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>프로그램 수정</SheetTitle>
            <SheetDescription></SheetDescription>
            <ProgramEditSheet programId={programId} programInfo={programInfo} />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로그램 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDelete(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteHandler(programId);
                setOpenDelete(false);
              }}
              className="bg-red-500"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
