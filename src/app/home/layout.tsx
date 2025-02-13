'use client'

import { ReactNode, useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

interface LayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: LayoutProps) {
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Si el usuario ha bajado más de 100px, mostramos el header
      if (window.scrollY > 100) {
        setShowStickyHeader(true);
      } else {
        setShowStickyHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`h-screen flex flex-col ${poppins.variable} relative`}>
      <h1 className="fixed top-[45%] left-[0%] hidden lg:block text-[100px] font-bold text-gray-100 rotate-90">
        REFLEXIONES
      </h1>

      {/* Header principal */}
      <header className="p-3 z-[99] bg-white text-black text-center text-3xl font-bold border-b">
        <div className="relative w-fit m-auto">
          <Link href="/home">
            <h1 className="relative text-3xl font-bold before:content-[''] before:block before:absolute before:right-0 before:bottom-[-5px] before:w-[10px] before:h-[10px] before:bg-green-400">
              R
            </h1>
          </Link>
        </div>
      </header>

      {/* Segundo Header (aparece al hacer scroll) */}
      <header
        className={`rounded-lg w-[80%] fixed left-1/2 top-0 transform -translate-x-1/2  z-[98] bg-black text-white text-center text-2xl font-bold p-3 transition-transform duration-300 ${
          showStickyHeader ? "translate-y-5" : "-translate-y-full"
        }`}
      >
        <div className="relative w-fit m-auto">
          <Link href="/home">
            <h1 className="relative text-3xl font-bold before:content-[''] before:block before:absolute before:right-0 before:bottom-[-5px] before:w-[10px] before:h-[10px] before:bg-green-400">
              R
            </h1>
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
