import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paragon Gateway A-24-10 | 3D 空间与室内风格决策 SaaS 平台",
  description: "Paragon Gateway Tower A (A-24-10) 648 sq ft 3D 空间决策平台，集成 4 大风格横向对比、Aqara 智能家居模拟与新山本地装修 BOM 造价核算。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
