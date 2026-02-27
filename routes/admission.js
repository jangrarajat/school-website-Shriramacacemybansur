const express = require("express")
const router = express.Router()

const supabase = require("../config/supabase")

const auth = require("../middleware/auth")

router.get("/all", auth, async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("admissions")

            .select("*")
            .order("created_at", { ascending: false })


        if (error) {

            return res.json({

                success: false,
                error: error.message

            })

        }


        res.json(data)

    } catch (err) {

        console.log(err)

        res.json({

            success: false

        })

    }

})


// SAVE ADMISSION

router.get("/all", auth, async (req, res) => {

    const {

        student_name,
        father_name,
        class_name,
        phone,
        address

    } = req.body


    const { data, error } = await supabase

        .from("admissions")

        .insert([{

            student_name,
            father_name,
            class: class_name,
            phone,
            address

        }])


    if (error) {

        return res.json({

            success: false,
            error: error.message

        })

    }


    res.json({

        success: true

    })

})



// GET ALL ADMISSIONS

router.get("/all", async (req, res) => {

    const { data, error } = await supabase

        .from("admissions")

        .select("*")
        .order("created_at", { ascending: false })


    res.json(data)

})



module.exports = router

router.delete("/delete/:id", auth, async (req, res) => {

    const id = req.params.id

    await supabase

        .from("admissions")

        .delete()

        .eq("id", id)

    res.json({

        success: true

    })

})