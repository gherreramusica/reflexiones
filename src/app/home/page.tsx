'use client'
import Image from "next/image";
import Link from "next/link";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";

import Sidebar from "@/components/sidebar/sidebar/page";
import { useState } from "react";


interface Post {
    id: number;
    autor: string;
    timestamp: string;
    contenido: string
}

export default function Home() {
    const [input, showInput] = useState(false);
    const [content, setContent] = useState('');
    const [post, setPost] = useState<Post[]>([]);

     const handleSubmit = () => {
        if(content === "") return;

        const newPost = {
            id: post.length + 1,
            autor: 'Martin Herrera',
            timestamp: 'hoy',
            contenido: content,
        }
        setPost([newPost, ...post]);
        setContent('');
        showInput(false);

    }

    return (
        <section  className="bg-[radial-gradient(#000_1px,transparent_1px)] min-h-screen max-w-[90%] lg:max-w-[50%] grid justify-center m-auto relative" >
            
            {/* Overlay oscuro cuando el input está activo */}
            {input &&(
                <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-[20]"

                     onClick={() => showInput(false)}
                ></div>
            )}

            <Sidebar/>

            {/* Contenido */}
            <div className="relative">  
                {/* Ventana flotante del textarea */}
                <div 
                    className={`lg:w-[600px] lg:h-[250px] w-[330px] h-[200px] h-auto border p-4 absolute top-[40%] left-[10%] rounded-md bg-white ${input ? 'block' : 'hidden'} z-[20]`}
                    onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer click dentro
                >
                    <div className="flex space-x-1 h-[250px] ">
                        <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
                            <Image 
                                width={40} // ✅ Debe ser un número
                                height={40} // ✅ Debe ser un número
                                src="/images/avatar.jpeg" 
                                alt="avatar"
                                className="object-cover rounded-full"
                            />
                        </div>
                        <div className="w-full h-[250px]">
                            <div><p>Martin Herrera</p></div>    
                            <textarea
                                className="w-full outline-none resize-none overflow-auto break-words lg:h-[130px] h-[100px]"
                                wrap="soft"
                                placeholder="Escribe aquí..."
                                onChange={(e) => setContent(e.target.value)}
                                value = {content}
                            ></textarea>
                            <div className="flex p-3 justify-end items-center">
                                <div className="space-x-3">
                                    <button 
                                        className="bg-gray-100 p-2 rounded-md" 
                                        onClick={() => showInput(false)}
                                    >
                                        <strong>Cancel</strong>
                                    </button>
                                    <button 
                                        className="bg-gray-100 p-2 rounded-md"                       
                                        onClick={handleSubmit}
                                    >
                                        <strong>Publicar</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>                  
                </div>

                {/* Botón para mostrar el textarea */}
                <div className="mt-10">
                    <div className="flex items-center space-x-2 shadow-md bg-white p-5 text-gray-400 rounded-md cursor-pointer w-[300px] sm:w-[500px] md:w-[600px] lg:w-[700px]"
                         onClick={() => showInput(true)}   >
                        <div className="rounded-full overflow-hidden w-[40px] h-[40px]">
                            <Image 
                                width={40} // ✅ Debe ser un número
                                height={40} // ✅ Debe ser un número
                                src="/images/avatar.jpeg" 
                                alt="avatar"
                                className="object-cover rounded-full"
                            />
                        </div>
                        <p>Escribe algo...</p>
                    </div>
                </div>

                {/* Lista de reflexiones */}
                <div>
                    <ul className="mt-10 space-y-3">
                      {post.map((p) => (
                        <li key={p.id}  className="text-gray-700 w-[300px] sm:w-[500px] md:w-[600px] lg:w-[700px] border-b p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-gray-700"><strong>{p.autor}</strong></p>
                                    <p>{p.timestamp}</p>
                                </div>
                                <div><p>{p.contenido}</p></div> 
                                <div className="flex space-x-2 mt-2">
                                    <div 
                                        className="flex items-center cursor-pointer" 
                                  
                                    >
                                        <HandThumbUpIcon 
                                            className="w-5 h-5" 
                                        />
                                         <span className="ml-1"></span>
                                    </div>
                                    <BookmarkIcon 
                                        className= "w-5 h-5 cursor-pointer"
                                    
                                    />
                                </div>            
                            </li>
                      ))}        
                    </ul>
                </div>
            </div>
        </section>
    )
}