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

      // 🔥 Actualizar el estado inmediatamente con la nueva tarea
      if (newTask._id) {
        setTasks((prevTasks) => [newTask, ...prevTasks]); // Agregar al inicio de la lista
      }

      setTaskInput(""); // Limpiar input
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  // 🔹 Eliminar una tarea y actualizar el estado en tiempo real
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  return (
    <div className="w-[90%] m-auto">
      {/* Input para agregar tareas */}
      <input
        className="border mt-5 w-full h-[50px] outline-none p-2 text-gray-500"
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
            <li key={task._id} className="border gap-3 flex items-center p-2 my-2">
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
