# 한 기업 다중 멘토 배정 (N:M) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 멘토링에서 한 기업을 여러 멘토가 함께 맡을 수 있도록 기업↔멘토를 N:M으로 바꾼다.

**Architecture:** 배정 전용 조인 테이블 `mentoring_company_mentor`를 신설하고, `mentoring_company`에서 단일 `mentor_id`/`claimed_at` 컬럼을 제거한다. 멘토 셀프 claim 기능은 제거하고 관리자 다중 배정(`setMentoringCompanyMentors`)만 남긴다. 세션 회차는 기업 단위 공유를 유지하므로 `mentoring_session`은 손대지 않는다.

**Tech Stack:** Next.js 14 App Router, Supabase(Postgres), TypeScript, React Query, shadcn/ui. 테스트 프레임워크 없음 → 검증은 `pnpm type-check` / `pnpm lint` / `pnpm build` + 수동 확인.

**관련 스펙:** `docs/superpowers/specs/2026-06-01-multi-mentor-per-company-design.md`

---

## File Structure

- `supabase/migrations/20260601000000_multi_mentor_per_company.sql` — **생성**. 조인 테이블 신설 + 데이터 이관 + 옛 컬럼 제거.
- `types_db.ts` — **재생성**(`pnpm generate-types`).
- `src/actions/mentoring-action.ts` — **수정**. 타입(`MentoringAssignment`), 조회(`getMentoringDetail`, `getMentoringByProgramId`), 집계(`buildAssignmentStats`), mutation(`setMentoringCompanyMentors` 신설, `assignMentoringCompanyByAdmin`·`claimMentoringCompany` 제거, `upsertMentoringSession` 권한, `updateMentoringUsers` 가드).
- `src/app/(admin)/admin/program/[programId]/_components/MentoringEditForm.tsx` — **수정**. 단일 Select → 멘토 다중 선택(Checkbox).
- `src/app/(home)/mentoring/[mentoringId]/page.tsx` — **수정**. claim UI 제거, 멘토 다중 표기, 필터링.

> **주의:** Task 1에서 마이그레이션을 적용하면 옛 컬럼이 사라져, Task 2~6이 끝나기 전까지 앱이 일시적으로 동작하지 않는다(피처 브랜치라 정상). 최종 검증은 Task 7에서 한다.

---

## Task 1: DB 마이그레이션 + 타입 재생성

**Files:**
- Create: `supabase/migrations/20260601000000_multi_mentor_per_company.sql`
- Regenerate: `types_db.ts`

- [ ] **Step 1: 마이그레이션 파일 작성**

`supabase/migrations/20260601000000_multi_mentor_per_company.sql`:

```sql
-- 기업↔멘토 배정을 N:M으로 전환한다.
-- mentoring_company 의 단일 mentor_id/claimed_at 컬럼을 제거하고,
-- 배정 전용 조인 테이블 mentoring_company_mentor 로 분리한다.

CREATE TABLE IF NOT EXISTS public.mentoring_company_mentor (
  id bigserial PRIMARY KEY,
  mentoring_company_id bigint NOT NULL
    REFERENCES public.mentoring_company(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL
    REFERENCES public."user"(id) ON DELETE CASCADE,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentoring_company_mentor_unique UNIQUE (mentoring_company_id, mentor_id)
);

CREATE INDEX IF NOT EXISTS mentoring_company_mentor_mentor_id_idx
  ON public.mentoring_company_mentor (mentor_id);
CREATE INDEX IF NOT EXISTS mentoring_company_mentor_company_idx
  ON public.mentoring_company_mentor (mentoring_company_id);

-- 기존 단일 배정 데이터 이관
INSERT INTO public.mentoring_company_mentor
  (mentoring_company_id, mentor_id, claimed_at, created_at)
SELECT id, mentor_id, claimed_at, created_at
FROM public.mentoring_company
WHERE mentor_id IS NOT NULL
ON CONFLICT (mentoring_company_id, mentor_id) DO NOTHING;

-- 옛 컬럼/인덱스 제거 (FK 는 컬럼과 함께 제거됨)
DROP INDEX IF EXISTS public.mentoring_company_mentor_id_idx;
ALTER TABLE public.mentoring_company DROP COLUMN IF EXISTS mentor_id;
ALTER TABLE public.mentoring_company DROP COLUMN IF EXISTS claimed_at;
```

