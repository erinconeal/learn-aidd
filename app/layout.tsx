import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Not used on first paint (body is sans-only); preloading mono triggers a
  // Chrome warning when the file is unused for a few seconds after load.
  preload: false,
});

export const metadata: Metadata = {
  title: "Learn AIDD Quiz",
  description: "Quiz app for rules/javascript, AIDD, SudoLang, React, Next.js, and the aidd framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:bg-zinc-100 dark:focus:text-zinc-900"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
