import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    image: { type: String },
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;

