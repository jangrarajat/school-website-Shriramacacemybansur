const  mongoose = require('mongoose')


const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected")
    } catch (error) {
        console.log("databse connection error",error.message)
    }

}

module.exports = {connectDb}