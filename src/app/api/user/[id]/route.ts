import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

interface UpdateUserData {
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  modules?: any; // Ideally, specify a more precise type for `modules`
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const userId = url.pathname.split('/').pop();

    const { name, username, bio, avatar, modules }: UpdateUserData = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    if (!name || !username) {
      return NextResponse.json({ error: "Nombre y usuario son requeridos" }, { status: 400 });
    }

    // Explicitly typing updateData
    const updateData: Partial<UpdateUserData> = { name, username, bio, avatar };

    if (modules) {
      updateData.modules = modules;
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

