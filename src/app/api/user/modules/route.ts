import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
      await connectDB();
  
      const userId = req.nextUrl.searchParams.get("userId");
      console.log("📌 userId recibido en la API:", userId);
  
      if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
      }
  
      const user = await User.findById(userId).select("modules");
  
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      // 🚀 Solución: Asegurar que `modules` siempre sea un array
      return NextResponse.json({ modules: Array.isArray(user.modules) ? user.modules : [] }, { status: 200 });
  
    } catch (error: unknown) {
      console.error("❌ Error obteniendo módulos:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: "Error obteniendo módulos", error: error.message }, { status: 500 });
      } else {
        return NextResponse.json({ message: "Error obteniendo módulos", error: "An unknown error occurred" }, { status: 500 });
      }
    }
  }  

export async function POST(req: NextRequest) {
    try {
      await connectDB();
      const { userId, module } = await req.json();
  
      console.log("📌 Recibido en API - userId:", userId, "Módulo:", module);
  
      if (!userId || !module) {
        return NextResponse.json({ message: "User ID and module are required" }, { status: 400 });
      }
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      // 🚀 Solución: Asegurar que `modules` siempre sea un array
      if (!Array.isArray(user.modules)) {
        user.modules = [];
      }
  
      // Evitar duplicados
      if (!user.modules.includes(module)) {
        user.modules.push(module);
        await user.markModified("modules"); // ✅ Forzar MongoDB a detectar cambios
        await user.save();
        console.log("✅ Módulo guardado:", user.modules);
      }
  
      return NextResponse.json({ message: "Module added successfully", modules: user.modules }, { status: 200 });
  
    } catch (error: unknown) {
      console.error("❌ Error al agregar módulo:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: "Error al agregar módulo", error: error.message }, { status: 500 });
      } else {
        return NextResponse.json({ message: "Error al agregar módulo", error: "An unknown error occurred" }, { status: 500 });
      }
    }
  }  

export async function DELETE(req: NextRequest) {
    try {
      await connectDB();
      const { userId, module } = await req.json();
  
      console.log("📌 Eliminando módulo:", module, "para el usuario:", userId);
  
      if (!userId || !module) {
        return NextResponse.json({ message: "User ID and module are required" }, { status: 400 });
      }
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      // Eliminar el módulo de la lista
      user.modules = user.modules.filter((mod: string) => mod !== module);
      await user.markModified("modules");
      await user.save();
  
      console.log("✅ Módulo eliminado, módulos actuales:", user.modules);
  
      return NextResponse.json({ message: "Module removed successfully", modules: user.modules }, { status: 200 });
  
    } catch (error: unknown) {
      console.error("❌ Error al eliminar módulo:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: "Error al eliminar módulo", error: error.message }, { status: 500 });
      } else {
        return NextResponse.json({ message: "Error al eliminar módulo", error: "An unknown error occurred" }, { status: 500 });
      }
    }
  }  
