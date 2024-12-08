import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import ReactQueryClientProvider from "@/config/ReactQueryClientProvider2";
import AuthProvider from "./_components/AuthProvider";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import "core-js/full/promise/with-resolvers";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "핸드파트너스",
  description: "핸드파트너스 심사 시스템",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  // console.log(session);

  return (
    <html lang="en" className={`${pretendard.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${pretendard.className} antialiased`}>
        <AuthProvider accessToken={session?.access_token}>
          <Toaster richColors />
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
