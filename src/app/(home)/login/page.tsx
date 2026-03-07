import { Suspense } from "react";
import Login from "./_components/Login";

export default function Page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
