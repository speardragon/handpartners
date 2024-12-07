import React from "react";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import EvaluationDocument from "./EvaluationDocument";
import { useRouter } from "next/navigation";

type Props = {
  judgingRoundId: number;
};

const PdfDownloadButton = ({ judgingRoundId }: Props) => {
  const router = useRouter();
  const handleButtonClick = () => {
    const newWindow = window.open(
      `/evaluationReport/${judgingRoundId}`,
      "_blank"
    );
    if (!newWindow) {
      alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
    }
  };

  return (
    <Button
      className="flex gap-2 bg-red-500 pr-6 text-sm"
      // onClick={downloadPdf}
      onClick={handleButtonClick}
      // onClick={() => router.push(`/evaluationReport/${judgingRoundId}`)}
    >
      <FileText />
      <div>PDF로 저장</div>
    </Button>
  );
};

export default PdfDownloadButton;
