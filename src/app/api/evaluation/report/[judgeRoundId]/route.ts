import { NextResponse } from "next/server";
import { getDetailedEvaluationsByUser } from "@/actions/evaluation-action";

interface Params {
  params: {
    judgeRoundId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { judgeRoundId } = params;

  try {
    // 서버 액션 함수 호출
    const data = await getDetailedEvaluationsByUser(Number(judgeRoundId));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
