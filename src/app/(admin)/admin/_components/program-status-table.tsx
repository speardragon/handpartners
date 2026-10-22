import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProgramDashboardRows, getProgramStatusBadge } from "../_lib/dashboard";

export async function ProgramStatusTable() {
  const rows = await getProgramDashboardRows();

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-5 py-4">
        <h2 className="text-base font-semibold text-neutral-950">
          프로그램별 심사 운영 현황
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          운영자가 완료율이 낮거나 누락이 많은 프로그램을 빠르게 찾을 수 있도록 정렬했습니다.
        </p>
      </div>

      <div className="overflow-x-auto px-2 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>프로그램</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">기업 수</TableHead>
              <TableHead className="text-center">완료</TableHead>
              <TableHead className="text-center">대기</TableHead>
              <TableHead className="text-center">완료율</TableHead>
              <TableHead className="text-center">피드백 누락</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const badge = getProgramStatusBadge(row.status);
              return (
                <TableRow key={row.judgingRoundId}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-neutral-900">{row.programName}</div>
                      <div className="text-xs text-neutral-500">
                        심사 라운드 ID: {row.judgingRoundId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={badge.className}>{badge.label}</Badge>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">{row.totalCompanies}</TableCell>
                  <TableCell className="text-center tabular-nums text-emerald-700">
                    {row.completedCompanies}
                  </TableCell>
                  <TableCell className="text-center tabular-nums text-amber-700">
                    {row.pendingCompanies}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-neutral-900"
                          style={{ width: `${row.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm tabular-nums text-neutral-700">
                        {row.completionRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {row.feedbackMissingCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/${row.judgingRoundId}`}
                      className="text-sm font-medium text-neutral-900 underline underline-offset-4"
                    >
                      상세 보기
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
