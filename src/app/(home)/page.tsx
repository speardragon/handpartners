"use client";

import { columns, ReviewStatus } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { useFetchAllProject } from "./_hooks/useProjectQuery";
import { data } from "./dummy";

export default function Home() {
  const { data: projectInfo } = useFetchAllProject();

  if (!projectInfo) {
    return <div>loading</div>;
  }

  return (
    <main className="w-full h-full">
      <div className="flex flex-col h-full p-4 space-y-4 px-16">
        <div>
          구분: {projectInfo[0].title} / 심사그룹코드: {projectInfo[0].id}
        </div>
        <div className="flex flex-col h-[500px] p-2 overflow-y-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </main>
  );
}
