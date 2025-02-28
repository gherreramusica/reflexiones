"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import { ModulesProvider } from "@/context/modulesContext";
import Carousel from "@/components/carousel/page";
import { usePathname } from "next/navigation";
import Tab from "@/components/tab/page";
import Header from "@/components/header/page";
import { useState } from "react";
import Sidebar from "@/components/sidebar/page";


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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const excludePaths = ["/", "/login", "/register", "/editor"];
  const isExcluded = (path: string) => {
    return excludePaths.includes(path) || path.startsWith("/post/");
  };

  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        <ModulesProvider>
          {isExcluded(pathname) ? ( // ✅ Use isExcluded() instead of excludePaths.includes()
            children
          ) : (
            <div className="h-screen flex flex-col relative">
              <h1 className="fixed top-[45%] left-[-15%] hidden lg:block text-[100px] font-bold text-gray-100 rotate-90">
                REFLEXIONES
              </h1>
              <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              {/* Contenido principal */}
              <div className="pl-4 pr-4">
                <Carousel />
              </div>
              <Tab />
              <main>{children}</main>
            </div>
          )}
        </ModulesProvider>
      </body>
    </html>
  );
}
