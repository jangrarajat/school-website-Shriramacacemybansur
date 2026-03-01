const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const Student = require('../models/talent.model.js');

router.post("/register", upload.single("photo"), async (req, res) => {
    try {
        const {
            student_name, father_name, mother_name, dob,
            address, school, mobile, medium, student_class
        } = req.body || {};

        console.log("--- Request Received ---");

        // 1. Validation
        if (!student_name || !student_class || !req.file || !dob) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Required fields are missing!" });
        }

        // 2. Logic for Groups and Starting Roll Numbers (Numbers for calculation)
        let startRoll;
        let groupName = "";

        if (["3", "4"].includes(student_class)) {
            startRoll = 108301;
            groupName = "A";
        } else if (["5", "6"].includes(student_class)) {
            startRoll = 208501;
            groupName = "B";
        } else if (["7", "8"].includes(student_class)) {
            startRoll = 308701;
            groupName = "C";
        } else if (["9", "10"].includes(student_class)) {
            startRoll = 408901;
            groupName = "D";
        } else {
            // Default case agar koi aur class ho
            startRoll = 500001;
            groupName = "Group-X";
        }

        // 3. Smart Roll Number Generation (Numeric logic)
        const lastStudent = await Student.findOne({
            roll: { $gte: startRoll, $lt: startRoll + 2000 }
        }).sort({ roll: -1 });

        let finalRollNumber = lastStudent ? lastStudent.roll + 1 : startRoll;
        
        // Final String format for display: "Group-A 108301"
        let rollWithGroup = `${groupName} `;

        // 4. Cloudinary Upload
        let finalPhotoUrl = "";
        try {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "talent_exams" });
            finalPhotoUrl = result.secure_url;
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        } catch (err) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }

        // 5. Date Parsing Logic
        let finalDate = dob;
        if (dob && dob.includes("-")) {
            const parts = dob.split("-");
            if (parts[0].length === 2) {
                finalDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        // 6. Save to MongoDB
        const newStudent = await Student.create({
            student_name,
            father_name,
            mother_name,
            dob: new Date(finalDate),
            address,
            school,
            mobile,
            medium,
            class: student_class,
            roll: finalRollNumber, // Database mein number save hoga
            rollWithGroup: rollWithGroup, // Display ke liye string save hogi
            photoUrl: finalPhotoUrl
        });

        res.status(201).json({ success: true, student: newStudent });

    } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Error details:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;