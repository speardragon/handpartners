import { Company } from "@/actions/program-action";
import type { JudgingRoundStatus } from "@/actions/judging_round-action";
import type { MentoringStatus } from "@/actions/mentoring-action";
import { Badge } from "@/components/ui/badge";
import { createElement } from "react";

export function getStatusBadge(status: JudgingRoundStatus | MentoringStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return createElement(
        Badge,
        {
          className:
            "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50 shadow-none",
        },
        "진행 중"
      );
    case "COMPLETED":
      return createElement(
        Badge,
        {
          className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 shadow-none",
        },
        "종료"
      );
    case "PENDING":
      return createElement(
        Badge,
        {
          className:
            "border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-100 shadow-none",
        },
        "진행 전"
      );
  }
}

export function calculateStatusDistribution(companies: Company[]) {
  const statusDistribution = {
    "심사 예정": 0,
    "심사 중": 0,
    "심사 완료": 0,
  };

  companies.forEach((company) => {
    switch (company.status) {
      case "심사 예정":
        statusDistribution["심사 예정"]++;
        break;
      case "심사 중":
        statusDistribution["심사 중"]++;
        break;
      case "심사 완료":
        statusDistribution["심사 완료"]++;
        break;
      default:
        break;
    }
  });

  return statusDistribution;
}

export function calculateScoreDistribution(companies: Company[]) {
  const scoreDistribution = {
    "90점 이상": 0,
    "80점 이상": 0,
    "70점 이상": 0,
    "60점 이상": 0,
    "60점 미만": 0,
  };

  companies.forEach((company) => {
    const score = company.score;

    if (score >= 90) {
      scoreDistribution["90점 이상"]++;
    } else if (score >= 80) {
      scoreDistribution["80점 이상"]++;
    } else if (score >= 70) {
      scoreDistribution["70점 이상"]++;
    } else if (score >= 60) {
      scoreDistribution["60점 이상"]++;
    } else {
      scoreDistribution["60점 미만"]++;
    }
  });

  return scoreDistribution;
}
