import { NextResponse } from "next/server";
import { getDetailedEvaluationsByUser } from "@/actions/evaluation-action";

interface Params {
  params: {
    judgingRoundId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { judgingRoundId } = params;

  try {
    // 서버 액션 함수 호출
    const data = await getDetailedEvaluationsByUser(Number(judgingRoundId));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
