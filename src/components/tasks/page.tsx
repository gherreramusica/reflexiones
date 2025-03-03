"use client";
import { useState, useEffect } from "react";

interface Task {
  _id: string;
  task: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  // 🔹 Cargar tareas desde la API al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        // 🔥 Filtrar tareas duplicadas antes de actualizar el estado
        const uniqueTasks = Array.from(new Map(data.map((t: Task) => [t._id, t])).values());

        setTasks(uniqueTasks as Task[]);
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
      }
    };    fetchTasks();
  }, []);

  // 🔹 Agregar una tarea y actualizar el estado en tiempo real
  const handleAddTask = async () => {
    if (taskInput.trim() === "") return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskInput }),
      });

      const newTask = await response.json();

      // Create a new task object that matches the Task interface
      const taskToAdd: Task = {
        _id: newTask._id,
        task: taskInput
      };

      setTasks((prevTasks) => [taskToAdd, ...prevTasks]);
      setTaskInput("");
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!taskId) {
      console.error("❌ No se proporcionó un ID para eliminar.");
      return;
    }
  
    try {
      console.log(`📢 Intentando eliminar tarea con ID: ${taskId}`);
  
      const response = await fetch(`/api/tasks/${taskId}`, { // ✅ Asegúrate de que el ID está en la URL
        method: "DELETE",
      });
  
      const data = await response.json();
      console.log("✅ Respuesta del servidor:", data);
  
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        console.log("✅ Tarea eliminada correctamente");
      } else {
        console.error("❌ Error deleting task:", data.message);
      }
    } catch (error) {
      console.error("❌ Error en la petición DELETE:", error);
    }
  };  
  

  return (
    <div className="w-[90%] m-auto">
      {/* Input para agregar tareas */}
      <input
        className="border mt-5 w-full outline-none rounded-lg p-2 text-gray-500"
        type="text"
        placeholder="Escribe aquí..."
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddTask();
          }
        }}
      />
      {/* Lista de tareas */}
      <div className="mt-5">
        <ul className="text-gray-500">
          {tasks.map((task) => (
            <li key={task._id} className="border rounded-lg gap-3 flex items-center p-2 my-2">
              <input
                type="checkbox"
                onClick={() => {
                  setTimeout(() => {
                    handleDeleteTask(task._id);
                  }, 500);
                }}
              />
              {task.task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
