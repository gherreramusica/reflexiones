'use client';
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Bible(){
  const [verse, setVerse] = useState("Cargando versículo...");
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [selectedBook, setSelectedBook] = useState(""); // Guardar el libro seleccionado
  const [selectedChapter, setSelectedChapter] = useState(""); // Guardar el capítulo seleccionado
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [chapter, setChapter] = useState(""); // Estado para almacenar el capítulo completo
  const [closeChapter, setCloseChapter] = useState(true);


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

  useEffect(() => {
    fetchRandomVerse();
  }, [])

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

  const handleCloseChapter = () => {
    setCloseChapter(!closeChapter);
  };

return(
<div className="mt-5 p-4 bg-gray-200 text-center rounded-md w-[100%]">
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
)
} 

