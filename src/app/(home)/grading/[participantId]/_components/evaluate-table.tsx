"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function EvaluateTable() {
  // 더미 데이터와 초기 선택 상태 정의 (group과 배점 분리)
  const initialData = [
    {
      id: 1,
      group: "문제인식",
      scoreAllocation: 20,
      details: "창업·아이템 개발 배경 및 필요성, 목표시장 분석",
      score: "",
    },
    {
      id: 2,
      group: "해결방안",
      scoreAllocation: 40,
      details: "창업·아이템 현황(준비), 실현(구체화) 방안",
      score: "",
    },
    {
      id: 3,
      group: "성장전략",
      scoreAllocation: 20,
      details: "사업화 추진 성과, 전략, 추진일정 및 자금 조달 계획",
      score: "",
    },
    {
      id: 4,
      group: "팀구성",
      scoreAllocation: 10,
      details: "대표자(팀) 역량, 외부 협력 계획, ESG 도입 계획",
      score: "",
    },
    {
      id: 5,
      group: "스포츠 연관성",
      scoreAllocation: 10,
      details: "스포츠 산업 분야 적합성 및 부가가치 창출 가능성",
      score: "",
    },
  ];

  const [evaluationData, setEvaluationData] = useState(initialData);

  // Select 값 변경 핸들러
  const handleSelectChange = (id: number, value: string) => {
    setEvaluationData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, score: value } : item
      )
    );
  };

  // 저장 버튼 클릭 핸들러 (콘솔에 데이터 출력)
  const handleSave = () => {
    console.log(evaluationData);
  };

  // 리셋 버튼 클릭 핸들러 (선택 초기화)
  const handleReset = () => {
    setEvaluationData(initialData);
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
          {evaluationData.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{`${item.group} (${item.scoreAllocation})`}</td>
              <td className="p-2">{item.details}</td>
              <td className="p-2">
                <Select
                  onValueChange={(value) => handleSelectChange(item.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
          <tr className="border-t">
            <td className="p-2">총점</td>
            <td className="p-2 text-center">
              상위 20 팀은 A 그룹 점수를 배분 부탁드립니다.
              <br />
              A: 100~91 / B: 90~81 / C: 80~71 / D: 70~
            </td>
            <td className="p-2 text-center">0</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center mt-4 space-x-4">
        <Button className="bg-purple-600 text-white" onClick={handleSave}>
          저장
        </Button>
        <Button className="bg-purple-600 text-white" onClick={handleReset}>
          리셋
        </Button>
        <Button variant="outline">닫기</Button>
      </div>
      <p className="text-center mt-2 text-sm text-gray-500">
        점수 입력이나 수정 후 반드시 저장해 주십시오.
      </p>
    </div>
  );
}
