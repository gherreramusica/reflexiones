"use client";

import { ReactNode, useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Bars3Icon, UserIcon } from "@heroicons/react/24/outline"; // Importar los íconos de Heroicons
import Sidebar from "@/components/sidebar/sidebar/page";
import useAuth from "@/hooks/useAuth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

interface LayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: LayoutProps) {
  const [sideBar, showSidebar] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleMenu = () => {
    showSidebar(!sideBar);
  };
  return (
    <div className={`h-screen flex flex-col ${poppins.variable} relative`}>
      <h1 className="fixed top-[45%] left-[0%] hidden lg:block text-[100px] font-bold text-gray-100 rotate-90">
        REFLEXIONES
      </h1>

      {/* Header principal */}
      <header className="p-3 sticky top-0 z-[99] flex justify-between items-center bg-white text-black text-center text-3xl font-bold border-b">
      {/* Menú Hamburguesa */}
      <div className="flex items-center">
        <button className="text-lg" onClick={handleMenu}>
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Logo */}
      <div className="relative w-fit">
        <Link href="/home">
          <h1 className="relative text-3xl font-bold before:content-[''] before:block before:absolute before:right-0 before:bottom-[-5px] before:w-[10px] before:h-[10px] before:bg-green-400">
            R
          </h1>
        </Link>
      </div>

      {/* Icono del Usuario + Menú de Cerrar Sesión */}
      <div className="relative flex items-center">
        {isAuthenticated ? (
          <div className="relative group">
            <button className="flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dropdown para cerrar sesión */}
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <Link href="/">
            <UserIcon className="w-6 h-6 text-gray-700" />
          </Link>
        )}
      </div>
    </header>

      <div
        className={`fixed top-10 left-0 z-50 w-[100%] h-full bg-gray-800 text-white transition-all duration-300 ease-in-out transform ${
          sideBar ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <Sidebar />
      </div>

      <main>{children}</main>
    </div>
  );
}
