const mongoose = require("mongoose")

const salesSignupSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
      },
      position:{
        type:String,
        required:true
      },
      companyName:{
        type:String
      },
      mobileNumber: {
        type: String,
        required: true,
        unique: true,
      },
      email:{
        type:String,
        required:true,
        unique:true
      },
      password: {
        type: String,
        required: true,
      },
})



const salesSignupModel = mongoose.model("salesSignup",salesSignupSchema)
module.exports = salesSignupModel