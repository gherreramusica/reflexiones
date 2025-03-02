import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const userId = url.pathname.split('/').pop(); // Obtiene el ID del usuario desde la URL

    const { name, username, bio, avatar, modules } = await req.json(); // ✅ Ahora también recibimos `modules`

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    // Validar los datos recibidos
    if (!name || !username) {
      return NextResponse.json({ error: "Nombre y usuario son requeridos" }, { status: 400 });
    }

    // ✅ Actualizar módulos si existen en la solicitud
    const updateData: any = { name, username, bio, avatar };
    if (modules) {
      updateData.modules = modules; // Solo actualiza `modules` si está presente
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
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
