import { NextRequest, NextResponse } from "next/server";
import { getJudgeById, JudgeCreateData } from "@/actions/judging_round-action";
import { createServerSupabaseClient } from "@/utils/supabase/server";

interface Params {
  params: {
    judgeRoundId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { judgeRoundId } = params;
  try {
    const data = await getJudgeById(Number(judgeRoundId));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    // ↑ 프로젝트 상황에 따라 적절한 Supabase client 생성 로직을 사용하시면 됩니다.

    // 1) 요청 바디 파싱
    const body = await req.json();
    const { judgingRoundId, judgeData } = body as {
      judgingRoundId: number;
      judgeData: JudgeCreateData;
    };

    if (!judgingRoundId) {
      return NextResponse.json(
        { success: false, error: "judgingRoundId가 필요합니다." },
        { status: 400 }
      );
    }

    // 2) DB의 judging_round 업데이트
    const { data: updatedRoundData, error: updateRoundError } = await supabase
      .from("judging_round")
      .update({
        name: judgeData.name,
        description: judgeData.description,
        start_date: judgeData.start_date || null,
        end_date: judgeData.end_date || null,
      })
      .eq("id", judgingRoundId)
      .select("id")
      .single();

    if (updateRoundError) {
      console.error("judge_round update error", updateRoundError);
      return NextResponse.json(
        { success: false, error: updateRoundError.message },
        { status: 500 }
      );
    }

    if (!updatedRoundData) {
      return NextResponse.json(
        { success: false, error: "심사 라운드 업데이트에 실패했습니다." },
        { status: 404 }
      );
    }

    // 3) 기존 judge_round_company, judge_round_user 모두 삭제
    const { error: deleteCompanyError } = await supabase
      .from("judging_round_company")
      .delete()
      .eq("judging_round_id", judgingRoundId);
    if (deleteCompanyError) {
      return NextResponse.json(
        { success: false, error: deleteCompanyError.message },
        { status: 500 }
      );
    }

    const { error: deleteUserError } = await supabase
      .from("judging_round_user")
      .delete()
      .eq("judging_round_id", judgingRoundId);
    if (deleteUserError) {
      return NextResponse.json(
        { success: false, error: deleteUserError.message },
        { status: 500 }
      );
    }

    // 4) judge_round_company 새로 insert
    //    - 실제로는 파일 업로드 로직이 필요하면, 여기서 FormData로 처리해야 함
    //      혹은 judgeData.companies[*].pdf_path 처럼 경로만 전달 받도록 설계
    if (judgeData.companies && judgeData.companies.length > 0) {
      const companiesPayload = [];

      for (const c of judgeData.companies) {
        let pdfPath: string | null = null;

        // (1) 여기선 파일 객체를 받기 어려우므로,
        //     실제 프로젝트에서는 클라이언트에서 먼저 파일 업로드 후
        //     pdf_path(publicUrl)만 API로 넘기는 방식을 권장합니다.

        pdfPath = c.file ? "dummy-no-file-handled" : null;
        // 또는 c.pdf_path가 있다면 그 값을 사용
        // pdfPath = c.pdf_path || null;

        companiesPayload.push({
          judging_round_id: judgingRoundId,
          company_id: c.company_id!,
          pdf_path: pdfPath,
          group_name: c.group_name || "A",
        });
      }

      const { error: companyInsertError } = await supabase
        .from("judging_round_company")
        .insert(companiesPayload);

      if (companyInsertError) {
        return NextResponse.json(
          { success: false, error: companyInsertError.message },
          { status: 500 }
        );
      }
    }

    // 5) judge_round_user 새로 insert
    if (judgeData.users && judgeData.users.length > 0) {
      const usersPayload = judgeData.users.map((u) => ({
        user_id: u.user_id,
        group_name: u.group_name || "A",
        judging_round_id: judgingRoundId,
      }));

      const { error: userInsertError } = await supabase
        .from("judging_round_user")
        .insert(usersPayload);

      if (userInsertError) {
        return NextResponse.json(
          { success: false, error: userInsertError.message },
          { status: 500 }
        );
      }
    }

    // 6) 성공 응답
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("updateJudge API error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
