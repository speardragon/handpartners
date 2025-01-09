import { getCompanies } from "@/actions/company-action";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const search = searchParams.get("search") || "";

  try {
    const companies = await getCompanies(page, size, search);
    return NextResponse.json(companies);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch screenings" },
      { status: 500 }
    );
  }
}
