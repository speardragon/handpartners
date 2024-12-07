"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useJudgeQuery } from "../_hooks/useJudgeQuery";
import { toast } from "sonner";
import { createEvaluation } from "@/actions/evaluation-action";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useEvaluationQuery } from "../_hooks/useEvaluationQuery";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  judgeRoundId: number;
  companyId: number;
};

export default function EvaluateTable({ judgeRoundId, companyId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: judgeRound, isLoading } = useJudgeQuery(judgeRoundId);
  const { data: existEvaluation, isLoading: isEvaluationLoading } =
    useEvaluationQuery(judgeRoundId, companyId);

  const [feedback, setFeedback] = useState<string>("");
  const [evaluations, setEvaluations] = useState<
    {
      id: number;
      grade: number;
      item_name: string;
      points: number;
      description: string;
    }[]
  >([]);

  useEffect(() => {
    if (
      judgeRound &&
      judgeRound.criterias &&
      existEvaluation &&
      existEvaluation.evaluations
    ) {
      const initialEvaluations = judgeRound.criterias.map((item) => {
        const existingEvaluation = existEvaluation.evaluations.find(
          (evalItem) => evalItem.evaluation_criterion_id === item.id
        );

        // existEvaluation.grade가 존재하면 해당 값, 없으면 0
        const grade = existingEvaluation ? Number(existingEvaluation.grade) : 0;

        return {
          ...item,
          grade,
        };
      });

      setEvaluations(initialEvaluations);
      setFeedback(existEvaluation.evaluations[0]?.feedback ?? "");
    }
  }, [judgeRound, existEvaluation]);

  const handleInputChange = (id: number, value: string) => {
    const numValue = Number(value);
    const item = evaluations.find((item) => item.id === id);

    if (item) {
      // Prevent negative values
      if (numValue < 0) return;

      // Prevent values larger than maximum points
      if (numValue > item.points) {
        setEvaluations((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, grade: item.points } : item
          )
        );
        return;
      }

      setEvaluations((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, grade: numValue } : item
        )
      );
    }
  };

  const handleSave = () => {
    router.push("/");
  };

  const handleReset = () => {
    if (judgeRound && judgeRound.criterias) {
      setEvaluations(
        judgeRound.criterias.map((item) => ({
          ...item,
          grade: 0,
        }))
      );
    }
  };

  const handleSubmit = async () => {
    const evaluationRecords = evaluations.map((item) => ({
      // judging_round_id: judgeRoundId,
      // company_id: companyId,
      evaluation_criterion_id: item.id,
      grade: item.grade,
      user_id: "",
      status: "DONE",
      feedback,
      created_at: new Date().toISOString(),
    }));
    try {
      await createEvaluation(judgeRoundId, companyId, evaluationRecords);
      toast.success("평가와 피드백이 성공적으로 저장되었습니다!");
      queryClient.invalidateQueries();
      // router.push("/");
    } catch (error) {
      toast.error("저장 중 문제가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto mt-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-500 text-white">
            <th className="p-2">점수그룹</th>
            <th className="p-2">세부평가내용</th>
            <th className="p-2">배점</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{`${item.item_name} (${item.points})`}</td>
              <td className="p-2 text-center">{item.description}</td>
              <td className="p-2">
                <input
                  value={item.grade} // 빈 문자열 허용
                  max={item.points}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  className="w-16 p-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
          ))}
          <tr className="border-t">
            <td className="p-2">총점</td>
            {/* <td className="p-2 text-center">
              상위 20 팀은 A 그룹 점수를 배분 부탁드립니다.
              <br />
              A: 100~91 / B: 90~81 / C: 80~71 / D: 70~
            </td> */}
            <td className="p-2 text-center">
              {evaluations.reduce((total, item) => total + item.grade, 0)}
            </td>
          </tr>
        </tbody>
      </table>

      <Separator />
      <div className="mt-4">
        <Textarea
          placeholder="총 피드백을 입력하세요"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows={5}
        />
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <Button variant="outline" onClick={handleSave}>
          닫기
        </Button>
        <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
          제출
        </Button>
      </div>
      <p className="text-center mt-2 text-sm text-gray-500">
        점수 입력이나 수정 후 반드시 저장해 주십시오.
      </p>
    </div>
  );
}
