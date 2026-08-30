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
    <html lang="zh-CN" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
