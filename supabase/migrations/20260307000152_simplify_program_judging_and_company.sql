ALTER TABLE public.company
ADD COLUMN IF NOT EXISTS representative_name text;

UPDATE public.company
SET representative_name = COALESCE(NULLIF(representative_name, ''), '홍길동');

ALTER TABLE public.company
ALTER COLUMN representative_name SET NOT NULL;

ALTER TABLE public.company
ALTER COLUMN representative_name DROP DEFAULT;

ALTER TABLE public.company
DROP CONSTRAINT IF EXISTS company_name_key;

ALTER TABLE public.company
DROP CONSTRAINT IF EXISTS company_name_representative_name_key;

ALTER TABLE public.company
ADD CONSTRAINT company_name_representative_name_key
UNIQUE (name, representative_name);

INSERT INTO public.judging_round (
  id,
  program_id,
  created_at,
  status
)
SELECT
  lower(substr(md5(random()::text || clock_timestamp()::text || p.id::text), 1, 8)),
  p.id,
  now(),
  'PENDING'::public.judging_round_status
FROM public.program AS p
LEFT JOIN public.judging_round AS jr
  ON jr.program_id = p.id
WHERE jr.id IS NULL;

CREATE TEMP TABLE _judging_round_ranked AS
SELECT
  jr.id,
  jr.program_id,
  row_number() OVER (
    PARTITION BY jr.program_id
    ORDER BY jr.created_at ASC, jr.id ASC
  ) AS row_num,
  first_value(jr.id) OVER (
    PARTITION BY jr.program_id
    ORDER BY jr.created_at ASC, jr.id ASC
  ) AS canonical_id
FROM public.judging_round AS jr;

WITH merged_statuses AS (
  SELECT
    jr.program_id,
    CASE
      WHEN bool_or(jr.status = 'IN_PROGRESS') THEN 'IN_PROGRESS'::public.judging_round_status
      WHEN bool_or(jr.status = 'PENDING') THEN 'PENDING'::public.judging_round_status
      ELSE 'COMPLETED'::public.judging_round_status
    END AS merged_status
  FROM public.judging_round AS jr
  GROUP BY jr.program_id
)
UPDATE public.judging_round AS canonical
SET status = merged_statuses.merged_status
FROM merged_statuses
JOIN _judging_round_ranked AS ranked
  ON ranked.program_id = merged_statuses.program_id
 AND ranked.row_num = 1
WHERE canonical.id = ranked.canonical_id;

CREATE TEMP TABLE _judging_round_merge_map AS
SELECT
  id AS duplicate_id,
  canonical_id
FROM _judging_round_ranked
WHERE row_num > 1;

UPDATE public.evaluation_criteria AS ec
SET judging_round_id = map.canonical_id
FROM _judging_round_merge_map AS map
WHERE ec.judging_round_id = map.duplicate_id;

UPDATE public.evaluation AS e
SET judging_round_id = map.canonical_id
FROM _judging_round_merge_map AS map
WHERE e.judging_round_id = map.duplicate_id;

UPDATE public.judging_round_company AS jrc
SET judging_round_id = map.canonical_id
FROM _judging_round_merge_map AS map
WHERE jrc.judging_round_id = map.duplicate_id;

UPDATE public.judging_round_user AS jru
SET judging_round_id = map.canonical_id
FROM _judging_round_merge_map AS map
WHERE jru.judging_round_id = map.duplicate_id;

WITH ranked_companies AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY judging_round_id, company_id
      ORDER BY
        (pdf_path IS NOT NULL) DESC,
        (submitted_at IS NOT NULL) DESC,
        (judge_num IS NOT NULL) DESC,
        created_at ASC,
        id ASC
    ) AS row_num
  FROM public.judging_round_company
)
DELETE FROM public.judging_round_company
WHERE id IN (
  SELECT id
  FROM ranked_companies
  WHERE row_num > 1
);

WITH ranked_users AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY judging_round_id, user_id
      ORDER BY
        (group_name IS NOT NULL AND group_name <> '') DESC,
        created_at ASC,
        id ASC
    ) AS row_num
  FROM public.judging_round_user
)
DELETE FROM public.judging_round_user
WHERE id IN (
  SELECT id
  FROM ranked_users
  WHERE row_num > 1
);

DELETE FROM public.judging_round
WHERE id IN (
  SELECT duplicate_id
  FROM _judging_round_merge_map
);

ALTER TABLE public.judging_round
DROP CONSTRAINT IF EXISTS judging_round_program_id_key;

ALTER TABLE public.judging_round
ADD CONSTRAINT judging_round_program_id_key UNIQUE (program_id);

ALTER TABLE public.judging_round
DROP COLUMN IF EXISTS name;

ALTER TABLE public.judging_round
DROP COLUMN IF EXISTS description;

ALTER TABLE public.judging_round
DROP COLUMN IF EXISTS start_date;

ALTER TABLE public.judging_round
DROP COLUMN IF EXISTS end_date;