- [ ] **Step 2: 마이그레이션 적용**

로컬/원격 Supabase에 적용한다(프로젝트에서 쓰는 방식으로). 예:
Run: `npx supabase db push` (또는 팀에서 사용하는 적용 절차)
Expected: 에러 없이 적용, `mentoring_company_mentor` 테이블 생성.

- [ ] **Step 3: 타입 재생성**

Run: `pnpm generate-types`
Expected: `types_db.ts`에 `mentoring_company_mentor`가 추가되고, `mentoring_company` Row에서 `mentor_id`/`claimed_at`이 사라짐.

> 연결 권한이 없어 `generate-types`가 실패하면, `types_db.ts`에서 `mentoring_company`의 `mentor_id`/`claimed_at` 필드를 제거하고 `mentoring_company_mentor` 테이블 정의를 다른 테이블 정의 형식에 맞춰 수동 추가한다.

- [ ] **Step 4: 커밋**

```bash
git add supabase/migrations/20260601000000_multi_mentor_per_company.sql types_db.ts
git commit -m "feat: 기업 다중 멘토 배정용 조인 테이블 추가 및 단일 배정 컬럼 제거"
```

---

## Task 2: 서버 타입 + `getMentoringDetail` 배정 조회 변경

**Files:**
- Modify: `src/actions/mentoring-action.ts` (타입 28~46, `buildAssignmentStats` 296~311는 Task 3, `getMentoringDetail` 배정 쿼리 862~879 / 매핑)

- [ ] **Step 1: 타입 교체**

`MentoringAssignment`(현재 28~46) 바로 위에 멘토 타입을 추가하고, `MentoringAssignment`의 단일 멘토 필드를 배열로 교체한다.

```ts
export interface MentoringAssignmentMentor {
  mentor_id: string;
  mentor_name: string | null;
  mentor_affiliation: string | null;
  mentor_position: string | null;
  claimed_at: string | null;
}

export interface MentoringAssignment {
  company_id: number;
  company_name: string;
  company_description: string | null;
  representative_name: string | null;
  mentors: MentoringAssignmentMentor[];
  is_mine: boolean;
  session_count: number;
  last_mentored_at: string | null;
}
```

(기존 `mentor_id`/`mentor_name`/`mentor_affiliation`/`mentor_position`/`claimed_at`/`can_claim` 필드는 삭제)

- [ ] **Step 2: `getMentoringDetail` 배정 쿼리 join 변경**

현재 862~879의 `mentoring_company` select를 아래로 교체:

```ts
      .select(
        `
          company_id,
          company:company_id (
            id,
            name,
            description,
            representative_name
          ),
          mentors:mentoring_company_mentor (
            claimed_at,
            mentor:mentor_id (
              id,
              username,
              affiliation,
              position
            )
          )
        `
      )
```

- [ ] **Step 3: `allAssignments` 매핑 교체**

`getMentoringDetail` 내 `allAssignments`(현재 `mentor`/`company`를 takeFirstRelation으로 뽑아 단일 필드로 매핑하던 블록)를 아래로 교체:

```ts
  const allAssignments = (assignments ?? []).map((item) => {
    const company = takeFirstRelation<{
      id: number;
      name: string;
      description: string | null;
      representative_name: string | null;
    }>(item.company as unknown);

    const mentors: MentoringAssignmentMentor[] = (
      Array.isArray(item.mentors) ? item.mentors : []
    ).map((link) => {
      const mentor = takeFirstRelation<{
        id: string;
        username: string;
        affiliation: string | null;
        position: string | null;
      }>((link as { mentor: unknown }).mentor);
      return {
        mentor_id: mentor?.id ?? "",
        mentor_name: mentor?.username ?? null,
        mentor_affiliation: mentor?.affiliation ?? null,
        mentor_position: mentor?.position ?? null,
        claimed_at: (link as { claimed_at: string | null }).claimed_at ?? null,
      };
    });

    return {
      company_id: item.company_id,
      company_name: company?.name ?? "",
      company_description: company?.description ?? null,
      representative_name: company?.representative_name ?? null,
      mentors,
    };
  });
```

- [ ] **Step 4: 가시성 필터 + enrich 교체**

