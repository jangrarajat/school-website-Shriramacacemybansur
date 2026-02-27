const express = require("express")

const router = express.Router()

const supabase = require("../config/supabase")

router.post("/login", async (req, res) => {

    const { email, password } = req.body

    const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email)

    res.json(data)

})

module.exports = router