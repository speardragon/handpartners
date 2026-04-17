import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/config/queryClient";
import { judgingQueries } from "@/queries";
import {
  getAllJudgingWorkspaces,
  type AllJudgingWorkspacesResult,
} from "@/actions/program-action";
import { createClient } from "@/lib/supabase/server";
import { USER_ROLES } from "@/constants/auth";
import HomeClient from "./_components/HomeClient";
import ProgramSkeleton from "./_components/ProgramSkeleton";

const PAGE_SIZE = 10;

export default async function HomePage() {
  const queryClient = getQueryClient();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin: boolean | undefined;

  if (user) {
    const { data: userRow } = await supabase
      .from("user")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userRow) {
      isAdmin = userRow.role === USER_ROLES.ADMIN;

      const workspaces: AllJudgingWorkspacesResult =
        await getAllJudgingWorkspaces(
          1,
          PAGE_SIZE,
          isAdmin,
          undefined,
          undefined,
          undefined,
          undefined,
          user.id
        );

      const listOptions = judgingQueries.list(
        1,
        PAGE_SIZE,
        isAdmin,
        undefined,
        undefined
      );
      queryClient.setQueryData(listOptions.queryKey, workspaces);
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProgramSkeleton />}>
        <HomeClient initialIsAdmin={isAdmin} />
      </Suspense>
    </HydrationBoundary>
  );
}
