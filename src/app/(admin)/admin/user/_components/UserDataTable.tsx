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
import { Button } from "@/components/ui/button";
import UserCreateDialog from "./UserCreateDialog";
import Loading from "@/app/_components/Loading";
import { Plus } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalPages: number;
}

export function UserDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  totalPages,
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

  useEffect(() => {
    if (userProfile.username !== "") {
      setOpen(true);
    }
  }, [userProfile]);

  return (
    <div className="rounded-lg border space-y-2 shadow-lg p-4 font-medium overflow-y-auto">
      <UserEditDialog userId={userId} userProfile={userProfile} />
      <UserCreateDialog />
      <div className="flex w-full justify-end">
        <button
          onClick={(e) => {
            setCreateOpen(true);
          }}
          className="flex p-2 py-1 pr-3 border border-blue-600 text-xs gap-2 rounded-lg bg-blue-300 text-black hover:bg-blue-400"
        >
          <Plus className="w-4 h-4" />
          사용자 추가
        </button>
      </div>
      <Table className="container relative py-2 mx-auto overflow-y-auto border">
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
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
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
                  // setOpen(true);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className="cursor-pointer p-3 px-6 text-gray-600"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {/* No results. */}
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
