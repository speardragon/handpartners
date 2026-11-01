"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-xl font-semibold text-neutral-900">
        화면을 표시하는 중 문제가 발생했습니다.
      </h2>
      <p className="text-sm leading-6 text-neutral-600">
        브라우저 번역 기능이 켜져 있다면 끈 뒤 다시 시도해주세요.
        <br />
        문제가 계속되면 페이지를 새로고침해주세요.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => reset()}>
          다시 시도
        </Button>
        <Button onClick={() => window.location.reload()}>새로고침</Button>
      </div>
    </main>
  );
}
