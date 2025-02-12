"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  title: string;
  extract?: string;
  image?: string;
  author?: string;
  content: string;
}

export default function SinglePost() {
  const params = useParams();
  const id = params?.id ? decodeURIComponent(String(params.id)) : null; // Asegurar que `id` sea un string válido
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/posts/${id}`);

        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudo cargar el post.`);
        }

        const data = await res.json();
        setPost(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post)
    return <p className="text-center text-gray-500">Post no encontrado.</p>;

  return (
    <div>
      <header className="p-3 bg-white text-black text-center text-3xl font-bold">
        <div className="relative w-fit flex gap-3 items-center">
        <button 
              onClick={() => window.history.back()} 
              className="p-2 rounded-md hover:bg-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          <Link href="/home">
            <h1 className="relative text-3xl font-bold before:content-[''] before:absolute before:right-[0] before:bottom-[-5] before:text-blue-500 before:w-[10px] before:h-[10px] before:bg-green-400">
              R
            </h1>
          </Link>
        </div>
      </header>
      <div className="max-w-3xl mx-auto mt-5 p-6 ">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        {post.extract && <p className="text-gray-500">{post.extract}</p>}

        {post.author && (
          <p className="text-sm text-gray-400">Escrito por: {post.author}</p>
        )}
        <div className="mt-4 text-lg">{post.content}</div>
      </div>
    </div>
  );
}
