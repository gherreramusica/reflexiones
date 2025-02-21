import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Obtener el ID desde la URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extrae el último segmento de la URL

    if (!id || !ObjectId.isValid(id)) {
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



export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Extract ID from the request URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    // Validate the ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Convert id to ObjectId and delete the post
    const deletedPost = await Post.findByIdAndDelete(new ObjectId(id));

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Post successfully deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}