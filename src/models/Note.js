import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    contenido: { type: String, required: true },
    likes: { type: Number, default: 0 },

  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);


