"use client";

import { memo, useState } from "react";
import Loading from "@/app/_components/Loading";
import { useJudgeQuery } from "./_hooks/useJudgeQuery";
import PdfViewer from "./_components/pdf-viewer";
import EvaluateTable from "./_components/evaluate-table";
import { useEvaluationQuery } from "./_hooks/useEvaluationQuery";

type Props = {
  params: {
    judgeRoundId: string;
    companyId: string;
  };
};

const Page = ({ params }: Props) => {
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

  if (isFull) {
    return (
      <div className="flex flex-col w-full h-full justify-center bg-gray-50">
        <PdfViewer
          isFull={isFull}
          handleFullButton={handleFullButton}
          pdfPath={existEvaluation.pdfPath}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full p-4 gap-2 h-screen">
      <div className="flex flex-col w-1/2 p-2">
        <div className="space-y-2 text-gray-600">
          <p className="text-gray-700 text-lg font-semibold">
            {judgeRound.program.name}
          </p>
          <p className="text-gray-800 font-bold">{judgeRound.name}</p>
          <p className="text-sm">{judgeRound.description}</p>
        </div>
        <EvaluateTable judgeRoundId={judgeRoundId} companyId={companyId} />
      </div>
      <div className="flex flex-col w-1/2 h-full justify-center bg-gray-50 p-4">
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
