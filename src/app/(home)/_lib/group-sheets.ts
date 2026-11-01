export const UNASSIGNED_GROUP_SHEET_NAME = "그룹 미지정";

// 엑셀 시트 이름에 쓸 수 없는 문자: \ / ? * [ ] :
const INVALID_SHEET_NAME_CHARS = /[\\/?*[\]:]/g;
const MAX_SHEET_NAME_LENGTH = 31;

function toSheetName(name: string) {
  const sanitized = name.replace(INVALID_SHEET_NAME_CHARS, " ").trim();
  return (sanitized || UNASSIGNED_GROUP_SHEET_NAME).slice(
    0,
    MAX_SHEET_NAME_LENGTH
  );
}

function makeUnique(name: string, usedNames: Set<string>) {
  if (!usedNames.has(name)) return name;
  for (let suffix = 2; ; suffix += 1) {
    const tail = ` (${suffix})`;
    const candidate = `${name.slice(0, MAX_SHEET_NAME_LENGTH - tail.length)}${tail}`;
    if (!usedNames.has(candidate)) return candidate;
  }
}

/**
 * 심사 그룹(분반)별로 항목을 나눠 엑셀 시트 단위로 반환한다.
 *
 * - 그룹이 2개 이상이면 그룹마다 시트를 하나씩 만든다. (그룹명 오름차순, 미지정은 마지막)
 * - 그룹이 없거나 하나뿐이면 기존과 같이 defaultSheetName 시트 하나만 만든다.
 * - 각 그룹 안의 항목 순서는 입력 순서를 그대로 유지한다.
 */
export function splitIntoGroupSheets<T extends { groupName: string | null }>(
  items: T[],
  defaultSheetName: string
): { sheetName: string; items: T[] }[] {
  const itemsByGroup = new Map<string | null, T[]>();
  items.forEach((item) => {
    const key = item.groupName?.trim() || null;
    itemsByGroup.set(key, [...(itemsByGroup.get(key) ?? []), item]);
  });

  if (itemsByGroup.size <= 1) {
    return [{ sheetName: defaultSheetName, items }];
  }

  const orderedGroups = Array.from(itemsByGroup.keys()).sort((a, b) => {
    if (a === null) return 1;
    if (b === null) return -1;
    return a.localeCompare(b, "ko", { numeric: true });
  });

  const usedNames = new Set<string>();
  return orderedGroups.map((groupName) => {
    const sheetName = makeUnique(
      toSheetName(groupName ?? UNASSIGNED_GROUP_SHEET_NAME),
      usedNames
    );
    usedNames.add(sheetName);
    return { sheetName, items: itemsByGroup.get(groupName) ?? [] };
  });
}
