import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

// 🔹 Manejo de DELETE con ID
export async function DELETE(request: NextRequest) {
  await connectDB();

  const id = request.nextUrl.searchParams.get('id');
  console.log("📢 ID recibido en DELETE:", id);

  if (!id) {
    return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
  }

  const deletedTask = await Task.findByIdAndDelete(id);

  if (!deletedTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  console.log("✅ Tarea eliminada:", deletedTask);
  return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
}