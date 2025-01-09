import { NextResponse } from "next/server";
import { getEvaluationByUser } from "@/actions/evaluation-action";

interface Params {
  params: {
    judgeRoundId: string;
    companyId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { judgeRoundId, companyId } = params;

  try {
    // 액션 함수 호출
    const evaluation = await getEvaluationByUser(
      Number(judgeRoundId),
      Number(companyId)
    );
    return NextResponse.json(evaluation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}