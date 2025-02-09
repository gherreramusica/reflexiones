
import mongoose from 'mongoose';

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('📌 Connected to MongoDB');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
    }
}
