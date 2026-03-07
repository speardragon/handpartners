DO $$
BEGIN
  CREATE TYPE public.mentoring_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS public.mentoring (
  id text PRIMARY KEY,
  program_id bigint NOT NULL REFERENCES public.program(id) ON DELETE CASCADE,
  status public.mentoring_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentoring_program_id_key UNIQUE (program_id)
);

INSERT INTO public.mentoring (
  id,
  program_id,
  status,
  created_at
)
SELECT
  lower(substr(md5(random()::text || clock_timestamp()::text || p.id::text), 1, 8)),
  p.id,
  'PENDING'::public.mentoring_status,
  now()
FROM public.program AS p
LEFT JOIN public.mentoring AS m
  ON m.program_id = p.id
WHERE m.id IS NULL;

CREATE TABLE IF NOT EXISTS public.mentoring_user (
  id bigserial PRIMARY KEY,
  mentoring_id text NOT NULL REFERENCES public.mentoring(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public."user"(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentoring_user_unique UNIQUE (mentoring_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.mentoring_company (
  id bigserial PRIMARY KEY,
  mentoring_id text NOT NULL REFERENCES public.mentoring(id) ON DELETE CASCADE,
  company_id bigint NOT NULL REFERENCES public.company(id),
  mentor_id uuid REFERENCES public."user"(id),
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentoring_company_unique UNIQUE (mentoring_id, company_id)
);

CREATE TABLE IF NOT EXISTS public.mentoring_session (
  id bigserial PRIMARY KEY,
  mentoring_id text NOT NULL REFERENCES public.mentoring(id) ON DELETE CASCADE,
  company_id bigint NOT NULL REFERENCES public.company(id),
  mentor_id uuid NOT NULL REFERENCES public."user"(id),
  session_no integer NOT NULL CHECK (session_no > 0),
  mentored_at timestamptz NOT NULL,
  place text,
  content text,
  result text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentoring_session_unique UNIQUE (mentoring_id, company_id, session_no)
);

CREATE TABLE IF NOT EXISTS public.mentoring_session_photo (
  id bigserial PRIMARY KEY,
  mentoring_session_id bigint NOT NULL REFERENCES public.mentoring_session(id) ON DELETE CASCADE,
  photo_path text NOT NULL,
  original_filename text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mentoring_user_user_id_idx
  ON public.mentoring_user (user_id);

CREATE INDEX IF NOT EXISTS mentoring_company_mentor_id_idx
  ON public.mentoring_company (mentor_id);

CREATE INDEX IF NOT EXISTS mentoring_session_company_idx
  ON public.mentoring_session (mentoring_id, company_id, mentored_at DESC);

CREATE INDEX IF NOT EXISTS mentoring_session_mentor_idx
  ON public.mentoring_session (mentor_id, mentored_at DESC);

CREATE INDEX IF NOT EXISTS mentoring_session_photo_session_idx
  ON public.mentoring_session_photo (mentoring_session_id, sort_order);
