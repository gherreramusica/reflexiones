'use client';

import { useState } from 'react';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('✅ Post creado con éxito');
            setTitle('');
            setContent('');
        } else {
            setMessage(`❌ ${data.error}`);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear un Nuevo Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Contenido"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Guardar
                </button>
            </form>
            {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        </div>
    );
}
