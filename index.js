const express = require("express")
const cors = require("cors")
const businessAuthRoute = require("./routes/businessAuth.route")
const shopAuthRoute = require("./routes/shopAuth.route")
const salesAuthRoute = require("./routes/salesAuth.route")
const connection = require("./config/db")
const addressRoute = require("./routes/address.route")
const bankDetailsRoute = require("./routes/bankDetails.route")
const licenseRoute = require("./routes/license.route")
const panGstinRoute = require("./routes/panGstin.route")
const imageRoute = require("./routes/image.route")
const panAadhaarRoute = require("./routes/panAadhaar.route")
require("dotenv").config();

const app = express()

app.use(cors())
app.use(express.json())
app.use("/public", express.static("public"))
app.use("/",businessAuthRoute)
app.use("/",salesAuthRoute)
app.use("/",shopAuthRoute)
app.use("/",addressRoute)
app.use("/",bankDetailsRoute)
app.use("/",licenseRoute)
app.use("/",panGstinRoute)
app.use("/",panAadhaarRoute)
app.use("/",imageRoute)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log(`Server is running on port ${process.env.port}`)
    }
    catch(error){
        console.log(error)
    }
})