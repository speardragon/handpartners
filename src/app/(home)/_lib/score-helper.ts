import { CompanyScoreResult } from "@/actions/judging_round-action";
import * as XLSX from "xlsx-js-style";

export function applyScoreSheetStylesAndWidths(
  ws: XLSX.WorkSheet,
  judgeCount: number
) {
  // 1) 열 너비 설정(필요 시 조정)
  const cols = [];
  // No.
  cols.push({ wch: 5 });
  // 기업명
  cols.push({ wch: 20 });
  // 심사자 열
  for (let i = 0; i < judgeCount; i++) {
    cols.push({ wch: 12 });
  }
  // 총점, 평균, 순위
  cols.push({ wch: 8 });
  cols.push({ wch: 8 });
  cols.push({ wch: 8 });

  ws["!cols"] = cols;

  // 2) 시트 전체 범위 (행/열 시작~끝)
  const range = XLSX.utils.decode_range(ws["!ref"]!);

  // 3) 모든 셀에 대해 반복하여 스타일 적용
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });

      // 셀이 존재하지 않으면 생성
      if (!ws[addr]) {
        ws[addr] = { t: "s", v: "" };
      }
      // 셀 스타일 초기화
      if (!ws[addr].s) {
        ws[addr].s = {};
      }

      // (3-1) 수평/수직 가운데 정렬 + 줄바꿈
      ws[addr].s.alignment = {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      };

      // (3-2) 모든 셀 테두리(검정, 얇은 선)
      ws[addr].s.border = {
        top: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
      };

      // (3-3) 헤더(예: row=0) 배경색 (필요시 row=1도 같이 적용 가능)
      if (R === 0) {
        ws[addr].s.fill = {
          patternType: "solid",
          fgColor: { rgb: "DAF7A6" }, // 원하는 색상
        };
      }
      // 만약 2행짜리 헤더 전체에 배경색 적용하려면:
      // if (R === 0 || R === 1) {
      //   ws[addr].s.fill = {
      //     patternType: "solid",
      //     fgColor: { rgb: "DAF7A6" },
      //   };
      // }
    }
  }
}

export function createScoreSheetData(companies: CompanyScoreResult[]) {
  // 1) 전체 심사자 목록 수집
  const judgeSet = new Set<string>();
  companies.forEach((c) => {
    c.judgings.forEach((j) => {
      judgeSet.add(j.judgingUserName);
    });
  });
  const judgeNames = Array.from(judgeSet);

  // 2) 2행짜리 헤더 구성
  //    전체 컬럼 수 = 2( No.+기업명 ) + judgeNames.length(심사자 수) + 3(총점/평균/순위)
  const totalCols = 2 + judgeNames.length + 3; // 5 + judgeNames.length
  const row0 = new Array<string>(totalCols).fill("");
  const row1 = new Array<string>(totalCols).fill("");

  // row0
  row0[0] = "No.";
  row0[1] = "기업명";
  row0[2] = "심사자"; // 심사자 열 헤더 (이후 judgeNames 수만큼 병합)
  row0[2 + judgeNames.length] = "총점";
  row0[3 + judgeNames.length] = "평균";
  row0[4 + judgeNames.length] = "순위";

  // row1
  judgeNames.forEach((name, i) => {
    row1[2 + i] = name; // 심사자들의 실제 이름
  });

  // sheetData 초기화
  const sheetData: Array<Array<string | number>> = [];
  sheetData.push(row0);
  sheetData.push(row1);

  // 3) 헤더 merges 정보
  const merges: XLSX.Range[] = [];

  // (3-1) "No."(col=0), "기업명"(col=1), "총점"(col=2+judgeCount), "평균"(col=3+judgeCount), "순위"(col=4+judgeCount) => 2행 병합
  merges.push(
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // No.
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // 기업명
    {
      s: { r: 0, c: 2 + judgeNames.length },
      e: { r: 1, c: 2 + judgeNames.length },
    }, // 총점
    {
      s: { r: 0, c: 3 + judgeNames.length },
      e: { r: 1, c: 3 + judgeNames.length },
    }, // 평균
    {
      s: { r: 0, c: 4 + judgeNames.length },
      e: { r: 1, c: 4 + judgeNames.length },
    } // 순위
  );

  // (3-2) "심사자" 헤더(col=2) ~ col=(2+judgeCount-1)를 한 칸으로 병합
  if (judgeNames.length > 0) {
    merges.push({
      s: { r: 0, c: 2 },
      e: { r: 0, c: 2 + judgeNames.length - 1 },
    });
  }

  // 4) 기업별 실제 데이터
  companies.forEach((company, idx) => {
    const row: Array<string | number> = [];

    // (4-1) 기본 2열: No., 기업명
    row.push(idx + 1); // No. (1부터 시작)
    row.push(company.name); // 기업명

    // (4-2) 심사자별 점수 (없으면 0)
    judgeNames.forEach((jName) => {
      const found = company.judgings.find((j) => j.judgingUserName === jName);
      const score = found ? found.score : 0;
      row.push(score);
    });

    // (4-3) 총점, 평균(반올림), 순위
    row.push(company.totalScore);
    // 소수점 첫째 자리에서 반올림(정수)
    row.push(Math.round(company.avgScore));
    row.push(company.ranking);

    sheetData.push(row);
  });

  return {
    sheetData,
    merges,
    judgeNames,
  };
}
