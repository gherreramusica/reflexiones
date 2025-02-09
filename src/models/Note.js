import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    contenido: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
