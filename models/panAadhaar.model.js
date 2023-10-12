const mongoose = require("mongoose")

const panAadhaarSchema = mongoose.Schema({
  id:{
    type:String,
    required:true
  },
    panNumber: {
      type: String,
      required:true
    },
    aadhaarNumber:{
     type:String,
     required:true
    }
  })

const panAadhaarModel = mongoose.model("panAadhaar",panAadhaarSchema)
module.exports = panAadhaarModel