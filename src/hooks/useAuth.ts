import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });
        const data = await res.json();
        
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email
          });
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setIsAuthenticated(false);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { isAuthenticated, user, logout };
}