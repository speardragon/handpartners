import * as XLSX from "xlsx-js-style";

// ----------------------
// 1) AOA & Merges 생성 함수
// ----------------------
export function createSheetDataAndMerges(
  companies: { name: string; feedbacks: string[] }[]
) {
  const sheetData: Array<Array<string | number>> = [
    ["No.", "회사명", "피드백"],
  ];

  const merges: XLSX.Range[] = [];

  let currentRowIndex = 1; // sheetData에서 현재 행 인덱스(0은 헤더)
  let companyIndex = 1; // "No."에 표시할 회사 번호 (회사마다 1씩 증가)
  let maxCompanyNameLength = "회사명".length;

  companies.forEach((company) => {
    // 회사명 최장 길이 체크
    if (company.name.length > maxCompanyNameLength) {
      maxCompanyNameLength = company.name.length;
    }

    const feedbackList = company.feedbacks;
    // 이번 회사가 차지할 행 범위 (피드백 개수만큼)
    const startRow = currentRowIndex;
    const endRow = startRow + feedbackList.length - 1;

    // (1) "No." 열(col=0) 병합
    merges.push({
      s: { r: startRow, c: 0 },
      e: { r: endRow, c: 0 },
    });

    // (2) "회사명" 열(col=1) 병합
    merges.push({
      s: { r: startRow, c: 1 },
      e: { r: endRow, c: 1 },
    });

    // (3) 피드백 열(col=2) - 병합 없음
    feedbackList.forEach((feedback, index) => {
      if (index === 0) {
        // 첫 피드백행: No.와 회사명 표시
        sheetData.push([companyIndex, company.name, feedback]);
      } else {
        // 나머지 행: 이미 병합될 것이므로 빈 문자열
        sheetData.push(["", "", feedback]);
      }
      currentRowIndex++;
    });

    // 다음 회사로 넘어가면 "No." 1 증가
    companyIndex++;
  });

  return { sheetData, merges, maxCompanyNameLength };
}

export function applySheetStylesAndWidths(
  ws: XLSX.WorkSheet,
  maxCompanyNameLength: number
) {
  // 열 너비 설정
  ws["!cols"] = [
    { wch: 6 }, // No.
    { wch: maxCompanyNameLength + 2 }, // 회사명
    { wch: 100 }, // 피드백
  ];

  // 시트 범위
  const range = XLSX.utils.decode_range(ws["!ref"]!);

  // (1) 모든 셀 가운데 정렬 & 줄바꿈
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) {
        // 빈 셀인 경우 셀 객체 생성
        ws[cellAddress] = { t: "s", v: "" };
      }

      // 스타일 객체 없으면 초기화
      if (!ws[cellAddress].s) ws[cellAddress].s = {};

      ws[cellAddress].s.alignment = {
        horizontal: "center", // 가로 중앙
        vertical: "center", // 세로 중앙
        wrapText: true, // 내용 길면 줄바꿈
      };
    }
  }

  // (2) 첫 번째 행(헤더) 배경색 설정
  //     헤더는 row=0, col=0..2 (No./회사명/피드백)
  for (let C = 0; C <= 2; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[cellAddress]) {
      ws[cellAddress] = { t: "s", v: "" };
    }
    if (!ws[cellAddress].s) ws[cellAddress].s = {};

    ws[cellAddress].s.fill = {
      patternType: "solid",
      fgColor: { rgb: "DAF7A6" }, // 알파 채널 제거
    };
  }
}
