"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import { ModulesProvider } from "@/context/modulesContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <ModulesProvider>
          {children}
        </ModulesProvider>
      </body>
    </html>
  );
}
