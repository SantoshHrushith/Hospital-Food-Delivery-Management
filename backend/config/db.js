import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Hrushith:VzzFGAQf3WKKHZno@cluster0.g6xpdzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};

export default connectDB;
