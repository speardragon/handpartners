import Header from "../_components/Header";
import "../globals.css";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-col flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
