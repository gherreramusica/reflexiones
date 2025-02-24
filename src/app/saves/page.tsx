"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface SavedPost {
  _id: string;
  user: { _id: string; name: string; avatar: string };
  post?: {
    _id: string;
    author: { _id: string; name: string; username: string; avatar: string };
    contenido: string;
    title: string;
    image: string;
    likes: number;
    createdAt?: string; // CreatedAt can be undefined
  };
  note?: {
    _id: string;
    author: { _id: string; name: string; username: string; avatar: string };
    contenido: string;
    likes: number;
    createdAt?: string; // CreatedAt can be undefined
  };
}

export default function Saves() {
  const { user, isAuthenticated } = useAuth();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/saved-posts?userId=${user.id}`);
        const data = await res.json();
        console.log("📢 Saved posts from API:", data);
        setSavedPosts(data.savedItems || []);
      } catch (error) {
        console.error("❌ Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSavedPosts();
    }
  }, [user, isAuthenticated]);

  // ✅ Fix: Function to safely format dates
  const formatDate = (date?: string) => {
    if (!date) return "Fecha desconocida"; // Handle undefined dates
    try {
      return new Date(date).toLocaleDateString("es-ES"); // Format date
    } catch (error) {
      console.error("❌ Error formatting date:", error);
      return "Fecha inválida";
    }
  };

  return (
    <section className="max-w-[500px] w-[90%] lg:max-w-[500px] m-auto relative">
      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : savedPosts.length === 0 ? (
        <p className="text-center text-gray-500">No tienes posts guardados.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {savedPosts.map((saved) => (
            <li
              key={saved._id}
              className="border-b flex gap-2 py-4 px-0 bg-white"
            >
              <div>
                <Image
                  width={30}
                  height={30}
                  src={
                    saved.post?.author.avatar ||
                    saved.note?.author.avatar ||
                    "/images/avatar.png"
                  }
                  alt="avatar"
                  className="object-cover rounded-full"
                />
              </div>
              <div className="w-full">
                <div className="flex space-x-3 relative justify-between items-center">
                  <div className="flex space-x-3 items-center">
                    <p className="text-sm text-gray-600 font-bold">
                      {saved.post?.author.name || saved.note?.author.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      @
                      {saved.post?.author.username ||
                        saved.note?.author.username}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatDate(
                        saved.post?.createdAt || saved.note?.createdAt
                      )}
                    </p>
                  </div>
                  <div className="relative">
                    <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>

                {/* Render post or note content */}
                {saved.post ? (
                  <Link href={`/post/${saved.post._id}`} className="block">
                    <div className="text-white border rounded-lg overflow-hidden bg-brown-900">
                      <div className="bg-gray-300 h-[200px] relative grid place-content-center w-full">
                        {saved.post.image && (
                          <Image
                            src={saved.post.image || "/images/R.png"}
                            alt="Post Image"
                            layout="fill"
                            objectFit="cover"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-200">
                            {saved.post.author?.name ?? "Usuario desconocido"}
                          </p>
                          <div>
                            <p className="text-sm text-white">
                              {formatDate(saved.post.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="font-normal w-full text-md">
                          <p className="text-white">{saved.post.title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <p className="text-gray-600">{saved.note?.contenido}</p>
                )}

                <div className="flex space-x-2 mt-2 items-center">
                  <HandThumbUpIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {saved.post?.likes || saved.note?.likes}
                  </span>
                  <BookmarkIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
