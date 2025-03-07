import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    const notes = await Note.find()
      .populate("author", "name username email avatar")
      .sort({ createdAt: -1 });

    

    return NextResponse.json(notes);
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const { author, contenido } = await req.json();

    if (!author || !contenido) {
      return NextResponse.json(
        { error: "Faltan datos: Se requiere el ID del autor y el contenido" },
        { status: 400 }
      );
    }

    const newNote = new Note({
      author, // 🔥 Guardamos el ID directamente
      contenido,
      likes: 0
    });

    const savedNote = await newNote.save();

    // 🔥 Recuperamos la nota con populate() para traer el nombre del usuario
    const populatedNote = await Note.findById(savedNote._id).populate("author", "name username email avatar");

    return NextResponse.json(populatedNote, { status: 201 });
  } catch (error) {
    console.error("❌ Error en POST:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al guardar la nota" },
      { status: 500 }
    );
  }
}



export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, like } = await req.json();

    if (!id || (like !== 1 && like !== -1)) {
      return NextResponse.json(
        { error: "Datos inválidos. Se requiere 'id' y 'like' (1 o -1)" },
        { status: 400 }
      );
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { $inc: { likes: like } },
      { new: true }
    );

    if (!note) {
      return NextResponse.json({ error: "Nota no encontrada" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("❌ Error en PATCH:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al actualizar el like" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Se requiere el ID del post" }, { status: 400 });
    }

    const deletedNote = await Note.findByIdAndDelete(id);
    
    if (!deletedNote) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("❌ Error en DELETE:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error deleting post" },
      { status: 500 }
    );
  }
}
