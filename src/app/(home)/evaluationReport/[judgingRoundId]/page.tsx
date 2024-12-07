"use client";

import { useEffect, useState } from "react";
import { useEvaluationReportQuery } from "../../_hooks/useEvaluationReportQuery";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import EvaluationDocument from "../../_components/EvaluationDocument";

type Props = {
  params: { judgingRoundId: string };
};

export default function Page({ params }: Props) {
  const judgingRoundId = parseInt(params.judgingRoundId);

  // useEvaluationReportQuery를 사용해 데이터 불러오기
  const { data, isLoading } = useEvaluationReportQuery(judgingRoundId);
  // 중복 저장 방지 플래그
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savePDF = async () => {
      console.log("hi");
      if (!isLoading && data && !isSaved) {
        try {
          const blob = await pdf(
            <EvaluationDocument evaluationReport={data} />
            // <TestDocument />
          ).toBlob();

          // PDF 다운로드
          const fileName = `심사_${new Date().toISOString().split("T")[0]}.pdf`;
          saveAs(blob, fileName);
          setIsSaved(true);

          // 창 닫기
          window.close();
        } catch (error) {
          console.error("PDF 저장 중 오류가 발생했습니다:", error);
        }
      }
    };

    savePDF();
  }, [isLoading, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>PDF 저장 중입니다...</div>;
}
