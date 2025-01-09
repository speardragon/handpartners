import { NextResponse } from "next/server";
import { getJudgeById } from "@/actions/judging_round-action";
import { getProgramCompanies } from "@/actions/program-company-action";

interface Params {
  params: {
    programId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { programId } = params;
  try {
    const data = await getProgramCompanies(Number(programId));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
