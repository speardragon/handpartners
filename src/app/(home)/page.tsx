import { columns, ReviewStatus } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { data } from "./dummy";

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="flex flex-col h-full p-4 space-y-4 px-16">
        <div>구분: 아이디어 공모전 1차 심사 / 심사그룹코드: 1</div>
        <div className="flex flex-col h-[500px] p-2 overflow-y-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </main>
  );
}
