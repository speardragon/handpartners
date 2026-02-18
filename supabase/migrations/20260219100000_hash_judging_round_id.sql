-- ============================================================
-- judging_round.id: bigint → text (8자리 소문자+숫자 해시)
-- 기존 FK 제약 DROP → 컬럼 타입 변경 → 데이터 해시화 → FK 재생성
-- ============================================================

-- 1) UNIQUE constraint 제거 (judging_round_id 포함)
ALTER TABLE "public"."evaluation"
  DROP CONSTRAINT IF EXISTS "evaluation_unique_constraint";

-- 2) FK 제약 DROP
ALTER TABLE "public"."evaluation"
  DROP CONSTRAINT IF EXISTS "evaluation_judging_round_id_fkey";

ALTER TABLE "public"."evaluation_criteria"
  DROP CONSTRAINT IF EXISTS "evaluation_criteria_judging_round_id_fkey";

ALTER TABLE "public"."judging_round_company"
  DROP CONSTRAINT IF EXISTS "judging_round_company_judging_round_id_fkey";

ALTER TABLE "public"."judging_round_user"
  DROP CONSTRAINT IF EXISTS "judging_round_user_judging_round_id_fkey";

-- 3) PK 제약 DROP
ALTER TABLE "public"."judging_round"
  DROP CONSTRAINT IF EXISTS "judging_round_pkey";

-- 4) get_unique_evaluations 함수 업데이트 (파라미터 타입 변경 예정)
DROP FUNCTION IF EXISTS "public"."get_unique_evaluations"("judging_round" integer);

-- 5) judging_round.id: bigint → text
-- identity 속성 제거 후 타입 변경 (identity 컬럼은 integer/bigint만 허용)
ALTER TABLE "public"."judging_round"
  ALTER COLUMN "id" DROP IDENTITY IF EXISTS;

ALTER TABLE "public"."judging_round"
  ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "public"."judging_round"
  ALTER COLUMN "id" TYPE text USING id::text;

-- 6) FK 테이블의 judging_round_id: bigint → text (PK UPDATE 전에 먼저)
ALTER TABLE "public"."evaluation"
  ALTER COLUMN "judging_round_id" TYPE text USING judging_round_id::text;

ALTER TABLE "public"."evaluation_criteria"
  ALTER COLUMN "judging_round_id" TYPE text USING judging_round_id::text;

ALTER TABLE "public"."judging_round_company"
  ALTER COLUMN "judging_round_id" TYPE text USING judging_round_id::text;

ALTER TABLE "public"."judging_round_user"
  ALTER COLUMN "judging_round_id" TYPE text USING judging_round_id::text;

-- 7) 기존 데이터 해시화
-- pgcrypto의 digest를 사용해 8자리 hex 생성
-- sha256(id) → 앞 4바이트 → hex → 8자리
-- 동일 id는 항상 동일 해시 → FK 일관성 유지

-- (A) judging_round.id의 새 해시값을 temp 컬럼에 저장하고 FK 먼저 업데이트
DO $$
DECLARE
  r RECORD;
  new_id TEXT;
BEGIN
  FOR r IN SELECT id FROM "public"."judging_round" LOOP
    new_id := encode(substring(extensions.digest(r.id::text, 'sha256'), 1, 4), 'hex');

    -- FK 테이블 먼저 업데이트 (ON UPDATE CASCADE 없으므로 PK 변경 전에)
    UPDATE "public"."evaluation"
      SET judging_round_id = new_id
      WHERE judging_round_id = r.id;

    UPDATE "public"."evaluation_criteria"
      SET judging_round_id = new_id
      WHERE judging_round_id = r.id;

    UPDATE "public"."judging_round_company"
      SET judging_round_id = new_id
      WHERE judging_round_id = r.id;

    UPDATE "public"."judging_round_user"
      SET judging_round_id = new_id
      WHERE judging_round_id = r.id;

    -- PK 업데이트
    UPDATE "public"."judging_round"
      SET id = new_id
      WHERE id = r.id;
  END LOOP;
END $$;

-- 8) PK 재생성
ALTER TABLE "public"."judging_round"
  ADD CONSTRAINT "judging_round_pkey" PRIMARY KEY ("id");

-- 9) sequence DROP (identity 제거 시 자동 해제되지만 명시적으로 정리)
DROP SEQUENCE IF EXISTS "public"."judging_round_id_seq";

-- 10) FK 재생성
ALTER TABLE "public"."evaluation"
  ADD CONSTRAINT "evaluation_judging_round_id_fkey"
  FOREIGN KEY ("judging_round_id")
  REFERENCES "public"."judging_round"("id");

ALTER TABLE "public"."evaluation_criteria"
  ADD CONSTRAINT "evaluation_criteria_judging_round_id_fkey"
  FOREIGN KEY ("judging_round_id")
  REFERENCES "public"."judging_round"("id")
  ON DELETE CASCADE;

ALTER TABLE "public"."judging_round_company"
  ADD CONSTRAINT "judging_round_company_judging_round_id_fkey"
  FOREIGN KEY ("judging_round_id")
  REFERENCES "public"."judging_round"("id")
  ON DELETE CASCADE;

ALTER TABLE "public"."judging_round_user"
  ADD CONSTRAINT "judging_round_user_judging_round_id_fkey"
  FOREIGN KEY ("judging_round_id")
  REFERENCES "public"."judging_round"("id")
  ON DELETE CASCADE;

-- 12) UNIQUE constraint 재생성
ALTER TABLE "public"."evaluation"
  ADD CONSTRAINT "evaluation_unique_constraint"
  UNIQUE ("judging_round_id", "company_id", "user_id", "evaluation_criterion_id");

-- 13) get_unique_evaluations 함수 재생성 (파라미터 타입 text)
CREATE OR REPLACE FUNCTION "public"."get_unique_evaluations"("judging_round" text)
  RETURNS TABLE("judging_round_id" text, "company_id" integer, "status" text)
  LANGUAGE "sql"
  AS $$
  SELECT judging_round_id, company_id, status
  FROM evaluation
  WHERE judging_round_id = judging_round
  GROUP BY judging_round_id, company_id, status;
$$;
