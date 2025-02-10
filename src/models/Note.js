import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    contenido: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }, // ✅ Asegurar que siempre tenga un valor de fecha
  }
);

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;

