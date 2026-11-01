-- 프로그램 기간(start_date ~ end_date)에 맞춰 심사(judging_round)·멘토링(mentoring) 상태를 자동 전환한다.
--
-- 배경: 관리자가 '심사 시작' 버튼을 누르는 것을 잊으면 심사위원이 채점할 수 없었다.
--
-- 규칙 (날짜는 한국 시간 기준, end_date 당일까지 진행)
--   1) 프로그램 생성 시(심사/멘토링 행 생성) 또는 기간 수정 시: 기간 기준으로 상태를 즉시 다시 계산
--      - end_date < 오늘          → COMPLETED
--      - start_date > 오늘        → PENDING
--      - start_date <= 오늘       → IN_PROGRESS
--   2) 매시 1분(pg_cron): 경계를 지난 경우에만 한 번씩 전환
--      - 시작일 도래: PENDING → IN_PROGRESS
--      - 종료일 경과: → COMPLETED
--      전환 여부를 auto_*_applied_at 에 기록해 같은 경계에서 다시 전환하지 않는다.
--      → 관리자가 기간 중 '심사 전으로' 되돌리거나 종료 후 '재개'한 상태는 덮어쓰지 않는다.

-- ---------------------------------------------------------------------------
-- 1. 자동 전환 기록 컬럼
-- ---------------------------------------------------------------------------
alter table public.judging_round
  add column if not exists auto_start_applied_at timestamptz,
  add column if not exists auto_end_applied_at timestamptz;

alter table public.mentoring
  add column if not exists auto_start_applied_at timestamptz,
  add column if not exists auto_end_applied_at timestamptz;

comment on column public.judging_round.auto_start_applied_at is '프로그램 시작일 자동 시작 처리 시각 (null이면 미처리)';
comment on column public.judging_round.auto_end_applied_at is '프로그램 종료일 경과 자동 종료 처리 시각 (null이면 미처리)';
comment on column public.mentoring.auto_start_applied_at is '프로그램 시작일 자동 시작 처리 시각 (null이면 미처리)';
comment on column public.mentoring.auto_end_applied_at is '프로그램 종료일 경과 자동 종료 처리 시각 (null이면 미처리)';

