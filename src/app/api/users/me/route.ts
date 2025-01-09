import { NextResponse } from "next/server";
import { getUserProfile } from "@/actions/user-actions";

export async function GET() {
  try {
    const userProfile = await getUserProfile();

    return NextResponse.json(userProfile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}