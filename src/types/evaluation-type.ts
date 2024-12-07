export type CompanyInfo = {
  name: string;
  description: string | null;
};

export type EvaluationCriterionInfo = {
  item_name: string;
  description: string | null;
  points: number;
};

export type EvaluationItem = {
  evaluation_criterion: EvaluationCriterionInfo;
  grade: number;
  feedback: string | null;
};

export type UserProfile = {
  name: string; // user.username을 name으로 사용
  affiliation: string | null;
  position: string | null;
};

export type FinalResult = {
  company: CompanyInfo;
  evaluations: EvaluationItem[];
  user_profile: UserProfile;
};
