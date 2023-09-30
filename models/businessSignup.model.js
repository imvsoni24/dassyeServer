const mongoose = require("mongoose")

const businessSignupSchema = mongoose.Schema({
    businessName: {
        type: String,
        required: true,
      },
      location:{
        type:String,
        required:true
      },
      website:{
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



const businessSignupModel = mongoose.model("businessSignup",businessSignupSchema)
module.exports = businessSignupModel