"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import { ModulesProvider } from "@/context/modulesContext"
import Carousel from "@/components/carousel/page";
import { usePathname } from "next/navigation";
import Tab from "@/components/tab/page";
import Header from "@/components/header/page";


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


  const pathname = usePathname();
  const excludePaths = ["/", "/login", "/register", "/editor"];

  
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        <ModulesProvider>
          {excludePaths.includes(pathname) ? (
            children
          ) : (
            <div className="h-screen flex flex-col relative">
              <h1 className="fixed top-[45%] left-[-15%] hidden lg:block text-[100px] font-bold text-gray-100 rotate-90">
                REFLEXIONES
              </h1>
             <Header/>
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


