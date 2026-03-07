import Footer from "../_components/Footer";
import Header from "../_components/Header";
import "../globals.css";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 flex flex-col min-h-0 overflow-hidden bg-background">
      <Header />
      <main className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
