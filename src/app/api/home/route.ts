import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

// 📌 GET: Obtener todas las notas
export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener notas" }, { status: 500 });
  }
}

// 📌 POST: Agregar una nueva nota
export async function POST(req: Request) {
  try {
    await connectDB();
    const { author, contenido } = await req.json();

    if (!author || !contenido) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const newNote = new Note({ author, contenido });
    await newNote.save();

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar la nota" }, { status: 500 });
  }
}
