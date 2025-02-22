"use client";

import { ReactNode, useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import {
  Bars3Icon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline"; // Importar los íconos de Heroicons
import Sidebar from "@/components/sidebar/sidebar/page";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

interface LayoutProps {
  children: ReactNode;
}

export default function PostLayout({ children }: LayoutProps) {
  const [sideBar, showSidebar] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    console.log("Usuario autenticado:", user);
    if (user) {
      setAvatar(user.avatar || "/images/avatar.png");
    }
  }, [user]);

  const handleMenu = () => {
    showSidebar(!sideBar);
  };

  const handleDropdown = () => {
    setDropdown(!dropdown);
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
              <button onClick={handleDropdown} className="flex items-center gap-2">
                <Image
                  width={30}
                  height={30}
                  src={avatar || "/images/avatar.png"} // Use user's avatar with fallback
                  alt={"Avatar"}
                  className="object-cover rounded-full"
                />
              </button>
              {/* Dropdown para cerrar sesión */}
              <div className={`absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md p-2 ${dropdown ? "block" : "hidden"}   transition-opacity duration-300`}>
                <Link href={"/cuenta"}>
                  <div className="flex items-center gap-2 px-4 py-2 border-b">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Image
                        width={30}
                        height={30}
                        src={avatar || "/images/avatar.png"} // Use user's avatar with fallback
                        alt={"Avatar"}
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-700">Usuario</span>
                  </div>
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <Cog6ToothIcon className="w-4 h-4" />
                  Configuración
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <QuestionMarkCircleIcon className="w-4 h-4" />
                  Ayuda
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>{" "}
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
