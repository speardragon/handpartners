import { executeAction } from "@/lib/action";
import { getUserProfile } from "@/actions/user-actions";
import { getAllJudgingWorkspaces } from "@/actions/program-action";
import { USER_ROLES } from "@/constants/auth";
import HomeClient, { PAGE_SIZE } from "./_components/HomeClient";

// 로그인 사용자(쿠키)에 의존하므로 정적 캐시 대신 요청 시점에 렌더한다.
export const dynamic = "force-dynamic";

export default async function Home() {
  // 서버(인리전)에서 프로필을 먼저 받아 role을 확정한 뒤, 그 role로 심사 목록을 조회한다.
  // 목록 쿼리는 isAdmin 분기가 필요해 프로필에 의존하지만, 두 쿼리 모두 Supabase와 동일 리전에서
  // 실행되므로 기존 클라이언트 워터폴(프로필 왕복 → enabled 해제 → 목록 왕복) 대비 수백 ms로 단축된다.
  const profile = await executeAction(getUserProfile());
  const isAdmin = profile?.role === USER_ROLES.ADMIN;

  const initialData = await getAllJudgingWorkspaces(1, PAGE_SIZE, isAdmin);

  return <HomeClient isAdmin={isAdmin} initialData={initialData} />;
}
