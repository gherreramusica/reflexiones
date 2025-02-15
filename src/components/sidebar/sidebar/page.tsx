// src/components/Sidebar.tsx
import React from "react";
import { useModules } from "@/context/modulesContext";

const Sidebar: React.FC = () => {
  const { addModule } = useModules();

  return (
    <div className="p-4 fixed top-5 min-h-screen bg-gray-100 w-full">
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
    </div>
  );
};

export default Sidebar;
