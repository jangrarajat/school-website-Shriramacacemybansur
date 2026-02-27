const express = require("express")

const router = express.Router()

const jwt = require("jsonwebtoken")

const supabase = require("../config/supabase")

const SECRET = "rahul123"



router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body


        const { data, error } = await supabase

            .from("admins")

            .select("*")

            .eq("email", email)

            .single()


        if (error || !data) {

            return res.json({

                success: false,
                message: "Admin Not Found"

            })

        }


        if (password !== data.password) {

            return res.json({

                success: false,
                message: "Wrong Password"

            })

        }


        const token = jwt.sign(

            { admin: true },

            SECRET,

            { expiresIn: "7d" }

        )


        res.json({

            success: true,
            token

        })

    } catch (err) {

        console.log(err)

        res.json({

            success: false,
            error: "Server Error"

        })

    }

})


module.exports = router