`visibleAssignments`/`visibleCompanyIds`/`enrichedAssignments` 블록을 아래로 교체(기존 `mentor_id === viewer.id || mentor_id === null` 및 `can_claim` 로직 제거):

```ts
  const visibleAssignments = isAdminView
    ? allAssignments
    : allAssignments.filter((item) =>
        item.mentors.some((m) => m.mentor_id === context.viewer.id)
      );
  const visibleCompanyIds = new Set(
    visibleAssignments.map((item) => item.company_id)
  );
```

```ts
  const enrichedAssignments: MentoringAssignment[] = visibleAssignments.map(
    (item) => {
      const stats = sessionStats.get(item.company_id);
      return {
        ...item,
        is_mine: item.mentors.some((m) => m.mentor_id === context.viewer.id),
        session_count: stats?.count ?? 0,
        last_mentored_at: stats?.lastMentoredAt ?? null,
      };
    }
  );
```

> `availableMentorIds`/`isParticipant`/`isAdminView` 계산은 그대로 둔다. 단 `can_claim` 관련 참조만 제거됐는지 확인.

- [ ] **Step 5: `buildAssignmentStats` 호출 인자 변경**

`getMentoringDetail` 하단의 `buildAssignmentStats(allAssignments, context.viewer.id)` 호출은 유지하되, `buildAssignmentStats` 시그니처는 Task 3에서 배열 기반으로 바꾼다. (이 Task에서는 타입 에러가 남아 있을 수 있음 → Task 3에서 해소)

- [ ] **Step 6: 타입 체크**

Run: `pnpm type-check`
Expected: `getMentoringByProgramId`/`buildAssignmentStats` 관련 에러만 남고(다음 Task에서 해소) 이 함수 범위 에러는 없음. 진행 가능.

---

## Task 3: `getMentoringByProgramId` 매핑 + `buildAssignmentStats` 변경

**Files:**
- Modify: `src/actions/mentoring-action.ts` (`buildAssignmentStats` 296~311, `getMentoringByProgramId` 434~589)

- [ ] **Step 1: `buildAssignmentStats` 배열 기반으로 교체**

현재 296~311 전체를 아래로 교체:

```ts
function buildAssignmentStats(
  assignments: Array<{
    company_id: number;
    mentors: { mentor_id: string }[];
  }>,
  viewerId: string
) {
  const assignedCompanyCount = assignments.filter(
    (item) => item.mentors.length > 0
  ).length;
  const myCompanyCount = assignments.filter((item) =>
    item.mentors.some((m) => m.mentor_id === viewerId)
  ).length;

  return { assignedCompanyCount, myCompanyCount };
}
```

- [ ] **Step 2: `getMentoringByProgramId` 배정 쿼리 join 변경**

현재 434~456의 `mentoring_company` select를 아래로 교체:

```ts
    context.supabase
      .from("mentoring_company")
      .select(
        `
          company_id,
          company:company_id (
            id,
            name,
            description,
            representative_name
          ),
          mentors:mentoring_company_mentor (
            claimed_at,
            mentor:mentor_id (
              id,
              username,
              affiliation,
              position
            )
          )
        `
      )
      .eq("mentoring_id", mentoring.id)
      .order("created_at", { ascending: true }),
```

- [ ] **Step 3: `mentoringCompanies` 매핑 교체**

현재 533~565를 아래로 교체:

```ts
  const mentoringCompanies: MentoringAssignment[] = (companies ?? []).map(
    (item) => {
      const stats = sessionStats.get(item.company_id);
      const company = takeFirstRelation<{
        id: number;
        name: string;
        description: string | null;
        representative_name: string | null;
      }>(item.company as unknown);

      const mentors: MentoringAssignmentMentor[] = (
        Array.isArray(item.mentors) ? item.mentors : []
      ).map((link) => {
        const mentor = takeFirstRelation<{
          id: string;
          username: string;
          affiliation: string | null;
          position: string | null;
        }>((link as { mentor: unknown }).mentor);
        return {
          mentor_id: mentor?.id ?? "",
          mentor_name: mentor?.username ?? null,
          mentor_affiliation: mentor?.affiliation ?? null,
          mentor_position: mentor?.position ?? null,
          claimed_at:
            (link as { claimed_at: string | null }).claimed_at ?? null,
        };
      });

      return {
        company_id: item.company_id,
        company_name: company?.name ?? "",
        company_description: company?.description ?? null,
        representative_name: company?.representative_name ?? null,
        mentors,
        is_mine: mentors.some((m) => m.mentor_id === context.viewer.id),
        session_count: stats?.count ?? 0,
        last_mentored_at: stats?.lastMentoredAt ?? null,
      };
    }
  );
```

