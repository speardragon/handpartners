import { NextResponse } from "next/server";
import { getJudgeById } from "@/actions/judging_round-action";
import { getJudgingRoundCompaniesById } from "@/actions/judging_rounds_company-action";

interface Params {
  params: {
    judgeRoundId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { judgeRoundId } = params;
  try {
    const data = await getJudgingRoundCompaniesById(Number(judgeRoundId));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
