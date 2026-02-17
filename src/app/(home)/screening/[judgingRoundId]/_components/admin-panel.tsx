"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Shield, SquareArrowOutUpRight, Download } from "lucide-react";
import { toast } from "sonner";
import { getAllJudgeEvaluations } from "@/actions/evaluation-action";
import type { ProgramRow } from "@/actions/program-action";

interface AdminPanelProps {
  judgingRoundId: number;
  programId: number;
  programName: string;
}

export default function AdminPanel({
  judgingRoundId,
  programId,
  programName,
}: AdminPanelProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBulkDownload = async () => {
    setIsDownloading(true);
    try {
      const judgeEvaluations = await getAllJudgeEvaluations(judgingRoundId);

      if (judgeEvaluations.length === 0) {
        toast.error("다운로드할 심사 데이터가 없습니다.");
        return;
      }

      const [{ pdf }, { default: JSZip }, { saveAs }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("jszip"),
        import("file-saver"),
      ]);

      const { default: EvaluationDocument } = await import(
        "@/app/(home)/_components/EvaluationDocument"
      );

      const zip = new JSZip();

      const programInfo = {
        id: programId,
        name: programName,
      } as ProgramRow;

      for (const judge of judgeEvaluations) {
        if (judge.evaluations.length === 0) continue;

        const blob = await pdf(
          <EvaluationDocument
            programInfo={programInfo}
            evaluationReport={judge.evaluations}
          />
        ).toBlob();

        zip.file(`${judge.username}_심사보고서.pdf`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const date = new Date().toISOString().split("T")[0];
      saveAs(zipBlob, `심사보고서_${date}.zip`);

      toast.success("보고서 일괄 다운로드가 완료되었습니다.");
    } catch (error) {
      toast.error("보고서 다운로드 중 오류가 발생했습니다.");
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Shield size={14} className="text-blue-600" />
        <h2 className="text-sm font-semibold text-blue-700">관리자 전용</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={() => router.push(`/admin/${judgingRoundId}`)}
        >
          <SquareArrowOutUpRight size={14} />
          심사 현황 보기
        </Button>
        <LoadingButton
          variant="outline"
          className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
          loading={isDownloading}
          onClick={handleBulkDownload}
        >
          <Download size={14} />
          보고서 일괄 다운로드
        </LoadingButton>
      </div>
    </div>
  );
}
