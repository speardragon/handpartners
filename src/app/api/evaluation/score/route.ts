import { NextResponse } from "next/server";
import { getCompanyScoresByRoundId } from "@/actions/judging_round-action";

export async function GET(request: Request) {
  // /api/evaluation/score?judging_round_id=1
  const { searchParams } = new URL(request.url);
  const judging_round_id = searchParams.get("judging_round_id");

  if (!judging_round_id) {
    return NextResponse.json(
      { error: "judging_round_id is required" },
      { status: 400 }
    );
  }

  // 숫자로 변환
  const roundIdNum = Number(judging_round_id);
  if (isNaN(roundIdNum)) {
    return NextResponse.json(
      { error: "judging_round_id must be a number" },
      { status: 400 }
    );
  }

  try {
    // 기존에 만든 함수를 그대로 호출
    const result = await getCompanyScoresByRoundId(roundIdNum);

    // 정상 결과 반환
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
