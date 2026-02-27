const express = require("express");
const router = express.Router();
const Student = require('../models/talent.model.js');

/* 1. GET ALL STUDENTS (MongoDB version) */
router.get("/exam/all", async (req, res) => {
    try {
        // 1. Saara data fetch karein (Naya data sabse upar - Sort by createdAt)
        const students = await Student.find({}).sort({ createdAt: -1 });

        // 2. Medium-wise counts nikalne ke liye logic
        // Case-insensitive (Hindi/hindi dono count honge)
        const mediumStats = {
            hindi: 0,
            english: 0,
            other: 0
        };

        // 3. Class-wise counts (Optional but useful for Dashboard)
        const classStats = {};

        students.forEach(student => {
            // Medium Count Logic
            const med = (student.medium || "").toLowerCase();
            if (med === "hindi") {
                mediumStats.hindi++;
            } else if (med === "english") {
                mediumStats.english++;
            } else {
                mediumStats.other++;
            }

            // Class Count Logic
            const cls = student.class || "Unknown";
            classStats[cls] = (classStats[cls] || 0) + 1;
        });

        // 4. Response with all data and new stats
        res.status(200).json({
            success: true,
            message: "Success: Data fetched from MongoDB",
            totalCount: students.length, // Total kitne bache hain
            mediumStats: mediumStats,    // Hindi, English, Other counts
            classStats: classStats,      // Har class ke kitne bache hain
            data: students               // Pura student data array
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

/* 2. DELETE STUDENT (MongoDB version) */
router.delete("/exam/delete/:id", async (req, res) => {
    try {
        const id = req.params.id.trim()

        // MongoDB ki default _id se delete karne ke liye
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

module.exports = router;