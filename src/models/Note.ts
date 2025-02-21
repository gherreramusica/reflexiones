import mongoose, { Document, Schema } from "mongoose";

interface Note extends Document {
  author: mongoose.Schema.Types.ObjectId; // Solo almacenamos el ID del autor
  contenido: string;
  likes: number;
}

const NoteSchema: Schema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencia correcta
    contenido: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model<Note>("Note", NoteSchema);
