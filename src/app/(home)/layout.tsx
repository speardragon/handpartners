import { createServerSupabaseClient } from "@/utils/supabase/server";
import Header from "../_components/Header";
import "../globals.css";
import Login from "./login/_components/Login";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
