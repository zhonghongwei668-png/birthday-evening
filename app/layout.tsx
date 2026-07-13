import type { Metadata, Viewport } from "next";
import "./globals.css";

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (productionHost
    ? `https://${productionHost}`
    : "https://birthday-evening-note.zhonghongwei668.chatgpt.site");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "A Little Birthday Evening",
  description: "一份提前准备的小小晚餐计划。重新见面，聊聊天，吃顿好饭。",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "A Little Birthday Evening",
    description: "一份提前准备的小小晚餐计划。",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "A Little Birthday Evening 私人生日晚餐邀请",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Little Birthday Evening",
    description: "一份提前准备的小小晚餐计划。",
    images: ["/og.png"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3efe7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
