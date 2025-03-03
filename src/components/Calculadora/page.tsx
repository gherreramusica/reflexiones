"use client";

import React, { useState } from "react";

export default function Calculadora() {
  const [input, setInput] = useState<string>("");

  const handleButtonClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      // Evaluar la expresión matemática
      const result = eval(input);
      setInput(result.toString());
    } catch (error) {
      console.error("Error al calcular:", error);
      setInput("Error");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 p-5 shadow-md w-full mx-auto">
      <h2 className="text-white text-2xl font-bold mb-4">Calculadora</h2>

      {/* Pantalla de la calculadora */}
      <div className="w-full bg-gray-800 text-right text-white p-4 text-3xl rounded-md mb-4 overflow-hidden">
        {input || "0"}
      </div>

      {/* Botones */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {/* Primera fila */}
        <button
          onClick={handleClear}
          className="col-span-2 bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg text-xl"
        >
          AC
        </button>
        <button
          onClick={handleBackspace}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg text-xl"
        >
          ⌫
        </button>
        <button
          onClick={() => handleButtonClick("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-xl"
        >
          ÷
        </button>

        {/* Segunda fila */}
        {["7", "8", "9", "*"].map((btn) => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl"
          >
            {btn === "*" ? "×" : btn}
          </button>
        ))}

        {/* Tercera fila */}
        {["4", "5", "6", "-"].map((btn) => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl"
          >
            {btn}
          </button>
        ))}

        {/* Cuarta fila */}
        {["1", "2", "3", "+"].map((btn) => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl"
          >
            {btn}
          </button>
        ))}

        {/* Última fila */}
        <button
          onClick={() => handleButtonClick("0")}
          className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl"
        >
          0
        </button>
        <button
          onClick={() => handleButtonClick(".")}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl"
        >
          .
        </button>
        <button
          onClick={handleCalculate}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-xl"
        >
          =
        </button>
      </div>
    </div>
  );
}
