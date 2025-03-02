import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

// 🔹 Manejo de DELETE con ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB(); // Conectar a la BD

  console.log("📢 ID recibido en DELETE:", params?.id); // 🔥 Debugging para verificar el ID

  if (!params?.id) {
    return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
  }

  const deletedTask = await Task.findByIdAndDelete(params.id); // Buscar y eliminar

  if (!deletedTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  console.log("✅ Tarea eliminada:", deletedTask);
  return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
}
