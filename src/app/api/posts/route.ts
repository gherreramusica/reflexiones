import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';

// Ruta para crear un nuevo post
export async function POST(req: Request) {
    try {
        // Conectar a MongoDB
        await connectDB();

        // Parsear el body
        const { title, content } = await req.json();

        // Validar datos
        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        // Crear y guardar el post
        const newPost = new Post({ title, content });
        await newPost.save();

        return NextResponse.json(
            { message: 'Post saved successfully!', post: newPost },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST:", error);
        return NextResponse.json(
            { error: 'Error saving post', details: error.message },
            { status: 500 }
        );
    }
}

// Ruta para obtener todos los posts
export async function GET(req: Request) {
    try {
        await connectDB();

        // Ordenar por la fecha de creación, más reciente primero
        const posts = await Post.find().sort({ createdAt: -1 });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }
}


