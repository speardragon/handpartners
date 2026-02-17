"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserEditDialog from "./UserEditDialog";
import useDialogOpenStore from "@/store/useDialogOpenStore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserRow } from "@/actions/user-actions";
import { DataTablePagination } from "../../_components/DataTablePagination";
import UserCreateDialog from "./UserCreateDialog";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalPages: number;
  isFetching?: boolean;
}

const SKELETON_ROW_COUNT = 10;

export function UserDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  totalPages,
  isFetching,
}: DataTableProps<TData, TValue>) {
  const { setOpen, setCreateOpen } = useDialogOpenStore((state) => state);

  const [userId, setUserId] = useState<string>();
  const [userProfile, setUserProfile] = useState<Partial<UserRow>>({
    username: "",
    role: "",
    email: "",
    affiliation: "",
    position: "",
    phone_number: "",
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    pageCount: totalPages,
    state: {
      pagination,
    },
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
    onPaginationChange: setPagination,
  });

  const visibleColumns = table.getVisibleLeafColumns();

  useEffect(() => {
    if (userProfile.username !== "") {
      setOpen(true);
    }
  }, [userProfile]);

  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
      <UserEditDialog userId={userId} userProfile={userProfile} />
      <UserCreateDialog />

      <div className="flex w-full items-center justify-between">
        <p className="text-xs text-neutral-500 sm:text-sm">
          목록을 클릭하면 수정할 수 있습니다
        </p>
        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">사용자 추가</span>
          <span className="sm:hidden">추가</span>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-neutral-50 hover:bg-neutral-50"
              >
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { className?: string }
                    | undefined;
                  return (
                    <TableHead
                      className={cn(
                        "whitespace-nowrap px-3 py-2.5 text-xs font-semibold text-neutral-600 sm:px-4",
                        meta?.className
                      )}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIdx) => (
                <TableRow key={`skeleton-${rowIdx}`}>
                  {visibleColumns.map((col) => {
                    const meta = col.columnDef.meta as
                      | { className?: string }
                      | undefined;
                    return (
                      <TableCell
                        key={col.id}
                        className={cn("px-3 py-3 sm:px-4", meta?.className)}
                      >
                        <Skeleton className="h-5 w-full rounded" />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer transition-colors hover:bg-neutral-50"
                  onClick={() => {
                    setUserId(row.getValue("id"));
                    setUserProfile({
                      username: row.getValue("username"),
                      role: row.getValue("role"),
                      email: row.getValue("email"),
                      affiliation: row.getValue("affiliation"),
                      position: row.getValue("position"),
                      phone_number: row.getValue("phone_number"),
                    });
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { className?: string }
                      | undefined;
                    return (
                      <TableCell
                        className={cn(
                          "whitespace-nowrap px-3 py-3 text-sm text-neutral-700 sm:px-4",
                          meta?.className
                        )}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-neutral-500"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end">
        {isFetching ? (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div />
        )}
        <DataTablePagination table={table} pagination={pagination} />
      </div>
    </div>
  );
}
