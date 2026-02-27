const jwt = require("jsonwebtoken")

const SECRET = "rahul123"

module.exports = (req, res, next) => {

    const token = req.headers.authorization

    if (!token) {

        return res.json({

            login: false

        })

    }

    try {

        jwt.verify(token, SECRET)

        next()

    } catch (err) {

        return res.json({

            login: false

        })

    }

}