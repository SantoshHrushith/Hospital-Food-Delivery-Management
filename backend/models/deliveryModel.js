import mongoose from'mongoose';

const deliverySchema = new mongoose.Schema({
    dietid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Diet', required: true},
    patientid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true},
    mealtype:{ type: String, enum: ['morning','evening','night'] },
    preparedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'PantryStaff' },
    deliveredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'PantryStaff' },
    status: { type: String, enum: ['Pending','Preparing','Out for Delivery','Delivered'], default: 'Pending' },
    deliveryTime: {type:String},
    notes: {type:String},
});

export const Delivery = mongoose.model('Delivery', deliverySchema);

