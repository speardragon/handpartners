import { NextResponse } from "next/server";
import { getJudgingRoundUsersById } from "@/actions/judging_round_user-action";

interface Params {
  params: {
    judgeRoundId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { judgeRoundId } = params;
  try {
    const data = await getJudgingRoundUsersById(Number(judgeRoundId));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
