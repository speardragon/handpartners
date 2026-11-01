/**
 * DB의 timestamptz 값(예: "2026-10-31T14:16:00+00:00")을 사용자 브라우저 시간대 기준으로 표시한다.
 *
 * 문자열을 slice 해서 쓰면 UTC 시각이 그대로 노출되어 한국 시간보다 9시간 이르게,
 * 오전 9시 이전 기록은 날짜까지 하루 전으로 보인다. 입력 폼(datetime-local)과
 * 보고서 PDF도 브라우저 시간대를 쓰므로 화면 표시도 반드시 이 함수들을 사용한다.
 */

const pad = (value: number) => String(value).padStart(2, "0");

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

/** YYYY-MM-DD */
export function formatLocalDate(value: string | Date) {
  const date = toDate(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** MM-DD */
export function formatLocalMonthDay(value: string | Date) {
  const date = toDate(value);
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** YYYY-MM-DD HH:mm */
export function formatLocalDateTime(value: string | Date) {
  const date = toDate(value);
  return `${formatLocalDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
