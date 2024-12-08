"use client";

import { memo, useState } from "react";
import Loading from "@/app/_components/Loading";
import { useJudgeQuery } from "./_hooks/useJudgeQuery";
import PdfViewer from "./_components/pdf-viewer";
import EvaluateTable from "./_components/evaluate-table";
import { useEvaluationQuery } from "./_hooks/useEvaluationQuery";
import { useParams } from "next/navigation";

type Props = {
  params: {
    judgeRoundId: string;
    companyId: string;
  };
};

const Page = () => {
  const params = useParams<{ judgeRoundId: string; companyId: string }>();

  const judgeRoundId = parseInt(params.judgeRoundId);
  const companyId = parseInt(params.companyId);

  const { data: judgeRound, isLoading } = useJudgeQuery(judgeRoundId);
  const { data: existEvaluation, isLoading: isEvaluationLoading } =
    useEvaluationQuery(judgeRoundId, companyId);

  const [isFull, setIsFull] = useState<boolean>(false);

  const handleFullButton = () => {
    setIsFull(!isFull);
  };

  if (isLoading || !judgeRound || !existEvaluation) {
    return <Loading />;
  }

  return (
    <div
      className={`flex w-full h-screen ${
        isFull ? "flex-col overflow-hidden" : "flex-row"
      }`}
    >
      {/* 왼쪽 영역: EvaluateTable - 전체화면일 때는 숨김 처리 */}
      <div className={`flex flex-col ${isFull ? "hidden" : "w-1/2 p-4"}`}>
        <div className="space-y-2 text-gray-600">
          <p className="text-gray-700 text-lg font-semibold">
            {judgeRound.program.name}
          </p>
          <p className="text-gray-800 font-bold">{judgeRound.name}</p>
          <p className="text-sm">{judgeRound.description}</p>
        </div>
        <EvaluateTable judgeRoundId={judgeRoundId} companyId={companyId} />
      </div>

      {/* 오른쪽 영역: PdfViewer - 전체화면일 때는 이 영역이 전부 */}
      <div
        className={`flex flex-col h-screen bg-gray-50 ${
          isFull ? "w-full h-full overflow-y-auto" : "w-1/2 p-4"
        }`}
      >
        <PdfViewer
          isFull={isFull}
          handleFullButton={handleFullButton}
          pdfPath={existEvaluation.pdfPath}
        />
      </div>
    </div>
  );
};

export default memo(Page);
