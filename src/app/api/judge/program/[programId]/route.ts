// app/api/judging-round/program/[programId]/route.ts
import { NextResponse } from "next/server";
import { getJudgingRoundsByProgramId } from "@/actions/judging_round-action";

interface Params {
  params: {
    programId: string;
  };
}
export async function GET(request: Request, { params }: Params) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const size = Number(searchParams.get("size") || 10);

    const programId = Number(params.programId);
    const result = await getJudgingRoundsByProgramId(programId, page, size);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
