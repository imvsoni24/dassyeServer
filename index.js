const express = require("express")
const cors = require("cors")
const businessAuthRoute = require("./routes/businessAuth.route")
const shopAuthRoute = require("./routes/shopAuth.route")
const salesAuthRoute = require("./routes/salesAuth.route")
const connection = require("./config/db")
require("dotenv").config();

const app = express()

app.use(cors())
app.use(express.json())
app.use("/",businessAuthRoute)
app.use("/",salesAuthRoute)
app.use("/",shopAuthRoute)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log(`Server is running on port ${process.env.port}`)
    }
    catch(error){
        console.log(error)
    }
})