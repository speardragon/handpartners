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
import useDialogOpenStore from "@/store/useDialogOpenStore";
import { Dispatch, SetStateAction } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { DataTablePagination } from "../../../_components/DataTablePagination";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import JudgeCreateSheet from "./JudgeCreateSheet";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  isFetching: boolean;
  programId: number;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalPages: number;
}

const SKELETON_ROW_COUNT = 10;

export function JudgeDataTable<TData, TValue>({
  isFetching,
  programId,
  columns,
  data,
  pagination,
  setPagination,
  totalPages,
}: DataTableProps<TData, TValue>) {
  const { setCreateOpen } = useDialogOpenStore((state) => state);
  const router = useRouter();

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

  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
      <JudgeCreateSheet programId={programId} />

      <div className="flex w-full items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1.5 text-neutral-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">뒤로가기</span>
        </Button>
        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">심사 추가</span>
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
                  className="transition-colors hover:bg-neutral-50"
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { className?: string }
                      | undefined;
                    return (
                      <TableCell
                        className={cn(
                          "whitespace-nowrap px-3 text-sm text-neutral-700 sm:px-4",
                          meta?.className
                        )}
                        style={{ width: cell.column.getSize() }}
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
                  등록된 심사가 없습니다.
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
