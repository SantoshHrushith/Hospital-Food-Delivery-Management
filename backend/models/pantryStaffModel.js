import mongoose from'mongoose';

const pantryStaffSchema = new mongoose.Schema({
    userid:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    contactInfo: { type: Number, required: true },
    location: { type: String, required: true },
    role:{type: String, enum: ['pantry','delivery'], required: true}
});

export const PantryStaff = mongoose.model('PantryStaff', pantryStaffSchema);