- [ ] **Step 4: 멘토별 담당 기업 수 집계 교체**

현재 567~574의 `assignedCounts` 블록을 아래로 교체:

```ts
  const assignedCounts = new Map<string, number>();
  mentoringCompanies.forEach((company) => {
    company.mentors.forEach((mentor) => {
      assignedCounts.set(
        mentor.mentor_id,
        (assignedCounts.get(mentor.mentor_id) ?? 0) + 1
      );
    });
  });
```

- [ ] **Step 5: 타입 체크**

Run: `pnpm type-check`
Expected: `getMentoringByProgramId`/`getMentoringDetail`/`buildAssignmentStats` 관련 에러 해소. 남는 에러는 mutation/UI(다음 Task) 범위.

- [ ] **Step 6: 커밋**

```bash
git add src/actions/mentoring-action.ts
git commit -m "feat: 멘토링 배정 조회를 다중 멘토 구조로 변경"
```

---

## Task 4: Mutation 변경 (다중 배정 신설, claim 제거, 권한/가드)

**Files:**
- Modify: `src/actions/mentoring-action.ts` (`updateMentoringUsers` 1258~1273, `assignMentoringCompanyByAdmin` 1315~1361, `claimMentoringCompany` 1363~1405, `upsertMentoringSession` 1497~1512)

- [ ] **Step 1: `updateMentoringUsers` 제거 가드 테이블 변경**

현재 멘토 제거 가드는 `mentoring_company.mentor_id IN toRemove`로 카운트한다(1263~1267). 이를 조인 테이블 기준으로 바꾼다. 해당 첫 번째 쿼리를 아래로 교체:

```ts
        context.supabase
          .from("mentoring_company_mentor")
          .select("id, mentoring_company!inner(mentoring_id)", {
            count: "exact",
            head: true,
          })
          .eq("mentoring_company.mentoring_id", args.mentoringId)
          .in("mentor_id", toRemove),
```

(두 번째 `mentoring_session` 카운트 쿼리는 그대로 둔다.)

- [ ] **Step 2: `assignMentoringCompanyByAdmin` → `setMentoringCompanyMentors`로 교체**

현재 `assignMentoringCompanyByAdmin` 함수 전체(1315~1361)를 아래로 교체:

```ts
export async function setMentoringCompanyMentors(args: {
  mentoringId: string;
  companyId: number;
  mentorIds: string[];
}) {
  return withActionResult(async () => {
    const context = await assertAdmin();
    const mentorIds = Array.from(new Set(args.mentorIds));

    // 대상 기업의 mentoring_company 행 확인
    const { data: companyRow, error: companyError } = await context.supabase
      .from("mentoring_company")
      .select("id")
      .eq("mentoring_id", args.mentoringId)
      .eq("company_id", args.companyId)
      .maybeSingle();

    if (companyError) raiseActionError(companyError);
    if (!companyRow) {
      throw new Error("멘토링 대상 기업을 찾을 수 없습니다.");
    }

    // 멘토는 모두 해당 멘토링 참여자여야 함
    if (mentorIds.length > 0) {
      const { data: enrolled, error: enrolledError } = await context.supabase
        .from("mentoring_user")
        .select("user_id")
        .eq("mentoring_id", args.mentoringId)
        .in("user_id", mentorIds);

      if (enrolledError) raiseActionError(enrolledError);

      const enrolledIds = new Set((enrolled ?? []).map((m) => m.user_id));
      if (mentorIds.some((id) => !enrolledIds.has(id))) {
        throw new Error("멘토링 참여 멘토만 배정할 수 있습니다.");
      }
    }

    // 현재 배정과 diff
    const { data: current, error: currentError } = await context.supabase
      .from("mentoring_company_mentor")
      .select("mentor_id")
      .eq("mentoring_company_id", companyRow.id);

    if (currentError) raiseActionError(currentError);

    const currentIds = new Set((current ?? []).map((m) => m.mentor_id));
    const nextIds = new Set(mentorIds);
    const toAdd = mentorIds.filter((id) => !currentIds.has(id));
    const toRemove = Array.from(currentIds).filter((id) => !nextIds.has(id));

    // 세션을 작성한 멘토는 배정 해제 불가
    if (toRemove.length > 0) {
      const { count, error: sessionError } = await context.supabase
        .from("mentoring_session")
        .select("id", { count: "exact", head: true })
        .eq("mentoring_id", args.mentoringId)
        .eq("company_id", args.companyId)
        .in("mentor_id", toRemove);

      if (sessionError) raiseActionError(sessionError);
      if ((count ?? 0) > 0) {
        throw new Error("멘토링 기록이 있는 멘토는 배정 해제할 수 없습니다.");
      }

      const { error: deleteError } = await context.supabase
        .from("mentoring_company_mentor")
        .delete()
        .eq("mentoring_company_id", companyRow.id)
        .in("mentor_id", toRemove);

      if (deleteError) raiseActionError(deleteError);
    }

    if (toAdd.length > 0) {
      const { error: insertError } = await context.supabase
        .from("mentoring_company_mentor")
        .insert(
          toAdd.map((mentorId) => ({
            mentoring_company_id: companyRow.id,
            mentor_id: mentorId,
            claimed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }))
        );

      if (insertError) raiseActionError(insertError);
    }

    return undefined;
  });
}
```

