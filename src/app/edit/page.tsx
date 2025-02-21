"use client";
import { Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // Hook de autenticación
import { useState, useEffect, useRef } from "react";
import Image from "next/image"; // Importar next/image

export default function Edit() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // Evita valores vacíos
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log("User data:", user);
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setPreview(user.avatar || "/images/avatar.png"); // Usa una imagen por defecto
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) {
      console.error("❌ Error: user.id es undefined");
      alert("Error: No se puede actualizar sin un ID de usuario");
      return;
    }

    let avatarUrl = user.avatar;

    if (avatar) {
      const formData = new FormData();
      formData.append("file", avatar);
      
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Error al subir la imagen");

        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          avatarUrl = uploadData.url;
        }
      } catch (error) {
        console.error("❌ Error al subir imagen:", error);
        alert("Hubo un problema al subir la imagen.");
        return;
      }
    }

    const updatedUser = { name, username, bio, avatar: avatarUrl };

    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      alert("Perfil actualizado correctamente");
      setPreview(avatarUrl || null);
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      alert("Hubo un problema al actualizar el perfil");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex max-w-[500px] text-gray-700 m-auto flex-col h-screen">
      <div className="mt-5 flex items-center">
        <h1 className="text-4xl mt-8 mb-8 w-full flex justify-between items-center py-2 px-0 font-bold mb-4">
          Edit Profile{" "}
          <button
            onClick={handleSave}
            className="bg-gray-200 text-xl py-2 px-4 font-normal rounded-lg"
          >
            Done
          </button>
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        {/* Botón para seleccionar imagen */}
        <button className="w-[80px] h-[80px] relative border rounded-full shadow-md"
        onClick={handleImageClick}>
          <div className="w-[30px] h-[30px] bg-white absolute bottom-0 right-0 border border-gray-400 rounded-full shadow-md flex items-center justify-center">
            <Pencil size={15} />
          </div>
          <Image
            className="rounded-full object-cover"
            src={preview || "/images/avatar.png"} // 🔹 Usa una imagen por defecto
            alt="avatar"
            width={80}
            height={80}
            unoptimized
          />
          {/* Input para subir archivo */}
        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded-lg shadow-sm hidden"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setAvatar(file);
            if (file) {
              const objectUrl = URL.createObjectURL(file);
              setPreview(objectUrl);
            }
          }}
        />
        </button>

        

        <label className="font-bold" htmlFor="name">
          Nombre
        </label>
        <input
          className="border shadow-sm font-bold h-[40px] rounded-lg p-2"
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="font-bold" htmlFor="username">
          Usuario
        </label>
        <input
          className="border h-[40px] shadow-sm rounded-lg p-2"
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="font-bold" htmlFor="bio">
          Bio
        </label>
        <textarea
          className="border shadow-sm rounded-lg h-[200px] p-2"
          name="bio"
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}
