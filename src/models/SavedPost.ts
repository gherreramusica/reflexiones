import mongoose, { Schema, Document } from "mongoose";

interface ISavedPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  post?: mongoose.Schema.Types.ObjectId | null;
  note?: mongoose.Schema.Types.ObjectId | null;
}

const SavedPostSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    note: { type: mongoose.Schema.Types.ObjectId, ref: "Note", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.SavedPost || mongoose.model<ISavedPost>("SavedPost", SavedPostSchema);



