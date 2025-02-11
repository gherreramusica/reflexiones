'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return <p className="text-center text-gray-500">Post no encontrado.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-5 p-6 ">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.extract && <p className="text-gray-500">{post.extract}</p>}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto my-4 rounded"
        />
      )}
      {post.author && <p className="text-sm text-gray-400">Escrito por: {post.author}</p>}
      <div className="mt-4 text-lg">{post.content}</div>
    </div>
  );
}
