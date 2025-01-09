"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useCompanyQuery } from "../../../company/_hooks/useCompanyQuery";
import { PaginationState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // 예시로 @radix-ui or similar
import { CompanyRow } from "@/actions/company-action";
import Loading from "@/app/_components/Loading";

interface CompanySelectSheetProps {
  onSelectCompanies: (companies: { id: number; name: string }[]) => void;
}

export function CompanySelectSheet({
  onSelectCompanies,
}: CompanySelectSheetProps) {
  // 페이지네이션 등은 필요에 따라 조절
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const { data: companies } = useCompanyQuery(pagination);

  // 선택된 company id를 로컬 state로 관리
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<number[]>([]);

  // 체크박스 토글 함수
  const handleToggle = (companyId: number) => {
    setSelectedCompanyIds((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleConfirm = () => {
    // 실제로는 name 등 추가 정보가 필요할 수 있으므로
    // companies에서 해당 id 찾은 뒤 {id, name} 형태로 구성
    const selectedCompanies = companies.result
      .filter((c: CompanyRow) => selectedCompanyIds.includes(c.id))
      .map((c: CompanyRow) => ({ id: c.id, name: c.name }));

    onSelectCompanies(selectedCompanies);
  };

  if (!companies.result) {
    return <Loading />;
  }

  return (
    <Sheet>
      <SheetTrigger className="text-sm px-2 py-1 rounded-lg bg-blue-300 font-medium border border-blue-500 hover:bg-blue-400">
        + 기업 추가
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>기업 선택</SheetTitle>
          <SheetDescription>심사에 참여할 기업을 선택하세요.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-2 h-[400px] overflow-auto border p-2">
          {companies.result.map((company: CompanyRow) => {
            const checked = selectedCompanyIds.includes(company.id);
            return (
              <div
                key={company.id}
                className="flex items-center gap-2 border-b py-2"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => handleToggle(company.id)}
                />
                <span>{company.name}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={handleConfirm}>확인</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
