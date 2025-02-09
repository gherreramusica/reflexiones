"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  _id: string; // MongoDB usa `_id`
  author: string;
  timestamp: string;
  contenido: string;
}

export default function Home() {
  const [input, showInput] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  // 📌 Cargar posts desde MongoDB cuando el componente se monta
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/home");
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  // 📌 Publicar un nuevo post en MongoDB
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
    <section className="bg-[radial-gradient(#000_1px,transparent_1px)] max-w-[90%] lg:max-w-[50%] grid justify-center m-auto relative">
      <div className="mt-10">
        <ul className="flex gap-3 justify-center">
          <Link href="/home"><li className="border p-2 rounded-md">Notes</li></Link> 
          <Link href="/blog"><li className="border p-2 rounded-md">Articles</li></Link> 
          <li className="border p-2 rounded-md">Saves</li>
        </ul>
      </div>
      {input && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-[20]"
          onClick={() => showInput(false)}
        ></div>
      )}

      {/* Ventana flotante del textarea */}
      <div className="relative">
        <div
          className={`lg:w-[600px] w-[330px] border p-4 absolute top-[40%] left-[10%] rounded-md bg-white ${
            input ? "block" : "hidden"
          } z-[20]`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex space-x-1 h-[250px]">
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
                className="w-full outline-none resize-none overflow-auto break-words h-[100px]"
                placeholder="Escribe aquí..."
                onChange={(e) => setContent(e.target.value)}
                value={content}
              ></textarea>
              <div className="flex p-3 justify-end items-center">
                <button
                  className="bg-gray-100 p-2 rounded-md"
                  onClick={() => showInput(false)}
                >
                  <strong>Cancelar</strong>
                </button>
                <button
                  className="bg-gray-100 p-2 rounded-md"
                  onClick={handleSubmit}
                >
                  <strong>Publicar</strong>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Botón para abrir el textarea */}
        <div className="mt-10">
          <div
            className="bg-white p-5 shadow-md cursor-pointer w-full rounded-md"
            onClick={() => showInput(true)}
          >
            <p>Escribe algo...</p>
          </div>
        </div>

        {/* Lista de posts */}
        <ul className="mt-10 space-y-3">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">
              No hay publicaciones aún.
            </p>
          ) : (
            posts.map((p) => (
              <li
                key={p._id}
                className="border p-4 bg-white shadow-md rounded-md"
              >
                <p className="font-bold">{p.author}</p>
                <p>{p.timestamp}</p>
                <p>{p.contenido}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
