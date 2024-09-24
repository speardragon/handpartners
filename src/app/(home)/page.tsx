import { columns, ReviewStatus } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default function Home() {
  // 더미 데이터
  const data: ReviewStatus[] = [
    {
      id: "1001",
      companyName: "팀A",
      ideaName: "스마트 농업 솔루션",
      field: "농업",
      status: "미심사",
      participantId: 100,
    },
    {
      id: "1002",
      companyName: "기업B",
      ideaName: "AI 의료 플랫폼",
      field: "의료",
      status: "미심사",
      participantId: 101,
    },
    {
      id: "1003",
      companyName: "팀C",
      ideaName: "친환경 에너지 기술",
      field: "에너지",
      status: "A(100)",
      participantId: 102,
    },
  ];

  return (
    <main className="w-full h-full">
      <div className="flex flex-col h-full p-4 space-y-4 px-16">
        <div>구분: 아이디어 공모전 1차 심사 / 심사그룹코드: 1</div>
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
