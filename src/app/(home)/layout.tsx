import { createClient } from "@/lib/supabase/server";
import Footer from "../_components/Footer";
import Header from "../_components/Header";
import "../globals.css";
import Login from "./login/_components/Login";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
}
