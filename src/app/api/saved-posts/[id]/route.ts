import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SavedPost from "@/models/SavedPost";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Extraer el ID desde la URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Obtiene el último segmento de la URL
    
    if (!id) {
      return NextResponse.json({ message: "Saved ID is required" }, { status: 400 });
    }

    const deletedItem = await SavedPost.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting saved item:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
