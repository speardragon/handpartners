import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPendingCompanyRows } from "../_lib/dashboard";

export async function PendingCompaniesTable() {
  const rows = await getPendingCompanyRows();

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <h2 className="text-base font-semibold text-neutral-950">
            조치가 필요한 기업
          </h2>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          미평가 상태이거나 피드백이 누락된 기업을 우선적으로 보여줍니다.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-10 text-sm text-neutral-500">
          현재 조치가 필요한 기업이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto px-2 pb-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>프로그램</TableHead>
                <TableHead>기업명</TableHead>
                <TableHead className="text-center">배정 심사위원</TableHead>
                <TableHead className="text-center">완료 심사위원</TableHead>
                <TableHead className="text-center">완료율</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`${row.judgingRoundId}:${row.companyId}`}>
                  <TableCell className="text-sm text-neutral-700">
                    {row.programName}
                  </TableCell>
                  <TableCell className="font-medium text-neutral-900">
                    {row.companyName}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.assignedJudges}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.completedJudges}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.completionRate}%
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        row.feedbackMissing
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {row.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/${row.judgingRoundId}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 underline underline-offset-4"
                    >
                      상세 보기
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
