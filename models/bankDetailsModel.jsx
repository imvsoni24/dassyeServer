const mongoose = require("mongoose")

const bankDetailsSchema = mongoose.Schema({
    accountNumber: {
      type: String,
      required: true,
    },
    bankName:{
     type:String,
     required:true
    },
    ifscCode:{
        type:String,
        required:true
    }
  })

const bankDetailsModel = mongoose.model("bank",bankDetailsSchema)
module.exports = bankDetailsModel