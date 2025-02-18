import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    console.log("🔍 Token recibido:", token);

    if (!token) {
      console.log("⚠️ No se encontró el token en las cookies");
      return NextResponse.json({ authenticated: false });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!);
    console.log("✅ Token decodificado:", decoded);

    await connectDB();
    const user = await User.findById(decoded.userId);
    console.log("👤 Usuario encontrado:", user);

    if (!user) {
      console.log("⚠️ Usuario no encontrado en la base de datos");
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ Error en la autenticación:", error);
    return NextResponse.json({ authenticated: false });
  }
}
