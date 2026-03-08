"use server";

import { raiseActionError, withActionResult } from "@/lib/action";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { JudgingInvitationEmail } from "@/lib/emails/judging-invitation";

export interface SendJudgingEmailsResult {
  sentCount: number;
  failedCount: number;
}

export async function sendJudgingEmails(judgingRoundId: string) {
  return withActionResult(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

    const { data: judgingRound, error: roundError } = await supabase
      .from("judging_round")
      .select("id, status, program:program_id ( name )")
      .eq("id", judgingRoundId)
      .single();

    if (roundError || !judgingRound) {
      raiseActionError(
        roundError ?? new Error("심사 라운드를 찾을 수 없습니다.")
      );
    }

    if (judgingRound.status !== "IN_PROGRESS") {
      throw new Error("심사가 진행 중일 때만 이메일을 발송할 수 있습니다.");
    }

    const { data: judges, error: judgesError } = await supabase
      .from("judging_round_user")
      .select("user:user_id ( username, email )")
      .eq("judging_round_id", judgingRoundId);

    if (judgesError) {
      raiseActionError(judgesError);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const program = judgingRound.program as unknown as { name: string } | null;
    const programName = program?.name ?? "프로그램";
    const judgingUrl = `${siteUrl}/judging/${judgingRoundId}`;

    const validJudges = (judges ?? [])
      .map(
        (j) =>
          j.user as unknown as { username: string; email: string | null } | null
      )
      .filter((u): u is { username: string; email: string } => !!u?.email);

    let sentCount = 0;
    let failedCount = 0;

    for (const judge of validJudges) {
      try {
        const { error } = await resend.emails.send({
          // from: "Startup Partners <startuppartners@resend.dev>",
          from: "noreply@startuppartners.co.kr",
          // to: "rkdckdfyyd@naver.com",
          to: judge.email,
          subject: `[${programName}] 심사 안내`,
          react: JudgingInvitationEmail({
            judgeName: judge.username,
            programName,
            judgingRoundName: judgingRoundId,
            judgingUrl,
          }),
        });
        sentCount++;
        throw error;
      } catch (e) {
        console.error("error sending email to", judge.email, "error msg:", e);
        failedCount++;
      }
    }

    return { sentCount, failedCount };
  });
}

export async function getJudgeEmailCount(judgingRoundId: string) {
  return withActionResult(async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("judging_round_user")
      .select("user:user_id ( email )")
      .eq("judging_round_id", judgingRoundId);

    if (error) {
      raiseActionError(error);
    }

    const total = data?.length ?? 0;
    const withEmail = (data ?? []).filter(
      (j) => (j.user as unknown as { email: string | null } | null)?.email
    ).length;

    return { total, withEmail };
  });
}
