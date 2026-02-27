const express = require("express")

const router = express.Router()

const supabase = require("../config/supabase")


router.get("/school", async (req, res) => {

    const { data } = await supabase

        .from("school")

        .select("*")

        .single()

    res.json(data)

})


module.exports = router