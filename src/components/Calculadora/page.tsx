'use client'

import React, { useState } from 'react';

export default function Calculadora() {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [operation, setOperation] = useState<string>("");
  const [result, setResult] = useState<number | string>("");

  const handleCalculate = () => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
      setResult("Error: Ingresa números válidos");
      return;
    }

    switch (operation) {
      case "+":
        setResult(n1 + n2);
        break;
      case "-":
        setResult(n1 - n2);
        break;
      case "*":
        setResult(n1 * n2);
        break;
      case "/":
        setResult(n2 !== 0 ? n1 / n2 : "Error: División por cero");
        break;
      default:
        setResult("Selecciona una operación");
    }
  };

  return (
    <div>
      {/* Calculadora */}
      <div className="mt-5 p-4 bg-gray-200 text-center rounded-md w-full max-w-sm mx-auto shadow-md">
        <h2 className="text-xl font-bold mb-4">Calculadora</h2>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Número 1"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className="w-full p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Número 2"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className="w-full p-2 rounded border"
          />
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full p-2 rounded border"
          >
            <option value="">Selecciona operación</option>
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </select>
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Calcular
          </button>
        </div>

        {result !== "" && (
          <div className="mt-4 text-center p-2 bg-gray-100 rounded">
            <strong>Resultado: </strong> {result}
          </div>
        )}
      </div>
    </div>
  );
}
