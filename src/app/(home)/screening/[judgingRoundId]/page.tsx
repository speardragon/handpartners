import { redirect } from "next/navigation";

interface LegacyScreeningPageProps {
  params: {
    judgingRoundId: string;
  };
}

export default function LegacyScreeningPage({
  params,
}: LegacyScreeningPageProps) {
  redirect(`/judging/${params.judgingRoundId}`);
}
