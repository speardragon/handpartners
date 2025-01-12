import { getJudgingCriteriaByRound } from "@/actions/evaluation_criteria-action";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { judgeRoundId: string } }
) {
  try {
    const judgingRoundId = parseInt(params.judgeRoundId, 10);
    if (!judgingRoundId) {
      throw new Error("유효하지 않은 judgingRoundId 입니다.");
    }

    const data = await getJudgingCriteriaByRound(judgingRoundId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
