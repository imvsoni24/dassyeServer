const mongoose = require("mongoose")

const shopSignupSchema = mongoose.Schema({
    shopName: {
        type: String,
        required: true,
      },
      location:{
        type:String,
        required:true
      },
      typeOfShop:{
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



const shopSignupModel = mongoose.model("shopSignup",shopSignupSchema)
module.exports = shopSignupModel