import express from 'express';
import { Delivery } from '../models/deliveryModel.js'; // Import the Delivery model
import { Diet } from '../models/dietModel.js'; // Import the Diet model
import { PantryStaff } from '../models/pantryStaffModel.js'; // Import the PantryStaff model

const router = express.Router();

// Route to create a new delivery
router.post('/create', async (req, res) => {
  try {
    // Destructure the body of the request
    console.log('Request Body:', req.body);
    const { mealid, mealType, deliveredBy, status, deliveryTime, notes } = req.body;

    // Validate the data
    if (!mealid || !mealType || !deliveredBy) {
      return res.status(400).json({ message: 'Meal ID, meal type, and deliveredBy are required' });
    }

    // Check if the meal exists in the Diet model
    const meal = await Diet.findById(mealid);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if the pantry staff exists in the PantryStaff model
    const staff = await PantryStaff.findById(deliveredBy);
    if (!staff) {
      return res.status(404).json({ message: 'Pantry staff not found' });
    }

    // Create a new delivery
    const newDelivery = new Delivery({
      mealid,
      mealType,
      deliveredBy,
      status: status || 'Pending', // Default to 'Pending' if no status is provided
      deliveryTime,
      notes,
    });

    // Save the new delivery to the database
    const savedDelivery = await newDelivery.save();

    // Respond with the created delivery
    res.status(201).json(savedDelivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/update/:deliveryId', async (req, res) => {
  const { deliveryId } = req.params;
  const { status, updateBy } = req.body;

  // Validate input
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  if (!['Pending', 'Preparing', 'Out for Delivery', 'Delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    // Find and update the delivery document
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      {
        $set: {
          status,
          deliveredBy: updateBy,
          deliveryTime: status === 'Delivered' ? new Date().toISOString() : undefined,
        },
      },
      { new: true } // Return the updated document
    ).populate('dietid patientid preparedBy deliveredBy');

    if (!updatedDelivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.status(200).json({ message: 'Delivery updated successfully', delivery: updatedDelivery });
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

router.get('/pantry/pending', async (req, res) => {
  try {
    // Find all deliveries with status "Pending"
    const pendingDeliveries = await Delivery.find({ status: { $in: ['Pending','Preparing'] } })
      .populate('dietid')
      .populate('patientid', 'name')
      .populate('preparedBy', 'name') // Populate preparedBy with name
      .populate('deliveredBy', 'name'); // Populate deliveredBy with name

    if (!pendingDeliveries.length) {
      return res.status(404).json({ message: 'No pending deliveries found' });
    }

    // Map deliveries to include meal type-specific ingredients and instructions
    const enhancedDeliveries = pendingDeliveries.map((delivery) => {
      const { dietid, mealtype } = delivery;

      // Dynamically select ingredients and instructions based on meal type
      const mealDetails = dietid?.[mealtype] || {};
      return {
        ...delivery.toObject(),
        mealDetails: {
          ingredients: mealDetails.ingredients || [],
          instructions: mealDetails.instructions || 'No instructions available'
        }
      };
    });
    res.status(200).json({ deliveries: enhancedDeliveries });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch pending deliveries' });
  }
});
router.get('/pending/morning', async (req, res) => {
  try {
    // Find all deliveries with status "Pending"
    const pendingDeliveries = await Delivery.find({ status: { $in: ['Pending', 'Preparing'] }, mealtype: 'morning' })
      .populate('dietid')
      .populate('patientid', 'name')
      .populate('preparedBy', 'name') // Populate preparedBy with name
      .populate('deliveredBy', 'name'); // Populate deliveredBy with name

    if (!pendingDeliveries.length) {
      return res.status(404).json({ message: 'No pending deliveries found' });
    }

    // Map deliveries to include meal type-specific ingredients and instructions
    const enhancedDeliveries = pendingDeliveries.map((delivery) => {
      const { dietid, mealtype } = delivery;

      // Dynamically select ingredients and instructions based on meal type
      const mealDetails = dietid?.[mealtype] || {};
      return {
        ...delivery.toObject(),
        mealDetails: {
          ingredients: mealDetails.ingredients || [],
          instructions: mealDetails.instructions || 'No instructions available'
        }
      };
    });

    res.status(200).json({ deliveries: enhancedDeliveries });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch pending deliveries' });
  }
});

router.get('/pending/evening', async (req, res) => {
  try {
    // Find all deliveries with status "Pending"
    const pendingDeliveries = await Delivery.find({ status: { $in: ['Pending', 'Preparing'] }, mealtype: 'evening' })
      .populate('dietid')
      .populate('patientid', 'name')
      .populate('preparedBy', 'name') // Populate preparedBy with name
      .populate('deliveredBy', 'name'); // Populate deliveredBy with name

    if (!pendingDeliveries.length) {
      return res.status(404).json({ message: 'No pending deliveries found' });
    }

    // Map deliveries to include meal type-specific ingredients and instructions
    const enhancedDeliveries = pendingDeliveries.map((delivery) => {
      const { dietid, mealtype } = delivery;

      // Dynamically select ingredients and instructions based on meal type
      const mealDetails = dietid?.[mealtype] || {};
      return {
        ...delivery.toObject(),
        mealDetails: {
          ingredients: mealDetails.ingredients || [],
          instructions: mealDetails.instructions || 'No instructions available'
        }
      };
    });

    res.status(200).json({ deliveries: enhancedDeliveries });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch pending deliveries' });
  }
});

router.get('/pending/night', async (req, res) => {
  try {
    // Find all deliveries with status "Pending"
    const pendingDeliveries = await Delivery.find({ status: { $in: ['Pending', 'Preparing'] }, mealtype: 'night' })
      .populate('dietid')
      .populate('patientid', 'name')
      .populate('preparedBy', 'name') // Populate preparedBy with name
      .populate('deliveredBy', 'name'); // Populate deliveredBy with name

    if (!pendingDeliveries.length) {
      return res.status(404).json({ message: 'No pending deliveries found' });
    }

    // Map deliveries to include meal type-specific ingredients and instructions
    const enhancedDeliveries = pendingDeliveries.map((delivery) => {
      const { dietid, mealtype } = delivery;

      // Dynamically select ingredients and instructions based on meal type
      const mealDetails = dietid?.[mealtype] || {};
      return {
        ...delivery.toObject(),
        mealDetails: {
          ingredients: mealDetails.ingredients || [],
          instructions: mealDetails.instructions || 'No instructions available'
        }
      };
    });

    res.status(200).json({ deliveries: enhancedDeliveries });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch pending deliveries' });
  }
});

router.get('/deliver/pending', async (req, res) => {
  try {
    // Find all deliveries with status "Pending"
    const pendingDeliveries = await Delivery.find({ status: { $in: ['Out for Delivery','Preparing'] } })
      .populate('dietid')
      .populate('patientid')
      .populate('preparedBy', 'name') // Populate preparedBy with name
      .populate('deliveredBy', 'name'); // Populate deliveredBy with name

    if (!pendingDeliveries.length) {
      return res.status(404).json({ message: 'No pending deliveries found' });
    }

    // Map deliveries to include meal type-specific ingredients and instructions
    const enhancedDeliveries = pendingDeliveries.map((delivery) => {
      const { dietid, mealtype } = delivery;

      // Dynamically select ingredients and instructions based on meal type
      const mealDetails = dietid?.[mealtype] || {};
      return {
        ...delivery.toObject(),
        mealDetails: {
          ingredients: mealDetails.ingredients || [],
          instructions: mealDetails.instructions || 'No instructions available'
        }
      };
    });
    res.status(200).json({ deliveries: enhancedDeliveries });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch pending deliveries' });
  }
});



// Route to update delivery with assigned delivery staff
router.put('/assign/:id', async (req, res) => {
    const { id } = req.params;
    const { deliveryPersonId, status, deliveryTime } = req.body;

    try {
        // Validate input
        if (!deliveryPersonId || !status || !deliveryTime) {
            return res.status(400).json({ message: 'Missing required fields: deliveryPersonId, status, or deliveryTime.' });
        }

        // Find and update the delivery
        const updatedDelivery = await Delivery.findByIdAndUpdate(
            id,
            {
                deliveredBy: deliveryPersonId,
                status,
                deliveryTime,
            },
            { new: true } // Return the updated document
        )
            .populate('preparedBy', 'name') // Populate preparedBy with name
            .populate('deliveredBy', 'name'); // Populate deliveredBy with name

        if (!updatedDelivery) {
            return res.status(404).json({ message: 'Delivery not found.' });
        }

        res.status(200).json({ message: 'Delivery updated successfully.', delivery: updatedDelivery });
    } catch (error) {
        console.error('Error updating delivery:', error);
        res.status(500).json({ message: 'Failed to update delivery.', error });
    }
});


router.get('/deliver/morning', async (req, res) => {
  try {
    // Find all deliveries with status "Pending"
    const pendingDeliveries = await Delivery.find({ status: { $ne: 'Delivered' }, mealtype: 'morning' })
      .populate('dietid')
      .populate('patientid', 'name roomNumber bedNumber floorNumber phoneNumber')
      .populate('preparedBy', 'name') // Populate preparedBy with name
      .populate('deliveredBy', 'name'); // Populate deliveredBy with name

    if (!pendingDeliveries.length) {
      return res.status(404).json({ message: 'No pending deliveries found' });
    }

    // Map deliveries to include meal type-specific ingredients and instructions
    const enhancedDeliveries = pendingDeliveries.map((delivery) => {
      const { dietid, mealtype } = delivery;

      // Dynamically select ingredients and instructions based on meal type
      const mealDetails = dietid?.[mealtype] || {};
      return {
        ...delivery.toObject(),
        mealDetails: {
          ingredients: mealDetails.ingredients || [],
          instructions: mealDetails.instructions || 'No instructions available'
        }
      };
    });

    res.status(200).json({ deliveries: enhancedDeliveries });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch pending deliveries' });
  }
});
router.get('/deliver/evening', async (req, res) => {
  try {
    // Find all deliveries with status "Pending"
    const pendingDeliveries = await Delivery.find({ sstatus: { $ne: 'Delivered' }, mealtype: 'evening' })
      .populate('dietid')
      .populate('patientid', 'name roomNumber bedNumber floorNumber phoneNumber')
      .populate('preparedBy', 'name') // Populate preparedBy with name
      .populate('deliveredBy', 'name'); // Populate deliveredBy with name

    if (!pendingDeliveries.length) {
      return res.status(404).json({ message: 'No pending deliveries found' });
    }

    // Map deliveries to include meal type-specific ingredients and instructions
    const enhancedDeliveries = pendingDeliveries.map((delivery) => {
      const { dietid, mealtype } = delivery;

      // Dynamically select ingredients and instructions based on meal type
      const mealDetails = dietid?.[mealtype] || {};
      return {
        ...delivery.toObject(),
        mealDetails: {
          ingredients: mealDetails.ingredients || [],
          instructions: mealDetails.instructions || 'No instructions available'
        }
      };
    });

    res.status(200).json({ deliveries: enhancedDeliveries });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch pending deliveries' });
  }
});

router.get('/deliver/night', async (req, res) => {
  try {
    // Find all deliveries with status "Pending"
    const pendingDeliveries = await Delivery.find({ status: { $ne: 'Delivered' }, mealtype: 'night' })
      .populate('dietid')
      .populate('patientid', 'name roomNumber bedNumber floorNumber phoneNumber')
      .populate('preparedBy', 'name') // Populate preparedBy with name
      .populate('deliveredBy', 'name'); // Populate deliveredBy with name

    if (!pendingDeliveries.length) {
      return res.status(404).json({ message: 'No pending deliveries found' });
    }

    // Map deliveries to include meal type-specific ingredients and instructions
    const enhancedDeliveries = pendingDeliveries.map((delivery) => {
      const { dietid, mealtype } = delivery;

      // Dynamically select ingredients and instructions based on meal type
      const mealDetails = dietid?.[mealtype] || {};
      return {
        ...delivery.toObject(),
        mealDetails: {
          ingredients: mealDetails.ingredients || [],
          instructions: mealDetails.instructions || 'No instructions available'
        }
      };
    });

    res.status(200).json({ deliveries: enhancedDeliveries });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch pending deliveries' });
  }
});







export default router;
