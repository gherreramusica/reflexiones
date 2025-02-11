"use client";
import Link from "next/link";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string; // ✅ Agregar createdAt (MongoDB lo envía como string)
  updatedAt: string; // ✅ Agregar updatedAt si lo necesitas
  timestamp: string;
}

export default function Blog() {
  const [input, showInput] = useState(false);
  const [post, setPost] = useState<Post[]>([]);
  const pathname = usePathname(); // Obtener la ruta actual

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, []);

  const formatDate = (post: Post) => {
    let dateString = post.createdAt || post.timestamp; // Usa createdAt o timestamp

    if (!dateString) return "Fecha desconocida"; // Si no hay fecha válida

    let parsedDate = new Date(dateString);

    // Si `dateString` no es válido, intenta parsearlo
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date(Date.parse(dateString));
    }

    // Si sigue sin ser una fecha válida, muestra error
    if (isNaN(parsedDate.getTime())) {
      console.error("Error al convertir la fecha:", dateString);
      return "Fecha inválida";
    }

    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 30) {
      return `hace ${formatDistanceToNow(parsedDate, {
        addSuffix: false,
        locale: es,
      })}`;
    } else {
      return parsedDate.toLocaleDateString("es-ES");
    }
  };

  return (
    <section className="bg-[radial-gradient(#000_1px,transparent_1px)]  m-auto relative max-w-[90%] lg:max-w-[500px]">
      <div className="mt-10">
        <ul className="flex gap-3 justify-center">
          <Link href="/home">
            <li
              className={`bg-gray-100 p-2 rounded-md ${
                pathname === "/home" ? "border font-bold" : ""
              }`}
            >
              Notes
            </li>
          </Link>
          <Link href="/blog">
            <li
              className={`bg-gray-100 p-2 rounded-md ${
                pathname === "/blog" ? "border font-bold" : ""
              }`}
            >
              Articles
            </li>
          </Link>
          <Link href="/saves">
            <li
              className={`bg-gray-100 p-2 rounded-md ${
                pathname === "/saves" ? "border  font-bold" : ""
              }`}
            >
              Saves
            </li>
          </Link>
        </ul>
      </div>
      {/* Overlay oscuro cuando el input está activo */}
      {input && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => showInput(false)} // Ocultar el modal al hacer clic en el fondo
        ></div>
      )}

      {/* Contenido */}
      <div className="relative z-20">
        {/* Ventana flotante del textarea */}
        <div
          className={`lg:w-[600px] lg:h-[250px] min-w-[330px] h-[200px] h-auto border p-4 absolute top-[40%] left-[10%] rounded-md bg-white ${
            input ? "block" : "hidden"
          }`}
        >
          <div className="flex space-x-1 h-[250px]">
            <div>FOTO</div>
            <div className="w-full h-[250px]">
              <div>
                <p>Martin Herrera</p>
              </div>
              <textarea
                className="w-full outline-none resize-none overflow-auto break-words lg:h-[130px] h-[100px]"
                autoFocus={input}
                wrap="soft"
                placeholder="Escribe aquí..."
              ></textarea>
              <div className="flex p-3 justify-end items-center">
                <div className="space-x-3">
                  <button
                    className="bg-gray-100 p-2 rounded-md"
                    onClick={() => showInput(false)}
                  >
                    <strong>Cancel</strong>
                  </button>
                  <button className="bg-gray-100 p-2 rounded-md">
                    <strong>Publicar</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón para mostrar el textarea */}
        <div className="mt-10">
          <Link href="/editor">
            <div className="bg-white flex shadow-md items-center gap-4 p-5 border cursor-pointer min-w-[330px] text-gray-500 rounded-md">
              <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
                <Image
                  width={40}
                  height={40}
                  src="/images/avatar.jpeg"
                  alt="avatar"
                  className="object-cover rounded-full"
                />
              </div>
              <p>Escribe algo...</p>
            </div>
          </Link>
        </div>

        {/* Lista de reflexiones */}
        <div>
          {/* Lista de reflexiones */}
          <ul className="mt-10 space-y-3">
            {post.map((post) => (
              <li key={post._id} className="border-b p-4">
                {/* Enlace a la página del post */}
                <Link href={`/post/${post._id}`} className="block">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Martin Herrera</p>
                    <div>
                      <p className="text-sm text-gray-500">
                        {formatDate(post)}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-xl">
                    <p>{post.title}</p>
                  </div>
                  <div>
                    <div>
                      <p>
                        {post.content.length > 50
                          ? post.content.slice(0, 150) + "..."
                          : post.content}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Íconos fuera del Link para evitar que sean clickeables */}
                <div className="flex space-x-2 mt-2">
                  <HandThumbUpIcon className="w-5 h-5" />
                  <BookmarkIcon className="w-5 h-5" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
