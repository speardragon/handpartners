"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ScoreToExcelButton from "@/app/(home)/_components/ScoreToExcelButton";
import FeedbackToExcelButton from "@/app/(home)/_components/FeedbackToExcelButton";
import PdfDownloadButton from "@/app/(home)/_components/PdfDownloadButton";

interface ExportDropdownProps {
  judgingRoundId: number;
  programId: number;
  showAdminLink?: boolean;
}

export default function ExportDropdown({
  judgingRoundId,
  programId,
  showAdminLink,
}: ExportDropdownProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-1 px-2" variant="outline">
          <EllipsisVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>심사 관리</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {showAdminLink && (
            <DropdownMenuItem>
              <Button
                className="flex w-full justify-evenly"
                onClick={() => {
                  router.push(`/admin/${judgingRoundId}`);
                }}
              >
                <SquareArrowOutUpRight size={18} />
                심사 현황 보러가기
              </Button>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <ScoreToExcelButton
              className="flex w-full p-2 rounded-md text-white gap-2 bg-blue-600 justify-evenly hover:bg-blue-700"
              judgingRoundId={judgingRoundId}
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FeedbackToExcelButton
              className="flex w-full p-2 rounded-md text-white gap-2 bg-green-600 justify-evenly hover:bg-green-700"
              judgingRoundId={judgingRoundId}
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PdfDownloadButton
              className="flex w-full p-2 rounded-md text-white gap-2 pr-6 text-sm bg-red-500 justify-evenly hover:bg-red-700"
              programId={programId}
              judgingRoundId={judgingRoundId}
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
