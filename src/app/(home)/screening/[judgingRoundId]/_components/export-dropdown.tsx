"use client";

import ScoreToExcelButton from "@/app/(home)/_components/ScoreToExcelButton";
import FeedbackToExcelButton from "@/app/(home)/_components/FeedbackToExcelButton";
import PdfDownloadButton from "@/app/(home)/_components/PdfDownloadButton";

interface ExportDropdownProps {
  judgingRoundId: number;
  programId: number;
}

const exportButtonClass =
  "inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer";

export default function ExportDropdown({
  judgingRoundId,
  programId,
}: ExportDropdownProps) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">내보내기</h2>
      <div className="flex flex-wrap gap-2">
        <ScoreToExcelButton
          className={exportButtonClass}
          judgingRoundId={judgingRoundId}
        />
        <FeedbackToExcelButton
          className={exportButtonClass}
          judgingRoundId={judgingRoundId}
        />
        <PdfDownloadButton
          className={exportButtonClass}
          programId={programId}
          judgingRoundId={judgingRoundId}
        />
      </div>
    </div>
  );
}
