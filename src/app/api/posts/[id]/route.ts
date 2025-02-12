import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest, // ← Cambiado a NextRequest
  { params }: { params: { id: string } } // Extrae `params` correctamente
) {
  try {
    await connectDB();
    
    const { id } = params; // Extraemos `id` desde `params`

    // Verificar que el ID tiene formato válido antes de hacer la consulta
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Buscar el post por ID
    const post = await Post.findById(new ObjectId(id));

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}
