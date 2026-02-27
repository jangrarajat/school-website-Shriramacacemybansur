const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    student_name: { type: String, required: true, trim: true },
    father_name: { type: String, required: true, trim: true },
    mother_name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    school: { type: String, required: true },
    mobile: { type: String, required: true },
    class: { type: String, required: true , enum:["3","4","5","6","7","8","9"] },

    roll: { type: Number, unique: true }, // Roll number store karne ke liye
    medium: {
        type: String,
        enum: ['Hindi', 'English', 'hindi', 'english', 'Other'],
        default: 'English'
    },
    photoUrl: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);