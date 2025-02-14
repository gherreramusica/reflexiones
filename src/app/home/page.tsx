"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // 📌 Icono de carga
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
  const [verse, setVerse] = useState("Cargando versículo...");
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [selectedBook, setSelectedBook] = useState(""); // Guardar el libro seleccionado
  const [selectedChapter, setSelectedChapter] = useState(""); // Guardar el capítulo seleccionado
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [chapter, setChapter] = useState(""); // Estado para almacenar el capítulo completo
  const pathname = usePathname(); // Obtener la ruta actual
  const [closeChapter, setCloseChapter] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true); // Activa el loading cuando se inicie la carga
      try {
        const res = await fetch("/api/home");
        const data = await res.json();

        console.log("Datos antes de ordenar:", data);

        // Ordena los posts por fecha más reciente primero
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
        setLoadingPosts(false); // Desactiva el loading cuando la carga haya terminado
      }
    };

    fetchPosts();
    fetchRandomVerse();
  }, []);

  const booksDictionary: { [key: string]: string } = {
    genesis: "Génesis",
    exodo: "Éxodo",
    levitico: "Levítico",
    numeros: "Números",
    deuteronomio: "Deuteronomio",
    josue: "Josué",
    job: "Job",
    salmos: "Salmos",
    proverbios: "Proverbios",
    eclesiastes: "Eclesiastés",
    isaias: "Isaías",
    jeremias: "Jeremías",
    daniel: "Daniel",
    jonas: "Jonás",
    mateo: "Mateo",
    marcos: "Marcos",
    lucas: "Lucas",
    juan: "Juan",
    hechos: "Hechos",
    romanos: "Romanos",
    efesios: "Efesios",
    hebreos: "Hebreos",
    apocalipsis: "Apocalipsis",
  };

  const fetchRandomVerse = async () => {
    try {
      setLoadingVerse(true);
      setChapter(""); // Limpiar capítulo anterior

      // Seleccionar un libro aleatorio de la lista
      const books = Object.keys(booksDictionary);
      const randomBookKey = books[Math.floor(Math.random() * books.length)];
      const randomBookName = booksDictionary[randomBookKey];

      // Generar capítulo y versículo aleatorio
      const randomChapter = Math.floor(Math.random() * 10) + 1;
      const randomVerse = Math.floor(Math.random() * 10) + 1;

      console.log(`📖 Seleccionado: ${randomBookName} (${randomBookKey})`);

      // Hacer la petición a la API con los valores aleatorios
      const res = await fetch(
        `https://bible-api.deno.dev/api/read/nvi/${randomBookKey}/${randomChapter}/${randomVerse}`
      );

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (data && data.verse) {
        setVerse(
          `${randomBookName} ${randomChapter}:${randomVerse} - ${data.verse}`
        );
        setSelectedBook(randomBookKey); // Guardar el libro seleccionado
        setSelectedChapter(randomChapter.toString()); // Guardar el capítulo seleccionado
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

  const fetchFullChapter = async () => {
    if (!selectedBook || !selectedChapter) return;
    setCloseChapter(true);

    try {
      setLoadingChapter(true);
      setChapter(""); // Limpiar el capítulo anterior

      console.log(
        `📖 Cargando capítulo completo: ${booksDictionary[selectedBook]} ${selectedChapter}`
      );

      const res = await fetch(
        `https://bible-api.deno.dev/api/read/nvi/${selectedBook}/${selectedChapter}`
      );

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      console.log("📖 Datos del capítulo completo:", data);

      if (data && data.vers) {
        // Convertir array de versículos en un texto formateado
        const formattedChapter = data.vers
          .map(
            (verse: { number: number; verse: string }) =>
              `${verse.number}. ${verse.verse}`
          )
          .join(" ");

        setChapter(formattedChapter);
      } else {
        setChapter("No se pudo cargar el capítulo.");
      }
    } catch (error) {
      console.error("❌ Error obteniendo el capítulo:", error);
      setChapter("No se pudo cargar el capítulo.");
    } finally {
      setLoadingChapter(false);
    }
  };

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
    setSuccessMessage(true);
    setTimeout( () => {
      setSuccessMessage(false);
    }
      ,1000
    )

  };

  const handleCloseChapter = () => {
    setCloseChapter(!closeChapter);
  };

  return (
    <section className="bg-[radial-gradient(#000_1px,transparent_1px)] max-w-[90%] lg:max-w-[500px] m-auto relative">
      <div className={`${successMessage ? 'block' : 'hidden'} p-3 mt-5 border rounded-lg bg-green-500 text-center w-[100%] m-auto text-white`}>
        <h4>Mensaje Enviado</h4>
      </div>
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
        <button
          onClick={fetchFullChapter}
          className="mt-2 m-auto px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
          disabled={loadingChapter}
        >
          {loadingChapter ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" /> Cargando
              capítulo...
            </>
          ) : (
            "Mostrar capítulo completo"
          )}
        </button>

        {/* Mostrar el capítulo completo si ya fue cargado */}
        {chapter && (
          <div
            className={`mt-5 p-4 bg-gray-100 relative rounded-md ${
              closeChapter ? "block" : "hidden"
            }`}
          >
            <button
              className="absolute font-bold top-0 left-0 p-3 underline"
              onClick={handleCloseChapter}
            >
              {closeChapter ? "Ocultar" : "Mostrar"}
            </button>
            <p className="font-bold text-lg">
              📖 {booksDictionary[selectedBook]} {selectedChapter}
            </p>
            <p className="text-gray-800 whitespace-pre-line">{chapter}</p>
          </div>
        )}
      </div>
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
            className="bg-white flex items-center gap-4 text-gray-500 p-5 shadow-md border cursor-pointer min-w-[330px] rounded-md"
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
        {loadingPosts ? (
        <div className="flex justify-center items-center p-e mt-10">
          <AiOutlineLoading3Quarters className="animate-spin text-xl" />
       
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">No hay publicaciones aún.</p>
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
      )}
      </div>
    </section>
  );
}
