"use client";

import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function AuthPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    // Added name field
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Add success state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (!isLogin) {
        // If registration successful, show message and switch to login
        setSuccess(data.message);
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ username: "", email: "", password: "", name: "" });
        }, 2000);
      } else {
        // If login successful, redirect to home
        router.push("/home");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`min-h-screen flex items-center justify-around bg-gradient-to-br  ${poppins.variable}`}
    >
      <div className="bg-black min-h-screen w-full hidden sm:flex flex flex-col items-center justify-center">
        <h2 className="text-white text-8xl w-[80%] font-bold text-left p-4 leading-[1.0]">
          TODOS <br /> <strong className="text-gray-500">UNIDOS</strong>
        </h2>
      </div>
      <div className="w-full text-white bg-white min-h-screen flex items-center justify-center">
        <div className="p-8 w-[500px] m-auto">
          <div className="mb-auto flex justify-center">
            <Image
              width={100}
              height={100}
              alt="Logo"
              src={"/images/R.png"}
            ></Image>
          </div>
          <h2 className="text-3xl font-bold text-center text-black">
            {isLogin ? "Iniciar sesión" : "Registro"}
          </h2>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 text-center mt-2">{success}</p>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    className="w-full outline-none px-4 py-2 border text-black rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    maxLength={14}
                    onChange={handleChange}
                    className="w-full outline-none px-4 py-2 border text-black rounded-md"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-black">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full outline-none px-4 text-black py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full outline-none text-black px-4 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-md transition"
            >
              {loading
                ? "Cargando..."
                : isLogin
                ? "Iniciar sesión"
                : "Registrarse"}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={toggleForm}
              className="text-sm text-black hover:underline"
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
