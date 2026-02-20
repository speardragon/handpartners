"use client";

import { use, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { useQuery } from "@tanstack/react-query";
import { evaluationQueries, programQueries } from "@/queries";
import EvaluationDocument from "@/app/(home)/_components/EvaluationDocument";

type Props = {
  params: Promise<{ judgingRoundId: string; programId: string }>;
};

export default function Page({ params }: Props) {
  const { judgingRoundId: judgingRoundIdStr, programId: programIdStr } =
    use(params);
  const judgingRoundId = parseInt(judgingRoundIdStr);
  const programId = parseInt(programIdStr);

  const { data, isLoading } = useQuery({
    ...evaluationQueries.report(judgingRoundIdStr),
    enabled: !!judgingRoundId,
  });
  const { data: programInfo } = useQuery({
    ...programQueries.detail(programId),
    enabled: !!programId,
  });

  // 중복 저장 방지 플래그
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savePDF = async () => {
      if (!isLoading && data && !isSaved && programInfo) {
        try {
          const { pdf } = await import("@react-pdf/renderer");

          const blob = await pdf(
            <EvaluationDocument
              programInfo={programInfo}
              evaluationReport={data}
            />
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
  }, [isLoading, data, programInfo, isSaved]);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return <div>PDF 저장 중입니다...</div>;
}
