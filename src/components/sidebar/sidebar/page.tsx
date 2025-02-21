// src/components/Sidebar.tsx
'use client'
import React from "react";
import { useModules } from "@/context/modulesContext";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { addModule } = useModules();

  return (
    <div className="p-4 fixed top-5 min-h-screen bg-gray-100 w-full">
      <div>
        <h2 className="text-xl text-gray-500 font-bold mb-4">Add Widgets</h2>
        <div>
          <button
            onClick={() => addModule("Bible")}
            className="mb-2 text-gray-500 rounded-md"
          >
            Bible +
          </button>
        </div>
        <div>
          <button
            onClick={() => addModule("Calculadora")}
            className="mb-2  text-gray-500 rounded-md"
          >
            Calculadora +
          </button>
        </div>
        <div>
          <button
            onClick={() => addModule("Bible")}
            className="mb-2 text-gray-500 rounded-md"
          >
            Bible +
          </button>
        </div>
        <div>
          <button
            onClick={() => addModule("Calculadora")}
            className="mb-2  text-gray-500 rounded-md"
          >
            Calculadora +
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl text-gray-500 font-bold mb-4">Links Útiles</h2>
        <div>
        <button 
         className="mb-2  text-gray-500 rounded-md"
         onClick={() => router.push('/cuenta')}><h2>Mi cuenta</h2></button>
 
        </div>
        <div>
          <button className="mb-2  text-gray-500 rounded-md">Ayuda</button>
        </div>
        <div>
          <button className="mb-2  text-gray-500 rounded-md">Notas</button>
        </div>
        <div>
          <button className="mb-2  text-gray-500 rounded-md">Articles</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
