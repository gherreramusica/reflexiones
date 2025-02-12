import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { ObjectId } from "mongodb";
import { RouteHandlerContext } from "next/server";

export async function GET(
  req: NextRequest, 
  context: RouteHandlerContext<{ id: string }> // Usa RouteHandlerContext
) {
  try {
    await connectDB();
    
    const { id } = context.params; 

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const post = await Post.findById(new ObjectId(id));

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}
