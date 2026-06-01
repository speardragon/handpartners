# 한 기업에 여러 멘토 배정 (N:M) 설계

작성일: 2026-06-01
브랜치(예정): `feat/multi-mentor-per-company`

## 배경 / 목표

현재 멘토링은 **기업당 멘토 1명** 구조다. `mentoring_company` 테이블이
`UNIQUE(mentoring_id, company_id)` + 단일 `mentor_id` 컬럼으로 기업당 멘토 1명을
DB 레벨에서 강제한다. 한 기업을 여러 멘토가 함께 멘토링하는 경우가 생겨,
**기업 ↔ 멘토를 N:M으로** 바꾼다.

### 확정된 의사결정

1. **배정 방식**: 관리자 배정만. 멘토가 직접 기업을 집는 claim 기능은 **제거**한다.
2. **세션(회차) 모델**: **기업 단위 공유 회차** 유지. 어느 멘토가 쓰든 그 기업의
   다음 회차로 이어지고, 작성자만 `mentoring_session.mentor_id`로 구분한다.
   → `mentoring_session` 스키마는 변경하지 않는다.
3. **데이터 모델**: 배정 전용 조인 테이블(`mentoring_company_mentor`)을 신설한다(접근 A).

## 1. 데이터 모델

### 신규 테이블 `mentoring_company_mentor`

```sql
CREATE TABLE public.mentoring_company_mentor (
  id bigserial PRIMARY KEY,
  mentoring_company_id bigint NOT NULL
    REFERENCES public.mentoring_company(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL
    REFERENCES public."user"(id) ON DELETE CASCADE,
  claimed_at timestamptz,                 -- 배정 시각(기존 의미 보존)
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentoring_company_mentor_unique UNIQUE (mentoring_company_id, mentor_id)
);

CREATE INDEX mentoring_company_mentor_mentor_id_idx
  ON public.mentoring_company_mentor (mentor_id);
CREATE INDEX mentoring_company_mentor_company_idx
  ON public.mentoring_company_mentor (mentoring_company_id);
```

- `mentoring_company`는 "이 기업이 이 멘토링에 속한다"는 사실만 담는다.
- `mentor_id` → `user` 는 `ON DELETE CASCADE`(배정은 단순 링크이므로 사용자 삭제 시
  배정 행 제거). 단, `mentoring_session.mentor_id`는 기존대로 `ON DELETE SET NULL`을
  유지해 세션 기록(작성자 표기만 null)은 보존한다.

### 데이터 이관 + 옛 컬럼 제거 (동일 마이그레이션 내)

```sql
INSERT INTO public.mentoring_company_mentor
  (mentoring_company_id, mentor_id, claimed_at, created_at)
SELECT id, mentor_id, claimed_at, created_at
FROM public.mentoring_company
WHERE mentor_id IS NOT NULL;

DROP INDEX IF EXISTS public.mentoring_company_mentor_id_idx;
ALTER TABLE public.mentoring_company DROP COLUMN IF EXISTS mentor_id;
ALTER TABLE public.mentoring_company DROP COLUMN IF EXISTS claimed_at;
```

- 마이그레이션 파일: `supabase/migrations/<timestamp>_multi_mentor_per_company.sql`
- 적용 후 `pnpm generate-types`로 `types_db.ts` 재생성.

## 2. 서버 액션 (`src/actions/mentoring-action.ts`)

