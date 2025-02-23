"use client";

import "./globals.css";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  Bars3Icon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Sidebar from "@/components/sidebar/sidebar/page";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { ModulesProvider } from "@/context/modulesContext"
import Carousel from "@/components/carousel/page";
import { usePathname } from "next/navigation";
import Tab from "@/components/tab/page";



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

  const [sideBar, showSidebar] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState(false);
  const pathname = usePathname();

  const excludePaths = ["/login", "/register"];

  

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
    <>
      {excludePaths.includes(pathname) ? (
        children
      ) : (
        <html lang="en">
          <body className={`${poppins.variable} font-sans`}>
            <ModulesProvider>
              <div className={`h-screen flex flex-col ${poppins.variable} relative`}>
                <h1 className="fixed top-[45%] left-[-15%] hidden lg:block text-[100px] font-bold text-gray-100 rotate-90">
                  REFLEXIONES
                </h1>
  
                {/* Header principal */}
                <header className="p-2 sticky top-0 z-[99] flex justify-between items-center bg-white text-black text-center text-3xl font-bold border-b">
                  {/* Menú Hamburguesa */}
                  <div className="flex items-center">
                    <button className="text-lg" onClick={handleMenu}>
                      <Bars3Icon className="w-6 h-6" />
                    </button>
                  </div>
  
                  {/* Logo */}
                  <div className="relative w-fit">
                    <Link href="/home">
                      <Image width={35} height={35} src="/images/R.png" alt="Logo">

                      </Image>
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
                            src={avatar || "/images/avatar.png"} // Usa el avatar del usuario con fallback
                            alt="Avatar"
                            className="object-cover rounded-full"
                          />
                        </button>
                        {/* Dropdown para cerrar sesión */}
                        {dropdown && (
                          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md p-2 transition-opacity duration-300">
                            <Link href={"/cuenta"}>
                              <div className="flex items-center gap-2 px-4 py-2 border-b">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Image
                                    width={30}
                                    height={30}
                                    src={avatar || "/images/avatar.png"} 
                                    alt="Avatar"
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
                          </div>
                        )}
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
                <div className="pl-4 pr-4">
                  <Carousel />
                </div>
                <Tab/>
  
                <main>{children}</main>
              </div>
            </ModulesProvider>
          </body>
        </html>
      )}
    </>
  );
  
}


