'use client'
import Link from "next/link";
import { HandThumbUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react"

// Definir la interfaz para un post
interface Post {
    id: number;
    author: string;
    content: string;
    timestamp: string;
    likes: number;
    saved: boolean;
}

export default function Home() {
    const [input, showInput] = useState(false);
    const [content, setContent] = useState('');
    // Tipar el estado posts
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            author: "Martin Herrera",
            content: "Porque de tal manera amo dios al mundo que dio a su hijo unigetito para que todo aquel que en el cree no se pierda mas tenga vida eterna",
            timestamp: "hace 1 min",
            likes: 0,
            saved: false
        }
    ]);

    const handleSubmit = () => {
        if (!content.trim()) return;

        const newPost: Post = {
            id: Date.now(),
            author: "Martin Herrera",
            content: content,
            timestamp: "hace 1 min",
            likes: 0,
            saved: false
        };

        setPosts([newPost, ...posts]);
        setContent('');
        showInput(false);
    };

    // Tipar el parámetro postId
    const handleLike = (postId: number) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? {...post, likes: post.likes + 1}
                : post
        ));
    };

    // Tipar el parámetro postId
    const handleSave = (postId: number) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? {...post, saved: !post.saved}
                : post
        ));
    };

    return (
        <section  className="bg-[radial-gradient(#000_1px,transparent_1px)] min-h-screen max-w-[90%] lg:max-w-[50%] grid justify-center m-auto relative" >
            
            {/* Overlay oscuro cuando el input está activo */}
            {input && (
                <div 
                    className="fixed inset-0 bg-black/50 z-10" 
                    onClick={() => showInput(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside onClick={() => showInput(false)} className="min-h-screen bg-black text-white w-[200px] border-r fixed top-0 left-0 pt-4 p-2 lg:block hidden">
                <div className="font-bold text-xl">REFLEXIONES</div>
                <ul className="space-y-4 pt-20">
                    <li>
                        <Link href="/home"><strong>NOTES</strong></Link>             
                    </li>
                    <li>
                        <Link href="/blog"><strong>LONG NOTES</strong></Link>             
                    </li>
                    <li>
                        <Link href="/settings"><strong>SAVES</strong></Link>             
                    </li>
                </ul>
            </aside>

            {/* Contenido */}
            <div className="relative z-20">  
                {/* Ventana flotante del textarea */}
                <div 
                    className={`lg:w-[600px] lg:h-[250px] w-[330px] h-[200px] h-auto border p-4 absolute top-[40%] left-[10%] rounded-md bg-white ${input ? 'block' : 'hidden'}`}
                    onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer click dentro
                >
                    <div className="flex space-x-1 h-[250px]">
                        <div>FOTO</div>
                        <div className="w-full h-[250px]">
                            <div><p>Martin Herrera</p></div>    
                            <textarea
                                className="w-full outline-none resize-none overflow-auto break-words lg:h-[130px] h-[100px]"
                                autoFocus={input}
                                wrap="soft"
                                placeholder="Escribe aquí..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                            <div className="flex p-3 justify-end items-center">
                                <div className="space-x-3">
                                    <button 
                                        className="bg-gray-100 p-2 rounded-md" 
                                        onClick={() => {
                                            showInput(false);
                                            setContent(''); // Limpiar contenido al cancelar
                                        }}
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
                <div className="mt-10" onClick={() => showInput(true)}>
                    <div className="border shadow-md cursor-pointer p-5 text-gray-400 rounded-md cursor-pointer">
                        <p>Escribe algo...</p>
                    </div>
                </div>

                {/* Lista de reflexiones */}
                <div>
                    <ul className="mt-10 space-y-3">
                        {posts.map(post => (
                            <li key={post.id} className="text-gray-700 border-b min-w-[300px] p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-gray-700"><strong>{post.author}</strong></p>
                                    <p>{post.timestamp}</p>
                                </div>
                                <div><p>{post.content}</p></div> 
                                <div className="flex space-x-2 mt-2">
                                    <div 
                                        className="flex items-center cursor-pointer" 
                                        onClick={() => handleLike(post.id)}
                                    >
                                        <HandThumbUpIcon 
                                            className={`w-5 h-5 ${post.likes > 0 ? 'text-blue-500' : ''}`} 
                                        />
                                        {post.likes > 0 && <span className="ml-1">{post.likes}</span>}
                                    </div>
                                    <BookmarkIcon 
                                        className={`w-5 h-5 cursor-pointer ${post.saved ? 'text-blue-500' : ''}`}
                                        onClick={() => handleSave(post.id)}
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