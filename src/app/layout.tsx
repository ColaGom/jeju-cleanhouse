import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "제주도 클린하우스 찾기",
  description: "제주도 클린하우스 위치 지도, 가까운 제주도 클린하우스, Powered by Alphaca Labs, https://www.alphaca.kr/ 알파카랩스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kr">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  );
}
