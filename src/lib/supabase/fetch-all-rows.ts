import type { PostgrestError } from "@supabase/supabase-js";

// PostgREST max_rows(기본 1000)와 같게 맞춰, 한 페이지가 꽉 찼는지로 다음 페이지 유무를 판단한다
const PAGE_SIZE = 1000;

type PageResponse<T> = PromiseLike<{
  data: T[] | null;
  error: PostgrestError | null;
}>;

/**
 * Supabase 조회는 요청당 최대 1000행만 반환하고 나머지는 에러 없이 잘린다.
 * 행 수가 1000을 넘을 수 있는 조회는 이 함수로 끝까지 페이지를 이어 받는다.
 *
 * fetchPage는 반드시 고유 컬럼(예: id)으로 정렬한 뒤 `.range(from, to)`를 적용해야
 * 페이지 사이에 행이 누락되거나 중복되지 않는다.
 */
export async function fetchAllRows<T>(
  fetchPage: (from: number, to: number) => PageResponse<T>
): Promise<{ data: T[]; error: PostgrestError | null }> {
  const rows: T[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1);
    if (error) return { data: rows, error };

    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) return { data: rows, error: null };
  }
}
