"use client";

import { UserRow } from "@/actions/user-actions";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export interface User {
  username: string;
  created_at: string; // or Date if you're using Date objects
  email: string;
  role: string;
  affiliation: string;
  position: string;
  phone_number: string;
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
  },

  {
    accessorKey: "email",
    header: "이메일",
  },

  {
    accessorKey: "affiliation",
    header: "소속",
  },
  {
    accessorKey: "position",
    header: "직급",
  },
  {
    accessorKey: "phone_number",
    header: "전화번호",
  },
  {
    accessorKey: "created_at",
    header: "생성일",
    cell: ({ row }) => {
      return <div>{formatDate(new Date(row.getValue("created_at")))}</div>;
    },
  },
];
