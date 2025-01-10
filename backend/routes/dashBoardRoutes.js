import express from 'express';
import { Delivery } from '../models/deliveryModel.js'; // Import the Delivery model
import { Diet } from '../models/dietModel.js'; // Import the Diet model
import { PantryStaff } from '../models/pantryStaffModel.js'; // Import the PantryStaff model
import { Patient } from '../models/patientModel.js';
const router = express.Router();

router.get('/manager', async (req, res) => {
    try {
        // Fetch pending deliveries
        const pendingDeliveries = await Delivery.find({ status: { $in: ['Pending'] }, mealtype: 'morning' })
            .populate('dietid')
            .populate('patientid', 'name')
            .populate('preparedBy', 'name')
            .populate('deliveredBy', 'name');

        // Enhance deliveries with meal type-specific details
        const enhancedDeliveries = pendingDeliveries.map((delivery) => {
            const { dietid, mealtype } = delivery;
            const mealDetails = dietid?.[mealtype] || {};
            return {
                ...delivery.toObject(),
                mealDetails: {
                    ingredients: mealDetails.ingredients || [],
                    instructions: mealDetails.instructions || 'No instructions available',
                },
            };
        });

        // Fetch additional summary data
        const totalPatients = await Patient.countDocuments();
        const pantryStaff = await PantryStaff.countDocuments({ role: 'pantry' });
        const deliveryStaff = await PantryStaff.countDocuments({ role: 'delivery' });
        const totalMealsServed = await Delivery.countDocuments({ status: 'Delivered' });
        const completedDeliveries = totalMealsServed;
        const pendingMeals = await Delivery.countDocuments({ status: 'Pending' });

        res.status(200).json({
            deliveries: enhancedDeliveries,
            stats: {
                pendingDeliveries: enhancedDeliveries.length,
                totalPatients,
                pantryStaff,
                deliveryStaff,
                pendingMeals,
                completedDeliveries,
                totalMealsServed,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});


router.get('/pantry', async (req, res) => {
    try {
        // Fetch pending deliveries
        const pendingDeliveries = await Delivery.find({ status: { $in: ['Preparing','Out for Delivery'] }})
            .populate('dietid')
            .populate('patientid', 'name')
            .populate('preparedBy', 'name')
            .populate('deliveredBy', 'name');

        // Enhance deliveries with meal type-specific details
        const enhancedDeliveries = pendingDeliveries.map((delivery) => {
            const { dietid, mealtype } = delivery;
            const mealDetails = dietid?.[mealtype] || {};
            return {
                ...delivery.toObject(),
                mealDetails: {
                    ingredients: mealDetails.ingredients || [],
                    instructions: mealDetails.instructions || 'No instructions available',
                },
            };
        });

        // Fetch additional summary data
        const pantryStaff = await PantryStaff.countDocuments({ role: 'pantry' });
        const deliveryStaff = await PantryStaff.countDocuments({ role: 'delivery' });
        const totalMealsServed = await Delivery.countDocuments({ status: 'Delivered' });
        const completedMeals = await Delivery.countDocuments({ status: {$in:['Out for Delivery', 'Delivered']}});
        const completedDeliveries = totalMealsServed;
        const pendingMeals = await Delivery.countDocuments({ status: 'Pending' });

        res.status(200).json({
            deliveries: enhancedDeliveries,
            stats: {
                pendingDeliveries: enhancedDeliveries.length,
                pantryStaff,
                deliveryStaff,
                completedMeals,
                pendingMeals,
                completedDeliveries,
                totalMealsServed,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});



export default router;
