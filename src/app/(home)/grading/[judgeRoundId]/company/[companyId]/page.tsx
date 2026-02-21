"use client";

import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  judgingRoundQueries,
  evaluationQueries,
  screeningQueries,
} from "@/queries";
import PdfViewer from "./_components/pdf-viewer";
import EvaluateTable from "./_components/evaluate-table";
import { useParams } from "next/navigation";
import { FileText, ClipboardList, Loader2 } from "lucide-react";

const Page = () => {
  const params = useParams<{ judgeRoundId: string; companyId: string }>();

  const judgeRoundId = params.judgeRoundId;
  const companyId = parseInt(params.companyId);

  const { data: judgeRound } = useQuery(
    judgingRoundQueries.judge(judgeRoundId)
  );
  const { data: existEvaluation } = useQuery(
    evaluationQueries.byUser(judgeRoundId, companyId)
  );
  const { data: isParticipant } = useQuery(
    screeningQueries.participation(judgeRoundId)
  );

  const [isFull, setIsFull] = useState<boolean>(false);

  const handleFullButton = () => {
    setIsFull(!isFull);
  };

  if (!judgeRound) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={`flex h-full min-h-0 w-full overflow-hidden ${
        isFull ? "flex-col" : "flex-row"
      }`}
    >
      <div
        className={`flex min-h-0 flex-col ${
          isFull ? "h-full w-full" : "w-1/2"
        }`}
      >
        {!isFull && (
          <div className="flex shrink-0 items-center gap-2 border-b bg-white px-6 py-3">
            <FileText size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              제출 서류
            </span>
          </div>
        )}
        <PdfViewer
          isFull={isFull}
          handleFullButton={handleFullButton}
          pdfPath={existEvaluation?.pdfPath ?? ""}
        />
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto border-l bg-gray-50 ${
          isFull ? "hidden" : "w-1/2"
        }`}
      >
        <div className="border-b bg-white px-6 py-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardList size={14} />
            <span>{judgeRound.program.name}</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">{judgeRound.name}</h1>
          {judgeRound.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {judgeRound.description}
            </p>
          )}
        </div>
        <div className="p-6">
          <EvaluateTable
            judgeRoundId={judgeRoundId}
            companyId={companyId}
            isParticipant={isParticipant ?? false}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Page);
