import express from 'express';
import { Diet } from '../models/dietModel.js';
import { Delivery } from '../models/deliveryModel.js';
const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        console.log(req.body);
        const { patient, morning, evening, night } = req.body;

        // Validate the required fields
        if (!patient || !morning || !evening || !night) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new diet plan
        const newDiet = new Diet({
            patient,
            morning,
            evening,
            night,
        });

        await newDiet.save();

        // Create a corresponding delivery record
        const newDelivery1 = new Delivery({
            dietid: newDiet._id,
            patientid: patient, // Assuming patient is an ObjectId
            mealtype: 'morning',
            preparedBy:newDiet.morning.assignedTo,

            status: 'Pending', // Default status
        });
        const newDelivery2 = new Delivery({
            dietid: newDiet._id,
            patientid: patient, // Assuming patient is an ObjectId
            mealtype: 'evening',
            preparedBy:newDiet.evening.assignedTo,

            status: 'Pending', // Default status
        });
        const newDelivery3 = new Delivery({
            dietid: newDiet._id,
            patientid: patient, // Assuming patient is an ObjectId
            mealtype: 'night',
            preparedBy:newDiet.night.assignedTo,
            status: 'Pending', // Default status
        });

        await newDelivery1.save();
        await newDelivery2.save();
        await newDelivery3.save();


        res.status(201).json({
            message: 'Diet plan and delivery record created successfully',
            diet: newDiet,
            delivery: newDelivery1,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {

        const diets = await Diet.find()
            .sort({ craetedAt: -1 })
            .populate('patient', 'name age gender')
            .populate('morning.assignedTo', 'userid name')
            .populate('evening.assignedTo', 'userid name')
            .populate('night.assignedTo', 'userid name');

        const transformedMeals = diets.flatMap((diet) => {
            const { _id, patient, morning, evening, night } = diet;

            return [
                { mealType: 'morning', mealid: _id, ...morning, patient },
                { mealType: 'evening', mealid: _id, ...evening, patient },
                { mealType: 'night', mealid: _id, ...night, patient },
            ];
        });

        res.json(transformedMeals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});





router.get('/:id', async (req, res) => {
    try {
        const diet = await Diet.findOne({ patient: req.params.id })
            .sort({ craetedAt: -1 })
            .populate('morning.assignedTo', 'name')
            .populate('evening.assignedTo', 'name')
            .populate('night.assignedTo', 'name');

        console.log(diet)
        if (!diet) {
            return res.status(404).json({ message: 'Diet plan not found' });
        }
        res.json(diet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/edit/:id', async (req, res) => {
    try {
        const { patient, morning, evening, night } = req.body;

        const updatedDiet = await Diet.findByIdAndUpdate(
            req.params.id,
            { patient, morning, evening, night },
            { new: true }
        );

        if (!updatedDiet) {
            return res.status(404).json({ message: 'Diet plan not found' });
        }

        res.json({ message: 'Diet plan updated successfully', diet: updatedDiet });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const diet = await Diet.findByIdAndDelete(req.params.id);
        if (!diet) {
            return res.status(404).json({ message: 'Diet plan not found' });
        }
        res.json({ message: 'Diet plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;