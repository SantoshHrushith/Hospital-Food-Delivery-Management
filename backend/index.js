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
console.log('MONGO_URI:', process.env.MONGO_URI);  // Check if MONGO_URI is correct

const app = express();

// CORS configuration (make sure the front-end URL matches the deployed URL)
const corsOptions = {
    origin: [
        "http://localhost:3000",  // For local development
        "https://hospital-food-delivery-management-f.vercel.app"  // Deployed front-end URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed methods
    credentials: true,  // Allows cookies to be sent
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json());  // To parse JSON in requests

const PORT = process.env.PORT || 5000;
app.options("*", cors());  // Allow pre-flight requests

// Routes for different API endpoints
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/staff', pantryRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/dashboard', dashBoardRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
