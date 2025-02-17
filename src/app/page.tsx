"use client";

import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // 🔹 Verificar si el usuario ya tiene una sesión activa
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" }); // Incluye cookies
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          router.push("/home"); // Redirigir si ya está autenticado
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
      }
    };
    checkAuth();
  }, [router]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Manejo de Login y Registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Incluir cookies en la petición
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsAuthenticated(true);
      router.push("/home");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    }
    
  };

  // 🔹 Cerrar Sesión
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsAuthenticated(false);
    router.push("/auth");
  };

  return (
    <div className={`min-h-screen flex items-center justify-around bg-gradient-to-br  ${poppins.variable}`}>
      <div className="bg-white border-r min-h-screen w-full hidden sm:flex flex flex-col items-center justify-center">
   
        <Image width={200}  height={200} alt="Logo" src={"/images/R.png"} ></Image>
        <p>No todas son malas noticias... son <strong>REFLEXIONES</strong></p>
        </div>
      <div className="w-full text-white bg-green-500 min-h-screen flex items-center justify-center">
      <div className=" p-8 w-[500px] m-auto">
        {isAuthenticated ? (
          <>
            <h2 className="text-3xl font-bold text-center text-white">Bienvenido</h2>
            <p className="text-center text-gray-600 mt-4">Ya has iniciado sesión.</p>
            <button onClick={handleLogout} className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-white">{isLogin ? "Iniciar sesión" : "Registro"}</h2>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-white">Nombre de usuario</label>
                  <input type="text" name="username" onChange={handleChange} className="w-full outline-none px-4 py-2 border rounded-md" required />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-white">Correo electrónico</label>
                <input type="email" name="email" onChange={handleChange} className="w-full outline-none px-4 text-black py-2 border rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Contraseña</label>
                <input type="password" name="password" onChange={handleChange} className="w-full outline-none text-black px-4 py-2 border rounded-md" required />
              </div>
              <button type="submit" className="w-full py-2 bg-black text-white rounded-md transition">
                {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
              </button>
            </form>

            <div className="text-center mt-4">
              <button onClick={toggleForm} className="text-sm text-black hover:underline">
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </>
        )}
      </div>
      </div>
      
    </div>
  );
}
