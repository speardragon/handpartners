// app/api/judging-round/[judgingRoundId]/detail/route.ts

import { getJudgingRoundDetails } from "@/actions/judging_round-action";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/judging-round/:judgingRoundId/detail
 */
export async function GET(
  request: NextRequest,
  context: { params: { judgeRoundId: string } }
) {
  try {
    const { judgeRoundId } = context.params;
    const detail = await getJudgingRoundDetails(Number(judgeRoundId));

    return NextResponse.json(detail);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
