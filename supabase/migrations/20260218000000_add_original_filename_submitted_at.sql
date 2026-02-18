ALTER TABLE "public"."judging_round_company"
  ADD COLUMN IF NOT EXISTS "original_filename" text,
  ADD COLUMN IF NOT EXISTS "submitted_at" timestamp with time zone;

COMMENT ON COLUMN "public"."judging_round_company"."original_filename" IS '업로드된 PDF의 원본 파일 이름';
COMMENT ON COLUMN "public"."judging_round_company"."submitted_at" IS 'PDF 제출 시각';
