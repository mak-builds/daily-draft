"use client";

import { DM_Sans } from "next/font/google";
import "./globals.css";

import AppWrappers from "@/app/AppWrapper";

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body id={"root"} className={dmSans.className}>
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
