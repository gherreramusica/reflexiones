import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/lib/mongodb';
import Task from "@/models/Task";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    console.log("📢 ID recibido en API DELETE:", params.id); // ✅ Verifica si el ID está llegando a la API

    if (!params.id) {
      return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
    }

    const deletedTask = await Task.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error eliminando la tarea:", error);
    return NextResponse.json({ message: "Error deleting task" }, { status: 500 });
  }
}
