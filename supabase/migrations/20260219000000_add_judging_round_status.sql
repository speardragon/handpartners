-- 심사 라운드 상태 enum 타입 생성
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'judging_round_status') THEN
        CREATE TYPE public.judging_round_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
    END IF;
END $$;

-- judging_round 테이블에 status 컬럼 추가 (기본값: PENDING)
ALTER TABLE public.judging_round
ADD COLUMN IF NOT EXISTS status public.judging_round_status NOT NULL DEFAULT 'PENDING';

COMMENT ON COLUMN public.judging_round.status IS '심사 상태: PENDING(심사전), IN_PROGRESS(심사중), COMPLETED(심사 종료)';
