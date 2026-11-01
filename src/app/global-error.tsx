"use client";

import { useEffect } from "react";

// 루트 레이아웃에서 발생한 예외까지 잡는 최후의 에러 경계.
// 루트 레이아웃을 대체하므로 html/body와 최소한의 스타일을 직접 포함한다.
export default function GlobalError({
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
    <html lang="ko" translate="no">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>
          화면을 표시하는 중 문제가 발생했습니다.
        </h2>
        <p style={{ fontSize: 14, color: "#525252", lineHeight: 1.6 }}>
          브라우저 번역 기능이 켜져 있다면 끈 뒤 다시 시도해주세요.
          <br />
          문제가 계속되면 페이지를 새로고침해주세요.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => reset()}>
            다시 시도
          </button>
          <button type="button" onClick={() => window.location.reload()}>
            새로고침
          </button>
        </div>
      </body>
    </html>
  );
}
