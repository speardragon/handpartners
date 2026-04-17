"use client";

import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  judgingRoundQueries,
  evaluationQueries,
  judgingQueries,
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
    judgingQueries.participation(judgeRoundId)
  );

  const [isFull, setIsFull] = useState<boolean>(false);

  const handleFullButton = () => {
    setIsFull(!isFull);
  };

  if (!judgeRound) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 top-16 z-10 flex overflow-hidden bg-white ${
        isFull ? "flex-col" : "flex-row"
      }`}
    >
      <div
        className={`flex min-h-0 flex-col ${
          isFull ? "h-full w-full" : "h-full w-1/2"
        }`}
      >
        {!isFull && (
          <div className="flex shrink-0 items-center gap-2 border-b bg-white px-6 py-3">
            <FileText size={13} className="text-neutral-400" />
            <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
              제출 서류
            </span>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-auto">
          <PdfViewer
            isFull={isFull}
            handleFullButton={handleFullButton}
            pdfPath={existEvaluation?.pdfPath ?? ""}
          />
        </div>
      </div>

      <div
        className={`flex min-h-0 flex-col border-l bg-gray-50 ${
          isFull ? "hidden" : "h-full w-1/2"
        }`}
      >
        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="mb-1 flex items-center gap-2 text-xs text-neutral-400">
            <ClipboardList size={13} />
            <span className="font-medium tracking-wide uppercase">심사 라운드</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-900">{judgeRound.name}</h1>
          {judgeRound.description && (
            <p className="mt-1 text-sm text-neutral-500">
              {judgeRound.description}
            </p>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
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
