import { formatLocalDate } from "@/lib/date-format";

// 파일 시스템에서 쓸 수 없는 문자: \ / : * ? " < > | 및 제어 문자
const INVALID_FILE_NAME_CHARS = /[\\/:*?"<>|\u0000-\u001f]/g;

function sanitizeFileNamePart(value: string) {
  return value
    .replace(INVALID_FILE_NAME_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 내보내기 파일 이름을 `{종류}_{프로그램명}_{YYYY-MM-DD}.{확장자}` 형태로 만든다.
 * 프로그램명이 비어 있으면 생략한다.
 *
 * @example buildExportFileName("결과점수", "2026 경기북부 스타트업 IR 데모데이", "xlsx")
 *          // "결과점수_2026 경기북부 스타트업 IR 데모데이_2026-11-01.xlsx"
 */
export function buildExportFileName(
  kind: string,
  programName: string | null | undefined,
  extension: string,
  date: Date = new Date()
) {
  const parts = [kind, programName ?? "", formatLocalDate(date)]
    .map(sanitizeFileNamePart)
    .filter(Boolean);
  return `${parts.join("_")}.${extension}`;
}
