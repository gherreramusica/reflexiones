import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const userId = params.id;
    const { name, username, bio, avatar } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    // Validar los datos recibidos
    if (!name || !username) {
      return NextResponse.json({ error: "Nombre y usuario son requeridos" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, username, bio, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("❌ Error en PATCH /api/user/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}
