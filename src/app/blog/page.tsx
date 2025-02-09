'use client'
import Link from "next/link";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react"


interface Post {
    _id: string,
    title: string,
    content: string,
}

export default function Blog() {
    const [input, showInput] = useState(false);
    const [post, setPost] = useState<Post[]>([]);

    useEffect(() => {
        fetch ("/api/posts")
        .then((res) => res.json())
        .then((data) => setPost(data))
    },[])


    return (
        <section  className="bg-[radial-gradient(#000_1px,transparent_1px)] min-h-screen grid justify-center m-auto relative max-w-[90%] lg:max-w-[50%]" >   
        <div className="mt-10">
        <ul className="flex gap-3 justify-center">
          <Link href="/home"><li className="border p-2 rounded-md">Notes</li></Link> 
          <Link href="/blog"><li className="border p-2 rounded-md">Articles</li></Link> 
          <li className="border p-2 rounded-md">Saves</li>
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
                <div className={`lg:w-[600px] lg:h-[250px] w-[330px] h-[200px] h-auto border p-4 absolute top-[40%] left-[10%] rounded-md bg-white ${input ? 'block' : 'hidden'}`}>
                    <div className="flex space-x-1 h-[250px]">
                        <div>FOTO</div>
                        <div className="w-full h-[250px]">
                            <div><p>Martin Herrera</p></div>    
                            <textarea
                                className="w-full outline-none resize-none overflow-auto break-words lg:h-[130px] h-[100px]"
                                autoFocus={input}
                                wrap="soft"
                                placeholder="Escribe aquí..."
                            ></textarea>
                            <div className="flex p-3 justify-end items-center">
                                <div className="space-x-3">
                                    <button className="bg-gray-100 p-2 rounded-md" onClick={() => showInput(false)}>
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
                    <Link href="/editor" ><div className="border shadow-md cursor-pointer p-5 text-gray-400 rounded-md cursor-pointer"><p>Escribe algo...</p></div></Link>
                </div>

                {/* Lista de reflexiones */}
                <div>
                    <ul className="mt-10 space-y-3">
                        {post.map((post) => (
                            <li key={post._id} className="border-b  p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p>Martin Herrera</p>
                                <p>hace 1 min</p>
                            </div>
                            <div className="font-bold text-xl"><p>{post.title}</p></div> 
                            <div><p>{post.content}</p></div>
                            <div className="flex space-x-2 mt-2">
                            <HandThumbUpIcon className="w-5 h-5" />
                            <BookmarkIcon className="w-5 h-5" />
                            </div>            
                        </li>
                        ))}
                        
                    </ul>
                </div>
            </div>
        </section>
    )
}