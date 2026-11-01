"use client";

import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { FileDigit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { judgingRoundQueries } from "@/queries";

// 헬퍼 함수
import {
  applyScoreSheetStylesAndWidths,
  createScoreSheetData,
} from "../_lib/score-helper";
import { splitIntoGroupSheets } from "../_lib/group-sheets";

type Props = {
  judgingRoundId: string;
  className?: string;
};

export default function ScoreToExcelButton({
  className,
  judgingRoundId,
}: Props) {
  const { isLoading, refetch } = useQuery({
    ...judgingRoundQueries.scores(judgingRoundId),
    enabled: false,
  });

  const handleExport = async () => {
    try {
      const { data: refetchedData } = await refetch();
      if (!refetchedData) {
        throw new Error("No data to export");
      }

      // 심사 그룹(분반)이 나뉘어 있으면 그룹마다 시트를 따로 만든다.
      // 각 시트에는 해당 그룹 기업과 그 기업을 심사한 심사자 열만 들어간다.
      const wb = XLSX.utils.book_new();
      splitIntoGroupSheets(refetchedData.companies, "결과점수").forEach(
        ({ sheetName, items }) => {
          // 1) 2차원 배열 + merges + 심사자 목록
          const { sheetData, merges, judgeNames } = createScoreSheetData(items);

          // 2) 시트 생성
          const ws = XLSX.utils.aoa_to_sheet(sheetData);

          // 3) merges 적용
          ws["!merges"] = merges;

          // 4) 스타일 & 너비
          applyScoreSheetStylesAndWidths(ws, judgeNames.length);

          // 5) 워크북에 시트 추가
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }
      );

      // 6) 파일 다운로드
      const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbOut], { type: "application/octet-stream" }),
        "결과 점수.xlsx"
      );
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Export failed");
    }
  };

  return (
    <button className={className} onClick={handleExport} disabled={isLoading}>
      <FileDigit size={16} />
      {isLoading ? "Loading..." : "결과 점수 저장(.xlsx)"}
    </button>
  );
}
