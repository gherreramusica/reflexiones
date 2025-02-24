import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    

    if (!token) {
      
      return NextResponse.json({ authenticated: false });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as { userId: string };


    await connectDB();
    const user = await User.findById(decoded.userId);


    if (!user) {
     
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name, // Cambiado de user.username a user.name
        email: user.email,
        avatar: user.avatar,
        username: user.username,
        bio: user.bio
      }
    });
  } catch (error) {
 
    return NextResponse.json({ authenticated: false });
  }
}