"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Bible() {
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
    <div>
      <div className="p-4 rounded-b-lg bg-gray-200 text-center w-[100%]">
        <p className="font-bold text-lg">📖 Versículo del Día:</p>
        <p className="italic">{verse}</p>
        
        <button
          onClick={fetchRandomVerse}
          className="mt-2 m-auto px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
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

        <button
          onClick={fetchFullChapter}
          className="mt-2 m-auto px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
          disabled={loadingChapter || !selectedBook || !selectedChapter} // ✅ Evita llamadas innecesarias
        >
          {loadingChapter ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" /> Cargando capítulo...
            </>
          ) : (
            "Mostrar capítulo completo"
          )}
        </button>

        {chapter && (
          <div className={`mt-5 p-4 bg-gray-100 relative rounded-b-lg ${closeChapter ? "block" : "hidden"}`}>
            <button
              className="absolute font-bold top-0 left-0 p-3 underline"
              onClick={handleCloseChapter}
            >
              {closeChapter ? "Ocultar" : "Mostrar"}
            </button>
            <p className="font-bold text-lg">
              📖 {booksDictionary[selectedBook as keyof typeof booksDictionary]} {selectedChapter}
            </p>
            <p className="text-gray-800 whitespace-pre-line">{chapter}</p>
          </div>
        )}
      </div>
    </div>
  );
}