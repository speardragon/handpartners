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
  /* eslint-disable react-hooks/purity */
  const t0 = Date.now();
  const queryClient = getQueryClient();
  const supabase = await createClient();
  const t1 = Date.now();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t2 = Date.now();

  let isAdmin: boolean | undefined;
  let t3 = t2;
  let t4 = t2;

  if (user) {
    const { data: userRow } = await supabase
      .from("user")
      .select("role")
      .eq("id", user.id)
      .single();
    t3 = Date.now();

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
      t4 = Date.now();

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

  console.log(
    `[PERF home] total=${Date.now() - t0}ms supabase_init=${t1 - t0}ms auth=${t2 - t1}ms user_role=${t3 - t2}ms workspaces=${t4 - t3}ms`
  );
  /* eslint-enable react-hooks/purity */

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProgramSkeleton />}>
        <HomeClient initialIsAdmin={isAdmin} />
      </Suspense>
    </HydrationBoundary>
  );
}
