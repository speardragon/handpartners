-- Fix: user 삭제 시 FK 제약 조건 위반 오류 해결
-- 5개 테이블의 user 참조 FK에 ON DELETE 정책 추가

-- 1. judging_round_user.user_id → ON DELETE CASCADE
ALTER TABLE public.judging_round_user
  DROP CONSTRAINT judging_round_user_user_id_fkey,
  ADD CONSTRAINT judging_round_user_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;

-- 2. evaluation.user_id → nullable + ON DELETE SET NULL (평가 데이터 보존)
ALTER TABLE public.evaluation
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.evaluation
  DROP CONSTRAINT evaluation_user_id_fkey,
  ADD CONSTRAINT evaluation_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;

-- evaluation unique constraint도 nullable user_id에 맞게 재생성
-- (PostgreSQL unique constraint는 NULL을 허용하므로 변경 불필요)

-- 3. mentoring_user.user_id → ON DELETE CASCADE
ALTER TABLE public.mentoring_user
  DROP CONSTRAINT mentoring_user_user_id_fkey,
  ADD CONSTRAINT mentoring_user_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;

-- 4. mentoring_company.mentor_id → ON DELETE SET NULL (이미 nullable)
ALTER TABLE public.mentoring_company
  DROP CONSTRAINT mentoring_company_mentor_id_fkey,
  ADD CONSTRAINT mentoring_company_mentor_id_fkey
    FOREIGN KEY (mentor_id) REFERENCES public."user"(id) ON DELETE SET NULL;

-- 5. mentoring_session.mentor_id → nullable로 변경 + ON DELETE SET NULL
ALTER TABLE public.mentoring_session
  ALTER COLUMN mentor_id DROP NOT NULL;

ALTER TABLE public.mentoring_session
  DROP CONSTRAINT mentoring_session_mentor_id_fkey,
  ADD CONSTRAINT mentoring_session_mentor_id_fkey
    FOREIGN KEY (mentor_id) REFERENCES public."user"(id) ON DELETE SET NULL;
