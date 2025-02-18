import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, email, password, avatar } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword,
      avatar: avatar || "https://ui-avatars.com/api/?name=" + username
    });
    await newUser.save();

      return NextResponse.json({ 
        message: "¡Registro exitoso! Bienvenido a la plataforma",
        success: true 
      }, { status: 201 });
  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}