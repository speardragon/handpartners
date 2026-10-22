import { Activity, Building2, CheckCircle2, FileWarning, LoaderCircle } from "lucide-react";
import { getDashboardOverview } from "../_lib/dashboard";

const cards = [
  {
    key: "inProgressPrograms",
    label: "진행 중 프로그램",
    icon: Activity,
    color: "text-blue-600",
  },
  {
    key: "totalCompanies",
    label: "전체 기업 수",
    icon: Building2,
    color: "text-neutral-700",
  },
  {
    key: "completedCompanies",
    label: "평가 완료 기업",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  {
    key: "pendingCompanies",
    label: "미평가/진행 중 기업",
    icon: LoaderCircle,
    color: "text-amber-600",
  },
  {
    key: "feedbackMissingCount",
    label: "피드백 누락 건",
    icon: FileWarning,
    color: "text-rose-600",
  },
] as const;

export async function DashboardOverview() {
  const overview = await getDashboardOverview();

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <article
          key={key}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-500">{label}</p>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="text-3xl font-semibold tracking-tight text-neutral-950">
            {overview[key].toLocaleString()}
          </div>
        </article>
      ))}
    </section>
  );
}
