import type { Metadata } from "next";
import localFont from "next/font/local";
import { SongBar } from "@/components/SongBar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative max-w-screen overflow-x-hidden h-[100dvh] grid grid-rows-[auto_80px]`}
      >
        <div className="overflow-y-scroll ">{children}</div>

        <SongBar />
      </body>
    </html>
  );
}
