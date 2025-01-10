import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import dietRoutes from './routes/dietRoutes.js'
import pantryRoutes from './routes/pantryRoutes.js'
import deliveryRoutes from './routes/deliveryRoutes.js'
import dashBoardRoutes from './routes/dashBoardRoutes.js'



dotenv.config(); // Load .env file

connectDB(); // Connect to MongoDB
console.log('MONGO_URI:', process.env.MONGO_URI);
const app = express();
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000", // For local development
        "https://hospital-food-delivery-management.vercel.app" // Deployed front-end URL
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));


const PORT = process.env.PORT || 5000;
app.options("*", cors());

app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/staff', pantryRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/dashboard', dashBoardRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
