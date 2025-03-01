"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useAuth } from "@/hooks/useAuth";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import HardBreak from "@tiptap/extension-hard-break";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";

const TiptapEditor = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Paragraph,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      Link,
      Image,
      HardBreak.configure({
        keepMarks: true,
      }),
      Placeholder.configure({
        placeholder: "Escribe tu reflexión aquí...",
        showOnlyWhenEditable: true,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "text-lg text-gray-500 pt-2 px-4 min-h-[200px] rounded-md focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchPost = async () => {
        const response = await fetch(`/api/posts/${id}`);
        const post = await response.json();

        setTitle(post.title);
        editor?.commands.setContent(post.content);
        setImage(post.image);
      };
      fetchPost();
    }
  }, [id, editor]);

  const savePost = async () => {
    if (!editor || !title) {
      alert("Title and content are required");
      return;
    }

    const content = editor.getHTML();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/posts/${id}` : "/api/posts";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: user?.id,
          title,
          content,
          image,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/post/${id || data.id}`);
      } else {
        const error = await response.json();
        alert("Error saving the post: " + error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server.");
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;
        if (editor) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
        setImage(imageUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload image");
    }
  };
  if (!editor) return null;

  return (
    <div>
      <header className="p-4">
        <div>
          <ul className="flex justify-between items-center">
            <li className="flex gap-2 items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-md hover:bg-gray-200 transition"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="relative text-3xl font-bold before:content-[''] before:block before:absolute before:right-0 before:bottom-[-5px] before:w-[10px] before:h-[10px] before:bg-green-400 before:text-blue-500">
                R
              </h1>
            </li>
            <li>
              <button
                onClick={savePost}
                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-blue-600"
              >
                {isEditing ? "Update" : "Publish"}
              </button>
            </li>
          </ul>
        </div>
      </header>
      <div className="p-4 mt-4 max-w-3xl mx-auto">
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

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="upload-image"
          />
          <label
            htmlFor="upload-image"
            className="p-2 rounded hover:bg-gray-200 cursor-pointer"
          >
            <ImageIcon className="w-5 h-5 text-gray-700" />
          </label>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a title"
          className="w-full p-2 mb-2 text-4xl font-bold rounded outline-none"
        />

        <EditorContent
          editor={editor}
          className="p-2 rounded-md min-h-[200px] focus:outline-none border border-gray-300"
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
