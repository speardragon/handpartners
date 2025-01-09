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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ProgramRow } from "@/actions/program-action";
import Loading from "@/app/_components/Loading";
import { Plus } from "lucide-react";
import { DataTablePagination } from "../../../_components/DataTablePagination";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import JudgeCreateSheet from "./JudgeCreateSheet";

interface DataTableProps<TData, TValue> {
  programId: number;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalPages: number;
}

export function JudgeDataTable<TData, TValue>({
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

  return (
    <div className="rounded-lg border space-y-2 shadow-lg p-4 font-medium overflow-y-auto">
      <JudgeCreateSheet programId={programId} />
      <div className="flex w-full justify-between items-center">
        <Button
          onClick={() => router.back()}
          className="p-4 border border-gray-300 hover:border-gray-400 hover:bg-gray-100 bg-transparent text-gray-800"
        >
          {"<"}
        </Button>
        <button
          onClick={(e) => {
            setCreateOpen(true);
          }}
          className="flex p-2 py-1 pr-3 border border-blue-600 text-xs gap-2 rounded-lg bg-blue-300 text-black hover:bg-blue-400"
        >
          <Plus className="w-4 h-4" />
          심사 추가
        </button>
      </div>
      <Table className="container relative py-2 mx-auto overflow-y-auto border rounded-full">
        <TableHeader className="sticky top-0 bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="p-2 px-6" key={header.id}>
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="bg-white hover:bg-white"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className="p-3 px-6 text-gray-600"
                    style={{ width: cell.column.getSize() }}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center ">
                등록된 심사가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} pagination={pagination} />
    </div>
  );
}
