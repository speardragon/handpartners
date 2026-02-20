"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { useQuery } from "@tanstack/react-query";
import { evaluationQueries, programQueries } from "@/queries";
import EvaluationDocument from "@/app/(home)/_components/EvaluationDocument";
import { saveAs } from "file-saver";

type Props = {
  judgingRoundId: string;
  programId: number;
  className?: string;
};

const PdfDownloadButton = ({ programId, judgingRoundId, className }: Props) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: evaluationReport } = useQuery({
    ...evaluationQueries.report(judgingRoundId),
    enabled: !!judgingRoundId,
  });

  const { data: programInfo } = useQuery({
    ...programQueries.detail(programId),
    enabled: !!programId,
  });

  const handleButtonClick = async () => {
    if (!evaluationReport || !programInfo) return;

    setIsDownloading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");

      const blob = await pdf(
        <EvaluationDocument
          programInfo={programInfo}
          evaluationReport={evaluationReport}
        />
      ).toBlob();

      const fileName = `심사_${new Date().toISOString().split("T")[0]}.pdf`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error("PDF 저장 중 오류가 발생했습니다:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <LoadingButton
      className={className}
      loading={isDownloading}
      onClick={handleButtonClick}
      disabled={
        !evaluationReport || evaluationReport.length === 0 || !programInfo
      }
    >
      <FileText size={16} />
      <div>보고서 저장(.pdf)</div>
    </LoadingButton>
  );
};

export default PdfDownloadButton;
