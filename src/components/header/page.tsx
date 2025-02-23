"use client";

import { useState, useEffect } from "react";
import {
  Bars3Icon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "../sidebar/sidebar/page";

// Define la estructura del versículo
interface Versiculo {
  number: number; // Número del versículo
  verse: string; // Texto del versículo
  id: number; // ID único
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const [bible, setBible] = useState(false);
  const [book, setBook] = useState("salmos"); // 📖 Libro por defecto
  const [chapter, setChapter] = useState(1); // 🔢 Capítulo por defecto
  const [loading, setLoading] = useState(false); // ⏳ Estado de carga

  const [capitulo, setCapitulo] = useState<{
    chapter: number;
    name: string;
    vers: Versiculo[];
  }>({ chapter: 1, name: "", vers: [] });

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || "/images/avatar.png");
    }
  }, [user]);

  // 📌 Fetch del capítulo actual
  useEffect(() => {
    setLoading(true);
    fetch(`https://bible-api.deno.dev/api/read/nvi/${book}/${chapter}`)
      .then((response) => response.json())
      .then((data) => {
        setCapitulo(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar la Biblia:", error);
        setLoading(false);
      });
  }, [book, chapter]); // ✅ Mantén siempre el mismo tamaño en este array

  const handleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleBible = () => setBible(!bible);

  // 📌 Función para avanzar al siguiente capítulo
  const nextChapter = () => {
    setChapter((prev) => prev + 1);
  };

  // 📌 Función para retroceder al capítulo anterior
  const prevChapter = () => {
    if (chapter > 1) {
      setChapter((prev) => prev - 1);
    }
  };

  return (
    <header className="p-2 w-full z-[99] flex justify-between items-center bg-white text-black text-center text-3xl font-bold border-b">
      {/* Menú Hamburguesa */}
      <div className="flex items-center">
        <button className="text-lg" onClick={handleMenu}>
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Logo */}
      <div className="relative w-fit">
        <Link href="/home">
          <Image width={35} height={35} src="/images/R.png" alt="Logo" />
        </Link>
      </div>

      {/* Icono del Usuario + Menú de Cerrar Sesión */}
      <div className="relative flex items-center">
        {isAuthenticated ? (
          <div className="relative group">
            <div className="flex gap-3 items-center">
              <button
                onClick={handleBible}
                className="text-sm font-normal py-2 px-4 rounded-lg bg-gray-300"
              >
                Leer
              </button>
              <button
                onClick={handleDropdown}
                className="flex items-center gap-2"
              >
                <Image
                  width={30}
                  height={30}
                  src={avatar || "/images/avatar.png"}
                  alt="Avatar"
                  className="object-cover rounded-full"
                />
              </button>
            </div>

            {/* Dropdown para cerrar sesión */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md p-2 transition-opacity duration-300">
                <Link href="/cuenta">
                  <div className="flex items-center gap-2 px-4 py-2 border-b">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Image
                        width={30}
                        height={30}
                        src={avatar || "/images/avatar.png"}
                        alt="Avatar"
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-700">Usuario</span>
                  </div>
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <Cog6ToothIcon className="w-4 h-4" />
                  Configuración
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <QuestionMarkCircleIcon className="w-4 h-4" />
                  Ayuda
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <UserIcon className="w-6 h-6 text-gray-700" />
          </Link>
        )}
      </div>
      {/* Sidebar */}
      <div
        className={`fixed top-[5%] left-0 z-50 w-[100%] h-full  text-white transition-all duration-300 ease-in-out transform ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* Modal de la Biblia */}
      {bible && (
        <div className="flex flex-col bg-white w-full fixed top-0 left-0 h-screen z-50">
          <div className="p-2 bg-white w-full">
            <div className="flex justify-between w-full">
              <h3 className="font-bold uppercase text-sm">
                {book} {capitulo.chapter}
              </h3>
              <button
                onClick={handleBible}
                className="rounded-lg p-2 text-sm bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-center text-2xl font-bold">
              {capitulo?.name} {capitulo?.chapter}
            </h1>

            {/* 📖 Selector de libro y capítulo */}
            <div className="flex gap-2 justify-center my-4">
              <select
                className="p-2 border text-sm rounded"
                value={book}
                onChange={(e) => {
                  setBook(e.target.value);
                  setChapter(1); // 🔄 Reiniciar a capítulo 1 al cambiar de libro
                }}
              >
                <option value="genesis">Génesis</option>
                <option value="exodo">Éxodo</option>
                <option value="salmos">Salmos</option>
                <option value="mateo">Mateo</option>
                <option value="juan">Juan</option>
                <option value="apocalipsis">Apocalipsis</option>
                {/* 🔥 Agrega más libros aquí */}
              </select>

              <input
                type="number"
                className="p-2 text-sm border rounded w-16"
                value={chapter}
                min="1"
                onChange={(e) => setChapter(parseInt(e.target.value))}
              />
            </div>

            {/* ⏳ Indicador de carga */}
            {loading && (
              <p className="text-center text-sm font-normal text-gray-500">
                Cargando...
              </p>
            )}

            {/* 📜 Versículos */}
            <div className="mt-4 text-sm font-normal space-y-2 overflow-y-auto max-h-[600px]">
              {capitulo?.vers?.map((versiculo) => (
                <p className="text-gray-900" key={versiculo.number}>
                  <strong className="font-normal text-gray-500">
                    {versiculo.number}
                  </strong>{" "}
                  {versiculo.verse}
                </p>
              ))}
            </div>

            {/* 🔄 Controles de navegación */}
            <div className="flex text-sm justify-between mt-4">
              <button
                onClick={prevChapter}
                className="p-2 border rounded bg-gray-200"
                disabled={chapter === 1}
              >
                ← Anterior
              </button>
              <button
                onClick={nextChapter}
                className="p-2 border rounded bg-gray-200"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
