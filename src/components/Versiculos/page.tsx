"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Versiculos() {
  const [verse, setVerse] = useState("Cargando versículo...");
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [chapter, setChapter] = useState("");
  const [closeChapter, setCloseChapter] = useState(true);
  
  // 🔹 Memoriza el diccionario para evitar recreaciones innecesarias
  const booksDictionary = useMemo(() => ({
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
  }), []);

  // 🔹 Memoriza la función para evitar recreaciones innecesarias
  const fetchRandomVerse = useCallback(async () => {
    try {
      setLoadingVerse(true);
      setChapter("");

      const books = Object.keys(booksDictionary);
      const randomBookKey = books[Math.floor(Math.random() * books.length)] as keyof typeof booksDictionary;
      const randomBookName = booksDictionary[randomBookKey];

      const randomChapter = Math.floor(Math.random() * 10) + 1;
      const randomVerse = Math.floor(Math.random() * 10) + 1;

      console.log(`📖 Seleccionado: ${randomBookName} (${randomBookKey})`);

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
        setSelectedBook(randomBookKey);
        setSelectedChapter(randomChapter.toString());
      } else {
        setVerse("No se pudo cargar el versículo.");
      }
    } catch (error) {
      console.error("Error obteniendo el versículo:", error);
      setVerse("No se pudo cargar el versículo.");
    } finally {
      setLoadingVerse(false);
    }
  }, [booksDictionary]);
  // 🔹 Prevención de múltiples llamadas en `useEffect`
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchRandomVerse();
      hasFetched.current = true;
    }
  }, [fetchRandomVerse]);

  // 🔹 Obtiene el capítulo completo
  const fetchFullChapter = async () => {
    if (!selectedBook || !selectedChapter) {
      alert("Selecciona primero un libro y un capítulo.");
      return;
    }
    setCloseChapter(true);

    try {
      setLoadingChapter(true);
      setChapter("");

      console.log(
        `📖 Cargando capítulo completo: ${booksDictionary[selectedBook as keyof typeof booksDictionary]} ${selectedChapter}`
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
  const handleCloseChapter = () => {
    setCloseChapter(!closeChapter);
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 w-full">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-3">📖 Versículo del Día</h2>
        <p className="italic text-lg">"{verse}"</p>

        {/* Botón de actualizar versículo */}
        <button
          onClick={fetchRandomVerse}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-900 text-white text-lg font-semibold flex justify-center items-center gap-2 hover:bg-gray-700 transition duration-200"
          disabled={loadingVerse}
        >
          {loadingVerse ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" /> Cargando...
            </>
          ) : (
            "Actualizar Versículo"
          )}
        </button>

        {/* Botón de mostrar capítulo completo */}
        <button
          onClick={fetchFullChapter}
          className="mt-3 w-full px-4 py-2 rounded-lg bg-blue-800 text-white text-lg font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 transition duration-200"
          disabled={loadingChapter || !selectedBook || !selectedChapter}
        >
          {loadingChapter ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" /> Cargando capítulo...
            </>
          ) : (
            "Mostrar capítulo completo"
          )}
        </button>
      </div>

      {/* Contenedor del capítulo completo */}
      {chapter && (
        <div className="mt-6 p-5 bg-white rounded-xl shadow-md w-full text-gray-900">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              📖 {booksDictionary[selectedBook as keyof typeof booksDictionary]} {selectedChapter}
            </h3>
            <button
              className="text-blue-600 font-bold underline hover:text-blue-800 transition duration-200"
              onClick={handleCloseChapter}
            >
              {closeChapter ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <p className="mt-4 text-gray-800 whitespace-pre-line">{chapter}</p>
        </div>
      )}
    </div>
  );
}