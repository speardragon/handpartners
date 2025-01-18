"use client";

import React from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { FileDigit } from "lucide-react";
import { useScoresQuery } from "../_hooks/useScoresQuery";

// 헬퍼 함수
import {
  applyScoreSheetStylesAndWidths,
  createScoreSheetData,
} from "../_lib/score-helper";

type Props = {
  judgingRoundId: number;
};

export default function ScoreToExcelButton({ judgingRoundId }: Props) {
  // 심사 점수 쿼리
  const { data, isLoading, isError, refetch } = useScoresQuery(
    judgingRoundId,
    false
  );

  const handleExport = async () => {
    try {
      const { data: refetchedData } = await refetch();
      if (!refetchedData) {
        throw new Error("No data to export");
      }

      // 1) 2차원 배열 + merges + 심사자 목록
      const { sheetData, merges, judgeNames } = createScoreSheetData(
        refetchedData.companies
      );

      // 2) 시트 생성
      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // 3) merges 적용
      ws["!merges"] = merges;

      // 4) 스타일 & 너비
      applyScoreSheetStylesAndWidths(ws, judgeNames.length);

      // 5) 워크북 생성 & 시트 추가
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "결과점수");

      // 6) 파일 다운로드
      const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbOut], { type: "application/octet-stream" }),
        "결과 점수.xlsx"
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Export failed");
    }
  };

  return (
    <Button
      className="flex w-full justify-evenly bg-blue-600 gap-2 hover:bg-blue-700"
      onClick={handleExport}
      disabled={isLoading}
    >
      <FileDigit size={18} />
      {isLoading ? "Loading..." : "결과 점수 저장(.xlsx)"}
    </Button>
  );
}
