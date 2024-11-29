"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "src/actions/user-actions";
import Image from "next/image";

import Login from "./_components/Login";

export default function Page() {
  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  return (
    <div className="flex w-full h-full py-16 justify-center items-center bg-blue-gray-50">
      <Login />
    </div>
  );
}
