const mongoose = require("mongoose")

const saveOTPSchema = mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    otp:{type:String}
  })

const saveOTPModel = mongoose.model("saveOTP",saveOTPSchema)
module.exports = saveOTPModel
