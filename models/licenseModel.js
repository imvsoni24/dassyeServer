const mongoose = require("mongoose")

const licenseSchema = mongoose.Schema({
  id:{
    type:String,
    required:true
  },
    licenseNumber: {
      type: String,
      required: true,
    },
    issuingAuthority:{
     type:String,
     required:true
    },
    expirationDate:{
        type:String,
        required:true
    }
  })

const licenseModel = mongoose.model("license",licenseSchema)
module.exports = licenseModel