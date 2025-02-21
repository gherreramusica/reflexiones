import mongoose from "mongoose";
import Note from "./Note"; // Importa el modelo de notas

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { 
    type: String, 
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
  },
  bio: { type: String, default: "" },
}, { timestamps: true });

/** Middleware para eliminar notas antes de eliminar un usuario */
UserSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter()); // Buscar el usuario a eliminar
  if (user) {
    await Note.deleteMany({ author: user._id }); // Eliminar notas relacionadas
    console.log(`🗑️ Notas eliminadas para el usuario ${user._id}`);
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
