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
