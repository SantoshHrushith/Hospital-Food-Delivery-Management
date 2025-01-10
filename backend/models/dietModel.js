import mongoose from 'mongoose';

const dietSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    morning: {
      ingredients: [String],
      instructions: String,
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'PantryStaff', required: true },
    },
    evening: {
      ingredients: [String],
      instructions: String,
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'PantryStaff', required: true },
    },
    night: {
      ingredients: [String],
      instructions: String,
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'PantryStaff', required: true },
    },
  },
  { timestamps: true } // Enable timestamps
);

export const Diet = mongoose.model('Diet', dietSchema);
