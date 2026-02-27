const express = require("express")

const router = express.Router()

const supabase = require("../config/supabase")


router.get("/students", async (req, res) => {

    const { data } = await supabase
        .from("students")
        .select("*")

    res.json(data)

})


router.post("/add-student", async (req, res) => {

    const { name, className } = req.body

    const { data } = await supabase
        .from("students")
        .insert([{ name, class: className }])

    res.json(data)

})

module.exports = router