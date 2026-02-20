"use client";

import { USER_ROLES } from "@/constants/auth";
import { UserRow } from "@/actions/user-actions";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

export const userColumns: ColumnDef<Partial<UserRow>>[] = [
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    enableHiding: true,
  },
  {
    accessorKey: "username",
    header: "이름",
  },
  {
    accessorKey: "role",
    header: "구분",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            role === USER_ROLES.ADMIN
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700"
          }`}
        >
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "이메일",
    meta: { className: "hidden md:table-cell" },
  },
  {
    accessorKey: "affiliation",
    header: "소속",
    meta: { className: "hidden lg:table-cell" },
  },
  {
    accessorKey: "position",
    header: "직급",
    meta: { className: "hidden lg:table-cell" },
  },
  {
    accessorKey: "phone_number",
    header: "전화번호",
    meta: { className: "hidden sm:table-cell" },
  },
  {
    accessorKey: "created_at",
    header: "생성일",
    meta: { className: "hidden xl:table-cell" },
    cell: ({ row }) => {
      return <div>{formatDate(new Date(row.getValue("created_at")))}</div>;
    },
  },
];
