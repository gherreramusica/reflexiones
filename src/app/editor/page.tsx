"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Link from "@tiptap/extension-link";
import { ArrowLeft } from "lucide-react"; // Importar icono de back
import { useState } from "react";
import { Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, List, ListOrdered, Link as LinkIcon } from "lucide-react"; // Importar iconos

const TiptapEditor = () => {
  const [title, setTitle] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      Link,
    ],
    content: "Aquí va el texto",
    editorProps: {
      attributes: {
        class: "text-lg text-gray-400 pt-2 outline-none", // Texto más grande y color gris
      },
    },
  });

  const savePost = async () => {
    if (!editor || !title) {
      alert("Title and content are required");
      return;
    }

    const content = editor.getText(); // Obtiene solo el texto sin etiquetas HTML

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        alert("Post saved successfully!");
        setTitle("");
        editor.commands.setContent("");
        window.location.href = "/blog"; // Redireccionar después de guardar
      } else {
        const error = await response.json();
        console.error("Failed to save post:", error);
        alert("Error saving the post: " + error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server.");
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div>
      <header className="p-4">
        <div>
          <ul className="flex justify-around items-center">
            <li className="flex gap-2 items-center">
            <button 
              onClick={() => window.history.back()} 
              className="p-2 rounded-md hover:bg-gray-200 transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <strong>REFLEXIONES</strong> 
            </li>
            <li>
              {/* Botón para guardar */}
              <button
                onClick={savePost}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Continuar
              </button>
            </li>
          </ul>
        </div>
      </header>

      <div className="p-4 mt-4 max-w-3xl mx-auto">
        {/* Barra de Herramientas con Iconos */}
        <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-md shadow-sm">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <BoldIcon className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("italic") ? "bg-gray-300" : ""
            }`}
          >
            <ItalicIcon className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("underline") ? "bg-gray-300" : ""
            }`}
          >
            <UnderlineIcon className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bulletList") ? "bg-gray-300" : ""
            }`}
          >
            <List className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("orderedList") ? "bg-gray-300" : ""
            }`}
          >
            <ListOrdered className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .setLink({ href: prompt("Enter a URL") || "" })
                .run()
            }
            className="p-2 rounded hover:bg-gray-200"
          >
            <LinkIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Campo para el título */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 mt-4 mb-2 text-4xl font-bold rounded outline-none"
        />

        {/* Editor */}
        <EditorContent
          editor={editor}
          className="p-2 rounded-md min-h-[200px] focus:outline-none border border-gray-300"
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
