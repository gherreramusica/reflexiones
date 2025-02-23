"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { es } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { MoreHorizontal } from "lucide-react";



interface Post {
  _id: string;
  author: {
    name: string;
    _id: string;
    username: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  contenido: string;
  timestamp: string;
  likes: number;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [input, showInput] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || "/images/avatar.png");
    }
  }, [user]);

  const handleMenuClick = (postId: string) => {
    setSelectedPostId(selectedPostId === postId ? null : postId);
  };

  const handleSubmit = async () => {
    console.log("Estado de autenticación:", isAuthenticated);
    console.log("Usuario autenticado:", user);

    if (content.trim() === "" || !user) {
      console.log("No content or user");
      return;
    }

    const newPost = {
      author: user.id, // Solo enviamos el ID del usuario
      contenido: content,
    };

    console.log("Sending post data:", newPost);

    try {
      const res = await fetch("/api/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      const responseData = await res.json();
      console.log("Response status:", res.status);
      console.log("Response data:", responseData); // 🔥 Muestra el error en consola

      if (!res.ok)
        throw new Error(`Error al crear post: ${responseData.error}`);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedRes = await fetch("/api/home");
      const updatedPosts = await updatedRes.json();

      console.log("📢 Datos actualizados con populate:", updatedPosts);

      setPosts(updatedPosts);
      setContent("");
      showInput(false);
      setSuccessMessage(true);
    } catch (error) {
      console.error("❌ Error creando post:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch("/api/home");
        const data = await res.json();
        console.log("📢 Datos recibidos en frontend:", data);

        const sortedPosts = data.sort(
          (
            a: { createdAt?: string; timestamp?: string },
            b: { createdAt?: string; timestamp?: string }
          ) => {
            const dateA = new Date(a.createdAt ?? a.timestamp ?? 0).getTime();
            const dateB = new Date(b.createdAt ?? b.timestamp ?? 0).getTime();
            return dateB - dateA;
          }
        );

        console.log("Datos después de ordenar:", sortedPosts);

        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoadingPosts(false);
      }
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

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch("/api/home", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, like: 1 }),
      });

      if (res.ok) {
        const updatedPost = await res.json();

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likes: updatedPost.likes } : post
          )
        );
      }
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/home/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove post from state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        // Close the menu
        setSelectedPostId(null);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <section className="bg-[radial-gradient(#000_1px,transparent_1px)] max-w-[500px] w-[90%] lg:max-w-[500px] m-auto relative">
      <div
        className={`${
          successMessage ? "block" : "hidden"
        } p-3 mt-5 border border-gray-500 rounded-lg bg-black text-gray-200 w-[100%] m-auto text-white`}
      >
        <h4>Mensaje Enviado</h4>
      </div>
    
      {input && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-[20]"
          onClick={() => showInput(false)}
        ></div>
      )}
      <div className="relative">
        <div
          className={`lg:w-[600px] min-w-[300px] border p-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white ${
            input ? "block" : "hidden"
          } z-[20]`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-3 space-x-1 h-[100%] min-w-[330px]">
            <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
              <Image
                width={40}
                height={40}
                src={avatar || "/images/avatar.jpeg"}
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
        <div className="mt-5">
          <div
            className="bg-white flex items-center gap-4 text-gray-500 p-3 shadow-md border cursor-pointer min-w-[330px] rounded-md"
            onClick={() => showInput(true)}
          >
            <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
              <Image
                width={40}
                height={40}
                src={avatar || "/images/avatar.jpeg"}
                alt="avatar"
                className="object-cover rounded-full"
              />
            </div>
            <p>Escribe algo...</p>
          </div>
        </div>
        {loadingPosts ? (
          <div className="flex justify-center items-center p-e mt-10">
            <AiOutlineLoading3Quarters className="animate-spin text-xl" />
          </div>
        ) : (
          <ul className="mt-10 space-y-3">
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center">
                No hay publicaciones aún.
              </p>
            ) : (
              posts.map((p, index) => {
                console.log(`📢 Post #${index + 1}:`, p); // Ver toda la data del post
                console.log(`📢 Autor en frontend:`, p.author); // Ver el objeto author
                console.log(`📢 Nombre del autor:`, p.author?.name); // Ver el valor específico
                return (
                  <li
                    key={p._id}
                    className="border-b flex gap-2 py-4 px-0 bg-white"
                  >
                    <div>
                      <Image
                        width={30}
                        height={30}
                        src={ p.author.avatar || "/images/avatar.png"} // Use author's avatar with fallback
                        alt={"avatar"}
                        className="object-cover rounded-full"

                      />
                    </div>
                    <div className="w-full">
                      <div className="flex space-x-3 relative justify-between items-center">
                        <div className="flex space-x-3 items-center">
                          <p className="text-sm text-gray-600 font-bold">
                            {p.author?.name ?? "Usuario desconocido"}
                          </p>

                          <p className="text-sm text-gray-400">
                            @{typeof p.author === "string"
                              ? p.author
                              : p.author?.username}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatDate(p)}
                          </p>
                        </div>
                        {/* Icono de opciones con menú desplegable */}
                        <div className="relative">
                          <MoreHorizontal
                            className="w-4 h-4 text-gray-400 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClick(p._id);
                            }}
                          />
                          {selectedPostId === p._id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                              {p.author._id === user?.id ? (
                                <>
                                  <button
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    onClick={() => handleDeletePost(p._id)}
                                  >
                                    Eliminar
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    onClick={() => handleDeletePost(p._id)}
                                  >
                                    Guardar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    onClick={() => {
                                      const updatedPosts = posts.filter(
                                        (post) => post._id !== p._id
                                      );
                                      setPosts(updatedPosts);
                                      setSelectedPostId(null);
                                    }}
                                  >
                                    Ocultar
                                  </button>{" "}
                                  <button
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    onClick={() => console.log("Mostrar Menos")}
                                  >
                                    Mostrar menos
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    onClick={() => console.log("Reportar")}
                                  >
                                    Reportar
                                  </button>
                                </>
                              )}
                            </div>
                          )}{" "}
                        </div>
                      </div>
                      <p className="text-gray-600">{p.contenido}</p>
                      <div className="flex space-x-2 mt-2 items-center">
                        <HandThumbUpIcon
                          className="w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500"
                          onClick={() => handleLike(p._id)}
                        />
                        <span className="text-sm text-gray-600">{p.likes}</span>
                        <BookmarkIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