-- ---------------------------------------------------------------------------
-- 2. 상태 전환 함수 (Data API에 노출되지 않는 private 스키마)
-- ---------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- 기간 기준으로 상태를 즉시 다시 계산 (생성/기간 수정 시)
create or replace function private.recompute_program_status(p_program_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := (now() at time zone 'Asia/Seoul')::date;
  v_start date;
  v_end date;
begin
  select p.start_date, p.end_date
    into v_start, v_end
    from public.program p
   where p.id = p_program_id;

  if not found then
    return;
  end if;

  update public.judging_round t
     set status = case
                    when v_end is not null and v_end < v_today then 'COMPLETED'
                    when v_start is not null and v_start > v_today then 'PENDING'
                    when v_start is not null then 'IN_PROGRESS'
                    else t.status
                  end::public.judging_round_status,
         auto_start_applied_at = case when v_start is not null and v_start <= v_today then now() end,
         auto_end_applied_at = case when v_end is not null and v_end < v_today then now() end
   where t.program_id = p_program_id;

  update public.mentoring t
     set status = case
                    when v_end is not null and v_end < v_today then 'COMPLETED'
                    when v_start is not null and v_start > v_today then 'PENDING'
                    when v_start is not null then 'IN_PROGRESS'
                    else t.status
                  end::public.mentoring_status,
         auto_start_applied_at = case when v_start is not null and v_start <= v_today then now() end,
         auto_end_applied_at = case when v_end is not null and v_end < v_today then now() end
   where t.program_id = p_program_id;
end;
$$;

-- 경계(시작일 도래 / 종료일 경과)를 지난 건만 한 번씩 전환 (pg_cron)
create or replace function private.apply_program_period_transitions()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := (now() at time zone 'Asia/Seoul')::date;
begin
  -- 종료일 경과 → COMPLETED
  update public.judging_round t
     set status = 'COMPLETED',
         auto_end_applied_at = now(),
         auto_start_applied_at = coalesce(t.auto_start_applied_at, now())
    from public.program p
   where p.id = t.program_id
     and t.auto_end_applied_at is null
     and p.end_date is not null
     and p.end_date < v_today;

  update public.mentoring t
     set status = 'COMPLETED',
         auto_end_applied_at = now(),
         auto_start_applied_at = coalesce(t.auto_start_applied_at, now())
    from public.program p
   where p.id = t.program_id
     and t.auto_end_applied_at is null
     and p.end_date is not null
     and p.end_date < v_today;

  -- 시작일 도래 → PENDING이면 IN_PROGRESS (이미 수동으로 바꾼 상태는 유지하고 처리 기록만 남김)
  update public.judging_round t
     set status = case when t.status = 'PENDING' then 'IN_PROGRESS' else t.status end::public.judging_round_status,
         auto_start_applied_at = now()
    from public.program p
   where p.id = t.program_id
     and t.auto_start_applied_at is null
     and p.start_date is not null
     and p.start_date <= v_today
     and (p.end_date is null or p.end_date >= v_today);

  update public.mentoring t
     set status = case when t.status = 'PENDING' then 'IN_PROGRESS' else t.status end::public.mentoring_status,
         auto_start_applied_at = now()
    from public.program p
   where p.id = t.program_id
     and t.auto_start_applied_at is null
     and p.start_date is not null
     and p.start_date <= v_today
     and (p.end_date is null or p.end_date >= v_today);
end;
$$;

revoke all on function private.recompute_program_status(bigint) from public, anon, authenticated;
revoke all on function private.apply_program_period_transitions() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. 트리거: 심사/멘토링 생성 시, 프로그램 기간 수정 시 즉시 재계산
-- ---------------------------------------------------------------------------
create or replace function private.on_program_child_inserted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.recompute_program_status(new.program_id);
  return null;
end;
$$;

create or replace function private.on_program_period_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.recompute_program_status(new.id);
  return null;
end;
$$;

revoke all on function private.on_program_child_inserted() from public, anon, authenticated;
revoke all on function private.on_program_period_changed() from public, anon, authenticated;

drop trigger if exists judging_round_auto_status_on_insert on public.judging_round;
create trigger judging_round_auto_status_on_insert
  after insert on public.judging_round
  for each row execute function private.on_program_child_inserted();

drop trigger if exists mentoring_auto_status_on_insert on public.mentoring;
create trigger mentoring_auto_status_on_insert
  after insert on public.mentoring
  for each row execute function private.on_program_child_inserted();

drop trigger if exists program_auto_status_on_period_change on public.program;
create trigger program_auto_status_on_period_change
  after update of start_date, end_date on public.program
  for each row
  when (old.start_date is distinct from new.start_date or old.end_date is distinct from new.end_date)
  execute function private.on_program_period_changed();

-- ---------------------------------------------------------------------------
-- 4. 기존 데이터 정리
--    - 기간이 끝난 프로그램: 상태는 그대로 두고 처리 완료로만 기록 (소급 변경하지 않음)
--    - 진행 중 기간인 프로그램: PENDING이면 IN_PROGRESS로 시작, 시작 처리 기록
--      (종료일이 지나면 이후 자동 종료됨)
-- ---------------------------------------------------------------------------
with today as (select (now() at time zone 'Asia/Seoul')::date as d)
update public.judging_round t
   set auto_start_applied_at = now(),
       auto_end_applied_at = now()
  from public.program p, today
 where p.id = t.program_id
   and p.end_date is not null
   and p.end_date < today.d;

with today as (select (now() at time zone 'Asia/Seoul')::date as d)
update public.mentoring t
   set auto_start_applied_at = now(),
       auto_end_applied_at = now()
  from public.program p, today
 where p.id = t.program_id
   and p.end_date is not null
   and p.end_date < today.d;

with today as (select (now() at time zone 'Asia/Seoul')::date as d)
update public.judging_round t
   set status = case when t.status = 'PENDING' then 'IN_PROGRESS' else t.status end::public.judging_round_status,
       auto_start_applied_at = now()
  from public.program p, today
 where p.id = t.program_id
   and p.start_date is not null
   and p.start_date <= today.d
   and (p.end_date is null or p.end_date >= today.d);

with today as (select (now() at time zone 'Asia/Seoul')::date as d)
update public.mentoring t
   set status = case when t.status = 'PENDING' then 'IN_PROGRESS' else t.status end::public.mentoring_status,
       auto_start_applied_at = now()
  from public.program p, today
 where p.id = t.program_id
   and p.start_date is not null
   and p.start_date <= today.d
   and (p.end_date is null or p.end_date >= today.d);

-- ---------------------------------------------------------------------------
-- 5. pg_cron: 매시 1분(UTC)에 경계 전환 실행 → 한국 시간 자정 00:01에도 실행됨
-- ---------------------------------------------------------------------------
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select cron.schedule(
  'apply-program-period-transitions',
  '1 * * * *',
  $$select private.apply_program_period_transitions();$$
);
