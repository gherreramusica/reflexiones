// src/components/Sidebar.tsx
"use client";
import React from "react";
import Image from "next/image";
import { useModules } from "@/context/modulesContext";
import { useRouter } from "next/navigation";
import { Bars3Icon, UserIcon } from "@heroicons/react/24/outline";

const Sidebar: React.FC<{
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}> = ({ isMenuOpen, setIsMenuOpen }) => {
  const router = useRouter();
  const { addModule } = useModules();
  return (
    <div
      className={`fixed z-[99] top-[0%] left-0 z-50 w-[100%] h-full  text-white transition-all duration-300 ease-in-out transform ${
        isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`}
    >
      <div className="fixed top-0 min-h-screen bg-white w-full">
        <header className="p-2 border-b border-gray-300">
          <ul className="flex justify-between items-center">
            <li onClick={() => setIsMenuOpen(false)}>
              <Bars3Icon className="text-black w-6 h-6 cursor-pointer" />
            </li>
            <li>
              <Image src="/images/R.png" alt="Logo" width={35} height={35} />
            </li>
            <li>
              <UserIcon className="w-6 h-6 text-black" />
            </li>
          </ul>
        </header>
        <div className="p-2">
          <h2 className="text-xl text-gray-500 font-bold mb-4">Add Widgets</h2>
          <div>
            <button
              onClick={() => addModule("Versiculos")}
              className="mb-2 text-gray-500 text-sm rounded-md"
            >
              Versiculos +
            </button>
          </div>
          <div>
            <button
              onClick={() => addModule("Calculadora")}
              className="mb-2  text-gray-500 text-sm rounded-md"
            >
              Calculadora +
            </button>
          </div>
          <div>
            <button
              onClick={() => addModule("Bible")}
              className="mb-2 text-gray-500 text-sm rounded-md"
            >
              Bible +
            </button>
          </div>
          <div>
            <button
              onClick={() => addModule("Calculadora")}
              className="mb-2  text-gray-500 text-sm rounded-md"
            >
              Calculadora +
            </button>
          </div>
        </div>
        <div className="mt-4 p-2">
          <h2 className="text-xl text-gray-500 font-bold mb-4">Links Útiles</h2>
          <div>
            <button
              className="mb-2  text-sm text-gray-500 rounded-md"
              onClick={() => router.push("/cuenta")}
            >
              <h2>Mi cuenta</h2>
            </button>
          </div>
          <div>
            <button className="mb-2 text-sm  text-gray-500 rounded-md">
              Ayuda
            </button>
          </div>
          <div>
            <button className="mb-2 text-sm  text-gray-500 rounded-md">
              Notas
            </button>
          </div>
          <div>
            <button className="mb-2 text-sm  text-gray-500 rounded-md">
              Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
