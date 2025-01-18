import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type Props = {
  judgingRoundId: number;
  programId: number;
};

const PdfDownloadButton = ({ programId, judgingRoundId }: Props) => {
  const handleButtonClick = () => {
    const newWindow = window.open(
      `/evaluationReport/program/${programId}/judgingRound/${judgingRoundId}`,
      "_blank"
    );
    if (!newWindow) {
      alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
    }
  };

  return (
    <Button
      className="flex gap-2 bg-red-500 pr-6 text-sm hover:bg-red-700"
      // onClick={downloadPdf}
      onClick={handleButtonClick}
      // onClick={() => router.push(`/evaluationReport/${judgingRoundId}`)}
    >
      <FileText />
      <div>보고서 저장(.pdf)</div>
    </Button>
  );
};

export default PdfDownloadButton;
