import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request
) {
  try {
    const id = request.url.split('/').pop();
    await connectDB();
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return NextResponse.json(
        { error: "Nota no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Nota eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar nota:", error);
    return NextResponse.json(
      { error: "Error al eliminar la nota" },
      { status: 500 }
    );
  }
}
