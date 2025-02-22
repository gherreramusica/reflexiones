"use client";
import Link from "next/link";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Post {
  _id: string;
  author: {
    name: string;
    _id: string;
    username: string;
    email: string;
    avatar: string;
  };
  title: string;
  createdAt: string;
  updatedAt: string;
  contenido: string;
  timestamp: string;
  likes: number;
  image: string;
}

export default function Blog() {
  const { user } = useAuth();
  const [input, showInput] = useState(false);
  const [post, setPost] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const pathname = usePathname(); // Obtener la ruta actual

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos:", data); // Verifica los datos recibidos
        setPost(data);
      })
      .catch((error) => {
        console.error("Error al obtener los posts:", error);
      });
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
      const distance = formatDistanceToNowStrict(parsedDate, {
        addSuffix: false,
        locale: es,
      });
  
      // Acortar el resultado
      const shortDistance = distance
        .replace("años", "a")
        .replace("año", "a")
        .replace("meses", "m")
        .replace("mes", "m")
        .replace("días", "d")
        .replace("día", "d")
        .replace("horas", "h")
        .replace("hora", "h")
        .replace("minutos", "m")
        .replace("minuto", "m")
        .replace("segundos", "s")
        .replace("segundo", "s");
  
      return `hace ${shortDistance}`;
    } else {
      return parsedDate.toLocaleDateString("es-ES");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      console.log("Intentando eliminar post con ID:", postId);
  
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al eliminar post:", errorData);
        return;
      }
  
      setPost((prevPosts) => prevPosts.filter((p) => p._id !== postId));
      setSelectedPostId(null);
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error);
    }
  };
  

  return (
    <section className="bg-[radial-gradient(#000_1px,transparent_1px)]  m-auto relative max-w-[90%] lg:max-w-[500px]">
      <div className="mt-5">
        <ul className="flex gap-3 justify-center">
          <Link href="/home">
            <li
              className={`bg-gray-100 p-1 text-sm rounded-md ${
                pathname === "/home" ? "border" : ""
              }`}
            >
              Notes
            </li>
          </Link>
          <Link href="/blog">
            <li
              className={`bg-gray-100 p-1 text-sm rounded-md ${
                pathname === "/blog" ? "border" : ""
              }`}
            >
              Articles
            </li>
          </Link>
          <Link href="/saves">
            <li
              className={`bg-gray-100 p-1 text-sm rounded-md ${
                pathname === "/saves" ? "border" : ""
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
                <p>{user?.name}</p>
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
            <div className="bg-white flex shadow-md items-center gap-4 p-3 border cursor-pointer min-w-[330px] text-gray-500 rounded-md">
              <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
                <Image
                  width={40}
                  height={40}
                  src={user?.avatar || "/images/avatar.png"}
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
            {post.map((post, index) => (
              <li
                key={post._id || index}
                className="text-white w-full gap-3 flex border-b pt-4 pb-4"
              >
                {/* Enlace a la página del post */}
                <div>
                  <Image
                    width={30}
                    height={30}
                    src={post.author?.avatar || "/images/avatar.png"} // Use author's avatar with fallback
                    alt={"avatar"}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="w-full flex-1">
                  <div className="flex space-x-3 relative w-full  items-center">
                    <div className="flex space-x-3 mb-2 items-center flex-1">
                      <p className="text-sm text-gray-700">
                        {post.author?.name ?? "Usuario desconocido"}
                      </p>

                      <p className="text-sm text-gray-700">
                        @{post.author?.username}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDate(post)}
                      </p>
                    </div>
                    {/* Icono de opciones con menú desplegable */}
                    <div className="relative">
                      <MoreHorizontal
                        onClick={() =>
                          setSelectedPostId(
                            selectedPostId === post._id ? null : post._id
                          )
                        }
                        className="w-4 h-4 text-gray-400 cursor-pointer"
                      />
                      {selectedPostId === post._id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          {post.author && post.author._id === user?.id ? (
                            <>
                              {/* Eliminar Post */}
                              <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                onClick={() => handleDeletePost(post._id)}
                              >
                                Eliminar
                              </button>

                              {/* Guardar Post (agregar lógica de guardado aquí) */}
                              <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                onClick={() =>
                                  console.log("Guardar post", post._id)
                                }
                              >
                                Guardar
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Ocultar Post */}
                              <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                onClick={() => {
                                  setPost((prevPost) =>
                                    prevPost.filter((p) => p._id !== post._id)
                                  );
                                  setSelectedPostId(null);
                                }}
                              >
                                Ocultar
                              </button>

                              {/* Mostrar Menos */}
                              <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                onClick={() => console.log("Mostrar Menos")}
                              >
                                Mostrar menos
                              </button>

                              {/* Reportar */}
                              <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                onClick={() => console.log("Reportar", post._id)}
                              >
                                Reportar
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link href={`/post/${post._id}`} className="block">
                    <div className=" text-white border rounded-lg overflow-hidden bg-brown-900">
                      <div className="bg-gray-300 h-[200px] relative grid place-content-center w-full">
                        {post.image && (
                          <Image
                          fill
                          src={post?.image || "/images/R.png"}
                          alt="Post Image"
                          className="object-cover w-full h-full"
                          background-size="cover"
                          background-position="top"
                          background-repeat="no-repeat"

                        />
                        
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex  justify-between items-center">
                          <p className="text-sm text-gray-200">
                            {post.author?.name ?? "Usuario desconocido"}
                          </p>
                          <div>
                            <p className="text-sm text-white">
                              {formatDate(post)}
                            </p>
                          </div>
                        </div>
                        <div className="font-normal  w-full text-md">
                          <p className="text-white">{post.title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Íconos fuera del Link para evitar que sean clickeables */}
                  <div className="flex space-x-2 mt-2 text-gray-500">
                    <HandThumbUpIcon className="w-5 h-5" />
                    <BookmarkIcon className="w-5 h-5" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
