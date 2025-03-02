import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // Función para conectar a la BD
import Task from "@/models/Task"; // Modelo de la tarea en MongoDB

// 🔹 Endpoint para OBTENER todas las tareas (GET)
export async function GET() {
  try {
    await connectDB(); // Conectar a la BD

    const tasks = await Task.find().sort({ createdAt: -1 }); // Obtener tareas ordenadas
    return NextResponse.json(tasks, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Error fetching tasks", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// 🔹 Endpoint para CREAR una nueva tarea (POST)
export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Conectar a la BD

    const { task } = await req.json(); // Extrae la tarea del body

    if (!task) {
      return NextResponse.json({ message: "Task field is required" }, { status: 400 });
    }

    const newTask = new Task({ task }); 
 
    await newTask.save();
    console.log("🚀 Nueva tarea creada:", newTask);

    return NextResponse.json(
      { message: "Task created successfully", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating task:", error);
    return NextResponse.json(
      { message: "Error creating task", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}


