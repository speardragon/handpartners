import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import ReactQueryClientProvider from "@/config/ReactQueryClientProvider";
import { AuthProvider } from "@/app/_components/AuthProvider";
import "core-js/full/promise/with-resolvers";
import Script from "next/dist/client/script";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "스타트업 파트너스",
  description: "스타트업 파트너스 심사 시스템",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className={`${pretendard.className} antialiased`}>
        <NextTopLoader
          color="#4f46e5"
          height={3}
          shadow="0 0 10px #4f46e5, 0 0 5px #4f46e5"
          showSpinner={false}
        />
        <ReactQueryClientProvider>
          <AuthProvider>
            <Toaster richColors />
            {children}
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
