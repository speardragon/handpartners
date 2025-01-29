"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { useFeedbacksQuery } from "../_hooks/useFeedbacksQuery";
import { Button } from "@/components/ui/button";
import {
  applySheetStylesAndWidths,
  createSheetDataAndMerges,
} from "../_lib/helper";
import { FileSpreadsheet } from "lucide-react";

type Props = {
  judgingRoundId: number;
  className?: string;
};

export default function FeedbackToExcelButton({
  judgingRoundId,
  className,
}: Props) {
  // React Query 훅 사용
  const { data, isLoading, isError, refetch } = useFeedbacksQuery(
    judgingRoundId,
    false
  );

  /**
   * 버튼을 누르면, refetch를 호출해 데이터를 가져온 뒤
   * Workbook 생성 -> Worksheet 생성 -> 엑셀 다운로드
   */
  const handleExport = async () => {
    try {
      const { data: refetchedData } = await refetch();
      if (!refetchedData) {
        throw new Error("No data to export.");
      }

      // 1) AOA & merges 생성
      const { sheetData, merges, maxCompanyNameLength } =
        createSheetDataAndMerges(refetchedData.companies);

      // 2) 시트 생성
      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // 3) 머지 정보
      ws["!merges"] = merges;

      // 4) 스타일 & 열 너비
      applySheetStylesAndWidths(ws, maxCompanyNameLength);

      // 5) Workbook & 저장
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Feedbacks");

      const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbOut], { type: "application/octet-stream" }),
        "심사 정리.xlsx"
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Export failed.");
    }
  };

  return (
    <button className={className} onClick={handleExport}>
      <FileSpreadsheet size={16} />
      {isLoading ? "Loading..." : "피드백 저장(.xlsx)"}
    </button>
  );
}
