import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type Props = {
  judgingRoundId: number;
  programId: number;
  className?: string;
};

const PdfDownloadButton = ({ programId, judgingRoundId, className }: Props) => {
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
    <button className={className} onClick={handleButtonClick}>
      <FileText size={16} />
      <div>보고서 저장(.pdf)</div>
    </button>
  );
};

export default PdfDownloadButton;