- [ ] **Step 3: `claimMentoringCompany` 제거**

`claimMentoringCompany` 함수 전체(현재 1363~1405)를 삭제한다.

- [ ] **Step 4: `upsertMentoringSession` 권한 체크 변경**

현재 1497~1512의 `assignment` 조회 + 검증 블록을 아래로 교체:

```ts
    const { data: companyRow, error: companyError } = await context.supabase
      .from("mentoring_company")
      .select("id")
      .eq("mentoring_id", args.mentoringId)
      .eq("company_id", args.companyId)
      .maybeSingle();

    if (companyError) raiseActionError(companyError);
    if (!companyRow) {
      throw new Error(
        "현재 담당 기업에 대해서만 멘토링 기록을 작성할 수 있습니다."
      );
    }

    const { data: assignment, error: assignmentError } = await context.supabase
      .from("mentoring_company_mentor")
      .select("id")
      .eq("mentoring_company_id", companyRow.id)
      .eq("mentor_id", context.viewer.id)
      .maybeSingle();

    if (assignmentError) raiseActionError(assignmentError);
    if (!assignment) {
      throw new Error(
        "현재 담당 기업에 대해서만 멘토링 기록을 작성할 수 있습니다."
      );
    }
```

(이후 `payload`의 `mentor_id: context.viewer.id`는 그대로 유지)

- [ ] **Step 5: 타입 체크**

Run: `pnpm type-check`
Expected: `mentoring-action.ts` 범위 에러 없음. 남는 에러는 UI(`assignMentoringCompanyByAdmin`/`claimMentoringCompany` import, `mentor_id` 접근) 범위.

- [ ] **Step 6: 커밋**

```bash
git add src/actions/mentoring-action.ts
git commit -m "feat: 관리자 다중 멘토 배정 액션 추가 및 claim 기능 제거"
```

---

## Task 5: 관리자 `MentoringEditForm` 다중 선택 UI

**Files:**
- Modify: `src/app/(admin)/admin/program/[programId]/_components/MentoringEditForm.tsx`

- [ ] **Step 1: import 교체**

24행 `assignMentoringCompanyByAdmin` 를 `setMentoringCompanyMentors` 로 바꾸고, Select 관련 import(11~17)를 제거, Checkbox import를 추가:

```ts
import { Checkbox } from "@/components/ui/checkbox";
```

```ts
import {
  createMentoringReportLogoUploadUrl,
  setMentoringCompanyMentors,
  updateMentoringCompanies,
  updateMentoringReportLogo,
  updateMentoringUsers,
} from "@/actions/mentoring-action";
```

(11~17의 `Select, SelectContent, SelectItem, SelectTrigger, SelectValue` import 블록 삭제)

- [ ] **Step 2: `assignedCompanyCount` 교체**

현재 288~291을 아래로 교체:

