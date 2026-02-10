import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIRS - SADC Impact Risk Studio",
  description:
    "Regional risk intelligence platform for disaster risk reduction in southern Africa. Built by 7Square.",
  keywords: [
    "SADC",
    "disaster risk reduction",
    "early warning",
    "risk intelligence",
    "southern Africa",
    "7Square",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
