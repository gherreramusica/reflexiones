"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // Define la variable CSS
});

export default function Home() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login y registro

  // Función para alternar entre los formularios
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div
      className={` min-h-screen bg-white bg-[size:10px_10px] ${poppins.variable}`}
    >
      <main className=" font-[var(--font-poppins)]">
        <Link href="/home">
          <div className="relative text-center mb-8">
            <h1 className="font-bold before:content-[''] before:absolute before:right-60 before:bottom-[-0px] before:text-blue-500 before:w-[30px] before:h-[30px] before:bg-green-400 text-[100px] sm:text-[150px] md:text-[200px]">
              R
            </h1>
          </div>
        </Link>

        {/* Formulario de Login / Registro */}
        <div className="w-[100%] sm:max-w-[500px] max-w-[300px] m-auto bg-white p-8 ">
          <h2 className="text-3xl font-bold text-center mb-6">
            {isLogin ? "Iniciar sesión" : "Registro"}
          </h2>

          {/* Formulario */}
          <form className="space-y-4 ">
            {!isLogin && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Nombre de usuario"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="submit"
                className="w-full py-2 bg-black text-white rounded-md hover:bg-blue-600 focus:outline-none"
              >
                {isLogin ? "Iniciar sesión" : "Registrarse"}
              </button>
            </div>
          </form>

          {/* Enlace para cambiar entre login y registro */}
          <div className="text-center mt-4">
            <button
              onClick={toggleForm}
              className="text-sm text-blue-500 hover:underline"
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
