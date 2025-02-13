"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // 📌 Icono de carga

interface Post {
  _id: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  contenido: string;
  timestamp?: string;
}

export default function Home() {
  const [input, showInput] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [verse, setVerse] = useState("Cargando versículo...");
  const [loadingVerse, setLoadingVerse] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/home");
      const data = await res.json();

      // Ordena los posts por fecha más reciente primero
      const sortedPosts = data.sort((a: { createdAt?: string; timestamp?: string }, b: { createdAt?: string; timestamp?: string }) => {
        const dateA = new Date(a.createdAt ?? a.timestamp ?? 0).getTime();
        const dateB = new Date(b.createdAt ?? b.timestamp ?? 0).getTime();
        return dateB - dateA;
      });

      setPosts(sortedPosts);
    };

    fetchPosts();
    fetchRandomVerse();
  }, []);

  const booksDictionary: { [key: string]: string } = {
    "genesis": "Génesis",
    "exodo": "Éxodo",
    "levitico": "Levítico",
    "numeros": "Números",
    "deuteronomio": "Deuteronomio",
    "josue": "Josué",
    "job": "Job",
    "salmos": "Salmos",
    "proverbios": "Proverbios",
    "eclesiastes": "Eclesiastés",
    "isaias": "Isaías",
    "jeremias": "Jeremías",
    "daniel": "Daniel",
    "jonas": "Jonás",
    "mateo": "Mateo",
    "marcos": "Marcos",
    "lucas": "Lucas",
    "juan": "Juan",
    "hechos": "Hechos",
    "romanos": "Romanos",
    "efesios": "Efesios",
    "hebreos": "Hebreos",
    "apocalipsis": "Apocalipsis"
  };
  

  const fetchRandomVerse = async () => {
    try {
      setLoadingVerse(true);

      // Seleccionar un libro aleatorio de la lista
      const books = Object.keys(booksDictionary);
      const randomBookKey = books[Math.floor(Math.random() * books.length)];
      const randomBookName = booksDictionary[randomBookKey];

      // Generar capítulo y versículo aleatorio
      const randomChapter = Math.floor(Math.random() * 10) + 1;
      const randomVerse = Math.floor(Math.random() * 10) + 1;

      console.log(`📖 Seleccionado: ${randomBookName} (${randomBookKey})`);


      // Hacer la petición a la API con los valores aleatorios
      const res = await fetch(`https://bible-api.deno.dev/api/read/nvi/${randomBookKey}/${randomChapter}/${randomVerse}`);

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (data && data.verse) {
        setVerse(`${randomBookName} ${randomChapter}:${randomVerse} - ${data.verse}`);
      } else {
        setVerse("No se pudo cargar el versículo.");
      }
    } catch (error) {
      console.error("Error obteniendo el versículo:", error);
      setVerse("No se pudo cargar el versículo.");
    } finally {
      setLoadingVerse(false);
    }
  };

  const formatDate = (post: Post) => {
    const dateString = post.createdAt || post.timestamp;
    if (!dateString) return "Fecha desconocida";

    let parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date(Date.parse(dateString));
    }

    if (isNaN(parsedDate.getTime())) {
      console.error("Error al convertir la fecha:", dateString);
      return "Fecha inválida";
    }

    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 30) {
      return `hace ${formatDistanceToNow(parsedDate, { addSuffix: false, locale: es })}`;
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
      setPosts((prevPosts) => [savedPost, ...prevPosts]);
      setContent("");
      showInput(false);
    }
  };

  return (
    <section className="bg-[radial-gradient(#000_1px,transparent_1px)] max-w-[90%] lg:max-w-[500px] m-auto relative">
      <div className="mt-5 p-4 bg-gray-200 text-center rounded-md">
        <p className="font-bold text-lg">📖 Versículo del Día:</p>
        <p className="italic">{verse}</p>
        <button
          onClick={fetchRandomVerse}
          className="mt-2 m-auto px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
          disabled={loadingVerse} // Deshabilita el botón mientras carga
        >
          {loadingVerse ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" /> Cargando...
            </>
          ) : (
            "Actualizar Versículo"
          )}
        </button>
      </div>

      <div className="mt-10">
        <ul className="flex gap-3 justify-center">
          <Link href="/home">
            <li className={`bg-gray-100 p-2 rounded-md ${pathname === "/home" ? "border font-bold" : ""}`}>
              Notes
            </li>
          </Link>
          <Link href="/blog">
            <li className={`bg-gray-100 p-2 rounded-md ${pathname === "/blog" ? "border font-bold" : ""}`}>
              Articles
            </li>
          </Link>
          <Link href="/saves">
            <li className={`bg-gray-100 p-2 rounded-md ${pathname === "/saves" ? "border font-bold" : ""}`}>
              Saves
            </li>
          </Link>
        </ul>
      </div>

      <div className="mt-10">
        <div className="bg-white flex items-center gap-4 text-gray-500 p-5 shadow-md border cursor-pointer min-w-[330px] rounded-md" onClick={() => showInput(true)}>
          <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
            <Image width={40} height={40} src="/images/avatar.jpeg" alt="avatar" className="object-cover rounded-full" />
          </div>
          <p>Escribe algo...</p>
        </div>
      </div>

      <ul className="mt-10 space-y-3">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No hay publicaciones aún.</p>
        ) : (
          posts.map((p) => (
            <li key={p._id} className="border-b flex gap-2 p-4 bg-white">
              <div>
                <div className="rounded-full flex overflow-hidden w-[35px] h-[35px]">
                  <Image width={35} height={35} src="/images/avatar.jpeg" alt="avatar" className="object-cover rounded-full" />
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{p.author}</p>
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
    </section>
  );
}
