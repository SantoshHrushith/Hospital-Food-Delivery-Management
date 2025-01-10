import express from 'express';
import { Patient } from '../models/patientModel.js';

const router = express.Router();

// Create a new patient
router.post('/create', async (req, res) => {
    try {
        const { name, diseases, allergies, roomNumber, bedNumber, floorNumber, age, gender, phoneNumber, emergencyContact } = req.body;

        // Validate request body
        if (!name || !diseases || !allergies || !roomNumber || !bedNumber || !floorNumber || !age || !gender || !phoneNumber || !emergencyContact) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newPatient = new Patient({
            name,
            diseases,
            allergies,
            roomNumber,
            bedNumber,
            floorNumber,
            age,
            gender,
            phoneNumber,
            emergencyContact
        });

        await newPatient.save();
        res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get patient by id
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Edit  patient by id
router.put('/:id', async (req, res) => {
    try {
        const { name, diseases, allergies, roomNumber, bedNumber, floorNumber, age, gender, phoneNumber, emergencyContact } = req.body;

        // Validate request body
        if (!name || !diseases || !allergies || !roomNumber || !bedNumber || !floorNumber || !age || !gender || !phoneNumber || !emergencyContact) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                name,
                diseases,
                allergies,
                roomNumber,
                bedNumber,
                floorNumber,
                age,
                gender,
                phoneNumber,
                emergencyContact
            },
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ message: 'Patient updated successfully', patient: updatedPatient });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// delete patient by id
router.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;