```ts
  const assignedCompanyCount = useMemo(
    () => data.companies.filter((company) => company.mentors.length > 0).length,
    [data.companies]
  );
```

- [ ] **Step 3: `assignmentMutation` 교체**

현재 194~213을 아래로 교체:

```ts
  const assignmentMutation = useMutation({
    mutationFn: async (payload: {
      companyId: number;
      mentorIds: string[];
    }) =>
      executeAction(
        setMentoringCompanyMentors({
          mentoringId,
          companyId: payload.companyId,
          mentorIds: payload.mentorIds,
        })
      ),
    onSuccess: () => {
      toast.success("멘토 배정을 수정했습니다.");
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "멘토 배정을 수정하지 못했습니다."));
    },
  });

  const toggleCompanyMentor = (
    company: (typeof data.companies)[number],
    mentorId: string,
    checked: boolean
  ) => {
    const currentIds = company.mentors.map((m) => m.mentor_id);
    const nextIds = checked
      ? Array.from(new Set([...currentIds, mentorId]))
      : currentIds.filter((id) => id !== mentorId);
    assignmentMutation.mutate({ companyId: company.company_id, mentorIds: nextIds });
  };
```

- [ ] **Step 4: 아코디언 트리거의 멘토 표기 교체**

현재 515~521(트리거 우측 `company.mentor_name` 단일 표기)을 아래로 교체:

```tsx
                    <span className="shrink-0 text-xs text-neutral-500">
                      {company.mentors.length > 0 ? (
                        <span className="font-medium text-neutral-700">
                          {company.mentors.length === 1
                            ? company.mentors[0].mentor_name
                            : `${company.mentors[0].mentor_name} 외 ${company.mentors.length - 1}명`}
                        </span>
                      ) : (
                        <span className="text-neutral-400">미배정</span>
                      )}
                    </span>
```

- [ ] **Step 5: "담당 멘토 변경" 패널을 체크박스 목록으로 교체**

현재 536~569(`담당 멘토 변경` div 내부의 단일 표기 + Select 블록 전체)를 아래로 교체:

```tsx
                    <div className="rounded-xl border border-neutral-200 bg-white p-3">
                      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">담당 멘토</p>
                      {data.mentors.length === 0 ? (
                        <p className="mt-2 text-sm text-neutral-400">
                          참여 멘토가 없습니다.
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {data.mentors.map((mentor) => {
                            const checked = company.mentors.some(
                              (m) => m.mentor_id === mentor.id
                            );
                            return (
                              <label
                                key={mentor.id}
                                className="flex items-center gap-2 text-sm text-neutral-800"
                              >
                                <Checkbox
                                  checked={checked}
                                  disabled={assignmentMutation.isPending}
                                  onCheckedChange={(value) =>
                                    toggleCompanyMentor(
                                      company,
                                      mentor.id,
                                      value === true
                                    )
                                  }
                                />
                                <span>
                                  {mentor.name}
                                  {mentor.affiliation ? ` · ${mentor.affiliation}` : ""}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
```

- [ ] **Step 6: 타입 체크 + 린트**

Run: `pnpm type-check && pnpm lint`
Expected: PASS. (Select import 미사용으로 인한 lint 에러가 나면 잔여 import 제거)

- [ ] **Step 7: 커밋**

```bash
git add "src/app/(admin)/admin/program/[programId]/_components/MentoringEditForm.tsx"
git commit -m "feat: 관리자 멘토링 화면에서 기업별 멘토 다중 선택 지원"
```

---

## Task 6: 멘토 홈 페이지 — claim 제거 + 다중 멘토 표기

**Files:**
- Modify: `src/app/(home)/mentoring/[mentoringId]/page.tsx`

- [ ] **Step 1: import 정리**

10행 `claimMentoringCompany` import 제거. 사용하지 않게 될 아이콘 import(`Plus`, `UserRound`)는 Step 5 이후 미사용이면 제거(다른 곳에서 쓰이면 유지 — lint로 확인).

- [ ] **Step 2: `availableAssignments`/`claimMutation` 제거**

148~151의 `availableAssignments` useMemo 블록과 274~284의 `claimMutation` 블록을 삭제한다.

- [ ] **Step 3: `activeCompanyId` 폴백에서 availableAssignments 참조 제거**

현재 177~189의 반환부와 deps를 아래로 교체:

