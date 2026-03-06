import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    programId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { programId } = await params;

  redirect(`/admin/program/${programId}/judging`);
}
