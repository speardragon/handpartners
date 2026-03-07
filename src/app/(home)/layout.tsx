import Footer from "../_components/Footer";
import Header from "../_components/Header";
import "../globals.css";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background fixed inset-0 flex min-h-0 flex-col overflow-hidden">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
