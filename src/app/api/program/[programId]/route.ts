import { NextResponse } from "next/server";
import { getProgramById } from "@/actions/program-action";

interface Params {
  params: {
    programId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { programId } = params;

  try {
    const data = await getProgramById(Number(programId));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
