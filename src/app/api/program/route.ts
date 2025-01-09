import { getScreenings } from "@/actions/program-action";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const screenings = await getScreenings();
    return NextResponse.json(screenings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch screenings" }, { status: 500 });
  }
}