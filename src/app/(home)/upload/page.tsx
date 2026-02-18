import { Suspense } from "react";
import UploadPageClient from "./_components/UploadPageClient";

export default function UploadPage() {
  return (
    <Suspense>
      <UploadPageClient />
    </Suspense>
  );
}
