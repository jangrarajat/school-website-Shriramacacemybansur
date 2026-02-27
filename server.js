// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());


// // Routes
// const schoolRoutes = require("./routes/schoolRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const admissionRoutes=require("./routes/admission")
// const adminRoutes=require("./routes/admin")

// app.use("/api", schoolRoutes);
// app.use("/api", adminRoutes);
// app.use("/api", studentRoutes);
// app.use("/admission",admissionRoutes)
// app.use("/admin",adminRoutes)


// // Test Route
// app.get("/", (req, res) => {
//   res.send("School Backend Running");
// });


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {

// console.log("🚀 Server Running");
// console.log("🌐 http://localhost:" + PORT);

// })

const  { connectDb } = require('./db/mongoDb')

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
connectDb()


// Routes Import

const schoolRoutes = require("./routes/schoolRoutes");

const adminLoginRoutes = require("./routes/adminRoutes"); // login routes

const studentRoutes = require("./routes/studentRoutes");

const admissionRoutes = require("./routes/admission");

const adminRoutes = require("./routes/admin"); // JWT admin routes

const examRoutes=require("./routes/exam")

const examAdmin=require("./routes/examAdmin")






// Routes Use

app.use("/api", schoolRoutes);

app.use("/api", adminLoginRoutes);

app.use("/api", studentRoutes);

app.use("/admission", admissionRoutes);

app.use("/admin", adminRoutes);

app.use("/exam",examRoutes)

app.use("/admin",examAdmin)

// app.use("/exam",examRoutes)

app.use("/admin",examAdmin)

app.use(express.json())

app.use("/uploads",express.static("uploads"))



// Test Route

app.get("/", (req, res) => {

res.send("School Backend Running");

});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

console.log("🚀 Server Running");

console.log("🌐 http://localhost:" + PORT);

});