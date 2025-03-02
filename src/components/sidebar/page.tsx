"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { useModules } from "@/context/modulesContext";
import { useRouter } from "next/navigation";
import { Bars3Icon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth"; // ✅ Importar autenticación

const Sidebar: React.FC<{
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}> = ({ isMenuOpen, setIsMenuOpen }) => {
  const router = useRouter();
  const { addModule } = useModules();
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useAuth(); // ✅ Obtener el usuario autenticado

  // ✅ Función para agregar un módulo y enviarlo al backend
  const handleAddModule = async (moduleName: string) => {
    console.log("📌 Enviando módulo:", moduleName);
    console.log("📌 userId:", user?.id);

    setMessage(`✅ Módulo "${moduleName}" agregado a tu feed`); // ✅ Mensaje de confirmación
    setIsMenuOpen(false); // ✅ Cierra el sidebar automáticamente

    if (!user?.id) {
      console.error("❌ No hay usuario autenticado.");
      return;
    }

    try {
      const response = await fetch("/api/user/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, module: moduleName }),
      });

      const data = await response.json();

      console.log("📌 Respuesta de la API:", data);

      if (response.ok) {
        addModule(moduleName);
        console.log("✅ Módulo agregado:", data);
      } else {
        console.error("❌ Error al agregar módulo:", data.message);
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
    }
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <>
      {/* ✅ Mensaje flotante de confirmación */}
      {message && (
        <div className=" bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {message}
        </div>
      )}
      <div
        className={`fixed z-[99] top-[0%] left-0 z-50 w-[100%] h-full text-white transition-all duration-300 ease-in-out transform ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
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
            <h2 className="text-xl text-gray-500 font-bold mb-4">
              Agregar Widgets
            </h2>
            <div>
              <button
                onClick={() => handleAddModule("Versiculos")}
                className="mb-2 text-gray-500 text-sm rounded-md"
              >
                Versículos +
              </button>
            </div>
            <div>
              <button
                onClick={() => handleAddModule("Calculadora")}
                className="mb-2 text-gray-500 text-sm rounded-md"
              >
                Calculadora +
              </button>
            </div>
            <div>
              <button
                onClick={() => handleAddModule("Tareas")}
                className="mb-2 text-gray-500 text-sm rounded-md"
              >
                Tareas +
              </button>
            </div>
          </div>
          <div className="mt-4 p-2">
            <h2 className="text-xl text-gray-500 font-bold mb-4">
              Links Útiles
            </h2>
            <div>
              <button
                className="mb-2 text-sm text-gray-500 rounded-md"
                onClick={() => router.push("/cuenta")}
              >
                <h2>Mi cuenta</h2>
              </button>
            </div>
            <div>
              <button className="mb-2 text-sm text-gray-500 rounded-md">
                Ayuda
              </button>
            </div>
            <div>
              <button className="mb-2 text-sm text-gray-500 rounded-md">
                Notas
              </button>
            </div>
            <div>
              <button className="mb-2 text-sm text-gray-500 rounded-md">
                Artículos
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
