import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    diseases: {
        type: [String],
        required: true
    },
    allergies: {
        type: [String],
        required: true
    },
    roomNumber: {
        type: Number,
        required: true
    },
    bedNumber: {
        type: Number,
        required: true
    },
    floorNumber: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },

    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        relation: {
            type: String,
            required: true
        },
        contactNumber: {
            type: String,
            required: true
        }
    },

});

export const Patient = mongoose.model('Patient', patientSchema);
