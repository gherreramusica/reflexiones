"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Post {
  _id: string;
  author: string;
  createdAt: string; // ✅ Agregar createdAt (MongoDB lo envía como string)
  updatedAt: string; // ✅ Agregar updatedAt si lo necesitas
  contenido: string;
  timestamp: string;
}

export default function Home() {
  const [input, showInput] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const pathname = usePathname(); // Obtener la ruta actual

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/home");
      const data = await res.json();

      console.log("Datos antes de ordenar:", data);

      // Ordena los posts por fecha más reciente primero
      const sortedPosts = data.sort((a: { createdAt?: string; timestamp?: string }, b: { createdAt?: string; timestamp?: string }) => {
        const dateA = new Date(a.createdAt ?? a.timestamp ?? 0).getTime();
        const dateB = new Date(b.createdAt ?? b.timestamp ?? 0).getTime();
        return dateB - dateA;
      });
      

      console.log("Datos después de ordenar:", sortedPosts);

      setPosts(sortedPosts);
    };

    fetchPosts();
  }, []);

  const formatDate = (post: Post) => {
    const dateString = post.createdAt || post.timestamp; // Usa createdAt o timestamp

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

  const handleSubmit = async () => {
    if (content.trim() === "") return;

    const newPost = { author: "Martin Herrera", contenido: content };

    const res = await fetch("/api/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });

    if (res.ok) {
      const savedPost = await res.json();
      setPosts((prevPosts) => [savedPost, ...prevPosts]); // Agregar al estado
      setContent("");
      showInput(false);
    }
  };

  return (
    <section className="bg-[radial-gradient(#000_1px,transparent_1px)] max-w-[90%] lg:max-w-[500px] m-auto relative">
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
                pathname === "/blog" ? "border text-white font-bold" : ""
              }`}
            >
              Articles
            </li>
          </Link>
          <Link href="/saves">
            <li
              className={`bg-gray-100 p-2 rounded-md ${
                pathname === "/saves" ? "border text-white font-bold" : ""
              }`}
            >
              Saves
            </li>
          </Link>
        </ul>
      </div>

      {input && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-[20]"
          onClick={() => showInput(false)}
        ></div>
      )}

      <div className="relative">
        <div
          className={`lg:w-[600px] min-w-[300px] border p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white ${
            input ? "block" : "hidden"
          } z-[20]`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-3 space-x-1 h-[100%] min-w-[330px]">
            <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
              <Image
                width={40}
                height={40}
                src="/images/avatar.jpeg"
                alt="avatar"
                className="object-cover rounded-full"
              />
            </div>
            <div className="w-full">
              <p>Martin Herrera</p>
              <textarea
                className="w-full outline-none resize-none overflow-auto break-words"
                placeholder="Escribe aquí..."
                onChange={(e) => setContent(e.target.value)}
                value={content}
              ></textarea>
            </div>
          </div>
          <div className="flex gap-3 p-3 justify-end">
            <button
              className="bg-gray-100 p-3 rounded-md"
              onClick={() => showInput(false)}
            >
              <strong>Cancelar</strong>
            </button>
            <button
              className="bg-gray-100 p-3 rounded-md"
              onClick={handleSubmit}
            >
              <strong>Publicar</strong>
            </button>
          </div>
        </div>

        <div className="mt-10">
          <div
            className="bg-white flex items-center gap-4 text-gray-500 p-5 shadow-lg border cursor-pointer min-w-[330px] rounded-md"
            onClick={() => showInput(true)}
          >
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
        </div>

        <ul className="mt-10 space-y-3">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">
              No hay publicaciones aún.
            </p>
          ) : (
            posts.map((p) => (
              <li key={p._id} className="border-b flex gap-2 p-4 bg-white">
                <div>
                  <div className="rounded-full flex overflow-hidden w-[35px] h-[35px]">
                    <Image
                      width={35}
                      height={35}
                      src="/images/avatar.jpeg"
                      alt="avatar"
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div>
                      <div>
                        <p className="text-sm text-gray-500">{p.author}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">{formatDate(p)}</p>
                  </div>
                  <p className="text-gray-800">{p.contenido}</p>
                  <div className="flex space-x-2 mt-2">
                    <HandThumbUpIcon className="w-5 h-5" />
                    <BookmarkIcon className="w-5 h-5" />
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