```ts
    return (
      myAssignments[0]?.company_id ??
      mentoring.assignments[0]?.company_id ??
      null
    );
  }, [mentoring, myAssignments, requestedCompanyId, selectedCompanyId]);
```

- [ ] **Step 4: 사이드바 멘토 표기 교체 (헬퍼 추가)**

`return (` 직전(컴포넌트 본문 내 적당한 위치, 예: `handleDownloadSessionPdf` 정의 다음)에 표기 헬퍼를 추가:

```ts
  const formatMentorNames = (
    mentors: { mentor_name: string | null }[]
  ): string => {
    if (mentors.length === 0) return "미배정";
    const names = mentors.map((m) => m.mentor_name).filter(Boolean) as string[];
    if (names.length === 0) return "미배정";
    return names.length === 1
      ? `담당 ${names[0]}`
      : `담당 ${names[0]} 외 ${names.length - 1}명`;
  };
```

현재 633~635(사이드바 카드의 `company.mentor_name` 표기)를 아래로 교체:

```tsx
                        {formatMentorNames(company.mentors)}
```

- [ ] **Step 5: "배정 가능한 기업" 섹션 제거**

현재 643~692의 `{!mentoring.isAdminView && ( <section> ... 배정 가능한 기업 ... </section> )}` 블록 전체를 삭제한다.

- [ ] **Step 6: 워크스페이스 헤더 멘토 배지 교체**

현재 716~720(`selectedCompany.mentor_name` 배지)을 아래로 교체:

```tsx
                      <Badge variant="outline">
                        {formatMentorNames(selectedCompany.mentors)}
                      </Badge>
```

- [ ] **Step 7: 타입 체크 + 린트**

Run: `pnpm type-check && pnpm lint`
Expected: PASS. 미사용 import(`Plus`/`UserRound`/`claimMentoringCompany`) 잔존 시 lint 에러 → 제거.

- [ ] **Step 8: 커밋**

```bash
git add "src/app/(home)/mentoring/[mentoringId]/page.tsx"
git commit -m "feat: 멘토 홈에서 claim 제거 및 다중 멘토 표기 적용"
```

---

## Task 7: 최종 검증

**Files:** 없음(검증만)

- [ ] **Step 1: 빌드**

Run: `pnpm type-check && pnpm lint && pnpm build`
Expected: 모두 PASS.

- [ ] **Step 2: 수동 테스트 (dev 서버)**

Run: `pnpm dev`
다음을 확인:
- 마이그레이션 후 기존 단일 배정이 그대로 보이는지(이관 정상).
- 관리자 화면에서 한 기업에 멘토 2명 체크 → 둘 다 배정됨, "외 N명" 표기.
- 두 멘토 계정 모두 자기 홈에서 해당 기업이 "내 담당 기업"에 보임.
- 두 멘토가 같은 기업에 세션 작성 → 회차가 기업 단위로 이어지고 각 세션 작성자 표기.
- 세션을 작성한 멘토를 관리자 화면에서 체크 해제 시도 → "멘토링 기록이 있는 멘토는 배정 해제할 수 없습니다." 차단.
- 멘토 홈에 "배정 가능한 기업"/"이 기업 선택하기"가 더 이상 없음.
- PDF 다운로드 시 각 세션 작성자가 정확히 표기.

- [ ] **Step 3: PR 생성**

```bash
git push -u origin feat/multi-mentor-per-company
gh pr create --base main --title "feat: 한 기업에 여러 멘토 배정(N:M) 지원" --body-file <요약>
```

---

## Self-Review 결과

- **스펙 커버리지**: 데이터 모델(Task 1) / 타입·조회(Task 2,3) / mutation·claim 제거·권한·가드(Task 4) / 관리자 UI(Task 5) / 홈 UI(Task 6) / 검증(Task 7) — 스펙 1~5 전 항목 매핑됨.
- **타입 일관성**: `MentoringAssignment.mentors: MentoringAssignmentMentor[]`, `setMentoringCompanyMentors({mentoringId, companyId, mentorIds})`가 액션 정의(Task 4)·호출부(Task 5)에서 동일. `formatMentorNames`는 Task 6 내에서 정의·사용.
- **플레이스홀더**: 없음(모든 step에 실제 코드/명령 포함). `generate-types` 실패 대비 수동 절차 명시.
