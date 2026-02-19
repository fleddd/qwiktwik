import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GridBackground from "@/components/GridBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QwikTwik - PC Optimization Utility",
  description: "Maximize FPS and minimize input lag.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <GridBackground />

        {children}
      </body>
    </html>
  );
}