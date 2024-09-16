"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "src/actions/user-actions";

export default function Page() {
  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
  return (
    <div className="flex w-full h-full justify-center items-center bg-blue-50">
      <div className="flex flex-col">
        <div>Login</div>
        <div>동의</div>
        <div>username</div>
        <div>password</div>
        {/* {userQuery.data && userQuery.data.map((user) => <div>{user.name}</div>)} */}
      </div>
    </div>
  );
}
