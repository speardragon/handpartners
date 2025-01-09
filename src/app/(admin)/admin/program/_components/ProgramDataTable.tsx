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
import { DataTablePagination } from "../../_components/DataTablePagination";
import Loading from "@/app/_components/Loading";
import ProgramCreateSheet from "./ProgramCreateSheet";
import { Plus } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalPages: number;
}

export function ProgramDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  totalPages,
}: DataTableProps<TData, TValue>) {
  const { setCreateOpen } = useDialogOpenStore((state) => state);

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
      <ProgramCreateSheet />
      <div className="flex w-full justify-end">
        <button
          onClick={(e) => {
            setCreateOpen(true);
          }}
          className="flex p-2 py-1 pr-3 border border-blue-600 text-xs gap-2 rounded-lg bg-blue-300 text-black hover:bg-blue-400"
        >
          <Plus className="w-4 h-4" />
          프로그램 추가
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
                {/* 로딩 중... */}
                <Loading />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} pagination={pagination} />
    </div>
  );
}
