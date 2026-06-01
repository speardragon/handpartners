import { executeAction } from "@/lib/action";
import { getUserProfile } from "@/actions/user-actions";
import { USER_ROLES } from "@/constants/auth";
import HomeClient from "./_components/HomeClient";

// 로그인 사용자(쿠키)에 의존하므로 정적 캐시 대신 요청 시점에 렌더한다.
export const dynamic = "force-dynamic";

export default async function Home() {
  // SSR에서는 role만 확정해 isAdmin을 prop으로 내려준다.
  // 심사 목록(getAllJudgingWorkspaces)은 RSC 렌더 컨텍스트에서 페이지 쿼리(.range() +
  // 중첩 embed + count:exact)가 빈 결과를 반환하는 문제가 있어(같은 호출의 통계 쿼리만 정상)
  // SSR에서 직접 페치하지 않고, 검증된 클라이언트 서버액션 경로로 조회한다.
  // isAdmin을 첫 렌더부터 prop으로 알 수 있으므로 useQuery가 즉시 활성화되어,
  // 기존의 "클라이언트 프로필 페치 → enabled 게이트 해제 → 목록 페치" 워터폴이 제거된다.
  const profile = await executeAction(getUserProfile());
  const isAdmin = profile?.role === USER_ROLES.ADMIN;

  return <HomeClient isAdmin={isAdmin} />;
}
