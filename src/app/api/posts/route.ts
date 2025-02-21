import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import Post from '@/models/Post';

// Ruta para crear un nuevo post
export async function POST(req: Request) {
    try {
        // Conectar a MongoDB
        await connectDB();

        // Intentar parsear el JSON
        let data;
        try {
            data = await req.json();
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid JSON format' },
                { status: 400 }
            );
        }

        const { author, title, content, likes = 0, image = '' } = data;

        // Validar datos
        if (!author || !title || !content) {
            return NextResponse.json(
                { error: 'Author, title, and content are required' },
                { status: 400 }
            );
        }

        // Asegurar que author sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(author)) {
            return NextResponse.json(
                { error: 'Invalid author ID' },
                { status: 400 }
            );
        }

        // Crear y guardar el post
        const newPost = new Post({
            author: new mongoose.Types.ObjectId(author), // Convertir a ObjectId
            title,
            content, 
            likes,
            image,
        });

        await newPost.save();

        return NextResponse.json(
            { message: 'Post saved successfully!', post: newPost },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST:", error);
        return NextResponse.json(
            { error: "Error saving post", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}


// Ruta para obtener todos los posts
export async function GET() {
    try {
        await connectDB();

        // Ordenar por la fecha de creación, más reciente primero
        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('author', 'name username avatar');
        console.log("Posts fetched:", posts); // Verificar los posts obtenidos

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }
}


