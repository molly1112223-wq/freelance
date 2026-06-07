import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Craft",
  description: "连接经过认证的专业自由职业者与真实需求方",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Craft",
    description: "连接经过认证的专业自由职业者与真实需求方",
    url: siteUrl,
    siteName: "Craft",
    locale: "zh_CN",
    type: "website"
  }
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--craft-sans",
  display: "swap"
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--craft-serif",
  display: "swap"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${dmSerif.variable}`}>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