### 타입

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
  mentors: MentoringAssignmentMentor[];   // 기존 단일 mentor_* 필드 대체
  is_mine: boolean;                        // 내가 mentors 안에 있는지
  session_count: number;
  last_mentored_at: string | null;
  // can_claim 제거
}
```

`MentoringSession`은 변경 없음(`mentor_id`=작성자 유지).

### 조회

- `getMentoringDetail`, `getMentoringByProgramId`의 배정 join을
  `mentor:mentor_id(...)` → `mentors:mentoring_company_mentor( claimed_at, mentor:mentor_id ( id, username, affiliation, position ) )`
  로 변경하고 `mentors` 배열로 매핑.
- 비관리자 필터: `visibleAssignments = isAdminView ? all : all.filter(a => a.mentors.some(m => m.mentor_id === viewer.id))`
  (claim 제거로 "미배정 기업 노출" 로직 삭제).
- `is_mine = a.mentors.some(m => m.mentor_id === viewer.id)`.
- 멘토별 담당 기업 수(`getMentoringByProgramId`의 mentors 목록, `buildAssignmentStats`):
  - `assigned_company_count` = 멘토 ≥1명인 기업 수
  - `my_company_count` = 내가 멘토인 기업 수
  - 멘토별 count = 그 멘토가 등장하는 기업 수

### 변경(mutation)

- **신규 `setMentoringCompanyMentors({ mentoringId, companyId, mentorIds: string[] })`**
  (`assignMentoringCompanyByAdmin` 대체):
  - 관리자 전용. `mentorIds`는 해당 멘토링 참여자(`mentoring_user`)인지 검증.
  - 기업의 `mentoring_company.id`를 찾고, 현 junction 행과 diff → insert/delete
    (`updateMentoringUsers` 패턴).
  - **제거되는 멘토가 그 기업에 작성한 세션이 있으면 차단**
    ("멘토링 기록이 있는 멘토는 배정 해제할 수 없습니다.").
  - 신규 insert 시 `claimed_at = now()`.
- **`claimMentoringCompany` 제거** (액션 + export + React Query/호출부 전부).
- **`upsertMentoringSession`** 권한 체크 변경:
  `assignment.mentor_id === viewer.id` →
  "viewer가 이 기업의 멘토 중 하나인지" (mentoring_company → mentoring_company_mentor join 조회).
  세션의 `mentor_id`는 그대로 작성자(viewer)로 기록.
- **`updateMentoringUsers`** 제거 가드: `mentoring_company.mentor_id IN toRemove`
  카운트를 `mentoring_company_mentor`(join `mentoring_company.mentoring_id`) 기준으로 변경.
- **`updateMentoringCompanies`**(기업 추가/제거)는 그대로. 기업 제거 시 junction 행은
  `ON DELETE CASCADE`로 함께 삭제됨(단, 기존 가드대로 세션 있으면 제거 차단).

## 3. UI

### 관리자 `(admin)/.../_components/MentoringEditForm.tsx`

- 기업별 단일 `Select`(미배정/멘토 1명) → **멘토 다중 선택**(체크박스 목록 또는
  multi-combobox). 변경 시 `setMentoringCompanyMentors(mentoringId, companyId, mentorIds)` 호출.
- "배정 완료" 카운트 = 멘토 ≥1명 기업 수.

### 멘토 홈 `(home)/mentoring/[mentoringId]/page.tsx`

- **"배정 가능한 기업" 섹션 + "이 기업 선택하기" 버튼 제거**(claim 제거).
- 사이드바/헤더의 "담당 OOO"(단일)를 **여러 명 표기**("담당 김멘토 외 N명" 또는 목록).
- 비관리자 멘토는 **자신에게 배정된 기업만** 조회.
- 세션 작성/표시는 `is_mine`(=내가 이 기업 멘토 중 하나) 기반으로 자동 확장. 세션 목록은
  작성자(`session.mentor_name`)별로 그대로 표시.

### PDF (`MentoringSessionDocument`)

- 세션 단위라 **변경 없음**(작성자 = `session.mentor_name`).

### 쿼리/훅 (`src/queries/mentoring.queries.ts`, `_hooks`)

- `assignment.mentor_id` / `assignment.mentor_name` 직접 접근부를 `assignment.mentors[]`로 수정.
- claim 관련 mutation 훅 제거.

## 4. 영향 범위 / 마이그레이션 순서

1. 마이그레이션 파일 작성 → 적용 → `pnpm generate-types`.
2. 서버 액션/타입 수정.
3. UI 수정.
4. `pnpm type-check` / `pnpm lint`로 전수 확인(타입 변경이 컴파일 에러로 누락 지점 노출).

## 5. 테스트 (수동 — 테스트 프레임워크 없음)

- [ ] 마이그레이션 후 기존 단일 배정이 junction으로 정확히 이관됐는지(샘플 비교).
- [ ] 관리자가 한 기업에 멘토 2명 배정 → 두 멘토 모두 홈에서 해당 기업이 보임.
- [ ] 두 멘토가 같은 기업에 세션 작성 → 회차가 기업 단위로 이어지고 작성자 구분.
- [ ] 세션을 작성한 멘토를 배정 해제 시도 → 차단.
- [ ] claim 관련 UI/엔드포인트가 모두 사라졌는지.
- [ ] PDF가 각 세션 작성자를 정확히 표기.

## 6. 비목표(YAGNI)

- 멘토별 독립 회차/배정 이력(audit) 테이블.
- claim 기능 유지·확장.
- `mentoring_session` 스키마 변경.
