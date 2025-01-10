import express from 'express';
import { PantryStaff } from '../models/pantryStaffModel.js';

const router = express.Router();

// Get all staff
router.get('/', async (req, res) => {
    try {
        const pantry = await PantryStaff.find().populate('userid','email');
        console.log(pantry);
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get delivery staff
router.get('/delivery', async (req, res) => {
    try {
        const pantry = await PantryStaff.find({role:'delivery'});
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } 
});

// Get delivery staff
router.get('/pantry', async (req, res) => {
    try {
        const pantry = await PantryStaff.find({role:'pantry'});
        res.json(pantry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/create', async (req, res) => {
    const { userId, name, contactInfo, location, role } = req.body;
  
    if (!userId || !name || !contactInfo || !location || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Check if the pantry staff already exists for this user
      const existingStaff = await PantryStaff.findOne({ userid: userId });
      if (existingStaff) {
        return res.status(409).json({ message: 'Pantry staff for this user already exists.' });
      }
  
      // Create a new pantry staff entry
      const newStaff = new PantryStaff({
        userid: userId,
        name,
        contactInfo,
        location,
        role,
      });
      const savedStaff = await newStaff.save();
  
      res.status(201).json({
        message: 'Pantry staff created successfully',
        staff: savedStaff,
      });
    } catch (error) {
      console.error('Error creating pantry staff:', error);
      res.status(500).json({ message: 'Server error while creating pantry staff.' });
    }
  });

export default router;
