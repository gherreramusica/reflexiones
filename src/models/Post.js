import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;

