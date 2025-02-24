import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SavedPost from "@/models/SavedPost";


export async function POST(req: Request) {
    try {
      await connectDB();

      const { userId, postId, noteId } = await req.json();
  
      if (!userId || (!postId && !noteId)) {
        return NextResponse.json({ message: "Missing userId or content ID" }, { status: 400 });
      }
  
      // 🔥 Fix: Only check if THIS post/note is already saved by the user
      const existingSavedPost = await SavedPost.findOne({
        user: userId,
        ...(postId ? { post: postId } : {}),
        ...(noteId ? { note: noteId } : {}),
      });
  
      if (existingSavedPost) {
        return NextResponse.json({ message: "Post already saved" }, { status: 400 });
      }
  
      // Create a new saved post entry
      const savedPost = new SavedPost({
        user: userId,
        post: postId || null,
        note: noteId || null,
      });
  
      await savedPost.save();
  
      return NextResponse.json({ message: "Saved successfully", savedPost }, { status: 201 });
    } catch (error) {
      console.error("❌ Error saving item:", error);
      return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
  }
  

  export async function GET(req: Request) {
    try {
      await connectDB();
  
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
  
      if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }
  
      // 🔍 Fetch saved posts with full population
      const savedItems = await SavedPost.find({ user: userId })
        .populate({
          path: "post",
          select: "image title likes createdAt",
          populate: { path: "author", select: "name username avatar" },
        })
        .populate({
          path: "note",
          select: "contenido likes createdAt",
          populate: { path: "author", select: "name username avatar" },
        })
        .populate("user", "name avatar");
  
      console.log("📢 Saved Posts After Population:", JSON.stringify(savedItems, null, 2));
  
      return NextResponse.json({ savedItems }, { status: 200 });
    } catch (error) {
      console.error("❌ Error fetching saved posts:", error);
      return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
  }
  
  



  
