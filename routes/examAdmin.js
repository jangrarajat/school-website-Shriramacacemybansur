const express = require("express");
const router = express.Router();
const Student = require('../models/talent.model.js');
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const fs = require("fs");

// Multer configuration for file upload
const upload = multer({ dest: "uploads/" });

/* 1. GET ALL STUDENTS */
router.get("/exam/all", async (req, res) => {
    try {
        const students = await Student.find({}).sort({ createdAt: -1 });

        const mediumStats = { hindi: 0, english: 0, other: 0 };
        const classStats = {};
        const groupStats = {};

        students.forEach(student => {
            const med = (student.medium || "").toLowerCase();
            if (med === "hindi") mediumStats.hindi++;
            else if (med === "english") mediumStats.english++;
            else mediumStats.other++;

            const cls = student.class || "Unknown";
            classStats[cls] = (classStats[cls] || 0) + 1;

            const grp = (student.rollWithGroup || "Unknown").trim();
            groupStats[grp] = (groupStats[grp] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            message: "Success: Data fetched from MongoDB",
            totalCount: students.length,
            mediumStats,
            classStats,
            groupStats,
            data: students
        });

    } catch (error) {
        console.error("Get Data Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching data",
            error: error.message
        });
    }
});

/* 2. DELETE STUDENT */
router.delete("/exam/delete/:id", async (req, res) => {
    try {
        const id = req.params.id.trim();
        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student nahi mila! Check karein ki ID sahi hai ya nahi."
            });
        }

        res.status(200).json({
            success: true,
            message: "Student successfully deleted from MongoDB",
            deletedData: deletedStudent
        });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during deletion",
            error: error.message
        });
    }
});

/* 3. UPDATE STUDENT - with photo upload support */
router.put("/exam/edit/:id", upload.single("photo"), async (req, res) => {
    try {
        const id = req.params.id.trim();
        const updateData = { ...req.body }; // form fields

        // Agar naya photo upload hua hai to Cloudinary par bhejo
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "talent_exams"
                });
                updateData.photoUrl = result.secure_url;
                // Upload ke baad temp file hata do
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            } catch (uploadErr) {
                if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                return res.status(500).json({
                    success: false,
                    message: "Cloudinary upload failed",
                    error: uploadErr.message
                });
            }
        }

        // _id ko update nahi kar sakte
        delete updateData._id;
        delete updateData.file; // extra field agar ho to

        // Date field ko handle karo (agar string aaye to)
        if (updateData.dob) {
            // Agar "YYYY-MM-DD" format mein hai to use as is, otherwise try to parse
            // MongoDB ko Date object chahiye
            updateData.dob = new Date(updateData.dob);
        }

        const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student successfully updated",
            data: updatedStudent
        });

    } catch (error) {
        // Agar koi error aaye to temp file hata do
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Update Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during update",
            error: error.message
        });
    }
});

/* 4. FIND ADMIT CARD (existing) */
router.post("/findAdmitCard", async (req, res) => {
    try {
        const { mobile, roll } = req.body;

        if (!mobile && !roll) {
            return res.status(400).json({
                success: false,
                message: "Please provide Mobile Number & Roll Number."
            });
        }

        if (mobile) {
            const getData = await Student.find({ mobile: mobile });
            return res.status(200).json({
                success: true,
                message: "Student data retrieved successfully",
                student: getData
            });
        }

        if (roll) {
            const getData = await Student.findOne({ roll: roll });
            return res.status(200).json({
                success: true,
                message: "Student data retrieved successfully",
                student: getData
            });
        }

    } catch (error) {
        console.error("Error fetching student:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error: Data fetch error",
            error: error.message
        });
    }
});

module.exports = router;