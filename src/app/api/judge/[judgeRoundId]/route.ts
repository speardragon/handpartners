import { NextResponse } from "next/server";
import { getJudgeById } from "@/actions/judging_round-action";

interface Params {
  params: {
    judgeRoundId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { judgeRoundId } = params;
  try {
    const data = await getJudgeById(Number(judgeRoundId));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
