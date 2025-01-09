import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({message: "Hello, World!"});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}